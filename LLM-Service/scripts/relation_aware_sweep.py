#!/usr/bin/env python3
"""Offline replay of the relation-aware stage over the cached candidate lists.

Uses the *production* modules (query_intent, relation_graph, relation_fusion) --
nothing is reimplemented here. Only the expensive front end (HyDE + embed +
ChromaDB search) is replayed from reports/_candidate_cache.json, so a whole
configuration grid costs seconds instead of an hour of API calls.

Usage:
    PYTHONPATH=. python scripts/relation_aware_sweep.py
    PYTHONPATH=. python scripts/relation_aware_sweep.py --single --threshold 0.45 --pool 30
"""
from __future__ import annotations

import argparse
import itertools
import json
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.indexing.vector_store import SearchHit, get_store  # noqa: E402
from RAG_System.retrieval.query_intent import detect  # noqa: E402
from RAG_System.retrieval.relation_fusion import (  # noqa: E402
    FusionParams,
    expand_and_fuse,
)
from RAG_System.retrieval.relation_graph import get_graph  # noqa: E402
from scripts.eval_precision_recall import _matches, _score  # noqa: E402
from scripts.threshold_candidate_sweep import candidates  # noqa: E402

CACHE = ROOT / "reports" / "_candidate_cache.json"
FINAL_K = 10
CATEGORY_K = 5


def to_hits(rows: list[dict]) -> list[SearchHit]:
    return [
        SearchHit(
            id=row["id"],
            text="",
            metadata=row["metadata"],
            distance=row["distance"],
        )
        for row in rows
    ]


def run_config(entries, graph, store, threshold, pool, params):
    rows = []
    t0 = time.perf_counter()
    for entry in entries:
        kept = to_hits(candidates(entry, pool, threshold))
        intent = detect(entry["query"])
        fused, supports = expand_and_fuse(
            entry["query"],
            kept,
            animal=entry.get("animal"),
            store=store,
            graph=graph,
            intent=intent,
            params=params,
            return_supports=True,
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
            "intent_match": intent.matched,
            "candidate_count": len(kept),
            "fused_count": len(fused),
            "expanded": len(fused) - len(kept),
            "names": names,
            "scores": scores,
            "category_precision@5": cat_p,
            "hit@5": 1.0 if scores["recall@5"] > 0 else 0.0,
            "missing": [
                kw for kw in entry["expected_keywords"]
                if not any(_matches(kw, n) for n in names)
            ],
            "supports": {
                sid: {
                    "name": s.name,
                    "category": s.category,
                    "vector_rank": s.vector_rank,
                    "vector_score": round(s.vector_score, 4),
                    "relation_score": round(s.relation_score, 4),
                    "intent_bonus": round(s.intent_bonus, 4),
                    "final_score": round(s.final_score, 4),
                    "edges": s.edges[:4],
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
        "threshold": threshold,
        "pool": pool,
        "params": {
            "anchor_top_n": params.anchor_top_n,
            "pass2_top_m": params.pass2_top_m,
            "max_passes": params.max_passes,
            "relation_cap": params.relation_cap,
            "reverse_penalty": params.reverse_penalty,
            "pass_decay": list(params.pass_decay),
            "enable_reverse": params.enable_reverse,
        },
        "precision@1": round(mean("precision@1"), 4),
        "recall@1": round(mean("recall@1"), 4),
        "recall@3": round(mean("recall@3"), 4),
        "recall@5": round(mean("recall@5"), 4),
        "recall@10": round(mean("recall@10"), 4),
        "precision@5": round(mean("precision@5"), 4),
        "f1@5": round(mean("f1@5"), 4),
        "mrr": round(mean("mrr"), 4),
        "hit@5": round(sum(r["hit@5"] for r in rows) / n, 4),
        "category_precision@5": round(
            sum(r["category_precision@5"] for r in rows) / n, 4
        ),
        "mean_candidate_count": round(
            sum(r["candidate_count"] for r in rows) / n, 2
        ),
        "mean_expanded": round(sum(r["expanded"] for r in rows) / n, 2),
        "fusion_ms": round(1000 * elapsed / n, 2),
        "mean_latency_s": round(front_end + elapsed / n, 3),
        "cases": rows,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", default=str(CACHE))
    ap.add_argument("--single", action="store_true")
    ap.add_argument("--threshold", type=float, default=0.45)
    ap.add_argument("--pool", type=int, default=30)
    ap.add_argument("--anchor", type=int, default=6)
    ap.add_argument("--pass2", type=int, default=8)
    ap.add_argument("--passes", type=int, default=2)
    ap.add_argument("--cap", type=float, default=0.80)
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    entries = json.loads(Path(args.cache).read_text(encoding="utf-8"))["entries"]
    store = get_store()
    graph = get_graph()

    if args.single:
        params = FusionParams(
            anchor_top_n=args.anchor,
            pass2_top_m=args.pass2,
            max_passes=args.passes,
            relation_cap=args.cap,
        )
        result = run_config(entries, graph, store, args.threshold, args.pool, params)
        for row in result["cases"]:
            flag = "OK " if not row["missing"] else "MISS"
            print(f"{flag} {row['query'][:44]:44} [{row['intent']:16}] "
                  f"R@5={row['scores']['recall@5']:.2f} "
                  f"P@1={row['scores']['precision@1']:.2f} "
                  f"exp={row['expanded']:3} miss={row['missing']}")
        print()
        for key in ("precision@1", "recall@1", "recall@3", "recall@5",
                    "recall@10", "precision@5", "f1@5", "mrr", "hit@5",
                    "category_precision@5", "mean_candidate_count",
                    "mean_expanded", "fusion_ms"):
            print(f"{key:24} {result[key]}")
        if args.out:
            Path(args.out).write_text(
                json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            print(f"\nSaved {args.out}")
        return

    grid = list(itertools.product(
        (0.55, 0.50, 0.45, 0.40),   # threshold
        (10, 20, 30),               # pool
        (4, 6, 8),                  # anchor_top_n
        (0.70, 0.80, 0.90),         # relation_cap
    ))
    results = []
    for threshold, pool, anchor, cap in grid:
        params = FusionParams(anchor_top_n=anchor, relation_cap=cap)
        r = run_config(entries, graph, store, threshold, pool, params)
        results.append({k: v for k, v in r.items() if k != "cases"})
        print(f"thr={threshold:.2f} pool={pool:2} anchor={anchor} cap={cap:.2f} "
              f"| R@5={r['recall@5']:.3f} MRR={r['mrr']:.3f} "
              f"P@1={r['precision@1']:.3f} Hit@5={r['hit@5']:.3f} "
              f"CatP={r['category_precision@5']:.3f}")

    results.sort(key=lambda r: (-r["recall@5"], -r["mrr"], -r["precision@1"]))
    print("\nTop 10 by Recall@5:")
    for r in results[:10]:
        print(f"  thr={r['threshold']:.2f} pool={r['pool']:2} "
              f"anchor={r['params']['anchor_top_n']} "
              f"cap={r['params']['relation_cap']:.2f} "
              f"| R@5={r['recall@5']:.3f} MRR={r['mrr']:.3f} "
              f"P@1={r['precision@1']:.3f} Hit@5={r['hit@5']:.3f} "
              f"CatP={r['category_precision@5']:.3f}")
    out = args.out or str(ROOT / "reports" / "relation_aware_grid.json")
    Path(out).write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nSaved {out}")


if __name__ == "__main__":
    main()
