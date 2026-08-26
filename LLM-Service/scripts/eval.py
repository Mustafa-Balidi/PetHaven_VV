"""Batch-run eval/eval.jsonl through retrieve + expand and report recall/coverage."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.retrieval.context_expander import expand
from RAG_System.retrieval.retriever import retrieve

EVAL_FILE = Path(__file__).resolve().parent.parent / "eval" / "eval.jsonl"


def _load_cases() -> list[dict]:
    lines = EVAL_FILE.read_text(encoding="utf-8").splitlines()
    return [json.loads(line) for line in lines if line.strip()]


def _run_case(case: dict) -> tuple[int, int, int, int]:
    """Return (categories_found, categories_total, keywords_found, keywords_total)."""
    hits = retrieve(case["query"], animal=case.get("animal"))
    hits = expand(hits, animal=case.get("animal"))

    found_categories = {hit.metadata.get("category") for hit in hits}
    categories_found = sum(
        1 for c in case["expected_categories"] if c in found_categories
    )

    haystack = " ".join(
        f"{hit.text} {hit.metadata.get('name', '')}".lower() for hit in hits
    )
    keywords_found = sum(
        1 for kw in case["expected_keywords"] if kw.lower() in haystack
    )

    return (
        categories_found,
        len(case["expected_categories"]),
        keywords_found,
        len(case["expected_keywords"]),
    )


def main() -> None:
    """Run every eval case and print aggregate recall/coverage metrics."""
    cases = _load_cases()

    cat_found = cat_total = kw_found = kw_total = 0
    for case in cases:
        cf, ct, kf, kt = _run_case(case)
        cat_found += cf
        cat_total += ct
        kw_found += kf
        kw_total += kt

    cat_pct = 100 * cat_found / cat_total if cat_total else 0.0
    kw_pct = 100 * kw_found / kw_total if kw_total else 0.0

    print(f"Category Recall: {cat_pct:.1f}% ({cat_found}/{cat_total})")
    print(f"Keyword Coverage: {kw_pct:.1f}% ({kw_found}/{kw_total})")


if __name__ == "__main__":
    main()
