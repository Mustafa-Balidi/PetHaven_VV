"""اختبارات validator.py — مع vaccines و emergency في EXPECTED_FIELDS."""
from __future__ import annotations

from pathlib import Path

from RAG_System.indexing import validator
from RAG_System.indexing.loader import RawEntity


def make_entity(data=None, folder_animal="dog", category="diseases") -> RawEntity:
    entity_data = {
        "id": "DOG_DIS_003",
        "name": "Hepatitis",
        "animal": "dog",
        "description": "Viral liver disease.",
    }
    entity_data.update(data or {})
    return RawEntity(
        path=Path(folder_animal) / category / f"test.json",
        category=category,
        data=entity_data,
    )


# ══════════════════════════════════════════════════════════════════════════════
# Validation أساسية
# ══════════════════════════════════════════════════════════════════════════════

def test_valid_entity_passes():
    assert validator.validate(make_entity()).valid


def test_missing_description_invalid():
    result = validator.validate(make_entity(data={"description": ""}))
    assert not result.valid


def test_missing_id_invalid():
    result = validator.validate(make_entity(data={"id": ""}))
    assert not result.valid


def test_missing_name_invalid():
    result = validator.validate(make_entity(data={"name": ""}))
    assert not result.valid


def test_animal_field_mismatch_invalid():
    result = validator.validate(make_entity(data={"animal": "cat"}))
    assert not result.valid


def test_bad_id_format_invalid():
    result = validator.validate(make_entity(data={"id": "bad-id"}))
    assert not result.valid


def test_unsupported_category_invalid():
    result = validator.validate(make_entity(category="unknown"))
    assert not result.valid


def test_unsupported_animal_invalid():
    result = validator.validate(make_entity(data={"animal": "elephant"}))
    assert not result.valid


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — diseases
# ══════════════════════════════════════════════════════════════════════════════

def test_missing_expected_field_warns_but_valid():
    result = validator.validate(make_entity())
    assert result.valid
    assert result.warnings


def test_disease_complete_no_warnings():
    """disease بكل الحقول المتوقعة → لا warnings."""
    data = {
        "id": "DOG_DIS_003",
        "name": "Hepatitis",
        "animal": "dog",
        "description": "Viral liver disease.",
        "affected_age_groups": ["Puppy"],
        "causes": "Virus",
        "symptoms": [{"id": "DOG_SYM_001", "name": "Vomiting"}],
        "contagious": True,
    }
    result = validator.validate(make_entity(data=data))
    assert result.valid
    assert not result.warnings


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — symptoms
# ══════════════════════════════════════════════════════════════════════════════

def test_symptom_missing_possible_diseases_warns():
    data = {
        "id": "DOG_SYM_001",
        "name": "Vomiting",
        "animal": "dog",
        "description": "Forceful expulsion.",
    }
    entity = make_entity(data=data, category="symptoms", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert any("possible_diseases" in w for w in result.warnings)


def test_symptom_complete_no_warnings():
    data = {
        "id": "DOG_SYM_001",
        "name": "Vomiting",
        "animal": "dog",
        "description": "Forceful expulsion.",
        "possible_diseases": [{"id": "DOG_DIS_001", "name": "Hep"}],
        "severity_hint": "Moderate",
    }
    entity = make_entity(data=data, category="symptoms", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — medications
# ══════════════════════════════════════════════════════════════════════════════

def test_medication_complete_no_warnings():
    data = {
        "id": "DOG_MED_001",
        "name": "Ampicillin",
        "animal": "dog",
        "description": "Antibiotic.",
        "related_diseases": [{"id": "DOG_DIS_003", "name": "Hep"}],
        "side_effects": ["Diarrhea"],
        "contraindications": ["Penicillin allergy"],
    }
    entity = make_entity(data=data, category="medications", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — vaccines (جديد)
# ══════════════════════════════════════════════════════════════════════════════

def test_vaccine_complete_no_warnings():
    data = {
        "id": "DOG_VAC_001",
        "name": "Parvo Vaccine",
        "animal": "dog",
        "description": "Prevents parvovirus.",
        "related_diseases": [{"id": "DOG_DIS_001", "name": "Parvo"}],
        "recommended_age": "6 weeks",
        "booster_schedule": "Every 3 weeks until 16 weeks",
    }
    entity = make_entity(data=data, category="vaccines", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings


def test_vaccine_missing_booster_schedule_warns():
    data = {
        "id": "DOG_VAC_001",
        "name": "Parvo Vaccine",
        "animal": "dog",
        "description": "Prevents parvovirus.",
        "related_diseases": [{"id": "DOG_DIS_001", "name": "Parvo"}],
        "recommended_age": "6 weeks",
        # booster_schedule مفقود
    }
    entity = make_entity(data=data, category="vaccines", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert any("booster_schedule" in w for w in result.warnings)


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — emergency (جديد)
# ══════════════════════════════════════════════════════════════════════════════

def test_emergency_complete_no_warnings():
    data = {
        "id": "DOG_EME_001",
        "name": "Acute Vomiting Protocol",
        "animal": "dog",
        "description": "Emergency for acute vomiting.",
        "immediate_actions": ["Stop food", "Stop water"],
        "avoid_actions": ["Do not give human meds"],
        "vet_required": True,
    }
    entity = make_entity(data=data, category="emergency", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings


def test_emergency_missing_vet_required_warns():
    data = {
        "id": "DOG_EME_001",
        "name": "Acute Vomiting Protocol",
        "animal": "dog",
        "description": "Emergency for acute vomiting.",
        "immediate_actions": ["Stop food"],
        "avoid_actions": ["Do not give human meds"],
        # vet_required مفقود
    }
    entity = make_entity(data=data, category="emergency", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert any("vet_required" in w for w in result.warnings)


def test_emergency_missing_immediate_actions_warns():
    data = {
        "id": "DOG_EME_001",
        "name": "Protocol",
        "animal": "dog",
        "description": "Emergency.",
        "avoid_actions": ["..."],
        "vet_required": True,
        # immediate_actions مفقود
    }
    entity = make_entity(data=data, category="emergency", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert any("immediate_actions" in w for w in result.warnings)


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — breeds
# ══════════════════════════════════════════════════════════════════════════════

def test_breed_complete_no_warnings():
    data = {
        "id": "DOG_BRD_001",
        "name": "Labrador",
        "animal": "dog",
        "description": "Friendly breed.",
        "characteristics": "Short coat.",
        "size": "Large",
    }
    entity = make_entity(data=data, category="breeds", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — diagnostics
# ══════════════════════════════════════════════════════════════════════════════

def test_diagnostic_complete_no_warnings():
    data = {
        "id": "DOG_DIA_001",
        "name": "CBC",
        "animal": "dog",
        "description": "Blood count.",
        "purpose": "Detect anemia.",
        "related_diseases": [{"id": "DOG_DIS_001", "name": "Disease"}],
    }
    entity = make_entity(data=data, category="diagnostics", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings


# ══════════════════════════════════════════════════════════════════════════════
# EXPECTED_FIELDS — medical_products
# ══════════════════════════════════════════════════════════════════════════════

def test_medical_product_complete_no_warnings():
    data = {
        "id": "DOG_PRD_001",
        "name": "Probiotics",
        "animal": "dog",
        "description": "Gut support.",
        "product_type": "tablets",
        "related_diseases": [{"id": "DOG_DIS_001", "name": "Disease"}],
    }
    entity = make_entity(data=data, category="medical_products", folder_animal="dog")
    result = validator.validate(entity)
    assert result.valid
    assert not result.warnings