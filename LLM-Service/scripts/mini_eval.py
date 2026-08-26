#!/usr/bin/env python3
"""Mini regression evaluation after the post-evaluation grounding fixes.

Covers only what the last full evaluation flagged:
grounding, trim relevance, emergency false positives, Arabic medical names
and HyDE stability. Uses the production pipeline unchanged.

Usage:
    PYTHONPATH=. python scripts/mini_eval.py --out mini_eval.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import uuid
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.config import settings
from RAG_System.llm.generator import _build_llm, _extract_text, _trim_context
from RAG_System.llm.prompt_builder import allowed_entities, build_prompt
from RAG_System.llm.translator import arabic_to_english, english_to_arabic
from RAG_System.retrieval.context_expander import expand
from RAG_System.retrieval.retriever import retrieve

# Categories whose names are real medical entities. `symptoms` and `breeds`
# are excluded: symptom words are ordinary clinical language.
_NAMED_CATEGORIES = {
    "diseases",
    "diagnostics",
    "medications",
    "vaccines",
    "medical_products",
    "emergency",
}

# Names the previous evaluation caught the model inventing, kept even when
# they are not entities in this knowledge base.
_WATCHLIST = [
    "Metronidazole",
    "Carprofen",
    "Meloxicam",
    "Radiography",
    "Ultrasonography",
    "Endoscopy",
    "Gastroenteritis",
    "Serum Biochemistry Profile",
    "Canine Parvovirus",
    "Gastric Dilatation-Volvulus",
]

# Single words that double as ordinary clinical description.
_GENERIC_TERMS = {
    "anemia",
    "dehydration",
    "fever",
    "infection",
    "inflammation",
    "obesity",
    "pain",
}

EMERGENCY_LINE = "This may be a veterinary emergency"

FORBIDDEN_ARABIC = ["القانوي", "القانيني", "الفيروس القانو"]


def _kb_named_entities() -> list[str]:
    """Every named medical entity in the knowledge base, longest name first."""
    names: set[str] = set()
    for path in Path(settings.KNOWLEDGE_BASE_PATH).rglob("*.json"):
        if path.parent.name not in _NAMED_CATEGORIES:
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        name = (data.get("name") or "").strip()
        if name:
            names.add(name)
    names.update(_WATCHLIST)
    return sorted(names, key=len, reverse=True)


_KB_NAMES = _kb_named_entities()


def _mentioned(answer: str, name: str) -> bool:
    return re.search(rf"(?<![A-Za-z]){re.escape(name)}(?![A-Za-z])", answer, re.I) is not None


def _grounding(answer: str, hits) -> tuple[list[str], list[str]]:
    """(named entities found in the answer, entities outside the allow-list)."""
    allowed = allowed_entities(hits)
    # Every name that reached the LLM, whatever its category: a symptom entity
    # named "Diarrhea" grounds the word "Diarrhea" just as well.
    allow_names = {
        n.lower()
        for names in allowed.values()
        for n in names
    }
    # An allowed name may contain a shorter one ("Canine Parvovirus Vaccine"
    # contains "Canine Parvovirus"), so allow substrings of allowed names too.
    found: list[str] = []
    for name in _KB_NAMES:
        if not _mentioned(answer, name):
            continue
        if any(name in existing for existing in found):
            continue
        found.append(name)

    violations: list[str] = []
    soft: list[str] = []
    for name in found:
        lowered = name.lower()
        if lowered in allow_names:
            continue
        if any(lowered in allowed_name for allowed_name in allow_names):
            continue
        # Written in lower case ("hypovolemic shock", "surgical intervention",
        # "diarrhea") the phrase is ordinary clinical description, not a named
        # entity presented as a diagnosis, test or drug.
        hard = [
            match
            for match in re.finditer(
                rf"(?<![A-Za-z]){re.escape(name)}(?![A-Za-z])", answer
            )
            # Capitalisation forced by the start of a line, a bullet or a
            # sentence says nothing about the word being a named entity.
            if not re.search(r"(?:^|[\n\r]\s*[-*\d.]*\s*|[.:!?]\s+)$",
                             answer[: match.start()])
        ]
        if not hard:
            soft.append(name)
            continue
        violations.append(name)
    return found, violations, soft


def _evidence(hits) -> list[str]:
    return [
        f"{(h.metadata or {}).get('category')}:{(h.metadata or {}).get('name')}"
        for h in hits
    ]


def _pipeline(question: str, animal: str | None, llm):
    raw = retrieve(question, animal=animal)
    retrieved_ids = {h.id for h in raw}
    hits = (
        _trim_context(expand(raw, animal=animal), retrieved_ids=retrieved_ids)
        if raw
        else []
    )
    prompt = build_prompt(question, hits, history=None)
    start = time.monotonic()
    answer = _extract_text(llm.invoke(prompt))
    return answer, hits, round(time.monotonic() - start, 2)


CASES = [
    ("TEST1_enough", "My dog has been vomiting since yesterday, has diarrhea, "
                     "refuses food, and is very tired.", "dog"),
    ("TEST2_hematemesis", "My dog is vomiting blood.", "dog"),
    ("TEST3_gdv", "My dog keeps trying to vomit but nothing comes out, "
                  "his abdomen is swollen and he is very restless.", "dog"),
    ("TEST4_non_emergency", "My dog vomited once but is otherwise acting "
                            "normally.", "dog"),
    ("TEST5_one_symptom", "My dog is vomiting.", "dog"),
]

CAT_QUERY = "My cat has not eaten for two days and is becoming weak."

ARABIC_CASES = [
    ("TEST7_ar_parvo", "ما هو فيروس بارفو الكلاب؟", None),
    ("TEST8_ar_symptoms",
     "كلبي يتقيأ منذ البارحة وعنده إسهال ولا يريد الأكل وهو خامل جداً.", "dog"),
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="mini_eval.json")
    parser.add_argument("--only", default="", help="comma-separated case ids")
    args = parser.parse_args()
    only = {c.strip() for c in args.only.split(",") if c.strip()}

    llm = _build_llm()
    rows: list[dict] = []

    for case_id, question, animal in CASES:
        if only and case_id not in only:
            continue
        answer, hits, latency = _pipeline(question, animal, llm)
        found, violations, soft = _grounding(answer, hits)
        row = {
            "case": case_id,
            "question": question,
            "evidence": _evidence(hits),
            "answer": answer,
            "named_entities": found,
            "violations": violations,
            "soft_mentions": soft,
            "emergency": EMERGENCY_LINE in answer,
            "latency": latency,
        }
        rows.append(row)
        print(f"\n{'='*70}\n{case_id}  ({latency}s)\n{'='*70}")
        print("FINAL EVIDENCE TO LLM:")
        for item in row["evidence"]:
            print(f"  - {item}")
        print(f"\nEMERGENCY WARNING: {row['emergency']}")
        print(f"NAMED ENTITIES   : {found}")
        print(f"VIOLATIONS       : {violations or 'none'}")
        print(f"SOFT MENTIONS    : {soft or 'none'}")
        print(f"\n--- ANSWER ---\n{answer}")

    # ── HyDE stability ────────────────────────────────────────────────────
    if not only or "TEST6_hyde" in only:
        print(f"\n{'='*70}\nTEST6_hyde — 3 runs\n{'='*70}")
        runs = []
        for run in range(1, 4):
            hits = retrieve(CAT_QUERY, animal="cat")
            top = _evidence(hits)[:5]
            runs.append(top)
            print(f"run {run}: {top}")
        rows.append({"case": "TEST6_hyde", "question": CAT_QUERY, "runs": runs})
        print(f"stable (order): {all(r == runs[0] for r in runs)}")
        print(f"stable (set)  : {all(set(r) == set(runs[0]) for r in runs)}")

    # ── Arabic ────────────────────────────────────────────────────────────
    for case_id, question, animal in ARABIC_CASES:
        if only and case_id not in only:
            continue
        english_question = arabic_to_english(question)
        english_answer, hits, _ = _pipeline(english_question, animal, llm)
        arabic_answer = english_to_arabic(english_answer)
        found, violations, soft = _grounding(english_answer, hits)
        bad_arabic = [w for w in FORBIDDEN_ARABIC if w in arabic_answer]
        rows.append({
            "case": case_id,
            "question": question,
            "english_question": english_question,
            "evidence": _evidence(hits),
            "english_answer": english_answer,
            "answer": arabic_answer,
            "named_entities": found,
            "violations": violations,
            "soft_mentions": soft,
            "forbidden_arabic": bad_arabic,
        })
        print(f"\n{'='*70}\n{case_id}\n{'='*70}")
        print(f"EN QUESTION: {english_question}")
        print("FINAL EVIDENCE TO LLM:")
        for item in _evidence(hits):
            print(f"  - {item}")
        print(f"VIOLATIONS       : {violations or 'none'}")
        print(f"FORBIDDEN ARABIC : {bad_arabic or 'none'}")
        print(f"\n--- EN ---\n{english_answer}")
        print(f"\n--- AR ---\n{arabic_answer}")

    conversation_id = str(uuid.uuid4())  # noqa: F841 — history untouched here

    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
