"""اختبارات pipeline.py — incremental indexing + content_hash الجديد + warned."""
from __future__ import annotations

from pathlib import Path

from RAG_System.indexing import loader, metadata as meta_mod, pipeline, vector_store
from tests.fakes import FakeEmbedder

FIXTURES = Path(__file__).parent / "fixtures"


def test_indexing_pipeline_indexes_valid_entities(tmp_path):
    """الـ pipeline يُفهرس كل الـ entities الصالحة."""
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_test")
    fake = FakeEmbedder()
    entities = [
        loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json"),
        loader.load_file(FIXTURES / "dog" / "symptoms" / "DOG_SYM_001.json"),
        loader.load_file(FIXTURES / "dog" / "medications" / "DOG_MED_001.json"),
    ]
    report = pipeline.index_entities(entities, embedder=fake, store=store)
    assert report.indexed == 3
    assert report.skipped == 0
    assert report.failed == 0
    assert report.warned == 0
    assert store.count() == 3


def test_invalid_entity_counted_as_failed(tmp_path):
    """Entity غير صالحة تُحسب failed (وليس skipped)."""
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_fail_test")
    fake = FakeEmbedder()
    good = loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")
    bad = loader.RawEntity(
        path=Path("dog/diseases/BAD_001.json"),
        category="diseases",
        data={
            "id": "BAD_001",
            "name": "Bad Entity",
            "animal": "dog",
            "description": "",  # فارغ → غير صالح
        },
    )
    report = pipeline.index_entities([good, bad], embedder=fake, store=store)
    assert report.indexed == 1
    assert report.failed == 1
    assert report.skipped == 0
    assert store.count() == 1


def test_entity_with_warnings_counted(tmp_path):
    """Entity صالحة لكنها تفتقد حقلاً متوقعاً → تُفهرس وتُحسب warned."""
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_warn_test")
    fake = FakeEmbedder()
    # entity يفتقد "causes" → سيُنتج warning من validator
    entity_missing_field = loader.RawEntity(
        path=Path("dog/diseases/DOG_DIS_999.json"),
        category="diseases",
        data={
            "id": "DOG_DIS_999",
            "name": "Test Disease",
            "animal": "dog",
            "description": "A test disease for warning counting.",
            # affected_age_groups, causes, symptoms, contagious كلها مفقودة
            # → validator سيُنتج warnings
        },
    )
    report = pipeline.index_entities([entity_missing_field], embedder=fake, store=store)
    assert report.indexed == 1, "Entity صالحة → يجب أن تُفهرس"
    assert report.warned >= 1, "حقول متوقعة مفقودة → يجب أن يُحسب warned"
    assert report.failed == 0, "Entity صالحة → ليس failed"
    assert store.count() == 1


def test_unchanged_entity_is_skipped(tmp_path):
    """إعادة فهرسة نفس الـ entity بدون تغيير → skipped (hash مطابق)."""
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_skip_test")
    fake = FakeEmbedder()
    entities = [loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")]

    report1 = pipeline.index_entities(entities, embedder=fake, store=store)
    assert report1.indexed == 1

    # الفهرسة الثانية — نفس المحتوى
    report2 = pipeline.index_entities(entities, embedder=fake, store=store)
    assert report2.indexed == 0
    assert report2.skipped == 1
    assert report2.failed == 0
    assert store.count() == 1


def test_modified_text_is_reindexed(tmp_path):
    """تغيير النص → hash مختلف → re-index."""
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_reindex_test")
    fake = FakeEmbedder()
    entity = loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")

    pipeline.index_entities([entity], embedder=fake, store=store)
    assert store.count() == 1

    modified_data = dict(entity.data)
    modified_data["description"] = "Updated description."
    modified_entity = loader.RawEntity(
        path=entity.path, category=entity.category, data=modified_data
    )
    report = pipeline.index_entities([modified_entity], embedder=fake, store=store)
    assert report.indexed == 1
    assert report.skipped == 0


def test_modified_metadata_is_reindexed(tmp_path):
    """
    الإصلاح الأهم: تغيير metadata (بدون تغيير النص) → re-index.
    
    قبل الإصلاح: _content_hash(text) فقط → metadata المتغيّرة لا تؤثر → skipped
    بعد الإصلاح: _content_hash(text, meta) → metadata المتغيّرة تُعيد الفهرسة
    """
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_meta_test")
    fake = FakeEmbedder()
    entity = loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")

    # الفهرسة الأولى
    pipeline.index_entities([entity], embedder=fake, store=store)
    assert store.count() == 1

    # محاكاة تغيير metadata: كأننا أضفنا حقلاً جديداً في metadata.py
    # نحقق ذلك عبر حقن قيمة مختلفة في data تُنتج metadata مختلفة
    modified_data = dict(entity.data)
    # أضف حقلاً إضافياً يغيّر metadata لكن لا يغيّر النص بشكل كبير
    modified_data["contagious"] = not modified_data.get("contagious", False)
    modified_entity = loader.RawEntity(
        path=entity.path, category=entity.category, data=modified_data
    )

    report = pipeline.index_entities([modified_entity], embedder=fake, store=store)
    assert report.indexed == 1, "تغيير metadata يجب أن يُعيد الفهرسة"
    assert report.skipped == 0


def test_flush_failure_does_not_kill_pipeline(tmp_path):
    """فشل دفعة embedding لا يوقف الـ pipeline بالكامل."""
    store = vector_store.VectorStore(path=tmp_path, name="pipeline_flush_test")

    class FailingEmbedder:
        def embed(self, texts):
            raise RuntimeError("Embedding service down")

    entities = [loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")]
    report = pipeline.index_entities(entities, embedder=FailingEmbedder(), store=store)
    assert report.failed == 1
    assert report.indexed == 0
    assert store.count() == 0


def test_index_report_total_property(tmp_path):
    """IndexReport.total يُرجع مجموع كل الحقول."""
    report = pipeline.IndexReport(indexed=10, skipped=5, failed=2, warned=3)
    assert report.total == 17


def test_content_hash_is_deterministic():
    """نفس المدخلات → نفس الـ hash."""
    h1 = pipeline._content_hash("text", {"a": "1", "b": "2"})
    h2 = pipeline._content_hash("text", {"b": "2", "a": "1"})
    assert h1 == h2


def test_content_hash_changes_with_metadata():
    """نفس النص + metadata مختلفة → hash مختلف."""
    h1 = pipeline._content_hash("same text", {"field": "old"})
    h2 = pipeline._content_hash("same text", {"field": "new"})
    assert h1 != h2


def test_content_hash_changes_with_text():
    """نص مختلف + نفس metadata → hash مختلف."""
    h1 = pipeline._content_hash("text one", {"field": "val"})
    h2 = pipeline._content_hash("text two", {"field": "val"})
    assert h1 != h2


def test_prepare_adds_content_hash():
    """_prepare تُضيف content_hash إلى الـ metadata."""
    entity = loader.load_file(FIXTURES / "dog" / "diseases" / "DOG_DIS_003.json")
    text, meta = pipeline._prepare(entity)
    assert "content_hash" in meta
    assert len(meta["content_hash"]) == 16  # sha256 hex truncated