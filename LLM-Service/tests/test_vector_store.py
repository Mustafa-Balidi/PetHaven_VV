"""اختبارات vector_store.py — search + get_by_ids الذي يُعيد id."""
from __future__ import annotations

import pytest

from RAG_System.indexing import vector_store
from RAG_System.indexing.vector_store import VectorStore


@pytest.fixture()
def store(tmp_path):
    return VectorStore(path=tmp_path, name="test_kb")


# ══════════════════════════════════════════════════════════════════════════════
# upsert + count
# ══════════════════════════════════════════════════════════════════════════════

def test_upsert_and_count(store):
    store.upsert(
        ids=["a", "b"],
        texts=["text a", "text b"],
        embeddings=[[1.0, 0.0], [0.0, 1.0]],
        metadatas=[
            {"id": "a", "name": "A", "animal": "dog", "category": "diseases"},
            {"id": "b", "name": "B", "animal": "cat", "category": "diseases"},
        ],
    )
    assert store.count() == 2

    store.upsert(
        ids=["a"],
        texts=["text a2"],
        embeddings=[[1.0, 0.0]],
        metadatas=[{"id": "a", "name": "A2", "animal": "dog", "category": "diseases"}],
    )
    assert store.count() == 2


def test_upsert_requires_nonempty_metadata(store):
    """ChromaDB يرفض metadata فارغة {} — يجب أن يكون على الأقل حقل واحد."""
    with pytest.raises(ValueError, match="non-empty"):
        store.upsert(
            ids=["x"],
            texts=["text"],
            embeddings=[[1.0]],
            metadatas=[{}],
        )


# ══════════════════════════════════════════════════════════════════════════════
# search
# ══════════════════════════════════════════════════════════════════════════════

def test_search_filters_by_animal(store):
    store.upsert(
        ids=["d1", "c1"],
        texts=["dog doc", "cat doc"],
        embeddings=[[1.0, 0.0], [0.9, 0.1]],
        metadatas=[
            {"id": "d1", "name": "Dog Disease", "animal": "dog", "category": "diseases"},
            {"id": "c1", "name": "Cat Disease", "animal": "cat", "category": "diseases"},
        ],
    )
    hits = store.search([1.0, 0.0], animal="dog", top_k=5)
    assert [h.id for h in hits] == ["d1"]


def test_search_filters_by_category(store):
    store.upsert(
        ids=["s1", "d1"],
        texts=["symptom", "disease"],
        embeddings=[[1.0, 0.0], [0.9, 0.1]],
        metadatas=[
            {"id": "s1", "name": "Vomit", "animal": "dog", "category": "symptoms"},
            {"id": "d1", "name": "Hepatitis", "animal": "dog", "category": "diseases"},
        ],
    )
    hits = store.search([1.0, 0.0], category="symptoms", top_k=5)
    assert [h.id for h in hits] == ["s1"]


def test_search_filters_by_animal_and_category(store):
    store.upsert(
        ids=["ds1", "dc1", "ss1"],
        texts=["dog symptom", "dog disease", "cat symptom"],
        embeddings=[[1.0, 0.0], [0.95, 0.05], [0.9, 0.1]],
        metadatas=[
            {"id": "ds1", "name": "Dog Vomit", "animal": "dog", "category": "symptoms"},
            {"id": "dc1", "name": "Dog Hep", "animal": "dog", "category": "diseases"},
            {"id": "ss1", "name": "Cat Vomit", "animal": "cat", "category": "symptoms"},
        ],
    )
    hits = store.search([1.0, 0.0], animal="dog", category="symptoms", top_k=5)
    assert [h.id for h in hits] == ["ds1"]


def test_search_returns_distance(store):
    store.upsert(
        ids=["x"],
        texts=["hello"],
        embeddings=[[1.0, 0.0]],
        metadatas=[{"id": "x", "name": "X", "animal": "dog", "category": "symptoms"}],
    )
    hit = store.search([1.0, 0.0], top_k=1)[0]
    assert hit.id == "x"
    assert hit.text == "hello"
    assert hit.metadata["category"] == "symptoms"
    assert isinstance(hit.distance, float)
    assert hit.distance >= 0.0


def test_search_empty_store(store):
    """البحث في store فارغ يُعيد [] بدون خطأ."""
    hits = store.search([1.0, 0.0], top_k=5)
    assert hits == []


# ══════════════════════════════════════════════════════════════════════════════
# get_by_ids — الإصلاح الحرج
# ══════════════════════════════════════════════════════════════════════════════

