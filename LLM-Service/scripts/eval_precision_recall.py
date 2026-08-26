#!/usr/bin/env python3
"""Precision@K / Recall@K / F1@K for the production retrieval pipeline.

Calls RAG_System.retrieval.retriever.retrieve() and nothing else. The generator,
the context expander and the prompt builder are never touched, and no LLM scores
anything: relevance is decided by normalized name matching, so the numbers are
reproducible from the saved report.

Relevance
---------
A hit is relevant when its metadata `name` matches any expected_keyword, compared
lowercased and whitespace-collapsed, as a substring in either direction:

    expected "Gastric Dilatation-Volvulus"
    retrieved "Gastric Dilatation-Volvulus (Gdv / Bloat)"   -> relevant

Metrics (K = 1, 3, 5, 10)
-------------------------
Precision@K          relevant hits in top K / K
Recall@K             distinct expected keywords found in top K / expected keywords
F1@K                 2PR / (P + R)
MRR                  1 / rank of the first relevant hit, 0 if none
CategoryPrecision@5  top-5 hits whose category is in expected_categories / 5

Usage:
    PYTHONPATH=. python scripts/eval_precision_recall.py
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.retrieval.retriever import retrieve

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "eval" / "eval.jsonl"
OUT_FILE = ROOT / "reports" / "retrieval_precision_recall.json"

K_VALUES = (1, 3, 5, 10)
CATEGORY_K = 5


def _norm(text: str) -> str:
    return " ".join(str(text).lower().split())


def _matches(keyword: str, name: str) -> bool:
    """Substring match in either direction, normalized."""
    keyword_n, name_n = _norm(keyword), _norm(name)
    if not keyword_n or not name_n:
        return False
    return keyword_n in name_n or name_n in keyword_n


def _f1(precision: float, recall: float) -> float:
    if precision + recall == 0:
        return 0.0
    return 2 * precision * recall / (precision + recall)


def _score(keywords: list[str], names: list[str]) -> dict:
    """Precision / Recall / F1 at every K, plus the first relevant rank."""
    scores: dict[str, float] = {}
    for k in K_VALUES:
        window = names[:k]
        relevant_hits = sum(
            1 for name in window if any(_matches(kw, name) for kw in keywords)
        )
        found = {kw for kw in keywords if any(_matches(kw, name) for name in window)}
        precision = relevant_hits / k
        recall = len(found) / len(keywords) if keywords else 0.0
        scores[f"precision@{k}"] = precision
        scores[f"recall@{k}"] = recall
        scores[f"f1@{k}"] = _f1(precision, recall)

    first_rank = next(
        (
            index
            for index, name in enumerate(names, start=1)
            if any(_matches(kw, name) for kw in keywords)
        ),
        None,
    )
    scores["mrr"] = 1.0 / first_rank if first_rank else 0.0
    scores["first_relevant_rank"] = float(first_rank or 0)
    return scores


def _load(path: Path) -> list[dict]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--dataset", default=str(DATASET))
    parser.add_argument("--out", default=str(OUT_FILE))
    args = parser.parse_args()

    dataset_path = Path(args.dataset)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    cases = _load(dataset_path)
    rows: list[dict] = []

    for case in cases:
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
        relevant_found = [
            kw for kw in keywords if any(_matches(kw, name) for name in names)
        ]

        window = retrieved[:CATEGORY_K]
        category_precision = (
            sum(1 for item in window if item["category"] in expected_categories)
            / CATEGORY_K
        )

        rows.append({
            "query": case["query"],
            "animal": case.get("animal"),
            "expected_keywords": keywords,
            "expected_categories": expected_categories,
            "retrieved": retrieved,
            "relevant_found": relevant_found,
            "precision": round(scores["precision@5"], 4),
            "recall": round(scores["recall@5"], 4),
            "f1": round(scores["f1@5"], 4),
            "mrr": round(scores["mrr"], 4),
            "first_relevant_rank": int(scores["first_relevant_rank"]),
            f"category_precision@{CATEGORY_K}": round(category_precision, 4),
            "hit_count": len(hits),
            "latency": latency,
            "scores": {key: round(value, 4) for key, value in scores.items()},
        })

        print(f"{case['query'][:50]:50} | hits={len(hits):2} "
              f"P@5={scores['precision@5']:.2f} R@5={scores['recall@5']:.2f} "
              f"rank={int(scores['first_relevant_rank']) or '-':>3} | {latency:>5.2f}s")

    total = len(rows)

    def mean(key: str) -> float:
        return sum(r["scores"][key] for r in rows) / total if total else 0.0

    summary = {
        **{
            f"{name}@{k}": round(mean(f"{name}@{k}"), 4)
            for k in K_VALUES
            for name in ("precision", "recall", "f1")
        },
        "mrr": round(mean("mrr"), 4),
        f"category_precision@{CATEGORY_K}": round(
            sum(r[f"category_precision@{CATEGORY_K}"] for r in rows) / total, 4
        ) if total else 0.0,
        "average_latency": round(
            sum(r["latency"] for r in rows) / total, 3
        ) if total else 0.0,
        "cases": total,
    }

    print()
    print("=" * 40)
    print("Pet Haven Retrieval Evaluation")
    print("=" * 40)
    print()
    print("Cases:")
    print(total)
    print()
    print("Retrieval metrics:")
    print()
    print(f"{'':4}{'P':>8}{'R':>8}{'F1':>8}")
    for k in K_VALUES:
        print(f"@{k:<3}"
              f"{summary[f'precision@{k}']:>8.2f}"
              f"{summary[f'recall@{k}']:>8.2f}"
              f"{summary[f'f1@{k}']:>8.2f}")
    print()
    print("MRR:")
    print(f"{summary['mrr']:.2f}")
    print()
    print(f"Category Precision@{CATEGORY_K}:")
    print(f"{100 * summary[f'category_precision@{CATEGORY_K}']:.0f}%")
    print()
    print("Average latency:")
    print(f"{summary['average_latency']:.2f} seconds")
    print()

    out_path.write_text(
        json.dumps({"summary": summary, "cases": rows}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"Saved {out_path}")


if __name__ == "__main__":
    main()
