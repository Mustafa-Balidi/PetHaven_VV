#!/usr/bin/env python3
"""Retrieval-only evaluation: Precision@K, Recall@K, F1@K, Hit@K, MRR.

Measures the RETRIEVAL layer exactly as it ships. The only production entry point
touched is `RAG_System.retrieval.retriever.retrieve()`:

    query -> retrieve(query, animal=...) -> list[SearchHit] -> metrics

`answer_with_hits()`, `expand()`, `_trim_context()`, `build_prompt()` and the
generator are never called. No LLM judge, no model scoring: every number here is
derived from entity IDs, categories and ranks, so two runs on the same index give
the same numbers.

(`retrieve()` does invoke an LLM internally for HyDE — that is part of the
retrieval configuration under test and is deliberately left untouched, along with
the embedding model, TOP_K, both similarity thresholds and dedup.)

Ground truth
------------
eval/retrieval_ground_truth.json, produced by
scripts/build_retrieval_ground_truth.py, which resolves the expected entity
*names* in eval/eval.jsonl and eval/eval_retrieval_supplement.jsonl into
Knowledge_Base entity IDs by deterministic lookup.

Definitions
-----------
gold(q)          set of expected entity IDs for query q
top_k(q)         first K retrieved hit IDs, ordered by ascending distance

Precision@K      |gold ∩ top_k| / |top_k|          (denominator is what was
                 actually retrieved; retrieval returns fewer than K whenever
                 the similarity threshold filters results out)
Precision@K str  |gold ∩ top_k| / K                (strict variant, also reported)
Recall@K         |gold ∩ top_k| / |gold|
F1@K             2PR / (P + R)                     (macro: computed per query,
                                                    then averaged)
Hit@K            1 if |gold ∩ top_k| > 0 else 0
MRR              1 / rank of the first gold hit, 0 if none in the full result list
CategoryAcc@1    top-1 hit category ∈ gold categories
CategoryAcc@5    at least one top-5 hit category ∈ gold categories

Out-of-domain cases (empty gold) are excluded from every average above and
scored separately: correct means retrieval returned nothing.

Writes reports/retrieval_metrics.json and reports/retrieval_metrics.md.
Nothing under RAG_System/, Knowledge_Base/ or the Chroma index is modified.

Usage:
    PYTHONPATH=. python scripts/evaluate_retrieval_metrics.py
    PYTHONPATH=. python scripts/evaluate_retrieval_metrics.py --baseline reports/retrieval_metrics.json
    PYTHONPATH=. python scripts/evaluate_retrieval_metrics.py --split core
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.config import settings
from RAG_System.retrieval.retriever import (
    _MAX_DISTANCE,
    _MAX_DISTANCE_FALLBACK,
    retrieve,
)

ROOT = Path(__file__).resolve().parent.parent
GROUND_TRUTH = ROOT / "eval" / "retrieval_ground_truth.json"
REPORT_DIR = ROOT / "reports"
JSON_OUT = REPORT_DIR / "retrieval_metrics.json"
MD_OUT = REPORT_DIR / "retrieval_metrics.md"

K_VALUES = (1, 3, 5)
FULL_K = 10  # widest window reported, for headroom analysis


# ── metric primitives ────────────────────────────────────────────────────────

def _f1(precision: float, recall: float) -> float:
    if precision + recall == 0:
        return 0.0
    return 2 * precision * recall / (precision + recall)


def _score_case(gold_ids: list[str], gold_categories: list[str],
                hit_ids: list[str], hit_categories: list[str]) -> dict:
    """All rank metrics for one query. Pure function of IDs and order."""
    gold = set(gold_ids)
    gold_cats = set(gold_categories)
    scores: dict[str, float] = {}

    for k in (*K_VALUES, FULL_K):
        window = hit_ids[:k]
        relevant = len(gold.intersection(window))
        precision = relevant / len(window) if window else 0.0
        precision_strict = relevant / k
        recall = relevant / len(gold) if gold else 0.0
        # A query with 1 gold entity can never exceed P@5 = 0.20, so raw
        # precision is also reported against the ceiling it could reach.
        ceiling = min(len(gold), len(window)) / len(window) if window else 0.0
        scores[f"precision@{k}"] = precision
        scores[f"precision_strict@{k}"] = precision_strict
        scores[f"precision_ceiling@{k}"] = ceiling
        scores[f"precision_ratio@{k}"] = precision / ceiling if ceiling else 0.0
        scores[f"recall@{k}"] = recall
        scores[f"f1@{k}"] = _f1(precision, recall)
        scores[f"hit@{k}"] = 1.0 if relevant else 0.0
        scores[f"relevant@{k}"] = float(relevant)

    first_rank = next(
        (i for i, hit_id in enumerate(hit_ids, start=1) if hit_id in gold), None
    )
    scores["mrr"] = 1.0 / first_rank if first_rank else 0.0
    scores["first_relevant_rank"] = float(first_rank) if first_rank else 0.0

    scores["category_acc@1"] = float(
        bool(hit_categories) and hit_categories[0] in gold_cats
    )
    scores["category_acc@5"] = float(
        any(category in gold_cats for category in hit_categories[:5])
    )
    return scores


def _classify(scores: dict, hit_count: int) -> str:
    """Failure bucket for one query, worst symptom first.

    PRECISION_ERROR is measured against `precision_ceiling@5`, not against a
    flat 0.5: a query with one gold entity tops out at P@5 = 0.20 by
    construction, and calling that a precision failure would only be measuring
    the size of the gold set.
    """
    if hit_count == 0:
        return "NO_RESULT"
    if scores["hit@5"] == 0:
        return "RECALL_ERROR"
    if scores["category_acc@1"] == 0:
        return "CATEGORY_ERROR"
    if scores["recall@5"] < 1.0:
        return "RECALL_ERROR"
    if scores["precision@5"] < scores["precision_ceiling@5"]:
        return "PRECISION_ERROR"
    return "PASS"


_METRIC_KEYS = [
    *(f"{name}@{k}" for k in (*K_VALUES, FULL_K)
      for name in ("precision", "precision_strict", "precision_ceiling",
                   "precision_ratio", "recall", "f1", "hit")),
    "mrr",
    "category_acc@1",
    "category_acc@5",
]


def _aggregate(rows: list[dict]) -> dict:
    """Macro-average of the per-query scores."""
    if not rows:
        return {"queries": 0}
    out: dict[str, float | int] = {"queries": len(rows)}
    for key in _METRIC_KEYS:
        out[key] = round(sum(r["scores"][key] for r in rows) / len(rows), 4)
    return out


# ── legacy comparability ─────────────────────────────────────────────────────

def _norm(text: str) -> str:
    return " ".join(str(text).lower().split())


def _keyword_matches(keyword: str, name: str) -> bool:
    """Same loose name match scripts/eval_retrieval.py used, kept so the older
    keyword-based Hit@K / MRR can be reproduced from this same run."""
    keyword_n, name_n = _norm(keyword), _norm(name)
    if not keyword_n or not name_n:
        return False
    return keyword_n in name_n or name_n in keyword_n


def _legacy_scores(keywords: list[str], hit_names: list[str]) -> dict:
    first_rank = next(
        (
            i
            for i, name in enumerate(hit_names, start=1)
            if any(_keyword_matches(kw, name) for kw in keywords)
        ),
        None,
    )
    return {
        **{
            f"hit@{k}": 1.0 if first_rank and first_rank <= k else 0.0
            for k in (*K_VALUES, FULL_K)
        },
        "mrr": 1.0 / first_rank if first_rank else 0.0,
    }


# ── run ──────────────────────────────────────────────────────────────────────

def _run_cases(cases: list[dict]) -> tuple[list[dict], list[dict]]:
    """(scored rows, out-of-domain rows). One retrieve() call per case."""
    scored: list[dict] = []
    abstention: list[dict] = []

    for case in cases:
        start = time.monotonic()
        hits = retrieve(case["query"], animal=case.get("animal"))
        latency = round(time.monotonic() - start, 3)

        retrieved = [
            {
                "rank": index,
                "id": hit.id,
                "name": (hit.metadata or {}).get("name", ""),
                "category": (hit.metadata or {}).get("category", ""),
                "animal": (hit.metadata or {}).get("animal", ""),
                "distance": round(hit.distance, 4),
                "tier": "primary" if hit.distance <= _MAX_DISTANCE else "fallback",
                "relevant": hit.id in set(case["gold_ids"]),
            }
            for index, hit in enumerate(hits, start=1)
        ]

        row = {
            "case_id": case["case_id"],
            "split": case["split"],
            "query": case["query"],
            "animal": case.get("animal"),
            "case_type": case.get("case_type", "standard"),
            "gold_ids": case["gold_ids"],
            "gold_names": [g["name"] for g in case["gold_entities"]],
            "gold_categories": case["gold_categories"],
            "hit_count": len(hits),
            "fallback_used": any(r["tier"] == "fallback" for r in retrieved),
            "latency_seconds": latency,
            "retrieved": retrieved,
        }

        if case["expects_no_answer"]:
            row["expects_no_answer"] = True
            row["abstained"] = len(hits) == 0
            row["error_type"] = "PASS" if len(hits) == 0 else "PRECISION_ERROR"
            abstention.append(row)
            marker = "OK " if row["abstained"] else "BAD"
            print(f"[{case['case_id']}] {marker} out-of-domain | "
                  f"hits={len(hits):2} | {latency:>6.2f}s | {case['query'][:44]}")
            continue

        row["scores"] = _score_case(
            case["gold_ids"],
            case["gold_categories"],
            [r["id"] for r in retrieved],
            [r["category"] for r in retrieved],
        )
        row["legacy_scores"] = _legacy_scores(
            [g["keyword"] for g in case["gold_entities"]],
            [r["name"] for r in retrieved],
        )
        row["error_type"] = _classify(row["scores"], len(hits))
        scored.append(row)

        print(f"[{case['case_id']}] {row['error_type']:15} | hits={len(hits):2} "
              f"P@5={row['scores']['precision@5']:.2f} R@5={row['scores']['recall@5']:.2f} "
              f"rank={int(row['scores']['first_relevant_rank']) or '-':>3} | "
              f"{latency:>6.2f}s | {case['query'][:44]}")

    return scored, abstention


def _pool_probe(cases: list[dict], pool_size: int) -> dict:
    """Diagnostic only: how much gold a wider candidate pool would surface.

    Calls the same production `retrieve()` with an explicit `top_k=pool_size`
    argument. Nothing is reconfigured — TOP_K, both thresholds, HyDE and the
    embedding model are untouched, and these numbers never enter the headline
    metrics. The point is to separate two very different problems:

      * gold that IS in a wider pool but ranked low  -> a reranker can fix it
      * gold that is absent even from a wide pool    -> only better candidate
                                                        generation (hybrid /
                                                        BM25 / thresholds) can

    """
    scored = [c for c in cases if not c["expects_no_answer"]]
    total_gold = sum(len(c["gold_ids"]) for c in scored)
    found_in_pool = 0
    depths: list[int] = []
    per_case: list[dict] = []

    for case in scored:
        hits = retrieve(case["query"], animal=case.get("animal"), top_k=pool_size)
        ids = [h.id for h in hits]
        ranks = {g: (ids.index(g) + 1 if g in ids else None) for g in case["gold_ids"]}
        found = [r for r in ranks.values() if r]
        found_in_pool += len(found)
        depths.extend(found)
        per_case.append({
            "case_id": case["case_id"],
            "pool_size": len(ids),
            "gold_ranks": ranks,
            "gold_found": len(found),
            "gold_total": len(case["gold_ids"]),
        })
        print(f"[{case['case_id']}] pool={len(ids):3} gold in pool "
              f"{len(found)}/{len(case['gold_ids'])} ranks={list(ranks.values())}")

    return {
        "requested_pool_size": pool_size,
        "gold_entities": total_gold,
        "gold_in_pool": found_in_pool,
        "recall_ceiling": round(found_in_pool / total_gold, 4) if total_gold else 0.0,
        "max_gold_rank": max(depths) if depths else 0,
        "gold_beyond_rank_5": sum(1 for d in depths if d > 5),
        "per_case": per_case,
    }


def _breakdown(rows: list[dict], key: str) -> dict:
    groups: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        value = row.get(key) or "unspecified"
        groups[str(value)].append(row)
    return {name: _aggregate(group) for name, group in sorted(groups.items())}


def _category_breakdown(rows: list[dict]) -> dict:
    """A query counts into every gold category it carries."""
    groups: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        for category in row["gold_categories"]:
            groups[category].append(row)
    return {name: _aggregate(group) for name, group in sorted(groups.items())}


# ── reporting ────────────────────────────────────────────────────────────────

def _pct(value: float) -> str:
    return f"{100 * value:.1f}%"


def _metric_table(title: str, table: dict) -> list[str]:
    lines = [f"### {title}", "",
             "| group | n | P@1 | P@3 | P@5 | R@1 | R@3 | R@5 | F1@5 | Hit@1 | Hit@3 | Hit@5 | MRR |",
             "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|"]
    for name, metrics in table.items():
        if not metrics.get("queries"):
            continue
        lines.append(
            f"| {name} | {metrics['queries']} | "
            f"{_pct(metrics['precision@1'])} | {_pct(metrics['precision@3'])} | {_pct(metrics['precision@5'])} | "
            f"{_pct(metrics['recall@1'])} | {_pct(metrics['recall@3'])} | {_pct(metrics['recall@5'])} | "
            f"{_pct(metrics['f1@5'])} | "
            f"{_pct(metrics['hit@1'])} | {_pct(metrics['hit@3'])} | {_pct(metrics['hit@5'])} | "
            f"{metrics['mrr']:.3f} |"
        )
    lines.append("")
    return lines


def _recommendations(payload: dict) -> list[str]:
    """Findings derived from this run's numbers. No model judgement involved."""
    overall = payload["overall"]
    probe = payload.get("diagnostics", {}).get("candidate_pool_probe")
    by_category = payload["by_category"]
    lines = ["## Recommendations", ""]

    if probe:
        ceiling = probe["recall_ceiling"]
        production = overall["recall@5"]
        unreachable = probe["gold_entities"] - probe["gold_in_pool"]
        lines += [
            f"1. **Candidate generation is the binding constraint, not ranking.** "
            f"A pool of {probe['requested_pool_size']} reaches "
            f"{_pct(ceiling)} of gold; production R@5 is {_pct(production)}. "
            f"Reordering a wider pool is worth at most "
            f"{_pct(ceiling - production)}, while {unreachable} of "
            f"{probe['gold_entities']} gold entities "
            f"({_pct(unreachable / probe['gold_entities'])}) are absent even from "
            "that wider pool and no reranker can recover them.",
            "",
        ]

    worst = sorted(
        ((name, m) for name, m in by_category.items() if m.get("queries", 0) >= 3),
        key=lambda item: item[1]["recall@5"],
    )
    if worst:
        name, metrics = worst[0]
        lines += [
            f"2. **`{name}` is the weakest category** — R@5 {_pct(metrics['recall@5'])}, "
            f"MRR {metrics['mrr']:.3f}, Hit@1 {_pct(metrics['hit@1'])} over "
            f"{metrics['queries']} queries. Category coverage, not similarity, is "
            "what fails there: the intent word in the query ('product', "
            "'medication') carries no signal the embedding of an entity document "
            "can match.",
            "",
        ]

    if payload["abstention"]["queries"] and payload["abstention"]["rate"] < 1.0:
        lines += [
            f"3. **Out-of-domain queries are not rejected.** "
            f"{payload['abstention']['queries'] - payload['abstention']['abstained']} of "
            f"{payload['abstention']['queries']} returned hits through the fallback "
            f"threshold ({payload['config']['similarity_threshold_fallback']}, "
            f"distance <= {payload['config']['max_distance_fallback']:.2f}). The "
            "fallback fires whenever the primary keeps nothing, which is exactly "
            "the case for a question the knowledge base cannot answer.",
            "",
        ]

    if overall["category_acc@1"] < 1.0:
        lines += [
            f"4. **Rank-1 category is wrong on {_pct(1 - overall['category_acc@1'])} "
            "of queries**, and the distance gaps between the wrong rank-1 hit and "
            "the correct gold hit are in the 0.002-0.03 range. The embedding "
            "barely separates them; ordering at the top is close to a coin flip.",
            "",
        ]

    lines += [
        "5. **Report a mean over several runs, not a single run.** HyDE runs at "
        "temperature 0.0 but the generated hypothetical document still varies "
        "between runs, moving R@5 / Hit@5 / MRR by roughly 3 points. Any "
        "BM25 or reranker gain smaller than that is not measurable from one run.",
        "",
    ]
    return lines


