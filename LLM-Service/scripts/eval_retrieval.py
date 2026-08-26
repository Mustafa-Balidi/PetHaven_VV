#!/usr/bin/env python3
"""Retrieval evaluation: Hit@K, MRR, category accuracy, fallback usage.

Measures the PRODUCTION configuration exactly as shipped — original query
+ HyDE + dedup + threshold. Nothing in RAG_System is modified or bypassed.

Ground truth: eval/eval.jsonl carries no entity IDs, so an expected
`keyword` counts as retrieved when it appears in a hit's metadata `name`
(normalized substring, either direction — the file stores short forms such
as "Gastric Dilatation-Volvulus" for the entity
"Gastric Dilatation-Volvulus (Gdv / Bloat)").

Usage:
    PYTHONPATH=. python scripts/eval_retrieval.py --out retrieval_eval.json
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.config import settings
from RAG_System.retrieval.retriever import _MAX_DISTANCE, retrieve

EVAL_FILE = Path(__file__).resolve().parent.parent / "eval" / "eval.jsonl"


def _norm(text: str) -> str:
    return " ".join(text.lower().split())


def _matches(keyword: str, name: str) -> bool:
    keyword_n, name_n = _norm(keyword), _norm(name)
    if not keyword_n or not name_n:
        return False
    return keyword_n in name_n or name_n in keyword_n


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="retrieval_eval.json")
    args = parser.parse_args()

    cases = [
        json.loads(line)
        for line in EVAL_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    rows: list[dict] = []

    for case in cases:
        start = time.monotonic()
        hits = retrieve(case["query"], animal=case.get("animal"))
        latency = round(time.monotonic() - start, 2)

        names = [(hit.metadata or {}).get("name", "") for hit in hits]
        categories = [(hit.metadata or {}).get("category", "") for hit in hits]

        # rank (1-based) of the first hit matching ANY expected keyword
        first_rank = None
        for index, name in enumerate(names, start=1):
            if any(_matches(kw, name) for kw in case["expected_keywords"]):
                first_rank = index
                break

        # per-keyword best rank, for keyword-level Hit@K
        keyword_ranks: dict[str, int | None] = {}
        for keyword in case["expected_keywords"]:
            rank = None
            for index, name in enumerate(names, start=1):
                if _matches(keyword, name):
                    rank = index
                    break
            keyword_ranks[keyword] = rank

        primary_count = sum(1 for hit in hits if hit.distance <= _MAX_DISTANCE)
        fallback_used = any(hit.distance > _MAX_DISTANCE for hit in hits)

        rows.append({
            "query":              case["query"],
            "animal":             case.get("animal"),
            "expected_keywords":  case["expected_keywords"],
            "expected_categories": case["expected_categories"],
            "hit_count":          len(hits),
            "primary_count":      primary_count,
            "fallback_used":      fallback_used,
            "latency":            latency,
            "names":              names,
            "categories":         categories,
            "distances":          [round(hit.distance, 4) for hit in hits],
            "first_rank":         first_rank,
            "keyword_ranks":      keyword_ranks,
            "top1_category_ok":   bool(categories) and categories[0] in case["expected_categories"],
        })

        print(f"{case['query'][:52]:52} | hits={len(hits):2} prim={primary_count:2} "
              f"fb={str(fallback_used):5} | rank={first_rank} | {latency:>5}s")

    total = len(rows)

    def hit_at(k: int) -> float:
        return 100 * sum(
            1 for r in rows if r["first_rank"] and r["first_rank"] <= k
        ) / total

    keyword_total = sum(len(r["expected_keywords"]) for r in rows)

    def keyword_hit_at(k: int) -> float:
        found = sum(
            1
            for r in rows
            for rank in r["keyword_ranks"].values()
            if rank and rank <= k
        )
        return 100 * found / keyword_total

    mrr = sum(1 / r["first_rank"] for r in rows if r["first_rank"]) / total
    category_accuracy = 100 * sum(1 for r in rows if r["top1_category_ok"]) / total
    fallback_rate = 100 * sum(1 for r in rows if r["fallback_used"]) / total
    empty = sum(1 for r in rows if r["hit_count"] == 0)

    print("\n" + "=" * 64)
    print(f"cases                : {total}")
    print(f"TOP_K                : {settings.TOP_K}   "
          f"primary max distance : {_MAX_DISTANCE:.4f}")
    print(f"Hit@1 / @3 / @5      : {hit_at(1):.1f}% / {hit_at(3):.1f}% / {hit_at(5):.1f}%")
    print(f"Hit@10 (any keyword) : {hit_at(10):.1f}%")
    print(f"keyword-level @1/@3/@5/@10 : {keyword_hit_at(1):.1f}% / "
          f"{keyword_hit_at(3):.1f}% / {keyword_hit_at(5):.1f}% / {keyword_hit_at(10):.1f}%")
    print(f"MRR                  : {mrr:.3f}")
    print(f"Category Accuracy@1  : {category_accuracy:.1f}%")
    print(f"Fallback usage       : {fallback_rate:.1f}%")
    print(f"Empty retrievals     : {empty}")
    print("=" * 64)

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
