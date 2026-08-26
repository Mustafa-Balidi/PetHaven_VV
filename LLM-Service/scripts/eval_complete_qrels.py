#!/usr/bin/env python3
"""Evaluate the current production system against the expanded context qrels.

Runtime is frozen -- this script only measures. It calls the production
`retrieve()` unchanged, with the production settings, and scores the returned
list against `eval/eval_complete_qrels.jsonl`.

Metric definitions (section 9), all standard:

    ContextPrecision@K  |relevant ∩ top-K| / K
    ContextRecall@K     |relevant ∩ top-K| / |relevant|
    ContextF1@K         harmonic mean of the two
    AnswerRecall@K      |grade-2 ∩ top-K| / |grade-2|
    AnswerHit@5         1 if any grade-2 entity is in the top 5
    MRR                 1 / rank of the first grade-2 entity
    nDCG@5              gain 2^grade - 1, log2(1+i) discount, ideal ordering
    CategoryPrecision@5 unchanged from the original harness

Relevance is by entity **id**, not by name substring, so a near-miss sibling
cannot be scored as a hit.

Outputs:
    reports/complete_qrels_evaluation.json
    reports/complete_qrels_evaluation.md

Usage:
    PYTHONPATH=. python scripts/eval_complete_qrels.py
"""
from __future__ import annotations

import json
import math
import statistics
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.config import settings  # noqa: E402
from RAG_System.retrieval.query_intent import detect  # noqa: E402
from RAG_System.retrieval.retriever import retrieve  # noqa: E402

QRELS = ROOT / "eval" / "eval_complete_qrels.jsonl"
ORIGINAL = ROOT / "reports" / "multi_evidence_relation_comparison.json"
OUT_JSON = ROOT / "reports" / "complete_qrels_evaluation.json"
OUT_MD = ROOT / "reports" / "complete_qrels_evaluation.md"

K_VALUES = (1, 3, 5)
CATEGORY_K = 5
TARGET = 0.85


def ndcg(grades: list[int], ideal: list[int], k: int) -> float:
    """Graded nDCG@k. gain = 2^grade - 1, discount = log2(1 + position)."""
    def dcg(values):
        return sum(
            (2 ** g - 1) / math.log2(i + 1)
            for i, g in enumerate(values[:k], start=1)
        )
    best = dcg(sorted(ideal, reverse=True))
    return dcg(grades) / best if best else 0.0


