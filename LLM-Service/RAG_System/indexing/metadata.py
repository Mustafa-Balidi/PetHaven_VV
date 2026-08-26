"""Extract rich ChromaDB metadata from entities.

Base fields (id, name, animal, category) always present.
animal normalized from folder (lowercase) so retrieval filters
like animal="bird" always match.
Relationship IDs stored as comma-separated strings so the
context_expander can fetch linked entities directly by ID.
"""
from __future__ import annotations

from RAG_System.indexing.loader import RawEntity, folder_location


def extract(entity: RawEntity) -> dict[str, str]:
    """Build the full metadata dict for one entity."""
    data = entity.data
    folder_animal, _ = folder_location(entity.path)
    meta: dict[str, str] = {
        "id":       entity.id,
        "name":     entity.name,
        "animal":   folder_animal.lower(),
        "category": entity.category,
    }

    aliases = data.get("aliases")
    if aliases:
        alias_str = (
            ", ".join(aliases) if isinstance(aliases, list) else str(aliases)
        )
        _set(meta, "aliases", alias_str)

    category = entity.category

    if category == "symptoms":
        _set(meta, "severity_hint",          data.get("severity_hint", ""))
        meta["has_emergency"] =              _bool(data, "emergency")
        _set(meta, "related_disease_ids",    _ids(data.get("possible_diseases")))
        _set(meta, "related_diagnostic_ids", _ids(data.get("recommended_diagnostics")))
        _set(meta, "emergency_ids",          _ids(data.get("emergency")))

    elif category == "diseases":
        meta["contagious"] =               _bool(data, "contagious")
        _set(meta, "related_symptom_ids",    _ids(data.get("symptoms")))
        _set(meta, "related_medication_ids", _ids(data.get("recommended_medications")))
        _set(meta, "related_diagnostic_ids", _ids(data.get("diagnostics")))
        _set(meta, "related_vaccine_ids",    _ids(data.get("vaccines")))
        _set(meta, "related_product_ids",    _ids(data.get("medical_products")))
        _set(meta, "related_emergency_ids",  _ids(data.get("emergency")))
        _set(meta, "related_breed_ids",      _ids(data.get("affected_breeds")))

    elif category == "medications":
        _set(meta, "related_disease_ids",  _ids(data.get("related_diseases")))
        _set(meta, "related_product_ids",  _ids(data.get("related_medical_products")))

    elif category == "medical_products":
        _set(meta, "related_disease_ids",    _ids(data.get("related_diseases")))
        _set(meta, "related_medication_ids", _ids(data.get("active_medications")))

    elif category == "vaccines":
        _set(meta, "related_disease_ids", _ids(data.get("related_diseases")))

    elif category == "emergency":
        meta["vet_required"] =            _bool(data, "vet_required")
        _set(meta, "related_disease_ids", _ids(data.get("related_diseases")))
        _set(meta, "related_symptom_ids", _ids(data.get("related_symptoms")))

    elif category == "diagnostics":
        _set(meta, "sample_type",          data.get("sample_type", ""))
        _set(meta, "related_disease_ids",  _ids(data.get("related_diseases")))

    elif category == "breeds":
        _set(meta, "size",                data.get("size", ""))
        _set(meta, "related_disease_ids", _ids(data.get("predisposed_diseases")))

    return meta


# ── helpers ─────────────────────────────────────────────────────────────────


def _set(meta: dict[str, str], key: str, value: str) -> None:
    """Store only non-empty values. Never store ''."""
    if value:
        meta[key] = value


def _ids(items: list | None) -> str:
    """[{id, name}, ...] → comma-separated IDs.
    
    ✅ الإصلاح: item.get("id") يتخطى null و "" تلقائياً.
    كان: "id" in item  ← True حتى لو id=null → يُدرج None في الـ join
    الآن: item.get("id") ← None و "" كلاهما falsy → يُتخطَّيان
    """
    if not items:
        return ""
    return ",".join(
        item["id"]
        for item in items
        if isinstance(item, dict) and item.get("id")   # ← السطر الوحيد المتغير
    )


def _bool(data: dict, field: str) -> str:
    """Boolean filter fields are always stored, even when false."""
    return "true" if data.get(field) else "false"