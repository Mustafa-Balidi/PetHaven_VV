#!/usr/bin/env python3
"""Render reports/RERANKER_REPORT.md from the comparison JSON.

The report is generated, never hand-written, so every number in it is the
number that compare_reranker.py actually measured.

Usage:
    PYTHONPATH=. python scripts/report_reranker.py
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
IN_FILE = ROOT / "reports" / "retrieval_reranker_comparison.json"
OUT_FILE = ROOT / "reports" / "RERANKER_REPORT.md"

# The entities the error analysis was asked to follow.
WATCHED = (
    "Canine Distemper",
    "Leptospirosis",
    "Acute Gastritis",
    "Chronic Kidney Disease",
    "Canine Parvovirus",
    "Feline Diabetes Mellitus",
)

METRIC_ROWS = (
    ("Hit@5", "hit@5"),
    ("Precision@1", "precision@1"),
    ("Precision@5", "precision@5"),
    ("Recall@5", "recall@5"),
    ("Recall@10", "recall@10"),
    ("F1@5", "f1@5"),
    ("MRR", "mrr"),
    ("CategoryPrecision@5", "category_precision@5"),
    ("Mean hits returned", "mean_hits_returned"),
)


def _fmt(value: float) -> str:
    return f"{value:.4f}"


def _delta(before: float, after: float) -> str:
    change = after - before
    sign = "+" if change > 0 else ""
    return f"{sign}{change:.4f}"


def _rank_text(rank) -> str:
    return f"rank {rank}" if rank else "missing"


def _watched_rows(per_query: dict) -> list[tuple[str, str, str, str, str]]:
    """(entity, query, baseline rank, reranker rank, verdict) for WATCHED."""
    rows = []

    for query, data in per_query.items():
        for keyword in data["expected_keywords"]:
            if not any(watch.lower() in keyword.lower() for watch in WATCHED):
                continue

            before = data["baseline"]["keyword_ranks"].get(keyword)
            after = data["reranker"]["keyword_ranks"].get(keyword)

            if before is None and after is not None:
                verdict = "RETRIEVED (was missing)"
            elif before is not None and after is None:
                verdict = "LOST"
            elif before is None and after is None:
                verdict = "still missing"
            elif after < before:
                verdict = f"promoted {before} -> {after}"
            elif after > before:
                verdict = f"demoted {before} -> {after}"
            else:
                verdict = "unchanged"

            rows.append(
                (keyword, query, _rank_text(before), _rank_text(after), verdict)
            )

    return rows


def _query_movements(per_query: dict) -> tuple[list, list, list]:
    """(improved, regressed, still failing) by recall@5."""
    improved, regressed, failing = [], [], []

    for query, data in per_query.items():
        before = data["baseline"]["recall@5"]
        after = data["reranker"]["recall@5"]

        if after > before:
            improved.append((query, before, after, data))
        elif after < before:
            regressed.append((query, before, after, data))

        if after < 1.0:
            missing = [
                keyword
                for keyword, rank in data["reranker"]["keyword_ranks"].items()
                if rank is None or rank > 5
            ]
            failing.append((query, after, missing))

    return improved, regressed, failing


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--input", default=str(IN_FILE))
    parser.add_argument("--out", default=str(OUT_FILE))
    args = parser.parse_args()

    payload = json.loads(Path(args.input).read_text(encoding="utf-8"))

    baseline = payload["full_summary"]["baseline"]
    reranked = payload["full_summary"]["reranker"]
    config = payload["config"]
    latency = payload["latency"]
    per_query = payload["per_query"]

    improved, regressed, failing = _query_movements(per_query)
    watched = _watched_rows(per_query)

    recall_change = payload["improvement"]["recall_change"]
    precision_change = payload["improvement"]["precision_change"]
    mrr_change = payload["improvement"]["mrr_change"]

    # Decision criteria, evaluated rather than asserted.
    recall_improved = recall_change > 0
    precision_held = precision_change >= -0.02
    latency_ok = latency["rerank_step_only"]["mean_ms"] < 1000
    keep = recall_improved and precision_held and latency_ok

    lines: list[str] = []
    add = lines.append

    add("# Retrieval Improvement Report")
    add("")
    add(f"Dataset: `{config['dataset']}` — {config['cases']} queries.  ")
    add(
        f"Baseline arm: `RETRIEVAL_TOP_K={config['baseline']['retrieval_top_k']}`, "
        f"reranker off — the pre-change pipeline.  "
    )
    add(
        f"Reranker arm: `RETRIEVAL_TOP_K={config['reranker']['retrieval_top_k']}`, "
        f"`RERANK_TOP_N={config['reranker']['rerank_top_n']}`, "
        f"`{config['reranker']['reranker_model']}`.  "
    )
    add(
        f"Reranker model actually loaded: "
        f"**{config['reranker']['reranker_loaded']}**"
    )
    add("")
    add("Both arms call the production `retrieve()`. HyDE, the similarity")
    add("threshold with its fallback, and animal/category filtering are")
    add("unchanged and active in both.")
    add("")

    add("## Before")
    add("")
    add("| Metric | Value |")
    add("| --- | ---: |")
    for label, key in METRIC_ROWS:
        add(f"| {label} | {_fmt(baseline[key])} |")
    add("")

    add("## After")
    add("")
    add("| Metric | Value |")
    add("| --- | ---: |")
    for label, key in METRIC_ROWS:
        add(f"| {label} | {_fmt(reranked[key])} |")
    add("")

    add("## Side by side")
    add("")
    add("| Metric | Before | After | Change |")
    add("| --- | ---: | ---: | ---: |")
    for label, key in METRIC_ROWS:
        add(
            f"| {label} | {_fmt(baseline[key])} | {_fmt(reranked[key])} "
            f"| {_delta(baseline[key], reranked[key])} |"
        )
    add("")

    add("## Fixed Queries")
    add("")
    if improved:
        add("| Query | Recall@5 before | after | What moved |")
        add("| --- | ---: | ---: | --- |")
        for query, before, after, data in improved:
            moved = ", ".join(
                f"{keyword} {_rank_text(data['baseline']['keyword_ranks'][keyword])}"
                f" -> {_rank_text(rank)}"
                for keyword, rank in data["reranker"]["keyword_ranks"].items()
                if rank != data["baseline"]["keyword_ranks"][keyword]
            )
            add(f"| {query} | {before:.2f} | {after:.2f} | {moved or '—'} |")
    else:
        add("No query improved its Recall@5.")
    add("")

    add("## Regressions")
    add("")
    if regressed:
        add("| Query | Recall@5 before | after | What was lost |")
        add("| --- | ---: | ---: | --- |")
        for query, before, after, data in regressed:
            lost = ", ".join(
                f"{keyword} {_rank_text(data['baseline']['keyword_ranks'][keyword])}"
                f" -> {_rank_text(rank)}"
                for keyword, rank in data["reranker"]["keyword_ranks"].items()
                if rank != data["baseline"]["keyword_ranks"][keyword]
            )
            add(f"| {query} | {before:.2f} | {after:.2f} | {lost or '—'} |")
    else:
        add("None — no query lost Recall@5.")
    add("")

    add("## Error Analysis — watched entities")
    add("")
    add("The entities the previous evaluation kept missing:")
    add("")
    if watched:
        add("| Entity | Query | Before | After | Verdict |")
        add("| --- | --- | --- | --- | --- |")
        for entity, query, before, after, verdict in watched:
            add(f"| {entity} | {query} | {before} | {after} | {verdict} |")
    else:
        add("None of the watched entities appear in this dataset.")
    add("")

    add("## Remaining Failures")
    add("")
    add("Queries that still do not reach Recall@5 = 1.0:")
    add("")
    if failing:
        add("| Query | Recall@5 | Expected entity not in top 5 |")
        add("| --- | ---: | --- |")
        for query, recall, missing in failing:
            add(f"| {query} | {recall:.2f} | {', '.join(missing) or '—'} |")
    else:
        add("None — every query reaches full Recall@5.")
    add("")

    add("## Latency")
    add("")
    add("| Measurement | Before | After |")
    add("| --- | ---: | ---: |")
    add(
        f"| `retrieve()` mean | {latency['baseline_retrieve_mean_s']:.3f} s "
        f"| {latency['reranker_retrieve_mean_s']:.3f} s |"
    )
    add(
        f"| `retrieve()` median | {latency['baseline_retrieve_median_s']:.3f} s "
        f"| {latency['reranker_retrieve_median_s']:.3f} s |"
    )
    add("")
    step = latency["rerank_step_only"]
    add(
        f"The rerank step measured on its own: **{step['mean_ms']} ms** "
        f"for {step['pool_size']} candidates "
        f"(min {step['min_ms']} ms, max {step['max_ms']} ms), CPU, after the "
        f"one-off model load."
    )
    add("")
    add("`retrieve()` end-to-end latency is dominated by the HyDE LLM")
    add("round-trip, so the arm-to-arm difference there is mostly network")
    add("noise; the isolated step above is the honest cost of the reranker.")
    add("")

    add("## Decision")
    add("")
    add(f"- Recall@5 improves: **{recall_improved}** ({_delta(0, recall_change)})")
    add(
        f"- Precision@5 does not collapse: **{precision_held}** "
        f"({_delta(0, precision_change)})"
    )
    add(f"- MRR change: {_delta(0, mrr_change)}")
    add(f"- Latency acceptable: **{latency_ok}** ({step['mean_ms']} ms per query)")
    add("")
    add(f"**Keep the reranker: {'YES' if keep else 'NO'}**")
    add("")
    add("Rollback is a config change, not a revert:")
    add("`RERANKER_ENABLED=false` restores pure vector ordering, and")
    add("`RETRIEVAL_TOP_K=5` restores the original candidate pool.")
    add("")

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Saved {out_path}")
    print(f"Keep reranker: {'YES' if keep else 'NO'}")


if __name__ == "__main__":
    main()
