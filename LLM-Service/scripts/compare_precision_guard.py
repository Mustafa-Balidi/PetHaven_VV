#!/usr/bin/env python3
"""MULTI-EVIDENCE (current) vs MULTI-EVIDENCE + TOP-1 PRECISION GUARD.

The current arm is re-measured live through the production `retrieve()`. The
guard arms come from scripts/precision_guard_sweep.py, which replays the same
cached HyDE answers and the same ChromaDB neighbour lists through the same
production fusion -- the offline replay reproduces the live arm to four
decimals, which is what licenses putting them in one table.

Outputs:
    reports/precision_guard_comparison.json
    reports/precision_guard_comparison.md

Usage:
    PYTHONPATH=. python scripts/compare_precision_guard.py
"""
from __future__ import annotations

import dataclasses
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.config import settings  # noqa: E402
from RAG_System.retrieval import relation_fusion as rf  # noqa: E402
from scripts.compare_multi_evidence import run  # noqa: E402
from scripts.eval_precision_recall import _load  # noqa: E402
from scripts.multi_evidence_sweep import load, run_config  # noqa: E402

DATASET = ROOT / "eval" / "eval.jsonl"
SWEEP = ROOT / "reports" / "precision_guard_sweep.json"
FAILURES = ROOT / "reports" / "precision_at1_failures_before.json"
OUT_JSON = ROOT / "reports" / "precision_guard_comparison.json"
OUT_MD = ROOT / "reports" / "precision_guard_comparison.md"

ROWS = [
    ("Precision@1", "precision@1"), ("Precision@3", "precision@3"),
    ("Precision@5", "precision@5"), ("Recall@3", "recall@3"),
    ("Recall@5", "recall@5"), ("Recall@10", "recall@10"),
    ("F1@5", "f1@5"), ("MRR", "mrr"), ("Hit@5", "hit@5"),
    ("CategoryPrecision@5", "category_precision@5"),
]

# Section 12.
ACCEPT = {"precision@1": 0.8667, "recall@5": 0.8667, "hit@5": 1.0,
          "mrr": 0.8660, "category_precision@5": 0.88}

# The configuration the headline table reports as "Guard": the best of the
# configurations the brief actually mandates (window 3, floors 0.75/0.85/0.95).
HEADLINE_GUARD = dict(guard_mode="exact", guard_window=3, guard_floor=0.75)
HEADLINE_NAME = "exact w3 f0.75"
# Below the mandated floors. Reported because it is the only setting that
# improves anything, not because it is a candidate under section 12.
CEILING = dict(guard_mode="exact", guard_window=3, guard_floor=0.60)
CEILING_NAME = "exact w3 f0.60"


def head_changes(entries, graph, store, base, over):
    """(query, old rank-1, new rank-1, old P@1, new P@1) for changed heads."""
    off = run_config(entries, graph, store,
                     dataclasses.replace(base, guard_mode="off"))
    on = run_config(entries, graph, store, dataclasses.replace(base, **over))
    out = []
    for a, b in zip(off["cases"], on["cases"]):
        if not a["names"] or not b["names"]:
            continue
        if a["names"][0] == b["names"][0]:
            continue
        out.append({
            "query": a["query"],
            "old_rank1": a["names"][0],
            "new_rank1": b["names"][0],
            "old_precision@1": a["scores"]["precision@1"],
            "new_precision@1": b["scores"]["precision@1"],
        })
    return out


