"""Deterministic classifier for cross-reference integrity in the Knowledge Base.

Shared by scripts/audit_kb_references.py (report only) and
scripts/repair_kb_references.py (dry-run / apply HIGH-confidence fixes).

No LLM involved anywhere in this module — every classification is a plain
string comparison after normalization, or an exact-match search scoped to
the same animal + expected category.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from RAG_System.config import settings

KB_ROOT = Path(settings.KNOWLEDGE_BASE_PATH)


# =============================================================================
# Field -> expected category
# =============================================================================

# Every list-of-{id,name} field actually used in this Knowledge Base (verified
# by scanning all 4046 entities). A field not in this map gets no auto-fix,
# regardless of how confident the name match looks.
FIELD_TO_CATEGORY: dict[str, str] = {
    "symptoms":                 "symptoms",
    "related_symptoms":         "symptoms",
    "diagnostics":               "diagnostics",
    "recommended_diagnostics":   "diagnostics",
    "possible_diseases":         "diseases",
    "related_diseases":          "diseases",
    "predisposed_diseases":      "diseases",
    "recommended_medications":   "medications",
    "active_medications":        "medications",
    "medical_products":          "medical_products",
    "related_medical_products":  "medical_products",
    "vaccines":                  "vaccines",
    "emergency":                 "emergency",
    "affected_breeds":           "breeds",
}


# A few explicit, unambiguous naming variants observed in the audit. Kept
# intentionally tiny — this is NOT a general medical synonym dictionary.
# Used only to recognise that a reference is already correct (class B),
# never invented to justify a fix.
MANUAL_ALIAS_PAIRS: list[tuple[str, str]] = [
    ("blood in urine", "hematuria"),
    ("vomiting blood", "hematemesis"),
    ("cbc", "complete blood count"),
    ("gdv", "gastric dilatation volvulus"),
]


def normalize(name: str) -> str:
    """lowercase, drop styling punctuation, collapse whitespace.

    Word order and every medical word (abdominal, orthopedic, cardiac, ...)
    are preserved — only case and cosmetic punctuation are stripped, so
    'Radiography (Abdominal)' and 'radiography abdominal' compare equal but
    'Radiography (Abdominal)' and 'Abdominal Radiography' do not.
    """
    text = name.lower()
    text = re.sub(r"[()/,.\-]", " ", text)
    return " ".join(text.split())


def _alias_equivalents(norm_name: str) -> set[str]:
    """norm_name plus any manual-alias partner, both directions."""
    out = {norm_name}
    for a, b in MANUAL_ALIAS_PAIRS:
        if norm_name == a:
            out.add(b)
        elif norm_name == b:
            out.add(a)
    return out


# =============================================================================
# Entity index
# =============================================================================

@dataclass(frozen=True)
class Entity:
    id: str
    name: str
    animal: str
    category: str
    path: Path
    aliases: tuple[str, ...] = ()


@dataclass
class KBIndex:
    by_id: dict[str, Entity]
    # (animal, category, normalized_variant) -> set of entity ids
    by_name: dict[tuple[str, str, str], set[str]]


def load_kb_index() -> KBIndex:
    by_id: dict[str, Entity] = {}

    for path in KB_ROOT.rglob("*.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(data, dict) or not data.get("id"):
            continue

        aliases_raw = data.get("aliases") or []
        if isinstance(aliases_raw, str):
            aliases_raw = [aliases_raw]
        aliases = tuple(str(a) for a in aliases_raw if a)

        # category = parent folder name (diseases, symptoms, ...), matches
        # RAG_System.indexing.metadata / loader conventions.
        category = path.parent.name
        animal = data.get("animal", path.parent.parent.name).lower()

        by_id[data["id"]] = Entity(
            id=data["id"],
            name=data.get("name", ""),
            animal=animal,
            category=category,
            path=path,
            aliases=aliases,
        )

    by_name: dict[tuple[str, str, str], set[str]] = {}

    for entity in by_id.values():
        variants = {normalize(entity.name)}
        for alias in entity.aliases:
            variants.add(normalize(alias))
        # Manual-alias closure, e.g. registers "cbc" for an entity literally
        # named "Complete Blood Count (...)".
        expanded: set[str] = set()
        for variant in variants:
            expanded |= _alias_equivalents(variant)
        variants |= expanded

        for variant in variants:
            if not variant:
                continue
            key = (entity.animal, entity.category, variant)
            by_name.setdefault(key, set()).add(entity.id)

    return KBIndex(by_id=by_id, by_name=by_name)


# =============================================================================
# Reference occurrences
# =============================================================================

@dataclass
class Reference:
    owner_id: str
    owner_name: str
    owner_animal: str
    owner_file: Path
    field: str
    ref_id: str
    ref_name: str


def iter_references() -> list[Reference]:
    refs: list[Reference] = []

    for path in KB_ROOT.rglob("*.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(data, dict) or not data.get("id"):
            continue

        owner_animal = data.get("animal", path.parent.parent.name).lower()

        for field_name, value in data.items():
            if not isinstance(value, list):
                continue
            for item in value:
                if not isinstance(item, dict):
                    continue
                ref_id = item.get("id")
                ref_name = item.get("name")
                if not ref_id or not ref_name:
                    continue
                refs.append(Reference(
                    owner_id=data["id"],
                    owner_name=data.get("name", ""),
                    owner_animal=owner_animal,
                    owner_file=path,
                    field=field_name,
                    ref_id=ref_id,
                    ref_name=ref_name,
                ))

    return refs


# =============================================================================
# Classification result
# =============================================================================

@dataclass
class Classification:
    ref: Reference
    cls: str  # A_EXACT_OK | B_ALIAS_OK | C_SAFE_ID_MISMATCH | D_* | E_AMBIGUOUS
              # | F_MISSING_ID_SAFE_REPAIR | G_MISSING_ID_AMBIGUOUS
              # | UNKNOWN_FIELD
    resolved_name: str | None = None
    candidates: tuple[str, ...] = ()
    new_id: str | None = None
    reason: str = ""


def classify(ref: Reference, index: KBIndex) -> Classification:
    expected_category = FIELD_TO_CATEGORY.get(ref.field)

    resolved = index.by_id.get(ref.ref_id)
    ref_norm = normalize(ref.ref_name)

    if resolved is not None:
        resolved_norm = normalize(resolved.name)

        if ref_norm == resolved_norm:
            return Classification(ref, "A_EXACT_OK", resolved_name=resolved.name)

        resolved_aliases_norm = {normalize(a) for a in resolved.aliases}
        resolved_aliases_norm |= _alias_equivalents(resolved_norm)

        if ref_norm in resolved_aliases_norm:
            return Classification(ref, "B_ALIAS_OK", resolved_name=resolved.name)

    # From here the ID is either missing or resolves to something else.
    if expected_category is None:
        return Classification(
            ref, "UNKNOWN_FIELD",
            resolved_name=resolved.name if resolved else None,
            reason=f"field '{ref.field}' not in FIELD_TO_CATEGORY",
        )

    key = (ref.owner_animal, expected_category, ref_norm)
    candidates = index.by_name.get(key, set())
    # Never "fix" a reference back onto the ID it already has.
    candidates = candidates - {ref.ref_id}

    if resolved is None:
        if len(candidates) == 1:
            return Classification(
                ref, "F_MISSING_ID_SAFE_REPAIR",
                candidates=tuple(candidates),
                new_id=next(iter(candidates)),
                reason="UNIQUE_EXACT_MATCH",
            )
        return Classification(
            ref, "G_MISSING_ID_AMBIGUOUS",
            candidates=tuple(candidates),
            reason="NO_UNIQUE_MATCH" if candidates else "ZERO_CANDIDATES",
        )

    if len(candidates) == 1:
        return Classification(
            ref, "C_SAFE_ID_MISMATCH",
            resolved_name=resolved.name,
            candidates=tuple(candidates),
            new_id=next(iter(candidates)),
            reason="UNIQUE_EXACT_MATCH",
        )

    return Classification(
        ref, "E_AMBIGUOUS",
        resolved_name=resolved.name,
        candidates=tuple(candidates),
        reason="NO_UNIQUE_MATCH" if candidates else "ZERO_CANDIDATES",
    )


def classify_all(index: KBIndex | None = None) -> list[Classification]:
    index = index or load_kb_index()
    return [classify(ref, index) for ref in iter_references()]
