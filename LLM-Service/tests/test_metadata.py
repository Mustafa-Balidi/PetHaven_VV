"""اختبارات metadata.py بعد إضافة relationship IDs."""

from pathlib import Path

from RAG_System.indexing import loader, metadata

FIXTURES = Path(__file__).parent / "fixtures"


def test_disease_metadata_includes_relationship_ids():
    """DOG_DIS_003 يحتوي symptoms → يجب أن يظهر related_symptom_ids."""
    entity = loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")
    meta = metadata.extract(entity)

    # الحقول الأساسية دائماً موجودة
    assert meta["id"] == "DOG_DIS_003"
    assert meta["name"] == "Canine Infectious Hepatitis (Adenovirus-1)"
    assert meta["animal"] == "dog"
    assert meta["category"] == "diseases"

    # حقل contagious (bool → str)
    assert meta["contagious"] == "true"

    # relationship IDs من حقل symptoms
    assert "related_symptom_ids" in meta
    assert "DOG_SYM_001" in meta["related_symptom_ids"]

    # لا توجد أدوية مرتبطة في هذا الـ fixture → الحقل غير موجود أصلاً
    assert "related_medication_ids" not in meta


def test_symptom_metadata_includes_severity_and_disease_ids():
    """DOG_SYM_001 يحتوي possible_diseases + severity_hint."""
    entity = loader.load_file(FIXTURES / "dog" / "symptoms" / "DOG_SYM_001.json")
    meta = metadata.extract(entity)

    assert meta["category"] == "symptoms"
    assert meta["severity_hint"] == "Moderate"
    assert "related_disease_ids" in meta
    assert "DOG_DIS_003" in meta["related_disease_ids"]


def test_diagnostic_metadata_includes_sample_type():
    """DOG_DIA_003 يحتوي sample_type + related_disease_ids."""
    entity = loader.load_file(FIXTURES / "dog" / "diagnostics" / "DOG_DIA_003.json")
    meta = metadata.extract(entity)

    assert meta["category"] == "diagnostics"
    assert meta["sample_type"] == "urine"
    assert "DOG_DIS_203" in meta.get("related_disease_ids", "")


def test_medication_metadata_includes_related_diseases():
    """DOG_MED_001 يحتوي related_diseases."""
    entity = loader.load_file(FIXTURES / "dog" / "medications" / "DOG_MED_001.json")
    meta = metadata.extract(entity)

    assert meta["category"] == "medications"
    assert "DOG_DIS_003" in meta.get("related_disease_ids", "")


def test_breed_metadata_includes_size():
    """DOG_BRD_001 يحتوي size."""
    entity = loader.load_file(FIXTURES / "dog" / "breeds" / "DOG_BRD_001.json")
    meta = metadata.extract(entity)

    assert meta["category"] == "breeds"
    assert meta["size"] == "Large"


def test_metadata_values_are_all_strings():
    """ChromaDB يتطلب أن تكون كل قيم metadata من نوع str."""
    entity = loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")
    meta = metadata.extract(entity)

    for key, value in meta.items():
        assert isinstance(value, str), f"metadata['{key}'] is {type(value)}, expected str"


def test_empty_fields_not_stored():
    """الحقول الفارغة لا تُخزَّن (قاعدة _set)."""
    entity = loader.load_file(FIXTURES / "dog" / "breeds" / "DOG_BRD_001.json")
    meta = metadata.extract(entity)

    # لا يجب أن يكون هناك قيم فارغة
    for key, value in meta.items():
        assert value != "", f"metadata['{key}'] is empty string — should be omitted"


def test_null_ids_in_relationships_are_skipped():
    """عناصر بدون id (أو id=null) تُتخطى في _ids()."""
    from RAG_System.indexing.loader import RawEntity

    # محاكاة entity فيها عنصر بدون id وعنصر id=null
    data = {
        "id": "DOG_DIS_999",
        "name": "Test Disease",
        "animal": "dog",
        "description": "Test.",
        "symptoms": [
            {"id": "DOG_SYM_001", "name": "Vomiting"},
            {"name": "No ID Here"},
            {"id": None, "name": "Null ID"},
        ],
    }
    entity = RawEntity(path=Path("dog/diseases/DOG_DIS_999.json"), category="diseases", data=data)
    meta = metadata.extract(entity)

    # فقط العنصر الصالح يظهر
    assert meta.get("related_symptom_ids") == "DOG_SYM_001"