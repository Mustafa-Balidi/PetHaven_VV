"""Lexical (BM25) retrieval over the same 4046 entities as the vector index.

There is one knowledge base. This module reads the documents ChromaDB already
stores -- the textualized entity, which already carries `Name:`, `Also known
as:`, `Category:`, `Animal:` and the description -- and builds a BM25Okapi
index over them. Nothing is re-authored and no second corpus exists.

What it is for
--------------
The bi-encoder is a semantic instrument and a poor literal one. When the
question names the entity outright ("What medication treats Canine Infectious
Hepatitis?") the embedding still returns every hepatitis-shaped neighbour, and
the exact entity can lose to a near-duplicate. Lexical matching is exact where
the embedding is fuzzy, so it is complementary evidence -- it is fused with the
vector ranking, never substituted for it.

What it is NOT for
------------------
BM25 cannot supply an entity the question never names. "My dog seems tired and
has no energy" contains no lexical trace of "Canine Distemper"; that inference
comes from the KB relations (see relation_fusion.py). The two mechanisms solve
different halves of the problem.

Tokenization
------------
Deliberately conservative and identical for corpus and query: unicode NFKC,
casefold, punctuation split, no stemming. Hyphenated compounds are kept whole
*and* split, so "Gastric Dilatation-Volvulus" matches a query that writes
"dilatation volvulus" and one that writes "dilatation-volvulus". Stemming is
avoided on purpose: "Benazepril", "Enrofloxacin" and "Metoclopramide" are
proper names, and a stemmer collapses drug names that differ by one suffix.
"""
from __future__ import annotations

import logging
import re
import threading
import unicodedata

from RAG_System.config import settings
from RAG_System.indexing.vector_store import SearchHit, VectorStore, get_store

logger = logging.getLogger(__name__)

# Words plus hyphenated compounds. `\w` keeps digits, so "Adenovirus-1" and
# "B12" survive intact.
_TOKEN = re.compile(r"\w+(?:-\w+)*", re.UNICODE)


def tokenize(text: str) -> list[str]:
    """Corpus and query MUST go through this same function."""
    normalized = unicodedata.normalize("NFKC", text or "").casefold()
    tokens: list[str] = []
    for token in _TOKEN.findall(normalized):
        tokens.append(token)
        if "-" in token:
            # Keep the compound AND its parts, so neither spelling of a
            # hyphenated medical term can miss.
            tokens.extend(part for part in token.split("-") if part)
    return tokens


def _norm_phrase(text: str) -> str:
    """Normalized surface form used for exact name/alias matching."""
    return " ".join(tokenize(text))


class BM25Index:
    """BM25Okapi over the ChromaDB documents, with metadata filtering."""

    def __init__(self, documents: list[dict]):
        from rank_bm25 import BM25Okapi  # noqa: PLC0415  (optional dependency)

        self._ids: list[str] = []
        self._texts: list[str] = []
        self._metadatas: list[dict] = []
        self._animals: list[str] = []
        self._categories: list[str] = []
        corpus: list[list[str]] = []

        # {normalized name or alias -> [corpus positions]}. Built from the same
        # metadata the retrieval filters use, so the exact-name rule is generic:
        # no evaluation entity is named anywhere in this module.
        self._by_phrase: dict[str, list[int]] = {}

        for position, doc in enumerate(documents):
            meta = doc.get("metadata") or {}
            self._ids.append(doc["id"])
            self._texts.append(doc.get("text", ""))
            self._metadatas.append(meta)
            self._animals.append(meta.get("animal", ""))
            self._categories.append(meta.get("category", ""))
            corpus.append(tokenize(self._document_text(doc, meta)))

            for phrase in self._phrases(meta):
                if len(phrase) >= _MIN_PHRASE_CHARS:
                    self._by_phrase.setdefault(phrase, []).append(position)

        self._bm25 = BM25Okapi(corpus) if corpus else None
        logger.info(
            "BM25Index: %d documents, %d indexed name/alias phrases",
            len(self._ids), len(self._by_phrase),
        )

    # ── Document construction ────────────────────────────────────────────────

    @staticmethod
    def _document_text(doc: dict, meta: dict) -> str:
        """name + aliases + category + animal + the textualized entity.

        The stored document already opens with those fields, but they are
        prepended from metadata as well: it guarantees the fields are present
        for every entity regardless of how its schema was textualized, and it
        gives the entity's own name a second occurrence, which is what makes a
        question that quotes the name score it above a document that merely
        mentions it.
        """
        header = [
            f"Name: {meta.get('name', '')}",
            f"Aliases: {meta.get('aliases', '')}",
            f"Category: {meta.get('category', '')}",
            f"Animal: {meta.get('animal', '')}",
        ]
        return "\n".join(header) + "\n" + (doc.get("text") or "")

    @staticmethod
    def _phrases(meta: dict) -> list[str]:
        """Normalized name and aliases of one entity."""
        out = []
        name = meta.get("name", "")
        if name:
            out.append(_norm_phrase(name))
            # "Gastric Dilatation-Volvulus (Gdv / Bloat)" -> also the part
            # before the parenthetical, which is how people write it.
            bare = re.split(r"[(\[/]", name)[0]
            if bare and bare != name:
                out.append(_norm_phrase(bare))
        for alias in (meta.get("aliases") or "").split(","):
            alias = alias.strip()
            if alias:
                out.append(_norm_phrase(alias))
        return [phrase for phrase in out if phrase]

    # ── Exact-name detection ─────────────────────────────────────────────────

    def exact_name_matches(self, query: str) -> set[int]:
        """Corpus positions whose name or alias appears verbatim in `query`.

        Generic: driven entirely by the indexed `name` / `aliases` metadata.
        A question that quotes an entity is direct evidence about that entity,
        and BM25 term saturation alone does not always express that -- a long
        document mentioning the name many times can outscore the entity itself.
        """
        normalized = _norm_phrase(query)
        if not normalized:
            return set()
        padded = f" {normalized} "
        found: set[int] = set()
        for phrase, positions in self._by_phrase.items():
            if f" {phrase} " in padded:
                found.update(positions)
        return found

    # ── Search ───────────────────────────────────────────────────────────────

    def search(
        self,
        query: str,
        animal: str | None = None,
        category: str | None = None,
        top_k: int = 20,
    ) -> list[SearchHit]:
        """Top-`top_k` lexical hits, respecting the same filters as the vector
        search. A cat question can never return a dog entity, however high its
        lexical score."""
        if self._bm25 is None or top_k <= 0:
            return []

        tokens = tokenize(query)
        if not tokens:
            return []

        scores = self._bm25.get_scores(tokens)
        exact = self.exact_name_matches(query)

        allowed = range(len(self._ids))
        ranked = sorted(
            (
                position
                for position in allowed
                if (not animal or self._animals[position] == animal)
                and (not category or self._categories[position] == category)
                and (scores[position] > 0.0 or position in exact)
            ),
            # An exact name/alias quote outranks pure term frequency; ties fall
            # back to the BM25 score.
            key=lambda position: (position in exact, scores[position]),
            reverse=True,
        )[:top_k]

        return [
            SearchHit(
                id=self._ids[position],
                text=self._texts[position],
                metadata=self._metadatas[position],
                # BM25 produces a relevance score, not a distance. The sentinel
                # keeps a lexical-only hit distinguishable from a vector hit
                # downstream; it is never read as a similarity.
                distance=_NO_VECTOR_DISTANCE,
            )
            for position in ranked
        ]

    def scores_for(self, query: str) -> dict[str, float]:
        """{entity_id: bm25 score} for the whole corpus. Diagnostics only."""
        if self._bm25 is None:
            return {}
        scores = self._bm25.get_scores(tokenize(query))
        return dict(zip(self._ids, (float(value) for value in scores)))

    def __len__(self) -> int:
        return len(self._ids)


