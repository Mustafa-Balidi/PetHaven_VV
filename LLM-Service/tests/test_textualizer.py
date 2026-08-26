from pathlib import Path

from RAG_System.indexing import loader, textualizer

FIXTURES = Path(__file__).parent / "fixtures"


def _load(animal: str, category: str, filename: str):
    return loader.load_file(FIXTURES / animal / category / filename)


def test_disease_text_rich():
    text = textualizer.to_text(_load("dog", "diseases", "DOG_DIS_003.json"))
    assert "Category: Disease" in text
    assert "Name: Canine Infectious Hepatitis (Adenovirus-1)" in text
    assert "Symptoms: Vomiting" in text
    assert "Contagious: yes" in text


def test_diagnostic_text():
    text = textualizer.to_text(_load("dog", "diagnostics", "DOG_DIA_003.json"))
    assert "Category: Diagnostic" in text
    assert "Purpose:" in text
    assert "Sample type: urine" in text


def test_missing_fields_skipped():
    text = textualizer.to_text(_load("cat", "diagnostics", "CAT_DIA_001.json"))
    assert "Notes:" not in text


def test_no_raw_json():
    text = textualizer.to_text(_load("dog", "medications", "DOG_MED_001.json"))
    assert "{" not in text