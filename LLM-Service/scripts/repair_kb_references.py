#!/usr/bin/env python3
"""Apply HIGH-confidence, unique-match reference fixes to the Knowledge Base.

Only two classes from kb_reference_lib are ever touched:
  C_SAFE_ID_MISMATCH        - existing ID resolves to the wrong entity, but
                              exactly one entity in the same animal+expected
                              category matches the claimed name/alias.
  F_MISSING_ID_SAFE_REPAIR  - the ID does not exist at all, but exactly one
                              entity matches the claimed name/alias.

Everything else (ambiguous, unknown field, alias-ok, exact-ok, missing with
0 or >1 candidates) is left untouched and only reported.

Each fix changes exactly one "id" value inside one {id, name} object. Names,
descriptions, list lengths, and every other field are left byte-for-byte
identical. Original line endings are preserved.

Usage:
    python scripts/repair_kb_references.py --dry-run
    python scripts/repair_kb_references.py --apply
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

from scripts.kb_reference_lib import (
    Classification,
    classify_all,
    load_kb_index,
)

MANIFEST_PATH = Path("reports/kb_reference_repair_manifest.json")

FIXABLE_CLASSES = {"C_SAFE_ID_MISMATCH", "F_MISSING_ID_SAFE_REPAIR"}


# =============================================================================
# Minimal-diff, field-scoped text editing
# =============================================================================

def _find_array_span(text: str, field_name: str) -> tuple[int, int] | None:
    """Byte range of `"field_name": [ ... ]` (brackets included), quote-aware."""
    key_pattern = re.compile(r'"' + re.escape(field_name) + r'"\s*:\s*\[')
    match = key_pattern.search(text)
    if not match:
        return None

    start = match.end() - 1  # position of '['
    depth = 0
    in_string = False
    escape = False
    i = start

    while i < len(text):
        ch = text[i]
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
        else:
            if ch == '"':
                in_string = True
            elif ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    return start, i + 1
        i += 1

    return None


def _apply_field_fixes(
    field_text: str,
    fixes: list[tuple[str, str, str]],  # (old_id, ref_name, new_id)
) -> tuple[str, list[str]]:
    """Replace each (old_id, ref_name) -> new_id inside one field's array text.

    Returns (new_field_text, failures) where failures names triples whose
    occurrence count in the text did not match the expected count (never
    partially applied in that case).
    """
    expected_counts = Counter(fixes)
    failures: list[str] = []

    for (old_id, ref_name, new_id), expected in expected_counts.items():
        pattern = re.compile(
            r'("id"\s*:\s*")' + re.escape(old_id) + r'("\s*,\s*"name"\s*:\s*"'
            + re.escape(ref_name) + r'")'
        )
        found = len(pattern.findall(field_text))
        if found != expected:
            failures.append(
                f"{old_id}|{ref_name}|{new_id}: expected {expected} occurrence(s), found {found}"
            )
            continue
        field_text = pattern.sub(r"\g<1>" + new_id + r"\g<2>", field_text)

    return field_text, failures


def apply_fixes_to_file(
    path: Path,
    owner_id: str,
    fixes_by_field: dict[str, list[tuple[str, str, str]]],
) -> tuple[bool, str]:
    """Apply every fix for one file. All-or-nothing per file.

    Returns (success, message).
    """
    original_text = path.read_text(encoding="utf-8", newline="")

    try:
        original_json = json.loads(original_text)
    except Exception as exc:
        return False, f"original JSON does not parse: {exc}"

    text = original_text
    all_failures: list[str] = []

    for field_name, fixes in fixes_by_field.items():
        span = _find_array_span(text, field_name)
        if span is None:
            all_failures.append(f"field '{field_name}' not found as an array")
            continue

        field_text = text[span[0]: span[1]]
        new_field_text, failures = _apply_field_fixes(field_text, fixes)
        all_failures.extend(f"{field_name}: {f}" for f in failures)
        text = text[: span[0]] + new_field_text + text[span[1]:]

    if all_failures:
        return False, "; ".join(all_failures)

    try:
        new_json = json.loads(text)
    except Exception as exc:
        return False, f"result JSON does not parse: {exc}"

    if new_json.get("id") != original_json.get("id"):
        return False, "top-level id changed — aborted"

    for field_name in fixes_by_field:
        old_len = len(original_json.get(field_name, []))
        new_len = len(new_json.get(field_name, []))
        if old_len != new_len:
            return False, f"field '{field_name}' length changed ({old_len} -> {new_len}) — aborted"

    path.write_text(text, encoding="utf-8", newline="")
    return True, "ok"


# =============================================================================
# Main
# =============================================================================

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--examples", type=int, default=30)
    args = parser.parse_args()

    if not args.apply:
        args.dry_run = True

    index = load_kb_index()
    results = classify_all(index)
    counts = Counter(r.cls for r in results)

    total = len(results)
    print("=== Classification ===")
    print(f"Total references            : {total}")
    print(f"A exact OK                  : {counts['A_EXACT_OK']}")
    print(f"B alias OK                  : {counts['B_ALIAS_OK']}")
    print(f"C safe ID mismatch          : {counts['C_SAFE_ID_MISMATCH']}")
    print(f"E ambiguous                 : {counts['E_AMBIGUOUS']}")
    print(f"F missing-ID safe repair    : {counts['F_MISSING_ID_SAFE_REPAIR']}")
    print(f"G missing-ID ambiguous      : {counts['G_MISSING_ID_AMBIGUOUS']}")
    print(f"Unknown field (no auto-fix) : {counts['UNKNOWN_FIELD']}")

    fixable: list[Classification] = [r for r in results if r.cls in FIXABLE_CLASSES]
    print(f"\nTotal HIGH-confidence fixes to apply: {len(fixable)}")

    print(f"\n=== First {min(args.examples, len(fixable))} planned fixes ===")
    for r in fixable[: args.examples]:
        ref = r.ref
        resolved_desc = r.resolved_name if r.resolved_name else "(missing ID)"
        new_name = index.by_id[r.new_id].name if r.new_id in index.by_id else "?"
        print(
            f"{ref.owner_id}\n"
            f"  field: {ref.field}\n"
            f"  old  : {ref.ref_id} -> {resolved_desc}\n"
            f"  claimed: {ref.ref_name}\n"
            f"  new  : {r.new_id} -> {new_name}\n"
            f"  reason: {r.reason}\n"
        )

    files_by_path: dict[Path, dict[str, list[tuple[str, str, str]]]] = defaultdict(
        lambda: defaultdict(list)
    )
    owner_id_by_path: dict[Path, str] = {}

    for r in fixable:
        ref = r.ref
        files_by_path[ref.owner_file][ref.field].append(
            (ref.ref_id, ref.ref_name, r.new_id)
        )
        owner_id_by_path[ref.owner_file] = ref.owner_id

    print(f"\nFiles that WOULD change: {len(files_by_path)}")
    print(f"Total replacements: {len(fixable)}")

    if args.dry_run and not args.apply:
        print("\nDry run only — no files modified. Re-run with --apply to write changes.")
        return

    manifest: list[dict] = []
    applied = 0
    failed_files: list[tuple[Path, str]] = []

    for path, fixes_by_field in files_by_path.items():
        owner_id = owner_id_by_path[path]
        success, message = apply_fixes_to_file(path, owner_id, dict(fixes_by_field))

        if not success:
            failed_files.append((path, message))
            continue

        applied += sum(len(v) for v in fixes_by_field.values())
        for field_name, triples in fixes_by_field.items():
            for old_id, ref_name, new_id in triples:
                manifest.append({
                    "owner_id": owner_id,
                    "owner_file": str(path),
                    "field": field_name,
                    "claimed_name": ref_name,
                    "old_id": old_id,
                    "old_resolved_name": index.by_id[old_id].name if old_id in index.by_id else None,
                    "new_id": new_id,
                    "new_resolved_name": index.by_id[new_id].name if new_id in index.by_id else None,
                    "reason": "UNIQUE_EXACT_MATCH",
                    "confidence": "HIGH",
                })

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2, ensure_ascii=False)

    print(f"\n=== Apply results ===")
    print(f"Files changed      : {len(files_by_path) - len(failed_files)}")
    print(f"Replacements applied: {applied}")
    print(f"Files failed        : {len(failed_files)}")
    for path, message in failed_files:
        print(f"  FAILED {path}: {message}")
    print(f"Manifest written to: {MANIFEST_PATH} ({len(manifest)} entries)")


if __name__ == "__main__":
    main()
