#!/usr/bin/env python3
"""Baseline vs reranker comparison on the retrieval eval set.

Both arms call the production `retrieve()`. Nothing is reimplemented: the arms
differ only in configuration, so anything the comparison shows is something the
service will actually do.

    baseline   RETRIEVAL_TOP_K = 5,  reranker OFF   (the pre-change pipeline)
    reranker   RETRIEVAL_TOP_K = 30, reranker ON    (the new pipeline)

Metrics are computed by scripts/eval_precision_recall.py's own scorer, so the
numbers are directly comparable with reports/retrieval_precision_recall.json.

Outputs:
    reports/retrieval_reranker_comparison.json   the required comparison shape,
                                                 plus per-query detail used by
                                                 the error analysis.

Usage:
    PYTHONPATH=. python scripts/compare_reranker.py
    PYTHONPATH=. python scripts/compare_reranker.py --dataset eval/eval.jsonl
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.config import settings  # noqa: E402
from RAG_System.retrieval import reranker as reranker_module  # noqa: E402
from RAG_System.retrieval.retriever import retrieve  # noqa: E402
from scripts.eval_precision_recall import _load, _matches, _score  # noqa: E402

DATASET = ROOT / "eval" / "eval.jsonl"
OUT_FILE = ROOT / "reports" / "retrieval_reranker_comparison.json"

CATEGORY_K = 5

# The pre-change production configuration, reproduced exactly: TOP_K=5 per
# sub-query, no reranking, no final trim beyond what dedup produced.
BASELINE_POOL = 5

ARMS = ("baseline", "reranker")


def _configure(arm: str) -> None:
    """Switch the production settings between the two arms."""
    if arm == "baseline":
        settings.RETRIEVAL_TOP_K = BASELINE_POOL
        settings.RERANK_TOP_N = 2 * BASELINE_POOL   # dedup ceiling, i.e. no trim
        settings.RERANKER_ENABLED = False
    else:
        settings.RETRIEVAL_TOP_K = 30
        settings.RERANK_TOP_N = 10
        settings.RERANKER_ENABLED = True


def _run_case(case: dict) -> dict:
    keywords = case["expected_keywords"]
    expected_categories = case.get("expected_categories") or []

    start = time.monotonic()
    hits = retrieve(case["query"], animal=case.get("animal"))
    latency = round(time.monotonic() - start, 3)

    retrieved = [
        {
            "name": (hit.metadata or {}).get("name", ""),
            "category": (hit.metadata or {}).get("category", ""),
            "distance": round(hit.distance, 4),
        }
        for hit in hits
    ]
    names = [item["name"] for item in retrieved]
    scores = _score(keywords, names)

    window = retrieved[:CATEGORY_K]
    category_precision = (
        sum(1 for item in window if item["category"] in expected_categories)
        / CATEGORY_K
    )

    # Rank of every expected keyword, so the error analysis can say
    # "retrieved but at rank 7" instead of only "found / not found".
    keyword_ranks = {}
    for keyword in keywords:
        rank = next(
            (
                index
                for index, name in enumerate(names, start=1)
                if _matches(keyword, name)
            ),
            None,
        )
        keyword_ranks[keyword] = rank

    return {
        "query": case["query"],
        "animal": case.get("animal"),
        "expected_keywords": keywords,
        "retrieved": retrieved,
        "keyword_ranks": keyword_ranks,
        "hit_count": len(hits),
        "latency": latency,
        f"category_precision@{CATEGORY_K}": round(category_precision, 4),
        "scores": {key: round(value, 4) for key, value in scores.items()},
    }


def _summarize(rows: list[dict]) -> dict:
    total = len(rows) or 1

    def mean(key: str) -> float:
        return sum(row["scores"][key] for row in rows) / total

    summary = {
        f"{name}@{k}": round(mean(f"{name}@{k}"), 4)
        for k in (1, 3, 5, 10)
        for name in ("precision", "recall", "f1")
    }
    summary["mrr"] = round(mean("mrr"), 4)
    # Hit@K: at least one relevant entity inside the top K.
    for k in (1, 3, 5, 10):
        summary[f"hit@{k}"] = round(
            sum(1 for row in rows if row["scores"][f"recall@{k}"] > 0) / total, 4
        )
    summary[f"category_precision@{CATEGORY_K}"] = round(
        sum(row[f"category_precision@{CATEGORY_K}"] for row in rows) / total, 4
    )
    summary["average_latency"] = round(
        sum(row["latency"] for row in rows) / total, 3
    )
    summary["median_latency"] = round(
        sorted(row["latency"] for row in rows)[len(rows) // 2], 3
    ) if rows else 0.0
    summary["mean_hits_returned"] = round(
        sum(row["hit_count"] for row in rows) / total, 2
    )
    summary["cases"] = len(rows)
    return summary


def _measure_rerank_overhead(cases: list[dict], pool: int = 30) -> dict:
    """Cost of the rerank step alone, isolated from HyDE and the network.

    `retrieve()` latency is dominated by the HyDE LLM round-trip (~6s), which
    would drown a CPU step measured in tens of milliseconds. This scores a
    realistic pool built from the eval set itself and reports the step in
    isolation, which is the number that decides whether the reranker is
    affordable.
    """
    from RAG_System.indexing.vector_store import SearchHit

    documents = [
        f"Category: Disease\nName: {case['expected_keywords'][0]}\n"
        f"Description: {case['query']}"
        for case in cases
    ]
    candidates = [
        SearchHit(
            id=f"X{index}",
            text=documents[index % len(documents)],
            metadata={"name": f"E{index}", "category": "diseases"},
            distance=0.1 + index / 100,
        )
        for index in range(pool)
    ]

    question = cases[0]["query"] if cases else "my dog is tired and weak"

    reranker_module.rerank(question, candidates)          # warm up

    timings = []
    for _ in range(5):
        start = time.monotonic()
        reranker_module.rerank(question, candidates, top_n=10)
        timings.append(time.monotonic() - start)

    return {
        "pool_size": pool,
        "mean_ms": round(1000 * sum(timings) / len(timings), 1),
        "min_ms": round(1000 * min(timings), 1),
        "max_ms": round(1000 * max(timings), 1),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--dataset", default=str(DATASET))
    parser.add_argument("--out", default=str(OUT_FILE))
    args = parser.parse_args()

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    cases = _load(Path(args.dataset))

    # Load the CrossEncoder before timing anything, so the one-off model load
    # is not charged to the first reranked query's latency.
    _configure("reranker")
    available = reranker_module.is_available()
    print(f"Reranker available: {available} ({settings.RERANKER_MODEL})")
    if not available:
        print("WARNING: reranker arm will fall back to vector ordering.")

    overhead = _measure_rerank_overhead(cases)
    print(
        f"Rerank step alone: {overhead['mean_ms']} ms "
        f"for {overhead['pool_size']} candidates"
    )

    results: dict[str, list[dict]] = {}

    for arm in ARMS:
        _configure(arm)
        print(f"\n{'=' * 60}\n{arm.upper()}  "
              f"pool={settings.RETRIEVAL_TOP_K} "
              f"return={settings.RERANK_TOP_N} "
              f"rerank={settings.RERANKER_ENABLED}\n{'=' * 60}")

        rows = []
        for case in cases:
            row = _run_case(case)
            rows.append(row)
            print(
                f"{case['query'][:46]:46} | hits={row['hit_count']:2} "
                f"P@5={row['scores']['precision@5']:.2f} "
                f"R@5={row['scores']['recall@5']:.2f} "
                f"rank={int(row['scores']['first_relevant_rank']) or '-':>3} "
                f"| {row['latency']:>5.2f}s"
            )
        results[arm] = rows

    baseline = _summarize(results["baseline"])
    reranked = _summarize(results["reranker"])

    def delta(key: str) -> float:
        return round(reranked[key] - baseline[key], 4)

    payload = {
        "baseline": {
            "precision@5": baseline["precision@5"],
            "recall@5": baseline["recall@5"],
            "mrr": baseline["mrr"],
        },
        "reranker": {
            "precision@5": reranked["precision@5"],
            "recall@5": reranked["recall@5"],
            "mrr": reranked["mrr"],
        },
        "improvement": {
            "recall_change": delta("recall@5"),
            "precision_change": delta("precision@5"),
            "mrr_change": delta("mrr"),
        },
        "config": {
            "baseline": {
                "retrieval_top_k": BASELINE_POOL,
                "reranker_enabled": False,
            },
            "reranker": {
                "retrieval_top_k": 30,
                "rerank_top_n": 10,
                "reranker_enabled": True,
                "reranker_model": settings.RERANKER_MODEL,
                "reranker_loaded": available,
            },
            "dataset": str(Path(args.dataset)),
            "cases": len(cases),
        },
        "latency": {
            "baseline_retrieve_mean_s": baseline["average_latency"],
            "reranker_retrieve_mean_s": reranked["average_latency"],
            "baseline_retrieve_median_s": baseline["median_latency"],
            "reranker_retrieve_median_s": reranked["median_latency"],
            "retrieve_change_s": round(
                reranked["average_latency"] - baseline["average_latency"], 3
            ),
            "rerank_step_only": overhead,
        },
        "full_summary": {"baseline": baseline, "reranker": reranked},
        "per_query": {
            row_b["query"]: {
                "expected_keywords": row_b["expected_keywords"],
                "baseline": {
                    "keyword_ranks": row_b["keyword_ranks"],
                    "recall@5": row_b["scores"]["recall@5"],
                    "precision@5": row_b["scores"]["precision@5"],
                    "mrr": row_b["scores"]["mrr"],
                    "latency": row_b["latency"],
                    "retrieved": [item["name"] for item in row_b["retrieved"]],
                },
                "reranker": {
                    "keyword_ranks": row_r["keyword_ranks"],
                    "recall@5": row_r["scores"]["recall@5"],
                    "precision@5": row_r["scores"]["precision@5"],
                    "mrr": row_r["scores"]["mrr"],
                    "latency": row_r["latency"],
                    "retrieved": [item["name"] for item in row_r["retrieved"]],
                },
            }
            for row_b, row_r in zip(results["baseline"], results["reranker"])
        },
    }

    out_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    print()
    print("=" * 52)
    print(f"{'metric':<24}{'baseline':>12}{'reranker':>12}")
    print("=" * 52)
    for key in (
        "hit@5", "precision@1", "precision@5", "recall@5", "recall@10",
        "f1@5", "mrr", "category_precision@5",
        "mean_hits_returned", "average_latency",
    ):
        print(f"{key:<24}{baseline[key]:>12.4f}{reranked[key]:>12.4f}")
    print("=" * 52)
    print(f"\nSaved {out_path}")


if __name__ == "__main__":
    main()
