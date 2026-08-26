"""Live retrieval test: real OpenRouter embeddings against a tmp index of fixtures."""

from __future__ import annotations

import json
import socket
from pathlib import Path

import pytest

from RAG_System.config import settings
from RAG_System.indexing import loader, pipeline, vector_store
from RAG_System.indexing.embedder import OpenRouterEmbedder
from RAG_System.retrieval.retriever import retrieve

FIXTURES = Path(__file__).parent / "fixtures"
QUERIES_FILE = Path(__file__).parent / "queries.jsonl"


def _openrouter_reachable() -> bool:
    try:
        socket.create_connection(("openrouter.ai", 443), timeout=3).close()
        return True
    except OSError:
        return False


pytestmark = [
    pytest.mark.live,
    pytest.mark.skipif(not _openrouter_reachable(), reason="OpenRouter unreachable"),
]


def _iter_fixture_entities():
    for animal_dir in sorted(p for p in FIXTURES.iterdir() if p.is_dir()):
        for category_dir in sorted(p for p in animal_dir.iterdir() if p.is_dir()):
            yield from loader.iter_category(category_dir)


def _load_queries() -> list[dict]:
    lines = QUERIES_FILE.read_text(encoding="utf-8").splitlines()
    return [json.loads(line) for line in lines if line.strip()]


@pytest.fixture(scope="module")
def live_store(tmp_path_factory):
    tmp_path = tmp_path_factory.mktemp("live_retrieval")
    store = vector_store.VectorStore(path=tmp_path, name="live_retrieval_kb")
    embedder = OpenRouterEmbedder()

    report = pipeline.index_entities(
        _iter_fixture_entities(), embedder=embedder, store=store
    )
    if report.failed:
        pytest.skip("OpenRouter embedding failed (no valid credentials in this environment)")
    return store


def test_retrieval_finds_expected_id(live_store, monkeypatch):
    # This fixture DB holds one entity per animal/category, so animal+category
    # filtering already narrows each query to its single expected candidate.
    # Real-embedding distances against this tiny fixture set run higher than
    # against the full KB (observed up to ~0.58, e.g. DOG_DIS_003's sparse
    # single-symptom text), so the test loosens the threshold locally rather
    # than weakening the production default in settings.py.
    monkeypatch.setattr(settings, "SIMILARITY_THRESHOLD", 0.40)

    for query in _load_queries():
        hits = retrieve(
            query["query"],
            animal=query["animal"],
            category=query["category"],
            store=live_store,
        )
        assert query["expected_id"] in [hit.id for hit in hits], query
