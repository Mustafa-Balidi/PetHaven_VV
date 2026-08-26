#!/usr/bin/env python3
"""Resolve eval keywords -> Knowledge_Base entity IDs. Writes eval/retrieval_ground_truth.json.

The shipped datasets (eval/eval.jsonl, eval/eval_retrieval_supplement.jsonl) carry
expected entity *names*, not IDs. Retrieval metrics need IDs, so this script does a
deterministic lookup against Knowledge_Base. It never guesses:

  EXACT       normalized entity name == keyword
  PAREN       name with its parenthetical stripped == keyword,
              or name starts with "<keyword> ("
  ALIAS       one of the entity's aliases == keyword
  *_WIDE      same three tiers, but searched across every category of that
              animal because the dataset's expected_categories field did not
              contain the entity (two dataset rows have a stale category list)
  OVERRIDE    a keyword that matches several distinct KB entities and is
              disambiguated by an explicit, hand-reviewed entry in _OVERRIDES

Anything that resolves to zero, or to several entities without an override, is
written into the "unresolved" block of the output and is NOT used as gold.

Read-only against Knowledge_Base. Writes one file, eval/retrieval_ground_truth.json.

Usage:
    PYTHONPATH=. python scripts/build_retrieval_ground_truth.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
KB = ROOT / "Knowledge_Base"
CORE_FILE = ROOT / "eval" / "eval.jsonl"
SUPPLEMENT_FILE = ROOT / "eval" / "eval_retrieval_supplement.jsonl"
OUT_FILE = ROOT / "eval" / "retrieval_ground_truth.json"

# Keywords that legitimately match more than one KB entity. Each entry is
# hand-reviewed against the query text and records why the alternatives lose.
_OVERRIDES: dict[tuple[str, str], dict] = {
    ("What is abdominal radiography used for in dogs?", "Radiography"): {
        "id": "DOG_DIA_019",
        "reason": (
            "Query names the abdominal view. The KB splits radiography into "
            "three entities: DOG_DIA_018 Radiography (Thoracic), DOG_DIA_019 "
            "Radiography (Abdominal), DOG_DIA_020 Radiography (Orthopedic)."
        ),
        "alternatives": ["DOG_DIA_018", "DOG_DIA_020"],
    },
}


def _norm(text: str) -> str:
    return " ".join(str(text).lower().split())


def _strip_paren(text: str) -> str:
    return " ".join(re.sub(r"\(.*?\)", " ", text).split())


def _load_kb() -> dict[str, list[dict]]:
    """{animal: [{id, name, category, aliases}, ...]}"""
    index: dict[str, list[dict]] = {}
    for path in sorted(KB.rglob("*.json")):
        parts = path.parts
        if len(parts) < 4:
            continue
        animal, category = parts[-3], parts[-2]
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(data, dict) or not data.get("id") or not data.get("name"):
            continue
        aliases = data.get("aliases") or []
        if not isinstance(aliases, list):
            aliases = [aliases]
        index.setdefault(animal, []).append({
            "id": data["id"],
            "name": data["name"],
            "category": category,
            "aliases": [str(a) for a in aliases if a],
        })
    return index


def _candidates(entries: list[dict], keyword: str) -> tuple[list[dict], str]:
    """First non-empty match tier, plus the tier name."""
    key = _norm(keyword)
    exact: list[dict] = []
    paren: list[dict] = []
    alias: list[dict] = []
    for entry in entries:
        name_n = _norm(entry["name"])
        if name_n == key:
            exact.append(entry)
        elif name_n.startswith(key + " (") or _norm(_strip_paren(name_n)) == key:
            paren.append(entry)
        elif any(_norm(a) == key for a in entry["aliases"]):
            alias.append(entry)
    for tier, found in (("EXACT", exact), ("PAREN", paren), ("ALIAS", alias)):
        if found:
            return found, tier
    return [], "NONE"


def _resolve(kb: dict, query: str, animal: str | None, keyword: str,
             categories: list[str]) -> dict:
    """One keyword -> one gold entity, or an unresolved record."""
    pool = kb.get(animal or "", [])
    scoped = [e for e in pool if e["category"] in categories] if categories else []

    found, tier = _candidates(scoped, keyword)
    if not found:
        found, tier = _candidates(pool, keyword)
        if found:
            tier += "_WIDE"

    override = _OVERRIDES.get((query, keyword))
    if len(found) > 1 and override:
        picked = [e for e in found if e["id"] == override["id"]]
        if picked:
            return {
                "keyword": keyword,
                "id": picked[0]["id"],
                "name": picked[0]["name"],
                "category": picked[0]["category"],
                "resolution": "OVERRIDE",
                "override_reason": override["reason"],
                "alternatives": override["alternatives"],
            }

    if len(found) == 1:
        entry = found[0]
        return {
            "keyword": keyword,
            "id": entry["id"],
            "name": entry["name"],
            "category": entry["category"],
            "resolution": tier,
        }

    return {
        "keyword": keyword,
        "id": None,
        "resolution": "UNRESOLVED",
        "reason": "no KB match" if not found else f"{len(found)} KB matches",
        "candidates": [
            {"id": e["id"], "name": e["name"], "category": e["category"]}
            for e in found
        ],
    }


def _read(path: Path) -> list[dict]:
    if not path.is_file():
        return []
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def main() -> None:
    kb = _load_kb()
    cases: list[dict] = []
    unresolved: list[dict] = []

    for split, path in (("core", CORE_FILE), ("supplement", SUPPLEMENT_FILE)):
        for index, row in enumerate(_read(path), start=1):
            query = row["query"]
            animal = row.get("animal")
            declared = row.get("expected_categories") or []
            gold: list[dict] = []
            misses: list[dict] = []

            for keyword in row.get("expected_keywords") or []:
                record = _resolve(kb, query, animal, keyword, declared)
                if record["id"]:
                    gold.append(record)
                else:
                    misses.append(record)
                    unresolved.append(
                        {"split": split, "index": index, "query": query, **record}
                    )

            cases.append({
                "case_id": f"{split[0].upper()}{index:02d}",
                "split": split,
                "query": query,
                "animal": animal,
                "case_type": row.get("case_type", "standard"),
                "declared_categories": declared,
                "gold_entities": gold,
                "gold_ids": [g["id"] for g in gold],
                "gold_categories": sorted({g["category"] for g in gold}),
                "expects_no_answer": not (row.get("expected_keywords") or []),
                "unresolved_keywords": misses,
            })

    payload = {
        "generated_by": "scripts/build_retrieval_ground_truth.py",
        "sources": {
            "core": "eval/eval.jsonl",
            "supplement": "eval/eval_retrieval_supplement.jsonl",
        },
        "resolution_tiers": ["EXACT", "PAREN", "ALIAS", "*_WIDE", "OVERRIDE"],
        "case_count": len(cases),
        "gold_entity_count": sum(len(c["gold_ids"]) for c in cases),
        "unresolved": unresolved,
        "cases": cases,
    }
    OUT_FILE.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    tiers: dict[str, int] = {}
    for case in cases:
        for gold in case["gold_entities"]:
            tiers[gold["resolution"]] = tiers.get(gold["resolution"], 0) + 1

    print(f"cases            : {len(cases)}")
    print(f"gold entities    : {payload['gold_entity_count']}")
    print(f"resolution tiers : {tiers}")
    print(f"unresolved       : {len(unresolved)}")
    for item in unresolved:
        print(f"  ! {item['query'][:50]!r} / {item['keyword']!r}: {item['reason']}")
    print("wrote eval/retrieval_ground_truth.json")


if __name__ == "__main__":
    main()
