from __future__ import annotations
from RAG_System.indexing.loader import RawEntity

_SINGULAR = {
    "diseases":       "disease",
    "symptoms":       "symptom",
    "medications":    "medication",
    "diagnostics":    "diagnostic",
    "vaccines":       "vaccine",
    "emergency":      "emergency",
    "breeds":         "breed",
    "medical_products": "medical product",
}

_BASE = (("Name", "name"), ("Animal", "animal"), ("Description", "description"))

_FIELDS: dict[str, tuple[tuple[str, str], ...]] = {
    "diseases": (
        ("Affected age groups",      "affected_age_groups"),
        ("Causes",                   "causes"),
        ("Symptoms",                 "symptoms"),
        ("Affected breeds",          "affected_breeds"),
        ("Diagnostics",              "diagnostics"),
        ("Recommended medications",  "recommended_medications"),
        ("Contagious",               "contagious"),
        ("Prevention",               "prevention"),
        ("Differential diagnosis",   "differential_diagnosis"),
    ),
    "symptoms": (
        ("Aliases",                  "aliases"),
        ("Severity",                 "severity_hint"),
        ("Possible diseases",        "possible_diseases"),
        ("Recommended diagnostics",  "recommended_diagnostics"),
        ("Duration relevance",       "duration_relevance"),
    ),
    "medications": (
        ("Related diseases",         "related_diseases"),
        ("Contraindications",        "contraindications"),
        ("Side effects",             "side_effects"),
        ("Warnings",                 "warnings"),
        ("Related products",         "related_medical_products"),
    ),
    "diagnostics": (
        ("Purpose",                  "purpose"),
        ("Sample type",              "sample_type"),
        ("Related diseases",         "related_diseases"),
        ("Notes",                    "notes"),
    ),
    "medical_products": (
        ("Product type",             "product_type"),
        ("Active medications",       "active_medications"),
        ("Related diseases",         "related_diseases"),
        ("Manufacturer",             "manufacturer"),
        ("Usage notes",              "usage_notes"),
        ("Warnings",                 "warnings"),
    ),
    "breeds": (
        ("Aliases",                  "aliases"),
        ("Origin",                   "origin"),
        ("Characteristics",          "characteristics"),
        ("Size",                     "size"),
        ("Weight range",             "weight_range"),
        ("Predisposed diseases",     "predisposed_diseases"),
        ("Notes",                    "notes"),
    ),
    "vaccines": (
        ("Related diseases",         "related_diseases"),
        ("Recommended age",          "recommended_age"),
        ("Booster schedule",         "booster_schedule"),
        ("Warnings",                 "warnings"),
    ),
    "emergency": (
        ("Immediate actions",        "immediate_actions"),
        ("Actions to avoid",         "avoid_actions"),
        ("Vet required",             "vet_required"),
        ("Related diseases",         "related_diseases"),
        ("Related symptoms",         "related_symptoms"),
    ),
}

_SKIP_EXTRA = {"id", "name", "animal", "description", "_metadata"}


def _render(value: object) -> str:

    if value is None:                        
        return ""
    if isinstance(value, bool):
        return "yes" if value else "no"
    if isinstance(value, list):
        rendered = []
        for item in value:
            if item is None:                   
                continue
            if isinstance(item, dict):
                name_or_id = item.get("name") or item.get("id") or ""
                rendered.append(str(name_or_id))
            else:
                rendered.append(str(item))
        return ", ".join(r for r in rendered if r)
    return str(value)

def to_text(entity: RawEntity) -> str:
    """Convert one entity into rich medical text. Never raw JSON."""
    kind = _SINGULAR.get(entity.category, entity.category).capitalize()
    lines = [f"Category: {kind}"]
    used: set[str] = set()

    aliases = entity.data.get("aliases", [])
    if aliases:
        alias_str = (
            ", ".join(aliases) if isinstance(aliases, list) else str(aliases)
        )
        lines.append(f"Also known as: {alias_str}")
        used.add("aliases")

    for label, field in _BASE + _FIELDS.get(entity.category, ()):
        if field in used:
            continue
        value = entity.data.get(field)
        if value is None or value == "" or value == []:
            continue
        lines.append(f"{label}: {_render(value)}")
        used.add(field)

    for key, value in entity.data.items():
        if key in used or key in _SKIP_EXTRA:
            continue
        if isinstance(value, str) and value.strip():
            lines.append(f"{key.replace('_', ' ').capitalize()}: {value}")

    return "\n".join(lines)