_MIN_PHRASE_CHARS = 4          # "gdv" is too short to match safely
_NO_VECTOR_DISTANCE = 1.0


# ── Process-wide singleton ───────────────────────────────────────────────────
#
# Built once from a single ChromaDB `get()`, like the RelationGraph. ~4k short
# documents; the build is well under a second and every query afterwards is a
# numpy dot product over the postings.

_index_lock = threading.Lock()
_default_index: BM25Index | None = None


def get_index(store: VectorStore | None = None) -> BM25Index | None:
    """Shared BM25Index, or None if the optional dependency is unavailable.

    Never fatal: a missing `rank_bm25` degrades the hybrid arm to the
    vector-only path rather than taking retrieval down.
    """
    global _default_index
    if store is not None:
        return BM25Index(store.all_documents())
    if _default_index is None:
        with _index_lock:
            if _default_index is None:
                try:
                    _default_index = BM25Index(get_store().all_documents())
                except Exception as exc:  # noqa: BLE001
                    logger.warning("BM25 index unavailable: %s", exc)
                    return None
    return _default_index


def reset_index() -> None:
    """Drop the cached index. Used after re-indexing and by tests."""
    global _default_index
    with _index_lock:
        _default_index = None


# ── Reciprocal Rank Fusion ───────────────────────────────────────────────────

def reciprocal_rank_fusion(
    ranked_lists: list[list[SearchHit]],
    k: int | None = None,
) -> list[SearchHit]:
    """Fuse ranked lists by RRF.

        score(entity) = sum over lists of 1 / (k + rank_in_that_list)

    Rank-based on purpose. Cosine distance and a BM25 score are not on a
    common scale and their ranges shift per query, so any weighted sum of the
    raw values ("0.7*cosine + 0.3*bm25") is arithmetic on incomparable units.
    RRF only needs the orderings.

    Duplicate entities keep the SearchHit from the first list that produced
    them, so a hit that carries a real vector distance keeps it.
    """
    rrf_k = settings.RRF_K if k is None else k

    scores: dict[str, float] = {}
    first_seen: dict[str, SearchHit] = {}
    for hits in ranked_lists:
        for rank, hit in enumerate(hits, start=1):
            scores[hit.id] = scores.get(hit.id, 0.0) + 1.0 / (rrf_k + rank)
            first_seen.setdefault(hit.id, hit)

    return [
        first_seen[entity_id]
        for entity_id in sorted(
            scores,
            key=lambda entity_id: (scores[entity_id], -first_seen[entity_id].distance),
            reverse=True,
        )
    ]


__all__ = [
    "BM25Index",
    "get_index",
    "reciprocal_rank_fusion",
    "reset_index",
    "tokenize",
]
