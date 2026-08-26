#!/usr/bin/env python3
"""Generation-only A/B test. Diagnostic tool only.

Evidence is retrieved ONCE per case and the identical prompt is sent to
every candidate arm, so differences come from the generator alone and not
from HyDE or retrieval luck.

Nothing here is imported by the RAG pipeline, and prompt_builder.py is
used unmodified.

Usage:
    PYTHONPATH=. python scripts/compare_generation.py --out gen.json
"""
from __future__ import annotations

import argparse
import json
import time

from langchain_openai import ChatOpenAI

from RAG_System.config import settings
from RAG_System.llm.generator import _extract_text, _trim_context
from RAG_System.llm.prompt_builder import build_prompt
from RAG_System.retrieval.context_expander import expand
from RAG_System.retrieval.retriever import retrieve

# (case id, question, animal)
CASES = [
    ("C01_vague",        "My dog is sick.", "dog"),
    ("C02_vomiting",     "My dog is vomiting.", "dog"),
    ("C03_enough_gi",    "My dog has been vomiting since yesterday, has diarrhea, "
                         "refuses food, and is very tired.", "dog"),
    ("C04_emergency",    "My dog keeps trying to vomit but nothing comes out, "
                         "his abdomen looks swollen and he is very restless.", "dog"),
    ("C05_hematemesis",  "My dog is vomiting blood.", "dog"),
    ("C06_general_info", "What is Canine Parvovirus?", None),
    ("C07_vaccine",      "What vaccine helps prevent canine parvovirus?", "dog"),
    ("C08_medication",   "What is Carprofen used for?", "dog"),
    ("C09_casual",       "Hello! How are you?", None),
    ("C10_offtopic",     "What is the capital of France?", None),
    # Emergency false-positive probe (section 12, group B)
    ("C11_non_emergency", "My dog vomited once but is otherwise acting normally.", "dog"),
]

ARMS = [
    ("qwen_disabled",  "qwen/qwen3.5-9b",        {"reasoning": {"enabled": False}}),
    ("gemma_disabled", "google/gemma-4-31b-it",  {"reasoning": {"enabled": False}}),
    ("gemma_low",      "google/gemma-4-31b-it",  {"reasoning": {"effort": "low"}}),
]


def _build(model: str, extra_body: dict) -> ChatOpenAI:
    return ChatOpenAI(
        model=model,
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
        temperature=settings.LLM_TEMPERATURE,
        max_tokens=settings.LLM_MAX_TOKENS,
        timeout=settings.LLM_TIMEOUT,
        extra_body=extra_body,
    )


def _usage(response) -> dict:
    meta = getattr(response, "response_metadata", None) or {}
    usage = meta.get("token_usage") or {}
    details = usage.get("completion_tokens_details") or {}
    return {
        "prompt_tokens":     usage.get("prompt_tokens"),
        "completion_tokens": usage.get("completion_tokens"),
        "reasoning_tokens":  details.get("reasoning_tokens"),
        "total_tokens":      usage.get("total_tokens"),
        "finish_reason":     meta.get("finish_reason"),
        "cost":              usage.get("cost"),
    }


def _invoke(llm: ChatOpenAI, prompt: str) -> dict:
    start = time.monotonic()
    try:
        response = llm.invoke(prompt)
    except Exception as exc:
        return {
            "error":           f"{type(exc).__name__}: {str(exc)[:200]}",
            "latency_seconds": round(time.monotonic() - start, 2),
            "answer":          "",
            "content_empty":   True,
        }
    latency = round(time.monotonic() - start, 2)
    text = _extract_text(response)
    row = {
        "latency_seconds": latency,
        "answer":          text,
        "content_empty":   not text.strip(),
    }
    row.update(_usage(response))
    return row


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="generation_results.json")
    parser.add_argument("--repeat-case", default="C03_enough_gi",
                        help="case repeated N times to measure ONE-condition adherence")
    parser.add_argument("--repeats", type=int, default=5)
    args = parser.parse_args()

    llms = {name: _build(model, body) for name, model, body in ARMS}
    rows: list[dict] = []

    for case_id, question, animal in CASES:
        hits = retrieve(question, animal=animal)
        if hits:
            hits = _trim_context(expand(hits, animal=animal))

        prompt = build_prompt(question, hits, history=None)
        evidence = [
            f"{h.id}|{h.metadata.get('category')}|{h.metadata.get('name')}"
            for h in hits
        ]

        repeats = args.repeats if case_id == args.repeat_case else 1

        for arm_name in llms:
            for run_index in range(repeats):
                row = {
                    "case":      case_id,
                    "question":  question,
                    "animal":    animal,
                    "arm":       arm_name,
                    "run":       run_index,
                    "evidence":  evidence,
                    "hit_count": len(hits),
                }
                row.update(_invoke(llms[arm_name], prompt))
                rows.append(row)
                print(
                    f"{case_id:17} run{run_index} | {arm_name:15} | "
                    f"hits={len(hits):2} | {row.get('latency_seconds'):>6}s | "
                    f"chars={len(row['answer']):>5} "
                    f"rtok={row.get('reasoning_tokens')} "
                    f"finish={row.get('finish_reason')} "
                    f"{row.get('error', '')}"
                )

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
