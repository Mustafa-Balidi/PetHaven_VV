"""اختبارات loader.py — load + iter + strip_strings (إن كان مضافاً)."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from RAG_System.indexing import loader

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture()
def entity_file(tmp_path: Path) -> Path:
    folder = tmp_path / "dog" / "diagnostics"
    folder.mkdir(parents=True)
    path = folder / "DOG_DIA_003.json"
    path.write_text(
        json.dumps({"id": "DOG_DIA_003", "name": "Urinalysis", "animal": "dog", "description": "Test"}),
        encoding="utf-8",
    )
    return path


# ══════════════════════════════════════════════════════════════════════════════
# load_file
# ══════════════════════════════════════════════════════════════════════════════

def test_load_file_returns_entity(entity_file: Path):
    entity = loader.load_file(entity_file)
    assert entity.id == "DOG_DIA_003"
    assert entity.animal == "dog"
    assert entity.category == "diagnostics"


def test_load_file_invalid_json(tmp_path: Path):
    bad = tmp_path / "dog" / "diagnostics" / "bad.json"
    bad.parent.mkdir(parents=True)
    bad.write_text("{not json", encoding="utf-8")
    with pytest.raises(loader.LoaderError):
        loader.load_file(bad)


def test_load_file_non_dict(tmp_path: Path):
    bad = tmp_path / "dog" / "diagnostics" / "list.json"
    bad.parent.mkdir(parents=True)
    bad.write_text("[1, 2, 3]", encoding="utf-8")
    with pytest.raises(loader.LoaderError):
        loader.load_file(bad)


def test_load_fixtures_category():
    entities = list(loader.iter_category(FIXTURES / "dog" / "diseases"))
    assert len(entities) == 1
    assert entities[0].category == "diseases"


# ══════════════════════════════════════════════════════════════════════════════
# _strip_strings — الإصلاح ضد المسافات الزائدة في JSON
# ══════════════════════════════════════════════════════════════════════════════

class TestStripStrings:
    """مهمة: ملفات KB أحياناً تحتوي مسافات زائدة في المفاتيح والقيم."""

    def test_strips_dict_keys(self):
        """المفاتيح مع مسافات → تُزال."""
        if not hasattr(loader, "_strip_strings"):
            pytest.skip("_strip_strings not implemented")
        result = loader._strip_strings({"id ": "value"})
        assert "id" in result
        assert "id " not in result

    def test_strips_string_values(self):
        """القيم النصية مع مسافات → تُزال."""
        if not hasattr(loader, "_strip_strings"):
            pytest.skip("_strip_strings not implemented")
        result = loader._strip_strings({"id": " DOG_MED_075 "})
        assert result["id"] == "DOG_MED_075"

    def test_strips_nested(self):
        """يُزيل المسافات من القواميس المتداخلة والقوائم."""
        if not hasattr(loader, "_strip_strings"):
            pytest.skip("_strip_strings not implemented")
        data = {
            "id ": " HAM_MED_075 ",
            "related_diseases ": [
                {"id ": " HAM_DIS_010 ", "name ": " Diabetes "},
            ],
        }
        result = loader._strip_strings(data)
        assert result["id"] == "HAM_MED_075"
        assert result["related_diseases"][0]["id"] == "HAM_DIS_010"
        assert result["related_diseases"][0]["name"] == "Diabetes"

    def test_preserves_non_string_values(self):
        """الأرقام والـ booleans تبقى كما هي."""
        if not hasattr(loader, "_strip_strings"):
            pytest.skip("_strip_strings not implemented")
        data = {"count": 42, "active": True, "ratio": 3.14}
        result = loader._strip_strings(data)
        assert result == data

    def test_handles_none(self):
        """None يبقى None."""
        if not hasattr(loader, "_strip_strings"):
            pytest.skip("_strip_strings not implemented")
        result = loader._strip_strings(None)
        assert result is None


# ══════════════════════════════════════════════════════════════════════════════
# iter_category
# ══════════════════════════════════════════════════════════════════════════════

def test_iter_category_streams(entity_file: Path):
    assert len(list(loader.iter_category(entity_file.parent))) == 1


def test_iter_category_missing_folder():
    with pytest.raises(loader.LoaderError):
        list(loader.iter_category(Path("/nonexistent/folder")))


def test_iter_category_skips_hash_files(tmp_path):
    """الملفات التي تبدأ بـ # تُتخطى (ملفات تحرير مؤقتة)."""
    folder = tmp_path / "dog" / "diseases"
    folder.mkdir(parents=True)
    (folder / "DOG_DIS_001.json").write_text(
        json.dumps({"id": "DOG_DIS_001", "name": "D", "animal": "dog", "description": "..."}),
        encoding="utf-8",
    )
    (folder / "#temp.json").write_text("{}", encoding="utf-8")

    entities = list(loader.iter_category(folder))
    assert len(entities) == 1
    assert entities[0].id == "DOG_DIS_001"


# ══════════════════════════════════════════════════════════════════════════════
# iter_all
# ══════════════════════════════════════════════════════════════════════════════

def test_iter_all_yields_from_fixtures(monkeypatch):
    """iter_all يجب أن يُعيد entities من المجلد الصحيح."""
    from RAG_System.config import settings
    # اجعل KNOWLEDGE_BASE_PATH يشير إلى fixtures
    monkeypatch.setattr(settings, "KNOWLEDGE_BASE_PATH", FIXTURES)
    entities = list(loader.iter_all())
    assert len(entities) > 0
    animals = {e.animal for e in entities}
    assert "dog" in animals or "cat" in animals