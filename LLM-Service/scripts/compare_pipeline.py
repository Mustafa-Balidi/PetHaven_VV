#!/usr/bin/env python3
"""Full-pipeline comparison for one model. Diagnostic tool only.

Run once per candidate in a FRESH process so no module cache, lazy LLM
singleton or conversation history leaks between models:

    LLM_MODEL=qwen/qwen3.5-9b PYTHONPATH=. python scripts/compare_pipeline.py --label qwen

Covers the follow-up/history sequence (section 13) and the Arabic cases
(section 14). Conversation IDs are namespaced by label so the two models
never share history.
"""
from __future__ import annotations

import argparse
import json
import time
import uuid

from RAG_System.config import settings
from RAG_System.llm.generator import answer_with_hits
from RAG_System.llm.translator import arabic_to_english, english_to_arabic

HISTORY_TURNS = [
    "My dog is vomiting.",
    "It started yesterday. He also has diarrhea and stopped eating.",
    "He is very tired and is not drinking much.",
]

ARABIC_CASES = [
    ("AR1", "كلبي يتقيأ منذ البارحة وعنده إسهال ولا يريد الأكل وهو خامل جداً.", "dog"),
    ("AR2", "كلبي يحاول التقيؤ لكن لا يخرج شيء وبطنه منتفخ وهو مضطرب.", "dog"),
    ("AR3", "ما هو فيروس بارفو الكلاب؟", None),
    ("AR4", "مرحباً كيف حالك؟", None),
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    parser.add_argument("--out", default="pipeline_results.json")
    args = parser.parse_args()

    print(f"model in use: {settings.LLM_MODEL}")
    rows: list[dict] = []

    # ── History / follow-up ───────────────────────────────────────────────
    conversation_id = f"{args.label}-history-{uuid.uuid4()}"

    for turn_index, question in enumerate(HISTORY_TURNS, start=1):
        start = time.monotonic()
        answer, hits = answer_with_hits(
            question, animal="dog", conversation_id=conversation_id
        )
        rows.append({
            "kind":            "history",
            "label":           args.label,
            "turn":            turn_index,
            "question":        question,
            "conversation_id": conversation_id,
            "latency_seconds": round(time.monotonic() - start, 2),
            "hit_count":       len(hits),
            "answer":          answer,
        })
        print(f"history turn{turn_index} | {rows[-1]['latency_seconds']:>6}s | "
              f"hits={len(hits)} | chars={len(answer)}")

    # ── Arabic ────────────────────────────────────────────────────────────
    for case_id, question, animal in ARABIC_CASES:
        row: dict = {
            "kind":     "arabic",
            "label":    args.label,
            "case":     case_id,
            "question": question,
        }
        total_start = time.monotonic()
        try:
            start = time.monotonic()
            english_question = arabic_to_english(question)
            row["translate_in_seconds"] = round(time.monotonic() - start, 2)

            start = time.monotonic()
            answer, hits = answer_with_hits(
                english_question,
                animal=animal,
                conversation_id=f"{args.label}-{case_id}-{uuid.uuid4()}",
            )
            row["rag_seconds"] = round(time.monotonic() - start, 2)
            row["hit_count"] = len(hits)
            row["english_answer"] = answer

            start = time.monotonic()
            row["arabic_answer"] = english_to_arabic(answer)
            row["translate_out_seconds"] = round(time.monotonic() - start, 2)
        except Exception as exc:
            row["error"] = f"{type(exc).__name__}: {str(exc)[:200]}"

        row["total_seconds"] = round(time.monotonic() - total_start, 2)
        rows.append(row)
        print(f"{case_id} | {row['total_seconds']:>6}s total "
              f"(in={row.get('translate_in_seconds')} rag={row.get('rag_seconds')} "
              f"out={row.get('translate_out_seconds')}) | "
              f"hits={row.get('hit_count')} | {row.get('error', '')}")

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
