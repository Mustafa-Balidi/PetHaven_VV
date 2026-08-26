"""ChromaDB storage and search."""

from __future__ import annotations

import logging
import threading as _threading
from dataclasses import dataclass
from pathlib import Path

import chromadb

from RAG_System.config import settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class SearchHit:
    """One retrieval result."""

    id: str
    text: str
    metadata: dict[str, str]
    distance: float


class VectorStore:
    """Thin wrapper over a ChromaDB collection."""

    def __init__(self, path: Path | None = None, name: str | None = None):
        self._client = chromadb.PersistentClient(path=str(path or settings.CHROMA_DB_PATH))
        self._collection = self._client.get_or_create_collection(
            name=name or settings.COLLECTION_NAME,
            metadata={"hnsw:space": settings.DISTANCE_METRIC},
        )

    def upsert(
        self,
        ids: list[str],
        texts: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict[str, str]],
    ) -> None:
        """Insert or update documents. Safe to re-run."""
        self._collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )

    def search(
        self,
        vector: list[float],
        animal: str | None = None,
        category: str | None = None,
        top_k: int | None = None,
    ) -> list[SearchHit]:
        """Vector search with optional metadata filters."""
        where = None
        if animal and category:
            where = {"$and": [{"animal": animal}, {"category": category}]}
        elif animal:
            where = {"animal": animal}
        elif category:
            where = {"category": category}

        actual_count = self._collection.count()
        if actual_count == 0:
            logger.warning("ChromaDB is empty — run python index.py first.")
            return []

        k = min(top_k or settings.TOP_K, actual_count)

        results = self._collection.query(
            query_embeddings=[vector],
            n_results=k,
            where=where,
        )

        return [
            SearchHit(
                id=hit_id,
                text=results["documents"][0][i],
                metadata=results["metadatas"][0][i],
                distance=results["distances"][0][i],
            )
            for i, hit_id in enumerate(results["ids"][0])
        ]

    def count(self) -> int:
        """Number of documents in the collection."""
        return self._collection.count()
    def ids_and_hashes(self) -> dict[str, str]:
        """{entity_id → content_hash}. Used for incremental indexing."""
        raw = self._collection.get(include=["metadatas"])
        if not raw["ids"]:
            return {}
        return {
            doc_id: (meta or {}).get("content_hash", "")
            for doc_id, meta in zip(raw["ids"], raw["metadatas"])
        }
    def all_metadatas(self) -> dict[str, dict[str, str]]:
        """{entity_id → metadata}. Used to build the relation index once."""
        raw = self._collection.get(include=["metadatas"])
        if not raw["ids"]:
            return {}
        return {
            doc_id: (meta or {})
            for doc_id, meta in zip(raw["ids"], raw["metadatas"])
        }

    def get_by_ids(self, ids: list[str]) -> list[dict]:
        """Fetch documents by ID directly — no embedding call.

        Returns: [{"id": str, "text": str, "metadata": dict}, ...]
        """
        if not ids:
            return []

        raw = self._collection.get(
            ids=ids,
            include=["documents", "metadatas"],
        )

        return [
            {
                "id": doc_id,
                "text": doc,
                "metadata": meta or {},
            }
            for doc_id, doc, meta in zip(
                raw["ids"],
                raw["documents"],
                raw["metadatas"],
            )
        ]


# ── Process-wide singleton ───────────────────────────────────────────────────

_store_lock: _threading.Lock = _threading.Lock()
_default_store: "VectorStore | None" = None


def get_store() -> "VectorStore":
    """Shared VectorStore. One ChromaDB connection per process."""
    global _default_store
    if _default_store is None:
        with _store_lock:
            if _default_store is None:
                _default_store = VectorStore()
    return _default_store
