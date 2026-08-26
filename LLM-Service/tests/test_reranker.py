"""Offline tests for the CrossEncoder reranker.

No model is downloaded: every test injects a fake scorer. What is verified is
the contract around the model — ordering, trimming, the candidate cap and,
above all, that every failure mode degrades to the incoming vector order
instead of raising or dropping evidence.
"""

from __future__ import annotations

import pytest

from RAG_System.config import settings
from RAG_System.indexing.vector_store import SearchHit
from RAG_System.retrieval import reranker


# ── Fakes ────────────────────────────────────────────────────────────────────

class ScoreByIndex:
    """Scores the i-th pair with i — reverses the incoming order."""

    def predict(self, pairs, **kwargs):
        return [float(index) for index in range(len(pairs))]


class ScoreByKeyword:
    """Scores 1.0 when `keyword` appears in the document, else 0.0."""

    def __init__(self, keyword: str):
        self.keyword = keyword.lower()
        self.calls: list[list[tuple[str, str]]] = []

    def predict(self, pairs, **kwargs):
        self.calls.append(list(pairs))
        return [
            1.0 if self.keyword in document.lower() else 0.0
            for _, document in pairs
        ]


class Raises:
    def predict(self, pairs, **kwargs):
        raise RuntimeError("scoring exploded")


class WrongLength:
    def predict(self, pairs, **kwargs):
        return [1.0]


class NoKwargs:
    """Older CrossEncoder builds accept the pairs positionally only."""

    def predict(self, pairs):
        return [float(len(document)) for _, document in pairs]


# ── Fixtures ─────────────────────────────────────────────────────────────────

def _hit(hit_id: str, name: str, category: str, distance: float, text=None):
    return SearchHit(
        id=hit_id,
        text=text if text is not None else f"Category: {category}\nName: {name}",
        metadata={"name": name, "category": category},
        distance=distance,
    )


@pytest.fixture
def hits() -> list[SearchHit]:
    """Vector-ranked candidates: the symptom first, the disease buried."""
    return [
        _hit("DOG_SYM_001", "Lethargy", "symptoms", 0.21),
        _hit("DOG_SYM_002", "Weakness", "symptoms", 0.24),
        _hit("DOG_DIS_014", "Canine Distemper", "diseases", 0.41),
    ]


# ── Ordering ─────────────────────────────────────────────────────────────────

def test_rerank_reorders_by_score(hits):
    ranked = reranker.rerank("dog tired and weak", hits, model=ScoreByIndex())
    assert [hit.id for hit in ranked] == ["DOG_DIS_014", "DOG_SYM_002", "DOG_SYM_001"]


def test_rerank_pulls_the_relevant_disease_to_rank_one(hits):
    model = ScoreByKeyword("distemper")
    ranked = reranker.rerank("what disease causes this", hits, model=model)
    assert ranked[0].id == "DOG_DIS_014"


def test_rerank_returns_the_same_objects(hits):
    ranked = reranker.rerank("q", hits, model=ScoreByIndex())
    assert sorted(id(hit) for hit in ranked) == sorted(id(hit) for hit in hits)


def test_searchhit_is_not_mutated(hits):
    before = [(hit.id, hit.distance) for hit in hits]
    reranker.rerank("q", hits, model=ScoreByIndex())
    assert [(hit.id, hit.distance) for hit in hits] == before


def test_equal_scores_keep_vector_order(hits):
    class Flat:
        def predict(self, pairs, **kwargs):
            return [0.5] * len(pairs)

    ranked = reranker.rerank("q", hits, model=Flat())
    assert [hit.id for hit in ranked] == [hit.id for hit in hits]


# ── Trimming ─────────────────────────────────────────────────────────────────

def test_top_n_trims(hits):
    ranked = reranker.rerank("q", hits, top_n=2, model=ScoreByIndex())
    assert [hit.id for hit in ranked] == ["DOG_DIS_014", "DOG_SYM_002"]


def test_top_n_larger_than_pool_is_harmless(hits):
    assert len(reranker.rerank("q", hits, top_n=99, model=ScoreByIndex())) == 3


def test_scores_are_returned_best_first(hits):
    scored = reranker.rerank_with_scores("q", hits, model=ScoreByIndex())
    assert [score for _, score in scored] == [2.0, 1.0, 0.0]


# ── The question, not the HyDE answer, is scored ─────────────────────────────

