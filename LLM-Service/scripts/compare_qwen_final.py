#!/usr/bin/env python3
"""Final cheap Qwen 9B vs 27B check: follow-up + Arabic. Diagnostic only.

Run once per candidate in a fresh process:

    LLM_MODEL=qwen/qwen3.5-9b PYTHONPATH=. python scripts/compare_qwen_final.py --label 9b
"""
from __future__ import annotations

import argparse
import json
import time
import uuid

from RAG_System.config import settings
from RAG_System.llm.generator import answer_with_hits
from RAG_System.llm.translator import arabic_to_english, english_to_arabic

TURNS = [
    "My dog is vomiting.",
    "It started yesterday. He also has diarrhea, stopped eating and is very tired.",
]

ARABIC = "كلبي يتقيأ منذ البارحة وعنده إسهال ولا يريد الأكل وهو خامل جداً."


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    parser.add_argument("--out", default="qwen_final.json")
    args = parser.parse_args()

    print("model:", settings.LLM_MODEL)
    rows: list[dict] = []

    conversation_id = f"{args.label}-final-{uuid.uuid4()}"
    for index, question in enumerate(TURNS, start=1):
        start = time.monotonic()
        answer, hits = answer_with_hits(
            question, animal="dog", conversation_id=conversation_id
        )
        latency = round(time.monotonic() - start, 2)
        rows.append({"case": f"CASE3_turn{index}", "latency": latency,
                     "hits": len(hits), "answer": answer})
        print(f"=== CASE3 turn{index} lat={latency}s hits={len(hits)} chars={len(answer)}")
        print(answer[:900].replace("\n", " | "))

    row: dict = {"case": "CASE4_arabic"}
    total = time.monotonic()
    start = time.monotonic()
    english_question = arabic_to_english(ARABIC)
    row["translate_in"] = round(time.monotonic() - start, 2)

    start = time.monotonic()
    answer, hits = answer_with_hits(
        english_question, animal="dog",
        conversation_id=f"{args.label}-ar-{uuid.uuid4()}",
    )
    row["rag"] = round(time.monotonic() - start, 2)
    row["hits"] = len(hits)
    row["english_answer"] = answer

    start = time.monotonic()
    row["arabic_answer"] = english_to_arabic(answer)
    row["translate_out"] = round(time.monotonic() - start, 2)
    row["latency"] = round(time.monotonic() - total, 2)
    rows.append(row)

    print(f"=== CASE4 total={row['latency']}s (in={row['translate_in']} "
          f"rag={row['rag']} out={row['translate_out']}) hits={row['hits']}")
    print(row["arabic_answer"][:900].replace("\n", " | "))

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
