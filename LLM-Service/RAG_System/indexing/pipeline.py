"""Indexing pipeline: entities → ChromaDB (incremental by content hash)."""
from __future__ import annotations

import hashlib
import json
import logging
from dataclasses import dataclass
from typing import Iterable

from RAG_System.indexing import metadata as meta_mod
from RAG_System.indexing import textualizer, validator, vector_store
from RAG_System.indexing.embedder import Embedder
from RAG_System.indexing.loader import RawEntity

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class IndexReport:
    """Summary of one indexing run."""
    indexed: int   # new or changed documents successfully indexed
    skipped: int   # unchanged documents (content hash matched)
    failed: int    # invalid documents or failed embedding batches
    warned: int    # valid documents that had validation warnings

    @property
    def total(self) -> int:
        return self.indexed + self.skipped + self.failed


def _content_hash(text: str, meta: dict) -> str:
    """Hash of text + metadata together.

    If either the textualized text OR any metadata field changes,
    the document is re-indexed. This catches:
      - new metadata keys added in metadata.py
      - fixes to relationship ID extraction
      - textualizer changes
    """
    payload = json.dumps(
        {"text": text, "meta": meta},
        sort_keys=True,
        ensure_ascii=False,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def _prepare(entity: RawEntity) -> tuple[str, dict]:
    """Text + metadata with content_hash."""
    text = textualizer.to_text(entity)
    meta = meta_mod.extract(entity)
    # hash يُحسب قبل إضافة content_hash إلى meta (لتجنب الدورة)
    meta["content_hash"] = _content_hash(text, meta)
    return text, meta


def index_entities(
    entities: Iterable[RawEntity],
    embedder: Embedder,
    store: vector_store.VectorStore,
    *,
    batch_size: int = 100,
) -> IndexReport:
    """Validate → textualize → embed → upsert.

    Only documents whose content OR metadata changed are re-embedded.
    One bad entity or one bad batch never kills the run.
    """
    try:
        existing_hashes = store.ids_and_hashes()
    except Exception:
        existing_hashes = {}

    indexed = skipped = failed = warned = 0  # ← أضفنا warned
    batch_texts: list[str] = []
    batch_metas: list[dict[str, str]] = []
    batch_ids: list[str] = []

    def _flush() -> None:
        nonlocal indexed, failed
        if not batch_ids:
            return
        n = len(batch_ids)
        try:
            vectors = embedder.embed(batch_texts)
            store.upsert(
                ids=batch_ids,
                texts=batch_texts,
                embeddings=vectors,
                metadatas=batch_metas,
            )
            indexed += n
        except Exception as exc:
            failed += n
            logger.error("Batch failed (%s...): %s", batch_ids[:3], exc)
        finally:
            batch_texts.clear()
            batch_metas.clear()
            batch_ids.clear()

    for entity in entities:
        result = validator.validate(entity)
        if not result.valid:
            failed += 1
            logger.error("Invalid %s: %s", entity.path.name, result.errors)
            continue

        # ← أضفنا هذا الجزء: تتبع الـ warnings
        if result.warnings:
            warned += 1

        try:
            text, meta = _prepare(entity)
        except Exception as exc:
            failed += 1
            logger.error("Prepare failed %s: %s", entity.path.name, exc)
            continue

        if existing_hashes.get(meta["id"]) == meta["content_hash"]:
            skipped += 1
            continue

        batch_texts.append(text)
        batch_metas.append(meta)
        batch_ids.append(meta["id"])

        if len(batch_ids) >= batch_size:
            _flush()

    _flush()
    return IndexReport(indexed=indexed, skipped=skipped, failed=failed, warned=warned)