#!/usr/bin/env python3
"""Diagnostic-only audit of cross-reference integrity in the Knowledge Base.

Classifies every {id, name} reference into A-G (see kb_reference_lib.py).
Never modifies any file — use repair_kb_references.py to apply fixes.

Usage:
    python scripts/audit_kb_references.py [--top N] [--out audit.json]
"""
from __future__ import annotations

import argparse
import json
from collections import Counter

from scripts.kb_reference_lib import KB_ROOT, classify_all, load_kb_index


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--top", type=int, default=20,
                        help="how many examples to print per non-exact class")
    parser.add_argument("--out", default="")
    args = parser.parse_args()

    index = load_kb_index()
    print(f"Loaded {len(index.by_id)} entities from {KB_ROOT}")

    results = classify_all(index)
    counts: Counter[str] = Counter(r.cls for r in results)
    total = len(results)

    print("\n=== Reference Integrity Summary ===")
    print(f"Total references            : {total}")
    print(f"A exact OK                  : {counts['A_EXACT_OK']}")
    print(f"B alias OK                  : {counts['B_ALIAS_OK']}")
    print(f"C safe ID mismatch          : {counts['C_SAFE_ID_MISMATCH']}")
    print(f"E ambiguous                 : {counts['E_AMBIGUOUS']}")
    print(f"F missing-ID safe repair    : {counts['F_MISSING_ID_SAFE_REPAIR']}")
    print(f"G missing-ID ambiguous      : {counts['G_MISSING_ID_AMBIGUOUS']}")
    print(f"Unknown field (no auto-fix) : {counts['UNKNOWN_FIELD']}")

    high_confidence = counts["C_SAFE_ID_MISMATCH"] + counts["F_MISSING_ID_SAFE_REPAIR"]
    print(f"\nHigh-confidence auto-fixable: {high_confidence}")

    for cls, label in [
        ("C_SAFE_ID_MISMATCH", "Safe ID mismatches (unique exact match found)"),
        ("F_MISSING_ID_SAFE_REPAIR", "Missing-ID safe repairs (unique exact match found)"),
        ("E_AMBIGUOUS", "Ambiguous (existing wrong ID, no unique replacement)"),
        ("G_MISSING_ID_AMBIGUOUS", "Missing ID, no unique replacement"),
    ]:
        rows = [r for r in results if r.cls == cls]
        print(f"\n=== {label}: {len(rows)} (showing up to {args.top}) ===")
        for r in rows[: args.top]:
            ref = r.ref
            candidates = ", ".join(
                f"{cid}={index.by_id[cid].name}" for cid in r.candidates
            ) or "(none)"
            print(
                f"{ref.owner_id:14} field={ref.field:24} ref_id={ref.ref_id:14} "
                f"claimed='{ref.ref_name}' resolved='{r.resolved_name}' "
                f"candidates=[{candidates}]"
            )

    if args.out:
        rows = [
            {
                "class": r.cls,
                "owner_id": r.ref.owner_id,
                "owner_name": r.ref.owner_name,
                "owner_animal": r.ref.owner_animal,
                "owner_file": str(r.ref.owner_file),
                "field": r.ref.field,
                "ref_id": r.ref.ref_id,
                "ref_name": r.ref.ref_name,
                "resolved_name": r.resolved_name,
                "candidates": list(r.candidates),
                "new_id": r.new_id,
                "reason": r.reason,
            }
            for r in results
            if r.cls != "A_EXACT_OK"
        ]
        with open(args.out, "w", encoding="utf-8") as handle:
            json.dump(rows, handle, indent=2, ensure_ascii=False)
        print(f"\nSaved {len(rows)} non-exact rows to {args.out}")


if __name__ == "__main__":
    main()
