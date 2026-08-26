#!/usr/bin/env python3
"""Context-expansion evaluation.

Answers two questions the retrieval-only pass cannot:
  1. How much expected-keyword coverage does expansion actually add?
  2. What does expansion put in front of the LLM that does not belong there?

Production functions are used unmodified. Expansion is ID-based and hits
ChromaDB only, so this costs one HyDE call per case and no extra
embedding calls (the embed cache absorbs repeats).

Note on distances: expanded entities carry distance=0.0 as a marker, NOT
a similarity score. They are never treated as better matches here.

Usage:
    PYTHONPATH=. python scripts/eval_expansion.py --out expansion_eval.json
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.llm.generator import _trim_context
from RAG_System.retrieval.context_expander import expand
from RAG_System.retrieval.retriever import retrieve

EVAL_FILE = Path(__file__).resolve().parent.parent / "eval" / "eval.jsonl"

# Clinical cases inspected in detail for section 7
DETAIL_QUERIES = {
    "My dog is vomiting blood, what could be wrong?",
    "My dog has no appetite and won't eat, what's going on?",
    "My cat keeps throwing up, what diseases cause that?",
    "My cat is very lethargic and low energy, what could it be?",
    "How is Gastric Dilatation-Volvulus treated in dogs?",
}


def _norm(text: str) -> str:
    return " ".join(text.lower().split())


def _matches(keyword: str, name: str) -> bool:
    keyword_n, name_n = _norm(keyword), _norm(name)
    if not keyword_n or not name_n:
        return False
    return keyword_n in name_n or name_n in keyword_n


def _covered(keywords: list[str], names: list[str]) -> int:
    return sum(1 for kw in keywords if any(_matches(kw, n) for n in names))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="expansion_eval.json")
    args = parser.parse_args()

    cases = [
        json.loads(line)
        for line in EVAL_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]

    rows: list[dict] = []
    keyword_total = retrieved_cov = expanded_cov = trimmed_cov = 0

    for case in cases:
        keywords = case["expected_keywords"]
        hits = retrieve(case["query"], animal=case.get("animal"))
        expanded = expand(hits, animal=case.get("animal")) if hits else []
        trimmed = _trim_context(expanded) if expanded else []

        retrieved_names = [(h.metadata or {}).get("name", "") for h in hits]
        expanded_names = [(h.metadata or {}).get("name", "") for h in expanded]
        trimmed_names = [(h.metadata or {}).get("name", "") for h in trimmed]

        added = [
            f"{(h.metadata or {}).get('category')}:{(h.metadata or {}).get('name')}"
            for h in expanded
            if h.id not in {x.id for x in hits}
        ]

        keyword_total += len(keywords)
        retrieved_cov += _covered(keywords, retrieved_names)
        expanded_cov += _covered(keywords, expanded_names)
        trimmed_cov += _covered(keywords, trimmed_names)

        row = {
            "query":            case["query"],
            "animal":           case.get("animal"),
            "expected_keywords": keywords,
            "retrieved":        len(hits),
            "expanded":         len(expanded),
            "trimmed":          len(trimmed),
            "added_count":      len(added),
            "covered_retrieved": _covered(keywords, retrieved_names),
            "covered_expanded":  _covered(keywords, expanded_names),
            "covered_trimmed":   _covered(keywords, trimmed_names),
        }
        if case["query"] in DETAIL_QUERIES:
            row["retrieved_names"] = [
                f"{(h.metadata or {}).get('category')}:{n}"
                for h, n in zip(hits, retrieved_names)
            ]
            row["added_entities"] = added
            row["final_to_llm"] = [
                f"{(h.metadata or {}).get('category')}:{n}"
                for h, n in zip(trimmed, trimmed_names)
            ]
        rows.append(row)

        print(f"{case['query'][:46]:46} | ret={len(hits):2} exp={len(expanded):3} "
              f"trim={len(trimmed):2} added={len(added):3} | "
              f"cov {row['covered_retrieved']}->{row['covered_expanded']}"
              f"->{row['covered_trimmed']} /{len(keywords)}")

    print("\n" + "=" * 64)
    print(f"keyword coverage after retrieval : "
          f"{100*retrieved_cov/keyword_total:.1f}%  ({retrieved_cov}/{keyword_total})")
    print(f"keyword coverage after expansion : "
          f"{100*expanded_cov/keyword_total:.1f}%  ({expanded_cov}/{keyword_total})")
    print(f"keyword coverage seen by the LLM : "
          f"{100*trimmed_cov/keyword_total:.1f}%  ({trimmed_cov}/{keyword_total})")
    print(f"mean entities: retrieved {sum(r['retrieved'] for r in rows)/len(rows):.1f} "
          f"-> expanded {sum(r['expanded'] for r in rows)/len(rows):.1f} "
          f"-> trimmed {sum(r['trimmed'] for r in rows)/len(rows):.1f}")
    print("=" * 64)

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