def test_question_is_used_as_the_query_side(hits):
    model = ScoreByKeyword("distemper")
    reranker.rerank("my dog is tired", hits, model=model)
    assert all(query == "my dog is tired" for query, _ in model.calls[0])


def test_empty_text_falls_back_to_metadata_name():
    blank = _hit("DOG_DIS_099", "Leptospirosis", "diseases", 0.30, text="   ")
    model = ScoreByKeyword("leptospirosis")
    reranker.rerank("q", [blank], model=model)
    assert "Leptospirosis" in model.calls[0][0][1]


# ── Failure modes never lose evidence ────────────────────────────────────────

def test_empty_input(hits):
    assert reranker.rerank("q", []) == []


def test_blank_question_keeps_vector_order(hits):
    assert [hit.id for hit in reranker.rerank("   ", hits)] == [h.id for h in hits]


def test_scoring_exception_keeps_vector_order(hits):
    ranked = reranker.rerank("q", hits, model=Raises())
    assert [hit.id for hit in ranked] == [hit.id for hit in hits]


def test_score_count_mismatch_keeps_vector_order(hits):
    ranked = reranker.rerank("q", hits, model=WrongLength())
    assert [hit.id for hit in ranked] == [hit.id for hit in hits]


def test_model_without_kwargs_still_works(hits):
    ranked = reranker.rerank("q", hits, model=NoKwargs())
    # longest document wins under NoKwargs
    assert ranked[0].id == "DOG_DIS_014"


def test_disabled_by_settings_keeps_vector_order(hits, monkeypatch):
    monkeypatch.setattr(settings, "RERANKER_ENABLED", False)
    ranked = reranker.rerank("q", hits)
    assert [hit.id for hit in ranked] == [hit.id for hit in hits]


def test_unloadable_model_keeps_vector_order(hits, monkeypatch):
    monkeypatch.setattr(settings, "RERANKER_ENABLED", True)
    monkeypatch.setattr(reranker, "_load_model", lambda: None)
    ranked = reranker.rerank("q", hits)
    assert [hit.id for hit in ranked] == [hit.id for hit in hits]


def test_disabled_reranker_still_respects_top_n(hits, monkeypatch):
    monkeypatch.setattr(settings, "RERANKER_ENABLED", False)
    assert len(reranker.rerank("q", hits, top_n=2)) == 2


# ── Candidate cap ────────────────────────────────────────────────────────────

def test_candidates_beyond_the_cap_are_kept_but_ranked_last(monkeypatch):
    monkeypatch.setattr(settings, "RERANKER_MAX_CANDIDATES", 2)

    pool = [
        _hit("A", "A", "diseases", 0.10),
        _hit("B", "B", "diseases", 0.20),
        _hit("C", "C", "diseases", 0.30),
    ]

    ranked = reranker.rerank("q", pool, model=ScoreByIndex())

    # B scored above A; C was never scored, so it sinks to the bottom.
    assert [hit.id for hit in ranked] == ["B", "A", "C"]
    assert len(ranked) == len(pool)


# ── Model source resolution ──────────────────────────────────────────────────

def test_complete_local_snapshot_is_preferred(tmp_path, monkeypatch):
    (tmp_path / "config.json").write_text("{}", encoding="utf-8")
    (tmp_path / "model.safetensors").write_bytes(b"weights")
    monkeypatch.setattr(settings, "RERANKER_MODEL_PATH", tmp_path)

    assert reranker._model_source() == str(tmp_path)


def test_snapshot_without_weights_falls_through_to_the_hub(tmp_path, monkeypatch):
    (tmp_path / "config.json").write_text("{}", encoding="utf-8")
    monkeypatch.setattr(settings, "RERANKER_MODEL_PATH", tmp_path)

    assert reranker._model_source() == settings.RERANKER_MODEL


def test_missing_snapshot_folder_falls_through_to_the_hub(tmp_path, monkeypatch):
    monkeypatch.setattr(settings, "RERANKER_MODEL_PATH", tmp_path / "nope")

    assert reranker._model_source() == settings.RERANKER_MODEL


def test_only_capped_candidates_are_scored(monkeypatch):
    monkeypatch.setattr(settings, "RERANKER_MAX_CANDIDATES", 2)
    model = ScoreByKeyword("x")
    pool = [_hit(str(i), str(i), "diseases", i / 10) for i in range(5)]

    reranker.rerank("q", pool, model=model)

    assert len(model.calls[0]) == 2
