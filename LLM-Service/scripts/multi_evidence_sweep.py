#!/usr/bin/env python3
"""Offline replay harness for the multi-evidence relation experiment.

Same idea as scripts/relation_aware_sweep.py, but it drives the *production*
FusionParams (so the replayed arm is the deployed configuration, not the
dataclass defaults) and lets a config override individual knobs.

Every configuration sees the identical cached HyDE answers and identical
ChromaDB neighbour lists, so a delta is attributable to the ranking change.

Usage:
    PYTHONPATH=. python scripts/multi_evidence_sweep.py --baseline
    PYTHONPATH=. python scripts/multi_evidence_sweep.py --sweep
"""
from __future__ import annotations

import argparse
import dataclasses
import json
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.config import settings  # noqa: E402
from RAG_System.indexing.vector_store import SearchHit, get_store  # noqa: E402
from RAG_System.retrieval.query_intent import detect  # noqa: E402
from RAG_System.retrieval import relation_fusion as rf  # noqa: E402
from RAG_System.retrieval.relation_graph import get_graph  # noqa: E402
from scripts.eval_precision_recall import _matches, _score  # noqa: E402
from scripts.threshold_candidate_sweep import candidates  # noqa: E402

CACHE = ROOT / "reports" / "_candidate_cache.json"
FINAL_K = 10
CATEGORY_K = 5
POOL = 20
THRESHOLD = 0.50

K_VALUES = (1, 3, 5, 10)


def to_hits(rows: list[dict]) -> list[SearchHit]:
    return [
        SearchHit(id=r["id"], text="", metadata=r["metadata"],
                  distance=r["distance"])
        for r in rows
    ]


def run_config(entries, graph, store, params, pool=POOL, threshold=THRESHOLD):
    rows = []
    t0 = time.perf_counter()
    for entry in entries:
        kept = to_hits(candidates(entry, pool, threshold))
        intent = detect(entry["query"])
        fused, supports = rf.expand_and_fuse(
            entry["query"], kept, animal=entry.get("animal"), store=store,
            graph=graph, intent=intent, params=params, return_supports=True,
        )
        final = fused[:FINAL_K]
        names = [(h.metadata or {}).get("name", "") for h in final]
        cats = [(h.metadata or {}).get("category", "") for h in final]
        scores = _score(entry["expected_keywords"], names)
        cat_p = sum(
            1 for c in cats[:CATEGORY_K] if c in entry["expected_categories"]
        ) / CATEGORY_K
        rows.append({
            "query": entry["query"],
            "intent": intent.name,
            "names": names,
            "scores": scores,
            "ranks": {
                kw: next((i for i, n in enumerate(names, 1) if _matches(kw, n)),
                         None)
                for kw in entry["expected_keywords"]
            },
            "category_precision@5": cat_p,
            "hit@5": 1.0 if scores["recall@5"] > 0 else 0.0,
            "missing": [kw for kw in entry["expected_keywords"]
                        if not any(_matches(kw, n) for n in names)],
            "supports": {
                sid: {
                    "name": s.name, "category": s.category,
                    "vector_rank": s.vector_rank,
                    "vector_score": round(s.vector_score, 4),
                    "relation_score": round(s.relation_score, 4),
                    "intent_bonus": round(s.intent_bonus, 4),
                    "final_score": round(s.final_score, 4),
                    "edges": sorted(s.edges, key=lambda e: -e["support"])[:4],
                    "n_edges": len(s.edges),
                    "n_anchors": len({e["from"] for e in s.edges}),
                }
                for sid, s in supports.items()
            },
        })
    elapsed = time.perf_counter() - t0
    n = len(rows)

    def mean(key):
        return sum(r["scores"][key] for r in rows) / n

    front_end = sum(
        e["timing"]["hyde_s"] + e["timing"]["search_s"] for e in entries
    ) / n
    return {
        **{f"{name}@{k}": round(mean(f"{name}@{k}"), 4)
           for k in K_VALUES for name in ("precision", "recall", "f1")},
        "mrr": round(mean("mrr"), 4),
        "hit@5": round(sum(r["hit@5"] for r in rows) / n, 4),
        "category_precision@5": round(
            sum(r["category_precision@5"] for r in rows) / n, 4),
        "fusion_ms": round(1000 * elapsed / n, 2),
        "mean_latency_s": round(front_end + elapsed / n, 3),
        "cases": rows,
    }


HEADLINE = ("precision@1", "precision@3", "precision@5", "recall@3",
            "recall@5", "recall@10", "f1@5", "mrr", "hit@5",
            "category_precision@5")


def load():
    entries = json.loads(CACHE.read_text(encoding="utf-8"))["entries"]
    return entries, get_graph(), get_store()


# ── The sweep that chose the shipped operating point ────────────────────────
#
# Deliberately small (section 13 of the brief): three knobs, sensible values,
# not a grid. Every configuration replays the identical cached HyDE answers and
# identical ChromaDB neighbour lists, so a delta is the ranking change and
# nothing else. `_BASE` is the aggressive corner -- every knob on -- and the
# first six rows walk in from the neutral end so each knob's contribution is
# separable; the last six perturb `_BASE` one knob at a time.

