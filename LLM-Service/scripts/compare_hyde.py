#!/usr/bin/env python3
"""Does reasoning improve HyDE retrieval? Diagnostic tool only.

Rebuilds the HyDE step in-process for two reasoning configurations and
compares the retrieval that follows. retriever.py itself is never modified,
so production HyDE behaviour is untouched while this runs.

Only countable metadata is stored — never the internal reasoning text.

Usage:
    PYTHONPATH=. python scripts/compare_hyde.py --model google/gemma-4-31b-it
"""
from __future__ import annotations

import argparse
import json
import time

from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

from RAG_System.config import settings
from RAG_System.indexing.embedder import OpenRouterEmbedder
from RAG_System.indexing.vector_store import get_store
from RAG_System.retrieval.retriever import (
    _HYDE_PROMPT,
    _MAX_DISTANCE,
    _dedup_hits,
)

QUERIES = [
    ("dog vomiting blood",                                  "dog"),
    ("dog vomiting diarrhea not eating tired",              "dog"),
    ("cat not eating for two days",                         "cat"),
    ("dog abdominal swelling and unproductive retching",    "dog"),
    ("what is canine parvovirus",                           None),
]

CONFIGS = [
    ("disabled", {"reasoning": {"enabled": False}}),
    ("low",      {"reasoning": {"effort": "low"}}),
]


def _hyde(model: str, extra_body: dict, query: str) -> tuple[str, float, int | None]:
    """Return (hypothetical answer, latency, reasoning_tokens)."""
    llm = ChatOpenAI(
        model=model,
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
        temperature=0.3,
        max_tokens=200,
        timeout=settings.LLM_TIMEOUT,
        extra_body=extra_body,
    )
    start = time.monotonic()
    try:
        response = (_HYDE_PROMPT | llm).invoke({"question": query})
    except Exception as exc:
        return f"__ERROR__ {type(exc).__name__}", round(time.monotonic() - start, 2), None
    latency = round(time.monotonic() - start, 2)

    meta = getattr(response, "response_metadata", None) or {}
    details = (meta.get("token_usage") or {}).get("completion_tokens_details") or {}
    text = StrOutputParser().invoke(response)
    return text, latency, details.get("reasoning_tokens")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=settings.LLM_MODEL)
    parser.add_argument("--out", default="hyde_results.json")
    args = parser.parse_args()

    store = get_store()
    embedder = OpenRouterEmbedder()
    rows: list[dict] = []

    for query, animal in QUERIES:
        for config_name, extra_body in CONFIGS:
            hyde_text, latency, reasoning_tokens = _hyde(
                args.model, extra_body, query
            )
            hyde_ok = bool(hyde_text.strip()) and not hyde_text.startswith("__ERROR__")

            search_queries = [query] + ([hyde_text] if hyde_ok else [])
            raw = []
            for search_query in search_queries:
                raw.extend(
                    store.search(
                        embedder.embed_query(search_query),
                        animal=animal,
                        top_k=settings.TOP_K,
                    )
                )

            deduped = _dedup_hits(raw)
            kept = [h for h in deduped if h.distance <= _MAX_DISTANCE]

            row = {
                "query":            query,
                "animal":           animal,
                "reasoning":        config_name,
                "hyde_empty":       not hyde_ok,
                "hyde_latency":     latency,
                "reasoning_tokens": reasoning_tokens,
                "kept_primary":     len(kept),
                "top_distances":    [round(h.distance, 4) for h in deduped[:5]],
                "top_hits": [
                    f"{h.id}|{h.metadata.get('category')}|{h.metadata.get('name')}"
                    for h in deduped[:3]
                ],
            }
            rows.append(row)
            print(
                f"{config_name:8} | {query[:38]:38} | empty={row['hyde_empty']!s:5} "
                f"| {latency:>5}s | rtok={reasoning_tokens} | kept={len(kept)} "
                f"| {row['top_distances']}"
            )
            for hit in row["top_hits"]:
                print(f"           {hit}")

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
