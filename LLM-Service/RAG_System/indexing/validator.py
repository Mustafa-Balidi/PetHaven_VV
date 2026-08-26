
from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from RAG_System.config import settings
from RAG_System.indexing.loader import RawEntity, folder_location

logger = logging.getLogger(__name__)

ID_PATTERN = re.compile(r"^[A-Z]+_[A-Z]+_\d+$", re.IGNORECASE)

REQUIRED_FIELDS = ("id", "name", "animal", "description")

EXPECTED_FIELDS = {
    "diseases": ("affected_age_groups", "causes", "symptoms", "contagious"),
    "symptoms": ("possible_diseases", "severity_hint"),
    "medications": ("related_diseases", "side_effects", "contraindications"),
    "medical_products": ("product_type", "related_diseases"),
    "breeds": ("characteristics", "size"),
    "diagnostics": ("purpose", "related_diseases"),
    "vaccines":  ("related_diseases", "recommended_age", "booster_schedule"),
    "emergency": ("immediate_actions", "avoid_actions", "vet_required"),
}


@dataclass(frozen=True)
class ValidationResult:
    """Outcome of validating one entity."""

    valid: bool
    errors: tuple[str, ...] = ()
    warnings: tuple[str, ...] = ()


def validate(entity: RawEntity) -> ValidationResult:
    """Validate one entity. Missing expected fields = warning only."""
    errors = []
    warnings = []
    data = entity.data

    for field_name in REQUIRED_FIELDS:
        value = data.get(field_name)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"missing/empty required field: {field_name}")

    folder_animal, folder_category = folder_location(entity.path)

    animal = data.get("animal")
    if isinstance(animal, str) and animal.strip():
        animal_lower = animal.lower()
        if animal_lower not in settings.SUPPORTED_ANIMALS:
            errors.append(f"unsupported animal: {animal}")
        elif animal_lower != folder_animal.lower():
            errors.append(f"animal '{animal}' != folder '{folder_animal}'")

    if entity.category not in settings.SUPPORTED_CATEGORIES:
        errors.append(f"unsupported category folder: {entity.category}")
    elif folder_category != entity.category:
        errors.append(
            f"folder category '{folder_category}' != entity.category '{entity.category}'"
        )

    entity_id = data.get("id")
    if isinstance(entity_id, str) and not ID_PATTERN.match(entity_id):
        errors.append(f"bad id format: {entity_id}")

    for field_name in EXPECTED_FIELDS.get(entity.category, ()):
        if field_name not in data:
            warnings.append(f"missing expected field: {field_name}")

    if warnings:
        logger.warning("Validation warnings for %s: %s", data.get("id"), warnings)

    return ValidationResult(valid=not errors, errors=tuple(errors), warnings=tuple(warnings))