_BASE = dict(multi_evidence_decay=0.55, relation_cap=2.4,
             exact_anchor_weight=0.95, anchor_rank_k=5,
             pass2_target_decay=0.60)

GRID = {
    "C01 me.55 cap2.4": dict(multi_evidence_decay=0.55, relation_cap=2.4),
    "C02 me.40 cap2.4": dict(multi_evidence_decay=0.40, relation_cap=2.4),
    "C03 +anchor_k5": dict(multi_evidence_decay=0.55, relation_cap=2.4,
                           anchor_rank_k=5),
    "C04 +exact.95": dict(multi_evidence_decay=0.55, relation_cap=2.4,
                          exact_anchor_weight=0.95),
    "C05 +exact +anchor_k5": dict(multi_evidence_decay=0.55, relation_cap=2.4,
                                  exact_anchor_weight=0.95, anchor_rank_k=5),
    "C06 +pass2_target.60 (BASE)": dict(_BASE),
    "C07 BASE me.40": {**_BASE, "multi_evidence_decay": 0.40},
    "C08 BASE primary_gain1.15": {**_BASE, "primary_relation_gain": 1.15},
    "C09 BASE reverse.80": {**_BASE, "reverse_penalty": 0.80},
    "C10 BASE cap3.0": {**_BASE, "relation_cap": 3.0},
    "C11 BASE category_decay.20": {**_BASE, "category_decay": 0.20},
    "C12 BASE pass2_target.70 anchor8": {**_BASE, "pass2_target_decay": 0.70,
                                         "anchor_top_n": 8},
    # Refinement around the two winners of the first twelve, plus the ablation
    # that isolates the named-entity anchor.
    "R1 me.50": dict(multi_evidence_decay=0.50, relation_cap=2.4,
                     exact_anchor_weight=0.95),
    "R2 me.65 (SHIPPED)": dict(multi_evidence_decay=0.65, relation_cap=2.4,
                               exact_anchor_weight=0.95),
    "R3 cap2.0": dict(multi_evidence_decay=0.55, relation_cap=2.0,
                      exact_anchor_weight=0.95),
    "R4 cap2.8": dict(multi_evidence_decay=0.55, relation_cap=2.8,
                      exact_anchor_weight=0.95),
    "R5 pass2_target.45": dict(multi_evidence_decay=0.55, relation_cap=2.4,
                               exact_anchor_weight=0.95,
                               pass2_target_decay=0.45),
    "R6 exact1.10": dict(multi_evidence_decay=0.55, relation_cap=2.4,
                         exact_anchor_weight=1.10),
    "A1 me.65 exact OFF": dict(multi_evidence_decay=0.65, relation_cap=2.4,
                               exact_anchor_weight=0.0),
    "A2 me.70": dict(multi_evidence_decay=0.70, relation_cap=2.4,
                     exact_anchor_weight=0.95),
}


def sweep(entries, graph, store, base_params) -> list[dict]:
    """Run GRID, print a row each, return them ranked by the section-13 order."""
    out = []
    for name, over in GRID.items():
        result = run_config(
            entries, graph, store, dataclasses.replace(base_params, **over))
        row = {key: result[key] for key in HEADLINE}
        row["name"], row["overrides"] = name, over
        out.append(row)
        print("{:34} R@5={:.4f} P@1={:.4f} MRR={:.4f} Hit@5={:.4f} "
              "CatP={:.4f}".format(
                  name, row["recall@5"], row["precision@1"], row["mrr"],
                  row["hit@5"], row["category_precision@5"]))
    # Selection order, section 13: Recall@5, then Precision@1, then MRR, then
    # Category Precision@5.
    out.sort(key=lambda r: (-r["recall@5"], -r["precision@1"], -r["mrr"],
                            -r["category_precision@5"]))
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", action="store_true")
    ap.add_argument("--sweep", action="store_true")
    ap.add_argument("--overrides", default="{}")
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    entries, graph, store = load()
    params = rf.params_from_settings()

    if args.sweep:
        ranked = sweep(entries, graph, store, params)
        print("\nRanked (Recall@5, Precision@1, MRR, CategoryPrecision@5):")
        for row in ranked:
            print("  {:34} R@5={:.4f} P@1={:.4f} MRR={:.4f} CatP={:.4f}".format(
                row["name"], row["recall@5"], row["precision@1"], row["mrr"],
                row["category_precision@5"]))
        out = args.out or str(ROOT / "reports" / "multi_evidence_sweep.json")
        Path(out).write_text(
            json.dumps(ranked, indent=2, ensure_ascii=False), encoding="utf-8")
        print("\nSaved {}".format(out))
        return
    over = json.loads(args.overrides)
    if over:
        params = dataclasses.replace(params, **over)
    result = run_config(entries, graph, store, params)
    for row in result["cases"]:
        flag = "OK " if not row["missing"] else "MISS"
        print(f"{flag} {row['query'][:44]:44} [{row['intent']:16}] "
              f"R@5={row['scores']['recall@5']:.2f} "
              f"P@1={row['scores']['precision@1']:.2f} miss={row['missing']}")
    print()
    for key in HEADLINE:
        print(f"{key:24} {result[key]}")
    if args.out:
        Path(args.out).write_text(
            json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nSaved {args.out}")


if __name__ == "__main__":
    main()