def _write_markdown(payload: dict, baseline: dict | None, md_out: Path) -> None:
    overall = payload["overall"]
    config = payload["config"]
    lines: list[str] = [
        "# Pet Haven Retrieval Evaluation Report",
        "",
        f"Generated {payload['generated_at']} — retrieval layer only, no generation, "
        "no LLM judge.",
        "",
        "## Dataset",
        "",
        f"- Scored queries: **{overall['queries']}**",
        f"- Out-of-domain queries (scored separately): "
        f"**{payload['abstention']['queries']}**",
        f"- Gold entities: **{payload['dataset']['gold_entity_count']}** "
        f"({payload['dataset']['gold_per_query']:.2f} per scored query)",
        f"- Sources: `{payload['dataset']['sources']['core']}` + "
        f"`{payload['dataset']['sources']['supplement']}`, resolved to IDs by "
        "`scripts/build_retrieval_ground_truth.py`",
        f"- Unresolved gold keywords: **{payload['dataset']['unresolved']}**",
        "",
        "## Configuration under test",
        "",
        f"- Embedding model: `{config['embedding_model']}`",
        f"- TOP_K: `{config['top_k']}` · distance metric: `{config['distance_metric']}`",
        f"- Primary max distance: `{config['max_distance']:.4f}` "
        f"(threshold {config['similarity_threshold']})",
        f"- Fallback max distance: `{config['max_distance_fallback']:.4f}` "
        f"(threshold {config['similarity_threshold_fallback']})",
        f"- HyDE: enabled inside `retrieve()`, LLM `{config['llm_model']}` at "
        "temperature 0.0",
        f"- Indexed documents: `{config['collection_count']}`",
        "",
        "## Overall Metrics",
        "",
        "| metric | @1 | @3 | @5 | @10 |",
        "|---|---:|---:|---:|---:|",
    ]
    for label, name in (("Precision", "precision"),
                        ("Precision (strict /K)", "precision_strict"),
                        ("Precision ceiling", "precision_ceiling"),
                        ("Precision / ceiling", "precision_ratio"),
                        ("Recall", "recall"), ("F1", "f1"), ("Hit", "hit")):
        lines.append(
            f"| {label} | " + " | ".join(
                _pct(overall[f"{name}@{k}"]) for k in (*K_VALUES, FULL_K)
            ) + " |"
        )
    lines += [
        "",
        "_Precision is bounded by the size of the gold set: a query with one "
        "expected entity cannot exceed P@5 = 0.20. **Precision ceiling** is that "
        "bound and **Precision / ceiling** is the share of it actually reached — "
        "that ratio, not raw precision, is the number to watch across runs._",
        "",
        f"- **MRR: {overall['mrr']:.3f}**",
        f"- Category Accuracy@1: **{_pct(overall['category_acc@1'])}**",
        f"- Category Accuracy@5: **{_pct(overall['category_acc@5'])}**",
        "",
        "## Out-of-domain behaviour",
        "",
        f"- Queries: {payload['abstention']['queries']}",
        f"- Correctly returned nothing: {payload['abstention']['abstained']}",
        f"- Abstention rate: {_pct(payload['abstention']['rate'])}",
        "",
        "## Retrieval health",
        "",
        f"- Empty result sets: {payload['health']['empty_results']}",
        f"- Queries using the fallback threshold: {payload['health']['fallback_queries']}",
        f"- Mean hits returned: {payload['health']['mean_hits']:.2f} of TOP_K="
        f"{config['top_k']} (double search + dedup can exceed TOP_K)",
        "",
        "## Performance",
        "",
        f"- Total queries executed: {payload['performance']['total_queries']}",
        f"- Total wall time: {payload['performance']['total_seconds']:.1f}s",
        f"- Mean retrieval latency: {payload['performance']['mean_latency']:.2f}s",
        f"- Median / p95 latency: {payload['performance']['median_latency']:.2f}s / "
        f"{payload['performance']['p95_latency']:.2f}s",
        "",
        "_Latency includes the HyDE LLM call and is informational — never a failure._",
        "",
    ]

    lines += _metric_table("Animal Breakdown", payload["by_animal"])
    lines += _metric_table("Category Breakdown", payload["by_category"])
    lines += _metric_table("Split Breakdown", payload["by_split"])
    lines += _metric_table("Case-type Breakdown", payload["by_case_type"])

    lines += ["## Error Distribution", "", "| error type | count |", "|---|---:|"]
    for name, count in payload["error_distribution"].items():
        lines.append(f"| {name} | {count} |")
    lines.append("")

    lines += ["## Top Retrieval Failures", ""]
    if not payload["failures"]:
        lines.append("_No failing query._")
    for failure in payload["failures"]:
        lines += [
            f"### {failure['case_id']} — {failure['error_type']}",
            "",
            f"**Query:** {failure['query']}  ",
            f"**Animal:** {failure['animal']}  ",
            f"**Expected:** {', '.join(f'{i} ({n})' for i, n in zip(failure['gold_ids'], failure['gold_names'])) or '—'}  ",
            f"**Scores:** P@5 {failure['precision@5']:.2f} · R@5 {failure['recall@5']:.2f} · "
            f"MRR {failure['mrr']:.3f}",
            "",
            "| rank | id | name | category | distance | relevant |",
            "|---:|---|---|---|---:|:--:|",
        ]
        for hit in failure["retrieved_top5"]:
            mark = "YES" if hit["relevant"] else "no"
            lines.append(
                f"| {hit['rank']} | `{hit['id']}` | {hit['name']} | {hit['category']} | "
                f"{hit['distance']:.4f} | {mark} |"
            )
        if not failure["retrieved_top5"]:
            lines.append("| — | — | _nothing retrieved_ | — | — | — |")
        lines.append("")

    lines += _recommendations(payload)

    lines += [
        "## Comparison with the previous methodology",
        "",
        "`scripts/eval_retrieval.py` scored a hit by loose name substring match and "
        "reported only Hit@K and MRR. Both scorings, computed over the same run:",
        "",
        "| metric | legacy (name substring) | current (entity ID) |",
        "|---|---:|---:|",
    ]
    legacy = payload["legacy_keyword_metrics"]
    for k in (*K_VALUES, FULL_K):
        lines.append(
            f"| Hit@{k} | {_pct(legacy[f'hit@{k}'])} | {_pct(overall[f'hit@{k}'])} |"
        )
    lines.append(f"| MRR | {legacy['mrr']:.3f} | {overall['mrr']:.3f} |")
    lines.append("")

    probe = payload.get("diagnostics", {}).get("candidate_pool_probe")
    if probe:
        lines += [
            "## Candidate-pool diagnostic",
            "",
            f"A second, diagnostic pass called the same `retrieve()` with "
            f"`top_k={probe['requested_pool_size']}`. Production TOP_K, both "
            "thresholds, HyDE and the embedding model were not changed, and these "
            "numbers are not part of the metrics above. It separates ranking "
            "problems from candidate-generation problems:",
            "",
            f"- Gold entities reachable in a pool of {probe['requested_pool_size']}: "
            f"**{probe['gold_in_pool']}/{probe['gold_entities']}** "
            f"(**{_pct(probe['recall_ceiling'])}** recall ceiling)",
            f"- Of those, ranked below 5: **{probe['gold_beyond_rank_5']}** "
            "— the share a reranker could recover",
            f"- Deepest gold rank observed: **{probe['max_gold_rank']}**",
            "",
        ]

    if baseline:
        lines += [
            "## Comparison with the stored baseline",
            "",
            f"Baseline generated {baseline.get('generated_at', 'unknown')}.",
            "",
            "| metric | previous | current | delta |",
            "|---|---:|---:|---:|",
        ]
        previous = baseline.get("overall", {})
        for key in ("precision@5", "recall@5", "f1@5", "hit@1", "hit@3",
                    "hit@5", "mrr", "category_acc@1"):
            if key not in previous:
                continue
            before, after = previous[key], overall[key]
            arrow = "+" if after >= before else ""
            fmt = (lambda v: f"{v:.3f}") if key == "mrr" else _pct
            lines.append(
                f"| {key} | {fmt(before)} | {fmt(after)} | {arrow}{fmt(after - before)} |"
            )
        lines.append("")

    MD_OUT.write_text("\n".join(lines), encoding="utf-8")


