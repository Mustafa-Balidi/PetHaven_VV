#!/usr/bin/env python3
"""Build an expanded Gold Ground Truth for RAG *context* evaluation.

The original `eval/eval.jsonl` labels only the one or two entities that
literally answer each question. That is the right target for Answer metrics and
the wrong one for Context metrics: an LLM answering "my dog is lethargic, what
could be wrong?" is well served by the symptom, the diseases that explain it and
the diagnostics that would confirm them, and Precision@5 against a two-entity
label set is capped at 0.40 no matter how good retrieval is.

Independence from retrieval (section 3)
---------------------------------------
Nothing here imports the retriever, the vector store search, the reranker or
the fusion ranking. A qrel can only enter from:

  1. the original human-authored `expected_keywords` (answer seeds), or
  2. a lexical entity-name match against the question text, or
  3. one authored KB relation hop away from a seed, in a direction the question
     type licenses.

"It was retrieved" is not a reason and cannot become one -- the production
ranking is never consulted. `RelationGraph` is used only as an index over the
authored `*_ids` the KB already states; it performs no search.

Conservatism (section 6)
------------------------
Expansion is one hop, from seeds only, restricted to the categories the
question type licenses, capped per relation type, and filtered to the query's
animal. No attempt is made to reach five entities per query.

Outputs:
    eval/eval_complete_qrels.jsonl
    reports/qrels_audit.md
    reports/qrels_audit.json

Usage:
    PYTHONPATH=. python scripts/build_complete_qrels.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.indexing.vector_store import get_store  # noqa: E402
from RAG_System.retrieval.query_intent import detect  # noqa: E402
from RAG_System.retrieval.relation_graph import (  # noqa: E402
    RelationGraph, normalise,
)

DATASET = ROOT / "eval" / "eval.jsonl"
OUT_QRELS = ROOT / "eval" / "eval_complete_qrels.jsonl"
OUT_MD = ROOT / "reports" / "qrels_audit.md"
OUT_JSON = ROOT / "reports" / "qrels_audit.json"

# Per question type: which categories may enter as grade-1 context, and how
# many of each. Caps are deliberately tight -- a disease that lists fifteen
# products must not contribute fifteen qrels.
#
# `symptomatic` is the default intent (an owner describing what they see).
CONTEXT_RULES: dict[str, dict[str, int]] = {
    # question type -> {category allowed as grade-1 context: max per seed}
    "symptomatic": {
        "diseases": 3,       # what could explain the complaint
        "symptoms": 2,       # co-presenting signs of a seeded disease
        "diagnostics": 2,    # what would confirm it
        "emergency": 1,      # only when the KB links one to the seed
    },
    "medications": {
        "medications": 3,    # siblings that also treat the seeded disease
        "diseases": 1,       # the disease being treated
        "diagnostics": 1,    # monitoring/confirmation for that treatment
    },
    "medical_products": {
        "medical_products": 3,
        "diseases": 1,
        "symptoms": 1,
        "medications": 1,
    },
    "diagnostics": {
        "diseases": 2,       # what the test evaluates
        "symptoms": 2,
        "diagnostics": 1,    # a panel routinely run alongside it
    },
    "breeds": {
        "diseases": 2,       # predisposition, only for a broad breed question
    },
    "emergency": {
        "emergency": 2,
        "diseases": 2,
        "symptoms": 1,
    },
    "definitional": {
        "diseases": 2,
        "symptoms": 2,
        "diagnostics": 1,
        "medications": 1,
        "vaccines": 1,
        "medical_products": 1,
    },
}

# Human-readable justification per (seed category, target category) pair, in
# the direction the KB authored the link. Every grade-1 qrel carries one; a
# pair with no entry here is not admitted, which is what keeps the expansion
# from drifting into "anything two entities happen to share".
REASONS: dict[tuple[str, str], str] = {
    ("symptoms", "diseases"):
        "disease the KB lists as a possible cause of the queried symptom",
    ("symptoms", "diagnostics"):
        "diagnostic the KB links to the queried symptom",
    ("symptoms", "emergency"):
        "emergency protocol the KB links to the queried symptom",
    ("diseases", "symptoms"):
        "sign the KB lists for the seeded disease",
    ("diseases", "medications"):
        "medication the KB links to the seeded disease",
    ("diseases", "medical_products"):
        "product the KB links to the seeded disease",
    ("diseases", "diagnostics"):
        "diagnostic the KB links to the seeded disease",
    ("diseases", "emergency"):
        "emergency protocol the KB links to the seeded disease",
    ("diseases", "vaccines"):
        "vaccine the KB links to the seeded disease",
    ("diseases", "breeds"):
        "breed the KB lists as predisposed to the seeded disease",
    ("medications", "diseases"):
        "disease the seeded medication declares it treats",
    ("medications", "medical_products"):
        "product the KB links to the seeded medication",
    ("medical_products", "diseases"):
        "disease the seeded product declares it is used for",
    ("medical_products", "medications"):
        "medication the KB links to the seeded product",
    ("diagnostics", "diseases"):
        "disease the seeded diagnostic is used to evaluate",
    ("diagnostics", "symptoms"):
        "symptom the seeded diagnostic is used to evaluate",
    ("diagnostics", "diagnostics"):
        "diagnostic the KB links to the seeded test",
    ("vaccines", "diseases"):
        "disease the seeded vaccine protects against",
    ("emergency", "diseases"):
        "disease the KB links to the seeded emergency protocol",
    ("emergency", "symptoms"):
        "symptom the KB links to the seeded emergency protocol",
    ("breeds", "diseases"):
        "disease the KB lists the seeded breed as predisposed to",
}

# A broad breed question invites predisposition context; a narrow one does not.
_BROAD_BREED = ("characteristic", "tell me about", "describe", "like", "breed")


def load_dataset(path: Path) -> list[dict]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def resolve_keyword(keyword: str, animal: str | None, query: str,
                    categories: list[str], meta: dict[str, dict]) -> list[str]:
    """Entity ids the answer keyword denotes, honouring the animal filter.

    The original scorer counts a hit by plain substring containment, which is
    fine for "did retrieval find it" and far too loose for building a label
    set: "Radiography" contains-matches Dental Radiography and Intraoral
    Radiography, and "Insulin" contains-matches Insulin *Syringes*, a product
    rather than the medication the question asks for. Both would be scored as
    correct answers to a question that asks for neither.

    Three narrowing steps, in order, each only applied if it leaves something:

      1. exact normalised name equality -- if the KB has the entity verbatim,
         nothing else is the answer;
      2. the categories the question declares it expects, which removes the
         product/medication confusion;
      3. entities whose whole name appears in the question, which picks
         Radiography (Abdominal) out of the radiography family for "what is
         abdominal radiography used for" and drops its siblings.
    """
    needle = normalise(keyword)
    query_tokens = set(normalise(query).split())
    exact, partial = [], []
    for entity_id, m in meta.items():
        if animal and m.get("animal") and m["animal"] != animal:
            continue
        name = normalise(m.get("name") or "")
        if not name:
            continue
        if name == needle:
            exact.append(entity_id)
        elif needle in name or name in needle:
            partial.append(entity_id)
    if exact:
        return exact

    if categories:
        on_category = [
            entity_id for entity_id in partial
            if meta[entity_id].get("category") in categories
        ]
        partial = on_category or partial

    named_in_query = [
        entity_id for entity_id in partial
        if set(normalise(meta[entity_id].get("name") or "").split())
        <= query_tokens
    ]
    return named_in_query or partial


def main() -> None:
    cases = load_dataset(DATASET)
    store = get_store()
    meta = store.all_metadatas()
    graph = RelationGraph(meta)

    rows, audit = [], []
    unjustified: list[dict] = []

    for case in cases:
        query = case["query"]
        animal = case.get("animal")
        intent = detect(query)
        rules = CONTEXT_RULES.get(intent.name, CONTEXT_RULES["symptomatic"])

        # ── Answer seeds: the original human gold, resolved to ids ──────────
        answer: dict[str, dict] = {}
        for keyword in case["expected_keywords"]:
            for entity_id in resolve_keyword(
                keyword, animal, query,
                case.get("expected_categories") or [], meta
            ):
                m = meta[entity_id]
                answer[entity_id] = {
                    "entity_id": entity_id,
                    "name": m.get("name", ""),
                    "category": m.get("category", ""),
                    "grade": 2,
                    "reason": "directly answers the question",
                    "evidence": "original authored gold label "
                                "`expected_keywords={}`".format(keyword),
                    "source_entity": None,
                    "source_relation": None,
                }

        # ── Lexical seeds: entities the question names outright ─────────────
        # Not promoted to answer grade -- naming an entity makes it context,
        # and the original gold decides what actually answers the question.
        named = {
            entity_id for entity_id in graph.named_in(query)
            if not animal or not meta[entity_id].get("animal")
            or meta[entity_id]["animal"] == animal
        }

        context: dict[str, dict] = {
            entity_id: dict(row, grade=2) for entity_id, row in answer.items()
        }
        for entity_id in named:
            if entity_id in context:
                continue
            m = meta[entity_id]
            context[entity_id] = {
                "entity_id": entity_id,
                "name": m.get("name", ""),
                "category": m.get("category", ""),
                "grade": 1,
                "reason": "the question names this entity outright",
                "evidence": "normalised name `{}` occurs in the question "
                            "text".format(normalise(m.get("name", ""))),
                "source_entity": None,
                "source_relation": "lexical name match",
            }

        # ── One authored hop from each seed ─────────────────────────────────
        seeds = list(answer) + sorted(named - set(answer))
        if intent.name == "breeds" and not any(
            token in query.lower() for token in _BROAD_BREED
        ):
            seeds = []  # narrow breed question: do not inflate

        taken: dict[tuple[str, str], int] = {}
        for seed_id in seeds:
            seed_meta = meta.get(seed_id, {})
            seed_category = seed_meta.get("category", "")
            edges = graph.edges(seed_id, include_reverse=True)
            # Forward edges first: a link the *seed* declares is the KB
            # asserting something about the queried entity, while a reverse
            # edge is some other entity asserting something about it. Sorting
            # purely by list size put obscure one-item reverse edges at the
            # head -- a Labrador Retriever question collected Vitamin D
            # Deficiency, and an anorexia question collected Zinc Deficiency,
            # because those diseases each name one breed or one symptom. Within
            # a direction, the more specific authored list wins, then list
            # position. Fully determined by the KB, never by a score.
            edges.sort(key=lambda e: (not e.forward, e.list_size, e.position))
            for edge in edges:
                target_category = edge.target_category
                cap = rules.get(target_category)
                if cap is None:
                    continue
                if edge.target_id in context:
                    continue
                target_meta = meta.get(edge.target_id)
                if target_meta is None:
                    continue
                if (
                    animal and target_meta.get("animal")
                    and target_meta["animal"] != animal
                ):
                    continue
                authored = (
                    (edge.source_category, edge.target_category)
                    if edge.forward
                    else (edge.target_category, edge.source_category)
                )
                reason = REASONS.get(authored)
                if reason is None:
                    continue
                key = (seed_id, target_category)
                if taken.get(key, 0) >= cap:
                    continue
                taken[key] = taken.get(key, 0) + 1
                context[edge.target_id] = {
                    "entity_id": edge.target_id,
                    "name": target_meta.get("name", ""),
                    "category": target_category,
                    "grade": 1,
                    "reason": reason,
                    "evidence": "authored KB relation {}->{} from {} ({}), "
                                "list of {} entries, position {}".format(
                                    authored[0], authored[1],
                                    seed_meta.get("name", seed_id), seed_id,
                                    edge.list_size, edge.position),
                    "source_entity": seed_id,
                    "source_relation": "{}->{} ({})".format(
                        authored[0], authored[1],
                        "forward" if edge.forward else "reverse"),
                }

        for row in context.values():
            if row["grade"] == 1 and not row.get("evidence"):
                unjustified.append(row)

        record = {
            "query": query,
            "animal": animal,
            "intent": intent.name,
            "expected_keywords": case["expected_keywords"],
            "expected_categories": case.get("expected_categories") or [],
            "answer_qrels": sorted(answer.values(), key=lambda r: r["entity_id"]),
            "context_qrels": sorted(
                context.values(),
                key=lambda r: (-r["grade"], r["category"], r["entity_id"])),
        }
        rows.append(record)
        audit.append({
            "query": query,
            "intent": intent.name,
            "n_answer": len(answer),
            "n_context": len(context),
            "n_grade2": sum(1 for r in context.values() if r["grade"] == 2),
            "n_grade1": sum(1 for r in context.values() if r["grade"] == 1),
        })

    # ── Validation (section 11) ─────────────────────────────────────────────
    problems = []
    if len(rows) != 30:
        problems.append("expected 30 queries, built {}".format(len(rows)))
    for record in rows:
        if not any(r["grade"] == 2 for r in record["answer_qrels"]):
            problems.append("no grade-2 answer qrel: {}".format(record["query"]))
        for field in ("answer_qrels", "context_qrels"):
            ids = [r["entity_id"] for r in record[field]]
            if len(ids) != len(set(ids)):
                problems.append("duplicate ids in {}: {}".format(
                    field, record["query"]))
            for r in record[field]:
                if r["entity_id"] not in meta:
                    problems.append("entity not in KB: {} ({})".format(
                        r["entity_id"], record["query"]))
                if r["grade"] == 1 and not r.get("evidence"):
                    problems.append("grade-1 without justification: {}".format(
                        r["entity_id"]))
        for r in record["context_qrels"]:
            if "rank" in (r.get("evidence") or "").lower():
                problems.append("retrieval rank used as justification: "
                                "{}".format(r["entity_id"]))

    counts = sorted(a["n_context"] for a in audit)
    n = len(counts)
    stats = {
        "min": counts[0],
        "median": (counts[n // 2] if n % 2
                   else (counts[n // 2 - 1] + counts[n // 2]) / 2),
        "mean": round(sum(counts) / n, 2),
        "max": counts[-1],
        "total": sum(counts),
    }

    OUT_QRELS.write_text(
        "\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n",
        encoding="utf-8")

    # ── Audit ───────────────────────────────────────────────────────────────
    lines = [
        "# Expanded Gold Ground Truth -- audit",
        "",
        "Built by `scripts/build_complete_qrels.py` from three sources only: "
        "the original authored `expected_keywords`, lexical entity-name "
        "matches against the question, and one authored KB relation hop from "
        "those seeds in a direction the question type licenses. The production "
        "retriever, the vector search and the fusion ranking are never "
        "consulted -- no qrel can enter because it was retrieved.",
        "",
        "Original `eval/eval.jsonl` is untouched.",
        "",
        "## Summary",
        "",
        "| | |",
        "|---|---|",
        "| queries | {} |".format(len(rows)),
        "| answer qrels (grade 2) | {} |".format(
            sum(a["n_answer"] for a in audit)),
        "| context qrels total | {} |".format(stats["total"]),
        "| context qrels per query (min / median / mean / max) | "
        "{} / {} / {} / {} |".format(
            stats["min"], stats["median"], stats["mean"], stats["max"]),
        "| validation problems | {} |".format(len(problems)),
        "",
    ]
    if problems:
        lines += ["### Problems", ""] + [
            "- {}".format(p) for p in problems] + [""]
    else:
        lines += ["All validation checks pass: 30 queries, every query has at "
                  "least one grade-2 answer qrel, no duplicate ids, every "
                  "entity exists in the KB, every grade-1 entry carries a "
                  "relationship or lexical justification, and no justification "
                  "references a retrieval rank.", ""]

    lines += [
        "## Per-query qrels",
        "",
        "`Grade 2` = directly answers the question. `Grade 1` = clinically "
        "useful supporting context. Evidence names the authored relation and "
        "the list it came from.",
        "",
    ]
    for record in rows:
        lines += [
            "### {}".format(record["query"]),
            "",
            "- intent: `{}`  animal: `{}`".format(
                record["intent"], record["animal"]),
            "- original `expected_keywords`: {}".format(
                record["expected_keywords"]),
            "- answer qrels: {}  |  context qrels: {}".format(
                len(record["answer_qrels"]), len(record["context_qrels"])),
            "",
            "| Grade | Entity | Category | ID | Reason | Evidence |",
            "|---|---|---|---|---|---|",
        ]
        for r in record["context_qrels"]:
            lines.append("| {} | {} | {} | `{}` | {} | {} |".format(
                r["grade"], r["name"][:34], r["category"], r["entity_id"],
                r["reason"], r["evidence"]))
        lines.append("")

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    OUT_JSON.write_text(json.dumps({
        "queries": len(rows),
        "context_per_query": stats,
        "validation_problems": problems,
        "unjustified": unjustified,
        "per_query": audit,
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    print("queries              {}".format(len(rows)))
    print("answer qrels         {}".format(sum(a["n_answer"] for a in audit)))
    print("context qrels        {}".format(stats["total"]))
    print("per query min/med/mean/max  {} / {} / {} / {}".format(
        stats["min"], stats["median"], stats["mean"], stats["max"]))
    print("validation problems  {}".format(len(problems)))
    for p in problems:
        print("   ! {}".format(p))
    print()
    print("Saved {}".format(OUT_QRELS))
    print("Saved {}".format(OUT_MD))
    print("Saved {}".format(OUT_JSON))
    print()
    print("QRELS FROZEN")


if __name__ == "__main__":
    main()
