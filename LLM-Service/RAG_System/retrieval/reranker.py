"""CrossEncoder reranking of retrieval candidates.

Why a reranker
--------------
Bi-encoder retrieval (question and document embedded independently) is a
recall instrument, not a precision one. For a symptom-shaped question such as
"My dog is tired and weak" the nearest neighbours are other *symptom*
descriptions, because they share surface vocabulary with the question. The
disease that explains the symptom ("Canine Distemper") sits further out in
embedding space and only enters the pool once the candidate count is large.

A CrossEncoder scores the (question, document) pair jointly with full
attention across both, so it can tell "this disease answers that complaint"
from "this text merely repeats the complaint". Widening the pool is what makes
the missing entity a candidate; reranking is what pulls it up the list.

Contract
--------
SearchHit is untouched — it stays a frozen dataclass carrying the vector
`distance`. `rerank()` returns the same objects in a new order.
`rerank_with_scores()` exposes the raw CrossEncoder logits when a caller needs
them (evaluation, diagnostics); scores are NOT persisted onto the hits.

Failure policy
--------------
Never fatal. A missing dependency, an unreachable model hub or a scoring error
degrades to the incoming vector ordering and logs once. Retrieval must keep
working offline.
"""
from __future__ import annotations

import logging
import threading
from pathlib import Path

from RAG_System.config import settings
from RAG_System.indexing.vector_store import SearchHit

logger = logging.getLogger(__name__)


# ── Lazy, process-wide model ─────────────────────────────────────────────────
#
# Loading the CrossEncoder costs ~1s and ~90 MB. It is loaded on first use and
# shared afterwards, exactly like the VectorStore singleton, so a FastAPI
# worker pays for it once. _load_failed latches so a broken environment does
# not retry the import/download on every single query.

_model_lock: threading.Lock = threading.Lock()
_model = None
_load_failed = False


# A local snapshot counts only when the weights and the config are both there.
# A half-finished download must fall through to the hub instead of latching the
# reranker off for the lifetime of the process.
_WEIGHT_FILES = ("model.safetensors", "pytorch_model.bin")


def _model_source() -> str:
    """Local snapshot when it is complete, otherwise the hub id.

    A pre-fetched folder (scripts/fetch_reranker_model.py) means the first
    query never waits on a model download — and never hangs on one, which a
    lazy load cannot recover from with a try/except.
    """
    local = getattr(settings, "RERANKER_MODEL_PATH", None)

    if not local:
        return settings.RERANKER_MODEL

    folder = Path(local)

    if (
        folder.is_dir()
        and (folder / "config.json").is_file()
        and any((folder / name).is_file() for name in _WEIGHT_FILES)
    ):
        return str(folder)

    return settings.RERANKER_MODEL


def _load_model():
    """Return the shared CrossEncoder, or None when it cannot be loaded."""
    global _model, _load_failed

    if _model is not None or _load_failed:
        return _model

    with _model_lock:
        if _model is not None or _load_failed:
            return _model

        try:
            from sentence_transformers import CrossEncoder
        except ImportError as exc:
            _load_failed = True
            logger.warning(
                "Reranker disabled — sentence-transformers is not installed "
                "(%s). Falling back to vector ordering.", exc,
            )
            return None

        source = _model_source()
        sources = [source]

        # A broken local snapshot should cost one retry against the hub, not
        # the reranker for the rest of the process lifetime.
        if source != settings.RERANKER_MODEL:
            sources.append(settings.RERANKER_MODEL)

        for candidate in sources:
            try:
                _model = CrossEncoder(
                    candidate,
                    max_length=settings.RERANKER_MAX_LENGTH,
                )
                logger.info("Reranker loaded: %s", candidate)
                return _model
            except Exception as exc:
                logger.warning("Reranker could not load %r: %s", candidate, exc)

        _load_failed = True
        logger.warning(
            "Reranker disabled — no loadable model in %s. "
            "Falling back to vector ordering.",
            sources,
        )
        return None

    return _model


def is_available() -> bool:
    """True when the CrossEncoder is enabled and loadable. Loads it if needed."""
    if not settings.RERANKER_ENABLED:
        return False
    return _load_model() is not None


