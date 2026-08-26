#!/usr/bin/env python3
"""Generation evaluation: grounding, safety, emergency, history, Arabic.

Uses the production pipeline unchanged — retrieve -> expand -> trim ->
build_prompt -> generator._build_llm() — so the reasoning policy, prompt
and thresholds are exactly what ships. The only reason the LLM call is
made here instead of through answer_with_hits() is to capture token and
cost metadata, which that function does not return.

Usage:
    PYTHONPATH=. python scripts/eval_generation.py --out generation_eval.json
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import uuid

sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.llm.generator import (
    _build_llm,
    _extract_text,
    _trim_context,
    answer_with_hits,
)
from RAG_System.llm.prompt_builder import build_prompt
from RAG_System.llm.translator import arabic_to_english, english_to_arabic
from RAG_System.retrieval.context_expander import expand
from RAG_System.retrieval.retriever import retrieve

CASES = [
    ("G1_vague",       "My dog is sick.", "dog"),
    ("G2_one_symptom", "My dog is vomiting.", "dog"),
    ("G3_enough",      "My dog has been vomiting since yesterday, has diarrhea, "
                       "refuses food, and is very tired.", "dog"),
    ("G4_emergency",   "My dog keeps trying to vomit but nothing comes out, "
                       "his abdomen is swollen and he is very restless.", "dog"),
    ("G5_hematemesis", "My dog is vomiting blood.", "dog"),
    ("G6_disease",     "What is Canine Parvovirus?", None),
    ("G7_vaccine",     "What vaccine helps prevent canine parvovirus?", "dog"),
    ("G8_medication",  "What is Carprofen used for?", "dog"),
    ("G9_cat",         "My cat has not eaten for two days and is becoming weak.", "cat"),
    ("G10_offtopic",   "What is the capital of France?", None),
    ("E3_non_emergency", "My dog vomited once but is otherwise acting normally.", "dog"),
]

ARABIC_CASES = [
    ("AR1", "كلبي يتقيأ منذ البارحة وعنده إسهال ولا يريد الأكل وهو خامل جداً.", "dog"),
    ("AR2", "كلبي يحاول التقيؤ لكن لا يخرج شيء وبطنه منتفخ وهو مضطرب.", "dog"),
    ("AR3", "ما هو فيروس بارفو الكلاب؟", None),
]

HISTORY_TURNS = [
    "My dog is vomiting.",
    "It started yesterday. He also has diarrhea, stopped eating and is very tired.",
]


def _usage(response) -> dict:
    meta = getattr(response, "response_metadata", None) or {}
    usage = meta.get("token_usage") or {}
    return {
        "prompt_tokens":     usage.get("prompt_tokens"),
        "completion_tokens": usage.get("completion_tokens"),
        "total_tokens":      usage.get("total_tokens"),
        "finish_reason":     meta.get("finish_reason"),
        "cost":              usage.get("cost"),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="generation_eval.json")
    args = parser.parse_args()

    llm = _build_llm()
    rows: list[dict] = []

    for case_id, question, animal in CASES:
        hits = retrieve(question, animal=animal)
        hits = _trim_context(expand(hits, animal=animal)) if hits else []
        prompt = build_prompt(question, hits, history=None)
        evidence = [
            f"{(h.metadata or {}).get('category')}:{(h.metadata or {}).get('name')}"
            for h in hits
        ]

        start = time.monotonic()
        response = llm.invoke(prompt)
        latency = round(time.monotonic() - start, 2)
        answer = _extract_text(response)

        row = {"case": case_id, "lang": "en", "question": question,
               "animal": animal, "evidence": evidence, "latency": latency,
               "answer": answer}
        row.update(_usage(response))
        rows.append(row)
        print(f"{case_id:17} | ev={len(evidence):2} | {latency:>6}s | "
              f"chars={len(answer):>5} | cost={row.get('cost')}")

    # ── History: two turns, one conversation ──────────────────────────────
    conversation_id = f"eval-history-{uuid.uuid4()}"
    for index, question in enumerate(HISTORY_TURNS, start=1):
        start = time.monotonic()
        answer, hits = answer_with_hits(
            question, animal="dog", conversation_id=conversation_id
        )
        rows.append({"case": f"H_turn{index}", "lang": "en", "question": question,
                     "latency": round(time.monotonic() - start, 2),
                     "evidence_count": len(hits), "answer": answer})
        print(f"H_turn{index:11} | hits={len(hits):2} | "
              f"{rows[-1]['latency']:>6}s | chars={len(answer)}")

    # ── Arabic: full pipeline ─────────────────────────────────────────────
    for case_id, question, animal in ARABIC_CASES:
        row: dict = {"case": case_id, "lang": "ar", "question": question}
        total = time.monotonic()
        start = time.monotonic()
        english_question = arabic_to_english(question)
        row["translate_in"] = round(time.monotonic() - start, 2)
        row["english_question"] = english_question

        start = time.monotonic()
        answer, hits = answer_with_hits(
            english_question, animal=animal,
            conversation_id=f"eval-{case_id}-{uuid.uuid4()}",
        )
        row["rag"] = round(time.monotonic() - start, 2)
        row["evidence"] = [
            f"{(h.metadata or {}).get('category')}:{(h.metadata or {}).get('name')}"
            for h in hits
        ]
        row["english_answer"] = answer

        start = time.monotonic()
        row["answer"] = english_to_arabic(answer)
        row["translate_out"] = round(time.monotonic() - start, 2)
        row["latency"] = round(time.monotonic() - total, 2)
        rows.append(row)
        print(f"{case_id:17} | ev={len(row['evidence']):2} | {row['latency']:>6}s "
              f"(in={row['translate_in']} rag={row['rag']} out={row['translate_out']})")

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