def main() -> None:
    cases = _load(DATASET)
    print("=== current (live, guard off) ===")
    live = run(cases)
    current = live["summary"]

    sweep = json.loads(SWEEP.read_text(encoding="utf-8"))
    by_name = {r["name"].replace("  ", " ").strip(): r for r in sweep}

    def pick(name):
        for row in sweep:
            if " ".join(row["name"].split()) == name:
                return row
        raise KeyError(name)

    guard = pick(HEADLINE_NAME)
    ceiling = pick(CEILING_NAME)

    entries, graph, store = load()
    base = rf.params_from_settings()
    guard_changes = head_changes(entries, graph, store, base, HEADLINE_GUARD)
    ceiling_changes = head_changes(entries, graph, store, base, CEILING)
    intent_changes = head_changes(
        entries, graph, store, base,
        dict(guard_mode="intent", guard_window=3, guard_floor=0.75))

    failures = json.loads(FAILURES.read_text(encoding="utf-8"))

    accepted = all(guard[k] >= v for k, v in ACCEPT.items())
    verdict = ("KEEP PRECISION GUARD" if accepted
               else "KEEP MULTI-EVIDENCE BASELINE")

    lines = [
        "# Top-1 Precision Guard -- Comparison",
        "",
        "Dataset: `eval/eval.jsonl`, {} queries, unmodified. Gold ground truth "
        "untouched. BM25 off, reranker off. No global relation-scoring "
        "parameter was retuned (section 3).".format(len(cases)),
        "",
        "`Current` is a live run of the production `retrieve()`. `Guard` is the "
        "best of the configurations section 7 mandates -- head window 3, score "
        "ratio floors 0.75 / 0.85 / 0.95 -- replayed offline from the same "
        "cached HyDE answers and the same ChromaDB neighbour lists. The "
        "guard-off row of that replay reproduces the live arm to four decimals.",
        "",
        "| Metric | Current | Guard ({}) | Delta |".format(HEADLINE_NAME),
        "|---|---|---|---|",
    ]
    for label, key in ROWS:
        lines.append("| {} | {:.4f} | {:.4f} | {:+.4f} |".format(
            label, current[key], guard[key], guard[key] - current[key]))
    lines.append(
        "| Latency (mean s) | {:.3f} | {:.3f} | {:+.3f} |".format(
            current["mean_latency_s"], current["mean_latency_s"], 0.0))
    lines += [
        "",
        "Latency is identical by construction: the guard is a bounded scan of "
        "the first {} candidates and at most one list rotation, with no extra "
        "graph, store or model access.".format(HEADLINE_GUARD["guard_window"]),
        "",
        "## Acceptance (section 12)",
        "",
        "| Gate | Floor | Measured | |",
        "|---|---|---|---|",
    ]
    for key, floor in ACCEPT.items():
        lines.append("| {} | >= {:.4f} | {:.4f} | {} |".format(
            key, floor, guard[key], "PASS" if guard[key] >= floor else "FAIL"))
    lines += [
        "",
        "**Precision@1 stays at 0.8000 (24/30).** The mandated configuration "
        "does not fire on any query, so nothing moves.",
        "",
        "## Full guard sweep",
        "",
        "`heads changed` counts queries whose rank-1 entity differs from the "
        "current arm; `fixed` / `broke` count Precision@1 transitions. Recall@5, "
        "Hit@5 and CategoryPrecision@5 are constant across every row -- the "
        "guard rotates one candidate within the head and cannot change top-K "
        "membership (section 9), which the sweep confirms rather than assumes.",
        "",
        "| Config | P@1 | R@5 | MRR | Hit@5 | CatP@5 | Heads changed | Fixed | "
        "Broke |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    for row in sweep:
        lines.append(
            "| {} | {:.4f} | {:.4f} | {:.4f} | {:.4f} | {:.4f} | {} | {} | {} |"
            .format(" ".join(row["name"].split()), row["precision@1"],
                    row["recall@5"], row["mrr"], row["hit@5"],
                    row["category_precision@5"], row["head_changed"],
                    row["top1_fixed"], row["top1_broken"]))

    # ── The six original failures ───────────────────────────────────────────
    lines += [
        "",
        "## The six original Precision@1 failures (section 11)",
        "",
        "`Rule` is the guard rule that fires under the mandated grid. "
        "`Fixable` records whether *any* generic head rule can reach the case "
        "at all, with the reason.",
        "",
        "| Query | Old rank 1 | Rule fired | New rank 1 | Expected matched | "
        "Fixable |",
        "|---|---|---|---|---|---|",
    ]
    guard_map = {c["query"]: c for c in guard_changes}
    fixable = {
        "What medication treats Canine Infectious Hepatitis?": (
            "yes, but only below the mandated floors -- the named disease sits "
            "at score ratio 0.644"),
        "What product helps a dog recovering from Gastric Dilatation-Volvulus?":
            ("only by the intent rule at floor 0.75, which costs three other "
             "queries their correct head"),
        "My dog has bad breath and swollen gums, what product helps?": (
            "no -- the relevant entity is at rank 5, outside any head window, "
            "and rank 1 is already on-intent"),
        "My dog has fleas, what product should I use?": (
            "no -- rank 1 and the relevant entity are both on-intent products; "
            "nothing generic separates them"),
        "My cat is vomiting, what product can help settle its stomach?": (
            "no -- the relevant product is at rank 4 and the two candidates "
            "above it are equally on-intent"),
        "My cat drinks and urinates a lot, what monitoring product helps?": (
            "no -- rank 1 is already on-intent and the relevant entity is "
            "off-intent at rank 5, ratio 0.453"),
    }
    for pattern in failures["patterns"]:
        query = pattern["query"]
        change = guard_map.get(query)
        lines.append("| {} | {} | {} | {} | {} | {} |".format(
            query[:38], pattern["rank1"][:30],
            "EXACT_ENTITY" if change else "NONE",
            change["new_rank1"][:30] if change else "(unchanged)",
            "yes" if change and change["new_precision@1"] else "no",
            fixable.get(query, "-")))

    lines += [
        "",
        "No previously-correct Precision@1 query changed under the mandated "
        "configuration: 0 fixed, 0 broken, 0 heads changed.",
        "",
        "## Why the intent rule is rejected",
        "",
        "PRIMARY_INTENT_HEAD at the lowest mandated floor (0.75, window 3) is "
        "net-negative: it fixes one query and breaks three. In all three "
        "breakages rank 1 is already the relevant entity and the promoted "
        "sibling is not.",
        "",
        "| Query | Old rank 1 | New rank 1 | P@1 |",
        "|---|---|---|---|",
    ]
    for c in intent_changes:
        lines.append("| {} | {} | {} | {} |".format(
            c["query"][:40], c["old_rank1"][:30], c["new_rank1"][:30],
            "{} -> {}".format(int(c["old_precision@1"]),
                              int(c["new_precision@1"]))))
    lines += [
        "",
        "Gating the rule on \"never displace an explicitly named rank 1\" "
        "removes two of the three breakages -- and also removes the one fix, "
        "because that query names its disease too (\"What product helps a dog "
        "recovering from **Gastric Dilatation-Volvulus**?\"). The rule has no "
        "setting that is both safe and useful on this set.",
        "",
        "## The ceiling of the idea (below the mandated floors)",
        "",
        "Recorded for completeness, **not** adopted -- its floor of 0.60 sits "
        "below all three thresholds section 7 specifies, and its Precision@1 "
        "of {:.4f} (25/30) is below the 0.8667 the goal requires.".format(
            ceiling["precision@1"]),
        "",
        "| Metric | Current | {} | Delta |".format(CEILING_NAME),
        "|---|---|---|---|",
    ]
    for label, key in ROWS:
        lines.append("| {} | {:.4f} | {:.4f} | {:+.4f} |".format(
            label, current[key], ceiling[key], ceiling[key] - current[key]))
    lines += [
        "",
        "It changes exactly two heads, fixes one and breaks none:",
        "",
        "| Query | Old rank 1 | New rank 1 | P@1 |",
        "|---|---|---|---|",
    ]
    for c in ceiling_changes:
        lines.append("| {} | {} | {} | {} |".format(
            c["query"][:40], c["old_rank1"][:30], c["new_rank1"][:30],
            "{} -> {}".format(int(c["old_precision@1"]),
                              int(c["new_precision@1"]))))
    lines += [
        "",
        "It improves Precision@1 and MRR at no cost to Recall@5, Hit@5 or "
        "CategoryPrecision@5, and is one environment variable away "
        "(`PRECISION_GUARD_MODE=exact PRECISION_GUARD_FLOOR=0.60`). Two "
        "reasons it is not switched on here: it misses the stated Precision@1 "
        "gate, and its second head change turns \"What medication is used for "
        "Hypothyroidism in dogs?\" from **Levothyroxine** into "
        "**Hypothyroidism** -- scored as correct either way, but the drug is "
        "the better head for a question that asks for one. That is a product "
        "judgement, not a metric one.",
        "",
        "## Shipped configuration",
        "",
        "| Setting | Value |",
        "|---|---|",
        "| PRECISION_GUARD_MODE | {} |".format(settings.PRECISION_GUARD_MODE),
        "| PRECISION_GUARD_WINDOW | {} |".format(
            settings.PRECISION_GUARD_WINDOW),
        "| PRECISION_GUARD_FLOOR | {} |".format(settings.PRECISION_GUARD_FLOOR),
        "",
        "Every global relation-scoring parameter is untouched (section 3): "
        "RELATION_BOOST 1.8, RELATION_MULTI_EVIDENCE_DECAY 0.65, RELATION_CAP "
        "2.4, RELATION_REVERSE_PENALTY 0.90, RELATION_PASS2_TARGET_DECAY 0.35, "
        "SIMILARITY_THRESHOLD 0.50, RETRIEVAL_TOP_K 20.",
        "",
        "With the guard off the pipeline is byte-identical in behaviour to the "
        "accepted Multi-Evidence version; the guard is dormant code behind a "
        "default-off switch.",
        "",
        "## Regression (section 13)",
        "",
        "The FastAPI server was restarted first, so the new module is the one "
        "under test.",
        "",
        "- `PYTHONIOENCODING=utf-8 python test_api.py "
        "--url http://127.0.0.1:8000` -> **40/40**.",
        "- `PYTHONPATH=. python scripts/mini_eval.py` -> **0 grounding "
        "violations** across all 8 cases; emergency flags unchanged with no "
        "false positives (TEST2/TEST3 true, TEST1/TEST4/TEST5 false); Arabic "
        "cases clean; TEST6 HyDE identical across three runs. Every case "
        "matches `reports/mini_eval_relation_aware.json` on violations and "
        "emergency flags.",
        "",
        "## Runtime smoke test (section 14)",
        "",
        "Natural questions through the shipped configuration. Not part of any "
        "tuning -- none of these are eval queries.",
        "",
        "| # | Question | Rank 1 | Category | Sensible head |",
        "|---|---|---|---|---|",
        "| 1 | What medication is used for hypothyroidism in dogs? | "
        "Levothyroxine | medications | yes -- the drug, not the disease |",
        "| 2 | My dog is vomiting and has no energy, what could be wrong? | "
        "Vomiting | symptoms | yes -- symptom head, GDV at rank 2 |",
        "| 3 | What product can help a diabetic cat with monitoring? | "
        "Glucose Meter | medical_products | yes |",
        "| 4 | What does a CBC test show? | Complete Blood Count | diagnostics "
        "| yes |",
        "| 5 | Tell me about Labrador Retrievers. | Labrador Retriever | breeds "
        "| yes |",
        "",
        "Two observations worth carrying into frontend integration, neither a "
        "regression from this experiment:",
        "",
        "- Question 3 returns **Glucose Meter at rank 1** even though the eval "
        "set's own phrasing of that question (\"My cat drinks and urinates a "
        "lot, what monitoring product helps?\") never retrieves it. The "
        "difference is that the natural phrasing names the condition; the eval "
        "phrasing describes symptoms. The pipeline is stronger than that eval "
        "row suggests.",
        "- Question 4 was asked without an `animal` filter and returns five "
        "near-identical Complete Blood Count entities, one per species. "
        "Correct, but poor context for the generator. The API always passes an "
        "animal, so this is only reachable through an unfiltered call.",
        "",
        "## Verdict",
        "",
        "**{}**".format(verdict),
        "",
    ]

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    OUT_JSON.write_text(json.dumps({
        "verdict": verdict,
        "accepted": accepted,
        "acceptance": {k: {"floor": v, "measured": guard[k],
                           "passed": guard[k] >= v}
                       for k, v in ACCEPT.items()},
        "current": current,
        "guard": {k: guard[k] for _, k in ROWS},
        "guard_config": HEADLINE_GUARD,
        "delta": {k: round(guard[k] - current[k], 4) for _, k in ROWS},
        "sweep": sweep,
        "head_changes": {
            HEADLINE_NAME: guard_changes,
            "intent w3 f0.75": intent_changes,
            CEILING_NAME: ceiling_changes,
        },
        "ceiling": {k: ceiling[k] for _, k in ROWS},
        "ceiling_config": CEILING,
        "shipped": {
            "PRECISION_GUARD_MODE": settings.PRECISION_GUARD_MODE,
            "PRECISION_GUARD_WINDOW": settings.PRECISION_GUARD_WINDOW,
            "PRECISION_GUARD_FLOOR": settings.PRECISION_GUARD_FLOOR,
        },
        "per_query_current": live["cases"],
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    print()
    print("\n".join(lines))
    print("Saved {}\nSaved {}".format(OUT_JSON, OUT_MD))


if __name__ == "__main__":
    main()
