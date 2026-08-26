"""اختبارات embedder.py بعد الانتقال إلى LangChain CacheBackedEmbeddings."""

from unittest.mock import MagicMock
import pytest

from RAG_System.indexing import embedder as emb
from tests.fakes import FakeEmbedder

def test_embed_success_calls_lc_embed_documents(monkeypatch):
    """embed() يستدعي _lc.embed_documents ويعيد vectors."""
    fake_vectors = [[0.1, 0.2, 0.3]]

    mock_lc = MagicMock()
    mock_lc.embed_documents.return_value = fake_vectors

    instance = emb.OpenRouterEmbedder.__new__(emb.OpenRouterEmbedder)
    instance._cache = MagicMock()
    instance._cache.get.return_value = None  # cache miss
    instance._lc = mock_lc

    vectors = instance.embed(["test text"])

    assert vectors == fake_vectors
    mock_lc.embed_documents.assert_called_once_with(["test text"])


def test_embed_uses_cache_on_hit(monkeypatch):
    """إذا كان الـ vector في الـ cache لا يُستدعى API."""
    cached_vector = [0.5, 0.6, 0.7]

    mock_lc = MagicMock()
    instance = emb.OpenRouterEmbedder.__new__(emb.OpenRouterEmbedder)
    instance._cache = MagicMock()
    instance._cache.get.return_value = cached_vector  # cache hit
    instance._lc = mock_lc

    vectors = instance.embed(["cached text"])

    assert vectors == [cached_vector]
    mock_lc.embed_documents.assert_not_called()


def test_embed_raises_on_failure(monkeypatch):
    """فشل الـ API يرفع EmbedderError."""
    mock_lc = MagicMock()
    mock_lc.embed_documents.side_effect = Exception("API failure")

    instance = emb.OpenRouterEmbedder.__new__(emb.OpenRouterEmbedder)
    instance._cache = MagicMock()
    instance._cache.get.return_value = None
    instance._lc = mock_lc

    with pytest.raises(emb.EmbedderError):
        instance.embed(["test"])


def test_embed_query_delegates(monkeypatch):
    """embed_query() يستدعي _lc.embed_query مباشرة."""
    expected = [0.1, 0.2, 0.3]

    mock_lc = MagicMock()
    mock_lc.embed_query.return_value = expected

    instance = emb.OpenRouterEmbedder.__new__(emb.OpenRouterEmbedder)
    instance._lc = mock_lc
    instance._cache = MagicMock()          # ← الإصلاح: إضافة _cache الوهمي
    instance._cache.get.return_value = None # ← لتجنب الـ AttributeError

    result = instance.embed_query("my question")

    assert result == expected
    mock_lc.embed_query.assert_called_once_with("my question")


def test_fake_embedder_deterministic():
    """FakeEmbedder يعيد نفس الـ vector لنفس النص."""
    fake = FakeEmbedder()  # ← الإصلاح: حذف dim=8 لأن الكلاس لا يقبلها
    v1 = fake.embed(["hello"])
    v2 = fake.embed(["hello"])
    assert v1 == v2


def test_fake_embedder_different_texts():
    """نصوص مختلفة → vectors مختلفة."""
    fake = FakeEmbedder()  # ← الإصلاح: حذف dim=8
    v1 = fake.embed(["hello"])[0]
    v2 = fake.embed(["world"])[0]
    assert v1 != v2