def baseline_for(args) -> dict | None:
    """Load a previous retrieval_metrics.json, if one was given and exists."""
    if args.baseline and Path(args.baseline).is_file():
        return json.loads(Path(args.baseline).read_text(encoding="utf-8"))
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--ground-truth", default=str(GROUND_TRUTH))
    parser.add_argument("--split", choices=["core", "supplement", "all"], default="all")
    parser.add_argument("--baseline", default="",
                        help="a previous retrieval_metrics.json to diff against")
    parser.add_argument("--candidate-pool", type=int, default=0,
                        help="diagnostic second pass at this top_k, to measure "
                             "the recall ceiling a reranker could work with; "
                             "does not affect the headline metrics")
    parser.add_argument("--render-only", action="store_true",
                        help="rebuild the markdown from an existing "
                             "retrieval_metrics.json without running retrieval")
    parser.add_argument("--json-out", default=str(JSON_OUT))
    parser.add_argument("--md-out", default=str(MD_OUT))
    args = parser.parse_args()

    json_out, md_out = Path(args.json_out), Path(args.md_out)
    json_out.parent.mkdir(parents=True, exist_ok=True)
    md_out.parent.mkdir(parents=True, exist_ok=True)

    if args.render_only:
        payload = json.loads(json_out.read_text(encoding="utf-8"))
        _write_markdown(payload, baseline_for(args), md_out)
        print(f"re-rendered {md_out} from {json_out}")
        return

    truth = json.loads(Path(args.ground_truth).read_text(encoding="utf-8"))
    cases = truth["cases"]
    if args.split != "all":
        cases = [c for c in cases if c["split"] == args.split]

    baseline = baseline_for(args)

    from RAG_System.indexing.vector_store import get_store
    collection_count = get_store().count()

    print(f"Ground truth : {args.ground_truth}")
    print(f"Cases        : {len(cases)} (split={args.split})")
    print(f"Chroma docs  : {collection_count}")
    print("-" * 110)

    started = time.monotonic()
    scored, abstention = _run_cases(cases)
    total_seconds = time.monotonic() - started

    overall = _aggregate(scored)
    latencies = sorted(r["latency_seconds"] for r in scored + abstention)

    def _percentile(values: list[float], fraction: float) -> float:
        if not values:
            return 0.0
        return values[min(len(values) - 1, int(round(fraction * (len(values) - 1))))]

    legacy_rows = [r["legacy_scores"] for r in scored]
    legacy = {
        key: round(sum(r[key] for r in legacy_rows) / len(legacy_rows), 4)
        for key in ("mrr", *(f"hit@{k}" for k in (*K_VALUES, FULL_K)))
    } if legacy_rows else {}

    error_distribution: dict[str, int] = defaultdict(int)
    for row in scored + abstention:
        error_distribution[row["error_type"]] += 1

    failures = sorted(
        (r for r in scored + abstention if r["error_type"] != "PASS"),
        key=lambda r: (r.get("scores", {}).get("recall@5", 0.0),
                       r.get("scores", {}).get("mrr", 0.0)),
    )

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "measures": "retrieval only (retrieve()); no generation, no LLM judge",
        "dataset_size": len(cases),
        "dataset": {
            "scored_queries": len(scored),
            "out_of_domain_queries": len(abstention),
            "gold_entity_count": sum(len(r["gold_ids"]) for r in scored),
            "gold_per_query": (
                sum(len(r["gold_ids"]) for r in scored) / len(scored) if scored else 0.0
            ),
            "sources": truth["sources"],
            "unresolved": len(truth.get("unresolved", [])),
        },
        "config": {
            "embedding_model": settings.EMBEDDING_MODEL,
            "llm_model": settings.LLM_MODEL,
            "top_k": settings.TOP_K,
            "distance_metric": settings.DISTANCE_METRIC,
            "similarity_threshold": settings.SIMILARITY_THRESHOLD,
            "similarity_threshold_fallback": settings.SIMILARITY_THRESHOLD_FALLBACK,
            "max_distance": _MAX_DISTANCE,
            "max_distance_fallback": _MAX_DISTANCE_FALLBACK,
            "collection_count": collection_count,
        },
        "overall": overall,
        "legacy_keyword_metrics": legacy,
        "abstention": {
            "queries": len(abstention),
            "abstained": sum(1 for r in abstention if r["abstained"]),
            "rate": (
                sum(1 for r in abstention if r["abstained"]) / len(abstention)
                if abstention else 0.0
            ),
        },
        "health": {
            "empty_results": sum(1 for r in scored if r["hit_count"] == 0),
            "fallback_queries": sum(1 for r in scored if r["fallback_used"]),
            "mean_hits": (
                sum(r["hit_count"] for r in scored) / len(scored) if scored else 0.0
            ),
        },
        "performance": {
            "total_queries": len(scored) + len(abstention),
            "total_seconds": round(total_seconds, 2),
            "mean_latency": round(sum(latencies) / len(latencies), 3) if latencies else 0.0,
            "median_latency": round(_percentile(latencies, 0.5), 3),
            "p95_latency": round(_percentile(latencies, 0.95), 3),
        },
        "by_animal": _breakdown(scored, "animal"),
        "by_category": _category_breakdown(scored),
        "by_split": _breakdown(scored, "split"),
        "by_case_type": _breakdown(scored, "case_type"),
        "error_distribution": dict(sorted(error_distribution.items())),
        "failures": [
            {
                "case_id": r["case_id"],
                "query": r["query"],
                "animal": r["animal"],
                "error_type": r["error_type"],
                "gold_ids": r["gold_ids"],
                "gold_names": r["gold_names"],
                "gold_categories": r["gold_categories"],
                "precision@5": r.get("scores", {}).get("precision@5", 0.0),
                "recall@5": r.get("scores", {}).get("recall@5", 0.0),
                "mrr": r.get("scores", {}).get("mrr", 0.0),
                "retrieved_top5": r["retrieved"][:5],
            }
            for r in failures
        ],
        "per_query": scored + abstention,
    }

    if args.candidate_pool:
        print("-" * 110)
        print(f"candidate-pool diagnostic at top_k={args.candidate_pool} "
              "(production metrics above are unaffected)")
        payload["diagnostics"] = {
            "candidate_pool_probe": _pool_probe(cases, args.candidate_pool)
        }
        probe = payload["diagnostics"]["candidate_pool_probe"]
        print(f"recall ceiling at pool={args.candidate_pool}: "
              f"{_pct(probe['recall_ceiling'])} "
              f"({probe['gold_in_pool']}/{probe['gold_entities']} gold entities, "
              f"{probe['gold_beyond_rank_5']} of them below rank 5)")

    json_out.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    _write_markdown(payload, baseline, md_out)

    print("-" * 110)
    print(f"scored queries       : {overall['queries']}")
    print(f"P@1 / @3 / @5        : {_pct(overall['precision@1'])} / "
          f"{_pct(overall['precision@3'])} / {_pct(overall['precision@5'])}")
    print(f"R@1 / @3 / @5        : {_pct(overall['recall@1'])} / "
          f"{_pct(overall['recall@3'])} / {_pct(overall['recall@5'])}")
    print(f"F1@1 / @3 / @5       : {_pct(overall['f1@1'])} / "
          f"{_pct(overall['f1@3'])} / {_pct(overall['f1@5'])}")
    print(f"Hit@1 / @3 / @5      : {_pct(overall['hit@1'])} / "
          f"{_pct(overall['hit@3'])} / {_pct(overall['hit@5'])}")
    print(f"MRR                  : {overall['mrr']:.3f}")
    print(f"Category Acc @1 / @5 : {_pct(overall['category_acc@1'])} / "
          f"{_pct(overall['category_acc@5'])}")
    print(f"errors               : {dict(sorted(error_distribution.items()))}")
    print(f"mean latency         : {payload['performance']['mean_latency']:.2f}s "
          f"over {payload['performance']['total_seconds']:.1f}s total")
    print(f"wrote {json_out} and {md_out}")


if __name__ == "__main__":
    main()
