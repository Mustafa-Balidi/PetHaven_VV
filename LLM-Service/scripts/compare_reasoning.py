#!/usr/bin/env python3
"""Measure reasoning behaviour of candidate OpenRouter models.

Diagnostic tool only — nothing in the RAG pipeline imports it.

It records token accounting and latency for each
(model x reasoning configuration x prompt) combination.

Privacy rule: the internal reasoning text and `reasoning_details` are
never read, printed or stored. Only countable metadata is kept.

Usage:
    python scripts/compare_reasoning.py [--out results.json]
"""
from __future__ import annotations

import argparse
import json
import time

from langchain_openai import ChatOpenAI

from RAG_System.config import settings

MODELS = [
    ("qwen",  "qwen/qwen3.5-9b"),
    ("gemma", "google/gemma-4-31b-it"),
]

CONFIGS = [
    ("disabled", {"reasoning": {"enabled": False}}),
    ("low",      {"reasoning": {"effort": "low"}}),
]

PROMPTS = [
    (
        "R1_trivial",
        "Say hello in one short sentence.",
        200,
    ),
    (
        "R2_vet_reasoning",
        "A dog has been vomiting since yesterday, has diarrhea, "
        "refuses food, and is very tired. "
        "Give a concise veterinary assessment.",
        512,
    ),
    (
        "R3_evidence_comparison",
        "Evidence A: vomiting, diarrhea, anorexia, lethargy.\n"
        "Evidence B: parvovirus causes vomiting, diarrhea, "
        "anorexia and lethargy.\n"
        "Evidence C: GDV commonly includes abdominal distension "
        "and unproductive retching.\n\n"
        "Select the single most supported condition from the evidence. "
        "Do not add facts.",
        512,
    ),
]


def _usage(response) -> dict:
    """Pull only countable fields out of the response metadata."""
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


def run_one(model: str, extra_body: dict, prompt: str, max_tokens: int) -> dict:
    llm = ChatOpenAI(
        model=model,
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
        temperature=0,
        max_tokens=max_tokens,
        timeout=settings.LLM_TIMEOUT,
        extra_body=extra_body,
    )

    start = time.monotonic()
    try:
        response = llm.invoke(prompt)
    except Exception as exc:
        return {
            "error":           f"{type(exc).__name__}: {str(exc)[:200]}",
            "latency_seconds": round(time.monotonic() - start, 2),
            "content_empty":   True,
            "content_length":  0,
        }
    latency = round(time.monotonic() - start, 2)

    content = str(response.content or "")
    record = {
        "latency_seconds": latency,
        "content_length":  len(content.strip()),
        "content_empty":   not content.strip(),
    }
    record.update(_usage(response))
    return record


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="reasoning_results.json")
    args = parser.parse_args()

    rows: list[dict] = []

    for label, model in MODELS:
        for config_name, extra_body in CONFIGS:
            for prompt_name, prompt, max_tokens in PROMPTS:
                row = {
                    "model":      label,
                    "model_id":   model,
                    "reasoning":  config_name,
                    "prompt":     prompt_name,
                    "max_tokens": max_tokens,
                }
                row.update(run_one(model, extra_body, prompt, max_tokens))
                rows.append(row)
                print(
                    f"{label:6} | {config_name:8} | {prompt_name:22} | "
                    f"{row.get('latency_seconds'):>6}s | "
                    f"reason={row.get('reasoning_tokens')} "
                    f"completion={row.get('completion_tokens')} "
                    f"empty={row.get('content_empty')} "
                    f"finish={row.get('finish_reason')} "
                    f"{row.get('error', '')}"
                )

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2)
    print(f"\nSaved {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
