"""
Context Expansion — Multi-Pass
================================
Pass 1 → original hits  (symptoms → diseases, emergency, diagnostics)
Pass 2 → hits from pass 1 (diseases → medications, vaccines, diagnostics, products)
"""
from __future__ import annotations

import logging

from RAG_System.indexing.vector_store import SearchHit, VectorStore, get_store

logger = logging.getLogger(__name__)

_EXPANSION_MAP: dict[str, list[str]] = {
    "symptoms": [
        "emergency_ids",
        "related_disease_ids",
        "related_diagnostic_ids",
    ],
    "diseases": [
        "related_emergency_ids",
        "related_medication_ids",
        "related_vaccine_ids",
        "related_diagnostic_ids",
        "related_product_ids",
    ],
    "medications": [
        "related_product_ids",
    ],
    "breeds": [
        "related_disease_ids",
    ],
}

MAX_PASSES = 2


def expand(
    hits: list[SearchHit],
    animal: str | None = None,
    store: VectorStore | None = None,
) -> list[SearchHit]:
    """
    يوسّع الـ hits عبر جلب الكيانات المرتبطة مباشرة بالـ ID.

    Returns
    -------
    list[SearchHit]
        القائمة الأصلية + الكيانات المرتبطة.
        الكيانات المُضافة لها distance=0.0.
    """
    if not hits:
        return []

    _store = store or get_store()
    seen_ids: set[str] = {hit.id for hit in hits}
    expanded: list[SearchHit] = list(hits)
    frontier: list[SearchHit] = list(hits)

    for pass_num in range(1, MAX_PASSES + 1):
        if not frontier:
            break

        ids_to_fetch: set[str] = set()
        for hit in frontier:
            meta = hit.metadata or {}
            category = meta.get("category", "")
            for key in _EXPANSION_MAP.get(category, []):
                raw_ids = meta.get(key, "")
                if not raw_ids:
                    continue
                for one_id in raw_ids.split(","):
                    one_id = one_id.strip()
                    if one_id and one_id not in seen_ids:
                        ids_to_fetch.add(one_id)

        if not ids_to_fetch:
            break

        logger.debug(
            "expand: pass %d — fetching %d IDs", pass_num, len(ids_to_fetch)
        )

        try:
            related_docs = _store.get_by_ids(sorted(ids_to_fetch))
        except Exception as exc:
            logger.warning("expand: pass %d — get_by_ids failed: %s", pass_num, exc)
            break

        next_frontier: list[SearchHit] = []
        for doc in related_docs:
            doc_id = (doc.get("id") or "").strip()
            if not doc_id or doc_id in seen_ids:
                continue
            new_hit = SearchHit(
                id=doc_id,
                text=doc.get("text", ""),
                metadata=doc.get("metadata", {}),
                distance=0.0,
            )
            expanded.append(new_hit)
            seen_ids.add(doc_id)
            next_frontier.append(new_hit)

        frontier = next_frontier

    logger.debug(
        "expand: %d original → %d expanded", len(hits), len(expanded)
    )
    return expanded