class TestGetByIds:
    """get_by_ids يجب أن يُعيد id + text + metadata."""

    def test_returns_id_text_metadata(self, store):
        store.upsert(
            ids=["DOG_DIS_001", "DOG_MED_001"],
            texts=["Disease text", "Medication text"],
            embeddings=[[1.0, 0.0], [0.0, 1.0]],
            metadatas=[
                {"id": "DOG_DIS_001", "name": "Hepatitis", "animal": "dog", "category": "diseases"},
                {"id": "DOG_MED_001", "name": "Ampicillin", "animal": "dog", "category": "medications"},
            ],
        )

        docs = store.get_by_ids(["DOG_DIS_001", "DOG_MED_001"])
        assert len(docs) == 2

        # id يجب أن يكون موجوداً — هذا هو الإصلاح الحرج
        ids = {d.get("id") for d in docs}
        assert "DOG_DIS_001" in ids
        assert "DOG_MED_001" in ids

        # text يجب أن يكون موجوداً
        dis_doc = next(d for d in docs if d.get("id") == "DOG_DIS_001")
        assert dis_doc["text"] == "Disease text"
        assert dis_doc["metadata"]["name"] == "Hepatitis"
        assert dis_doc["metadata"]["category"] == "diseases"

    def test_missing_ids_ignored(self, store):
        """IDs غير موجودة في الـ store → تُتجاهل بصمت."""
        store.upsert(
            ids=["DOG_DIS_001"],
            texts=["Disease text"],
            embeddings=[[1.0, 0.0]],
            metadatas=[{"id": "DOG_DIS_001", "name": "Hep", "animal": "dog", "category": "diseases"}],
        )
        docs = store.get_by_ids(["DOG_DIS_001", "DOG_DIS_GHOST"])
        assert len(docs) == 1
        assert docs[0]["id"] == "DOG_DIS_001"

    def test_empty_input_returns_empty(self, store):
        """قائمة IDs فارغة → [] بدون استدعاء لـ Chroma."""
        assert store.get_by_ids([]) == []

    def test_missing_metadata_becomes_dict(self, store):
        """metadata موجودة دائماً كقاموس (ChromaDB يرفض metadata فارغة أصلاً)."""
        store.upsert(
            ids=["x"],
            texts=["text"],
            embeddings=[[1.0]],
            metadatas=[{"id": "x", "category": "diseases"}],
        )
        docs = store.get_by_ids(["x"])
        assert len(docs) == 1
        assert isinstance(docs[0]["metadata"], dict)
        assert docs[0]["metadata"]["id"] == "x"

    def test_all_requested_ids_returned(self, store):
        """كل الـ IDs المطلوبة تُعاد (ChromaDB لا يضمن ترتيباً معيناً)."""
        store.upsert(
            ids=["A", "B", "C"],
            texts=["a", "b", "c"],
            embeddings=[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
            metadatas=[
                {"id": "A", "name": "A", "animal": "dog", "category": "diseases"},
                {"id": "B", "name": "B", "animal": "dog", "category": "diseases"},
                {"id": "C", "name": "C", "animal": "dog", "category": "diseases"},
            ],
        )
        docs = store.get_by_ids(["C", "A", "B"])
        returned_ids = {d["id"] for d in docs}
        # ChromaDB لا يضمن الترتيب، لكنه يضمن إرجاع كل الـ IDs المطلوبة
        assert returned_ids == {"A", "B", "C"}
        assert len(docs) == 3


# ══════════════════════════════════════════════════════════════════════════════
# ids_and_hashes
# ══════════════════════════════════════════════════════════════════════════════

def test_ids_and_hashes_empty_store(store):
    assert store.ids_and_hashes() == {}


def test_ids_and_hashes_returns_hashes(store):
    store.upsert(
        ids=["DOG_DIS_001"],
        texts=["text"],
        embeddings=[[1.0]],
        metadatas=[{"id": "DOG_DIS_001", "name": "Hep", "content_hash": "abc123"}],
    )
    result = store.ids_and_hashes()
    assert result == {"DOG_DIS_001": "abc123"}


def test_ids_and_hashes_without_hash(store):
    """metadata بدون content_hash → string فارغ."""
    store.upsert(
        ids=["DOG_DIS_001"],
        texts=["text"],
        embeddings=[[1.0]],
        metadatas=[{"id": "DOG_DIS_001", "name": "Hep"}],
    )
    result = store.ids_and_hashes()
    assert result["DOG_DIS_001"] == ""