def main() -> None:
    cases = [
        json.loads(line)
        for line in QRELS.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    rows = []
    for case in cases:
        query = case["query"]
        start = time.monotonic()
        hits = retrieve(query, animal=case.get("animal"))
        latency = round(time.monotonic() - start, 3)

        context = {q["entity_id"]: q["grade"] for q in case["context_qrels"]}
        answers = {q["entity_id"] for q in case["answer_qrels"]}
        expected_categories = case.get("expected_categories") or []

        retrieved = [
            {
                "id": h.id,
                "name": (h.metadata or {}).get("name", ""),
                "category": (h.metadata or {}).get("category", ""),
                "grade": context.get(h.id, 0),
                "is_answer": h.id in answers,
            }
            for h in hits
        ]
        ids = [r["id"] for r in retrieved]

        scores = {}
        for k in K_VALUES:
            window = ids[:k]
            relevant_hit = sum(1 for i in window if context.get(i, 0) > 0)
            precision = relevant_hit / k
            recall = relevant_hit / len(context) if context else 0.0
            scores["context_precision@{}".format(k)] = precision
            scores["context_recall@{}".format(k)] = recall
            scores["context_f1@{}".format(k)] = (
                2 * precision * recall / (precision + recall)
                if precision + recall else 0.0
            )
            answer_hit = sum(1 for i in window if i in answers)
            scores["answer_recall@{}".format(k)] = (
                answer_hit / len(answers) if answers else 0.0
            )
            scores["answer_precision@{}".format(k)] = answer_hit / k

        scores["answer_hit@5"] = float(
            any(i in answers for i in ids[:5])
        )
        first = next(
            (i for i, entity_id in enumerate(ids, start=1)
             if entity_id in answers),
            None,
        )
        scores["mrr"] = 1.0 / first if first else 0.0
        scores["ndcg@5"] = ndcg(
            [context.get(i, 0) for i in ids],
            list(context.values()),
            5,
        )
        scores["category_precision@5"] = sum(
            1 for r in retrieved[:CATEGORY_K]
            if r["category"] in expected_categories
        ) / CATEGORY_K

        rows.append({
            "query": query,
            "intent": detect(query).name,
            "n_context_qrels": len(context),
            "n_answer_qrels": len(answers),
            "first_answer_rank": first,
            "retrieved": retrieved,
            "scores": {k: round(v, 4) for k, v in scores.items()},
            "latency": latency,
        })
        print("  {:46} CtxP@5={:.2f} CtxR@5={:.2f} nDCG@5={:.2f} "
              "{:5.2f}s".format(
                  query[:46], scores["context_precision@5"],
                  scores["context_recall@5"], scores["ndcg@5"], latency))

    n = len(rows)

    def mean(key):
        return round(sum(r["scores"][key] for r in rows) / n, 4)

    keys = (
        [k.format(v) for v in K_VALUES for k in (
            "context_precision@{}", "context_recall@{}", "context_f1@{}",
            "answer_recall@{}", "answer_precision@{}")]
        + ["answer_hit@5", "mrr", "ndcg@5", "category_precision@5"]
    )
    summary = {key: mean(key) for key in keys}
    latencies = [r["latency"] for r in rows]
    summary["mean_latency_s"] = round(statistics.mean(latencies), 3)
    summary["median_latency_s"] = round(statistics.median(latencies), 3)
    summary["queries"] = n

    counts = sorted(r["n_context_qrels"] for r in rows)
    stats = {
        "min": counts[0],
        "median": (counts[n // 2] if n % 2
                   else (counts[n // 2 - 1] + counts[n // 2]) / 2),
        "mean": round(sum(counts) / n, 2),
        "max": counts[-1],
    }

    original = json.loads(ORIGINAL.read_text(encoding="utf-8"))["new"]

    gates = {
        "ContextPrecision@5": summary["context_precision@5"],
        "ContextRecall@5": summary["context_recall@5"],
        "ContextF1@5": summary["context_f1@5"],
    }

    # The arithmetic ceiling on ContextRecall@5: 10 hits are returned, and only
    # the first 5 count, so a query with more than 5 relevant entities cannot
    # reach 1.0 no matter what retrieval does.
    ceiling = round(
        sum(min(5, r["n_context_qrels"]) / r["n_context_qrels"] for r in rows)
        / n, 4)
    ceiling_f1 = round(sum(
        (lambda p, rc: 2 * p * rc / (p + rc) if p + rc else 0.0)(
            min(5, r["n_context_qrels"]) / 5,
            min(5, r["n_context_qrels"]) / r["n_context_qrels"])
        for r in rows) / n, 4)

    lines = [
        "# Expanded Gold Ground Truth -- evaluation of the production system",
        "",
        "Runtime unchanged and unmeasured-by-proxy: this calls the production "
        "`retrieve()` directly. Multi-Evidence Relation Ranking on, "
        "relation-aware on, BM25 off, reranker off, precision guard off, "
        "SIMILARITY_THRESHOLD {}, RETRIEVAL_TOP_K {}.".format(
            settings.SIMILARITY_THRESHOLD, settings.RETRIEVAL_TOP_K),
        "",
        "Qrels: `eval/eval_complete_qrels.jsonl`, frozen before this ran. "
        "Original `eval/eval.jsonl` untouched. Relevance is matched by entity "
        "id, not by name substring.",
        "",
        "## Original narrow gold (unchanged, for reference)",
        "",
        "| Metric | Value |",
        "|---|---|",
        "| Precision@1 | {:.4f} |".format(original["precision@1"]),
        "| Precision@5 | {:.4f} |".format(original["precision@5"]),
        "| Recall@5 | {:.4f} |".format(original["recall@5"]),
        "| F1@5 | {:.4f} |".format(original["f1@5"]),
        "| MRR | {:.4f} |".format(original["mrr"]),
        "",
        "## Expanded context gold",
        "",
        "| Metric | @1 | @3 | @5 |",
        "|---|---|---|---|",
        "| ContextPrecision | {:.4f} | {:.4f} | {:.4f} |".format(
            summary["context_precision@1"], summary["context_precision@3"],
            summary["context_precision@5"]),
        "| ContextRecall | {:.4f} | {:.4f} | {:.4f} |".format(
            summary["context_recall@1"], summary["context_recall@3"],
            summary["context_recall@5"]),
        "| ContextF1 | {:.4f} | {:.4f} | {:.4f} |".format(
            summary["context_f1@1"], summary["context_f1@3"],
            summary["context_f1@5"]),
        "| AnswerRecall | {:.4f} | {:.4f} | {:.4f} |".format(
            summary["answer_recall@1"], summary["answer_recall@3"],
            summary["answer_recall@5"]),
        "",
        "| Metric | Value |",
        "|---|---|",
        "| AnswerHit@5 | {:.4f} |".format(summary["answer_hit@5"]),
        "| MRR (grade-2) | {:.4f} |".format(summary["mrr"]),
        "| nDCG@5 (graded) | {:.4f} |".format(summary["ndcg@5"]),
        "| CategoryPrecision@5 | {:.4f} |".format(
            summary["category_precision@5"]),
        "| Latency (mean s) | {:.3f} |".format(summary["mean_latency_s"]),
        "",
        "## Targets",
        "",
        "| Target | Value | Result |",
        "|---|---|---|",
    ]
    for label, value in gates.items():
        lines.append("| {} >= {:.2f} | {:.4f} | {} |".format(
            label, TARGET, value, "PASS" if value >= TARGET else "FAIL"))

    lines += [
        "",
        "## Why ContextRecall@5 and ContextF1@5 cannot reach 0.85",
        "",
        "This is arithmetic, not retrieval quality. The qrels average {} "
        "relevant entities per query (min {}, median {}, max {}), and only "
        "five slots are scored. A query with {} relevant entities caps at "
        "5/{} = {:.2f} recall however perfect the ranking is.".format(
            stats["mean"], stats["min"], stats["median"], stats["max"],
            stats["max"], stats["max"], 5 / stats["max"]),
        "",
        "| Bound | Value |",
        "|---|---|",
        "| ContextRecall@5 with perfect ranking | {:.4f} |".format(ceiling),
        "| ContextF1@5 with perfect ranking | {:.4f} |".format(ceiling_f1),
        "| ContextRecall@5 measured | {:.4f} |".format(
            summary["context_recall@5"]),
        "| fraction of the achievable recall attained | {:.4f} |".format(
            summary["context_recall@5"] / ceiling if ceiling else 0.0),
        "",
        "ContextPrecision@5 has no such ceiling -- it is a fair target and is "
        "reported against 0.85 as specified. The honest reading of "
        "ContextRecall@5 is the last row: how much of the reachable recall the "
        "system actually captured.",
        "",
        "## Per-query",
        "",
        "| Query | Intent | Context qrels | CtxP@5 | CtxR@5 | CtxF1@5 | "
        "nDCG@5 | Answer rank |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for r in rows:
        s = r["scores"]
        lines.append("| {} | {} | {} | {:.2f} | {:.2f} | {:.2f} | {:.2f} | {} |"
                     .format(r["query"][:38], r["intent"], r["n_context_qrels"],
                             s["context_precision@5"], s["context_recall@5"],
                             s["context_f1@5"], s["ndcg@5"],
                             r["first_answer_rank"] or "-"))

    lines += [
        "",
        "## Final table (section 12)",
        "",
        "| Metric | Result |",
        "|---|---|",
        "| Original Precision@5 | {:.4f} |".format(original["precision@5"]),
        "| Original Recall@5 | {:.4f} |".format(original["recall@5"]),
        "| Original F1@5 | {:.4f} |".format(original["f1@5"]),
        "| Context Precision@5 | {:.4f} |".format(
            summary["context_precision@5"]),
        "| Context Recall@5 | {:.4f} |".format(summary["context_recall@5"]),
        "| Context F1@5 | {:.4f} |".format(summary["context_f1@5"]),
        "| Answer Recall@5 | {:.4f} |".format(summary["answer_recall@5"]),
        "| Answer Hit@5 | {:.4f} |".format(summary["answer_hit@5"]),
        "| MRR | {:.4f} |".format(summary["mrr"]),
        "| nDCG@5 | {:.4f} |".format(summary["ndcg@5"]),
        "| Category Precision@5 | {:.4f} |".format(
            summary["category_precision@5"]),
        "",
        "- Context Precision target >= 0.85 : **{}**".format(
            "PASS" if gates["ContextPrecision@5"] >= TARGET else "FAIL"),
        "- Context Recall target >= 0.85    : **{}**".format(
            "PASS" if gates["ContextRecall@5"] >= TARGET else "FAIL"),
        "- Context F1 target >= 0.85        : **{}**".format(
            "PASS" if gates["ContextF1@5"] >= TARGET else "FAIL"),
        "",
    ]

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    OUT_JSON.write_text(json.dumps({
        "original_narrow_gold": {
            k: original[k] for k in
            ("precision@1", "precision@5", "recall@5", "f1@5", "mrr")
        },
        "expanded_context_gold": summary,
        "targets": {
            label: {"target": TARGET, "value": value,
                    "passed": value >= TARGET}
            for label, value in gates.items()
        },
        "context_qrels_per_query": stats,
        "recall_ceiling@5": ceiling,
        "f1_ceiling@5": ceiling_f1,
        "fraction_of_achievable_recall": round(
            summary["context_recall@5"] / ceiling if ceiling else 0.0, 4),
        "per_query": rows,
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    print()
    print("\n".join(lines[lines.index("## Final table (section 12)"):]))
    print("Saved {}\nSaved {}".format(OUT_JSON, OUT_MD))


if __name__ == "__main__":
    main()