def reset() -> None:
    """Drop the cached model. Tests only."""
    global _model, _load_failed
    with _model_lock:
        _model = None
        _load_failed = False


# ── Scoring ──────────────────────────────────────────────────────────────────

def _document(hit: SearchHit) -> str:
    """Text handed to the CrossEncoder for one hit.

    hit.text is the textualizer output, which already opens with
    "Category: ... / Name: ... / Animal: ...", so the entity identity sits
    inside the truncation window even for long disease records. The name is
    reconstructed from metadata only when the text is empty, so an entity is
    never scored blind.
    """
    text = (hit.text or "").strip()
    if text:
        return text

    meta = hit.metadata or {}
    name = meta.get("name", "")
    category = meta.get("category", "")
    return f"{category}: {name}".strip(": ")


def _unscored(
    hits: list[SearchHit],
    top_n: int | None,
) -> list[tuple[SearchHit, float]]:
    """Fallback result: incoming vector order, neutral scores."""
    pairs = [(hit, 0.0) for hit in hits]
    return pairs[:top_n] if top_n is not None else pairs


def rerank_with_scores(
    question: str,
    hits: list[SearchHit],
    top_n: int | None = None,
    model=None,
) -> list[tuple[SearchHit, float]]:
    """Score (question, hit) pairs and return (hit, score) best-first.

    Parameters
    ----------
    question : the user's original question — NOT the HyDE answer. The
        CrossEncoder is trained on real query/passage pairs, and a synthetic
        hypothetical answer scores like a document, not like a query.
    hits : candidates, already deduped and threshold-filtered.
    top_n : keep only this many. None keeps all.
    model : injectable CrossEncoder-like object exposing .predict(pairs).

    Falls back to the incoming order (score 0.0) whenever the model is
    unavailable or scoring raises.
    """
    if not hits:
        return []

    if not question or not question.strip():
        return _unscored(hits, top_n)

    if model is None:
        if not settings.RERANKER_ENABLED:
            logger.debug("Reranker disabled by settings — keeping vector order.")
            return _unscored(hits, top_n)
        model = _load_model()

    if model is None:
        return _unscored(hits, top_n)

    # A pathological pool must not turn one retrieval into a multi-second CPU
    # job. The cap is applied to the vector-ranked list, so the candidates it
    # drops are the ones the bi-encoder liked least anyway.
    capped = hits[: settings.RERANKER_MAX_CANDIDATES]
    overflow = hits[settings.RERANKER_MAX_CANDIDATES :]

    pairs = [(question, _document(hit)) for hit in capped]

    try:
        raw_scores = model.predict(
            pairs,
            batch_size=settings.RERANKER_BATCH_SIZE,
            show_progress_bar=False,
        )
    except TypeError:
        # Injected fakes and older CrossEncoder builds may not accept kwargs.
        try:
            raw_scores = model.predict(pairs)
        except Exception as exc:
            logger.warning("Rerank failed (%s) — keeping vector order.", exc)
            return _unscored(hits, top_n)
    except Exception as exc:
        logger.warning("Rerank failed (%s) — keeping vector order.", exc)
        return _unscored(hits, top_n)

    scores = [float(score) for score in raw_scores]

    if len(scores) != len(capped):
        logger.warning(
            "Reranker returned %d scores for %d candidates — keeping vector order.",
            len(scores), len(capped),
        )
        return _unscored(hits, top_n)

    # sorted() is stable, so equal scores keep their incoming vector rank.
    ranked: list[tuple[SearchHit, float]] = sorted(
        zip(capped, scores),
        key=lambda pair: pair[1],
        reverse=True,
    )

    # Candidates beyond the cap were never scored; they stay strictly below
    # everything that was, in their original vector order.
    ranked.extend((hit, float("-inf")) for hit in overflow)

    if top_n is not None:
        ranked = ranked[:top_n]

    return ranked


def rerank(
    question: str,
    hits: list[SearchHit],
    top_n: int | None = None,
    model=None,
) -> list[SearchHit]:
    """Same SearchHit objects, sorted by CrossEncoder relevance to `question`."""
    return [hit for hit, _ in rerank_with_scores(question, hits, top_n, model)]
