#!/usr/bin/env python3
"""Why Precision@1 = 0 on the queries where it is 0.

Reads the live per-query results of the current production arm from
reports/multi_evidence_relation_comparison.json, and joins them against the
offline fusion provenance in reports/_me_new.json (the same ranking, replayed
from the cached HyDE answers, so the support records describe the run that
produced those ranks).

Diagnosis only -- it changes nothing and decides nothing.

Outputs:
    reports/precision_at1_failures_before.json
    reports/precision_at1_failures_before.md

Usage:
    PYTHONPATH=. python scripts/diagnose_precision_at1.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.retrieval.query_intent import detect  # noqa: E402
from RAG_System.retrieval.relation_graph import get_graph  # noqa: E402
from scripts.eval_precision_recall import _load, _matches  # noqa: E402

DATASET = ROOT / "eval" / "eval.jsonl"
LIVE = ROOT / "reports" / "multi_evidence_relation_comparison.json"
REPLAY = ROOT / "reports" / "_me_new.json"
OUT_JSON = ROOT / "reports" / "precision_at1_failures_before.json"
OUT_MD = ROOT / "reports" / "precision_at1_failures_before.md"

HEAD = 5


def main() -> None:
    cases = {c["query"]: c for c in _load(DATASET)}
    live = json.loads(LIVE.read_text(encoding="utf-8"))["per_query"]["new"]
    replay = {
        case["query"]: case
        for case in json.loads(REPLAY.read_text(encoding="utf-8"))["cases"]
    }
    graph = get_graph()

    failures, passes = [], []
    for row in live:
        query = row["query"]
        case = cases[query]
        intent = detect(query)
        supports = replay.get(query, {}).get("supports", {})
        named = {
            entity_id for entity_id in graph.named_in(query)
            if entity_id in supports
        }

        head = []
        for position, item in enumerate(row["retrieved"][:HEAD], start=1):
            s = supports.get(item["id"], {})
            edges = s.get("edges") or []
            head.append({
                "rank": position,
                "id": item["id"],
                "name": item["name"],
                "category": item["category"],
                "vector_rank": s.get("vector_rank"),
                "vector_score": s.get("vector_score"),
                "relation_score": s.get("relation_score"),
                "intent_bonus": s.get("intent_bonus"),
                "final_score": s.get("final_score"),
                "supporting_anchors": s.get("n_anchors"),
                "forward_edges": sum(
                    1 for e in edges if e["direction"] == "forward"),
                "reverse_edges": sum(
                    1 for e in edges if e["direction"] == "reverse"),
                "explicitly_named": item["id"] in named,
                "matches_expected": any(
                    _matches(kw, item["name"])
                    for kw in case["expected_keywords"]),
                "in_primary_category": item["category"] in intent.primary,
            })

        record = {
            "query": query,
            "intent": intent.name,
            "intent_primary": list(intent.primary),
            "intent_secondary": list(intent.secondary),
            "expected_keywords": case["expected_keywords"],
            "expected_categories": case.get("expected_categories") or [],
            "precision@1": row["scores"]["precision@1"],
            "first_relevant_rank": row["scores"].get("first_relevant_rank"),
            "named_entities_in_query": sorted(
                (entity_id, supports[entity_id]["name"],
                 supports[entity_id]["category"])
                for entity_id in named
            ),
            "head": head,
        }
        (failures if row["scores"]["precision@1"] == 0 else passes).append(
            record)

    # ── Pattern summary ─────────────────────────────────────────────────────
    patterns = []
    for f in failures:
        top = f["head"][0]
        relevant = [h for h in f["head"] if h["matches_expected"]]
        best = relevant[0] if relevant else None
        ratio = (
            best["final_score"] / top["final_score"]
            if best and top.get("final_score") else None
        )
        patterns.append({
            "query": f["query"],
            "intent": f["intent"],
            "rank1": top["name"],
            "rank1_category": top["category"],
            "rank1_in_primary": top["in_primary_category"],
            "first_relevant_rank_in_head": best["rank"] if best else None,
            "first_relevant_name": best["name"] if best else None,
            "first_relevant_category": best["category"] if best else None,
            "first_relevant_in_primary": (
                best["in_primary_category"] if best else None),
            "first_relevant_explicitly_named": (
                best["explicitly_named"] if best else None),
            "score_ratio_to_rank1": round(ratio, 4) if ratio else None,
            "first_relevant_vector_rank": (
                best["vector_rank"] if best else None),
            "first_relevant_anchors": (
                best["supporting_anchors"] if best else None),
        })

    lines = [
        "# Precision@1 failures -- current Multi-Evidence arm",
        "",
        "Diagnosis before any change. Ranks are the live "
        "`retrieve()` output recorded in "
        "`reports/multi_evidence_relation_comparison.json`; the score columns "
        "are the fusion provenance for that same ranking, replayed from the "
        "cached HyDE answers.",
        "",
        "Precision@1 = {}/30 = {:.4f}. {} failing queries.".format(
            len(passes), len(passes) / len(live), len(failures)),
        "",
        "## Pattern summary",
        "",
        "`Ratio` is `first_relevant.final_score / rank1.final_score` -- the "
        "promotion evidence floor of section 7 would have to sit at or below "
        "it for that query to be fixable by a head swap.",
        "",
        "| Query | Intent | Rank 1 | Rank1 on-intent | First relevant | "
        "At rank | On-intent | Named | Vec rank | Anchors | Ratio |",
        "|---|---|---|---|---|---|---|---|---|---|---|",
    ]
    for p in patterns:
        lines.append(
            "| {} | {} | {} ({}) | {} | {} | {} | {} | {} | {} | {} | {} |"
            .format(
                p["query"][:38], p["intent"], p["rank1"][:28],
                p["rank1_category"],
                "yes" if p["rank1_in_primary"] else "no",
                (p["first_relevant_name"] or "-")[:28],
                p["first_relevant_rank_in_head"] or "outside top 5",
                "yes" if p["first_relevant_in_primary"] else "no",
                "yes" if p["first_relevant_explicitly_named"] else "no",
                p["first_relevant_vector_rank"] or "none",
                p["first_relevant_anchors"] or "-",
                "{:.3f}".format(p["score_ratio_to_rank1"])
                if p["score_ratio_to_rank1"] else "-"))

    lines += ["", "## Per-query detail", ""]
    for f in failures:
        lines += [
            "### {}".format(f["query"]),
            "",
            "- intent: `{}`  primary={}  secondary={}".format(
                f["intent"], f["intent_primary"], f["intent_secondary"]),
            "- expected_keywords: {}".format(f["expected_keywords"]),
            "- expected_categories: {}".format(f["expected_categories"]),
            "- first relevant entity at rank: {}".format(
                int(f["first_relevant_rank"]) if f["first_relevant_rank"]
                else "not in returned list"),
            "- entities the query names outright: {}".format(
                ", ".join("{} ({})".format(n, c)
                          for _, n, c in f["named_entities_in_query"])
                or "none"),
            "",
            "| Rank | Entity | Category | Vec rank | Vec score | Relation | "
            "Intent bonus | Final | Anchors | Fwd | Rev | Named | On-intent | "
            "Relevant |",
            "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
        ]
        for h in f["head"]:
            lines.append(
                "| {} | {} | {} | {} | {} | {} | {} | {} | {} | {} | {} | {} "
                "| {} | {} |".format(
                    h["rank"], h["name"][:34], h["category"],
                    h["vector_rank"] or "none",
                    "{:.3f}".format(h["vector_score"])
                    if h["vector_score"] is not None else "-",
                    "{:.3f}".format(h["relation_score"])
                    if h["relation_score"] is not None else "-",
                    "{:.2f}".format(h["intent_bonus"])
                    if h["intent_bonus"] is not None else "-",
                    "{:.3f}".format(h["final_score"])
                    if h["final_score"] is not None else "-",
                    h["supporting_anchors"] or "-",
                    h["forward_edges"], h["reverse_edges"],
                    "yes" if h["explicitly_named"] else "",
                    "yes" if h["in_primary_category"] else "",
                    "**yes**" if h["matches_expected"] else ""))
        lines.append("")

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    OUT_JSON.write_text(json.dumps({
        "precision@1": round(len(passes) / len(live), 4),
        "failing_queries": len(failures),
        "patterns": patterns,
        "failures": failures,
        "passes": passes,
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    print("\n".join(lines))
    print("Saved {}\nSaved {}".format(OUT_JSON, OUT_MD))


if __name__ == "__main__":
    main()
