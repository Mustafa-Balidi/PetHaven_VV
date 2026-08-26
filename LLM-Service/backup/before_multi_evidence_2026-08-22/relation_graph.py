"""Inverted index over the KB links that are already in ChromaDB metadata.

This does **not** re-derive the knowledge graph. `metadata.extract()` already
flattened every relationship into comma-separated `*_ids` strings at index time;
this module only reads those same strings back and stores them as adjacency,
plus the reverse direction, which the flattened form does not give you.

Why the reverse direction matters
---------------------------------
The KB is authored asymmetrically. `DOG_MED_018` (Enrofloxacin) declares
`related_diseases: [DOG_DIS_003 Canine Infectious Hepatitis]`, but
`DOG_DIS_003` declares no `recommended_medications` at all. Walking forward
from the disease anchor therefore reaches nothing, and the question
"What medication treats Canine Infectious Hepatitis?" cannot be answered from
the graph. The same edge read backwards answers it. Reverse edges are weaker
evidence than authored ones and are scored as such (see relation_fusion).

`RAG_System/retrieval/context_expander.py` keeps its own forward-only walk: it
runs *after* retrieval to enrich the LLM context and must stay conservative.
This index feeds *candidate generation*, which is a different job.
"""
from __future__ import annotations

import logging
import threading
from collections import defaultdict
from dataclasses import dataclass

from RAG_System.indexing.vector_store import VectorStore, get_store

logger = logging.getLogger(__name__)

# Metadata keys holding relationship IDs, and the direction they were authored
# in. Everything here already exists in the index -- nothing new is computed.
_RELATION_KEYS = (
    "related_disease_ids",
    "related_symptom_ids",
    "related_medication_ids",
    "related_diagnostic_ids",
    "related_vaccine_ids",
    "related_product_ids",
    "related_emergency_ids",
    "related_breed_ids",
    "emergency_ids",
)


@dataclass(frozen=True)
class Edge:
    """One KB link, seen from the anchor side."""

    target_id: str
    source_category: str
    target_category: str
    forward: bool
    position: int   # index within the authored list, 0-based
    list_size: int  # length of the authored list this edge came from


class RelationGraph:
    """Forward and reverse adjacency for every indexed entity."""

    def __init__(self, metadatas: dict[str, dict[str, str]]):
        self._category: dict[str, str] = {
            entity_id: (meta.get("category") or "")
            for entity_id, meta in metadatas.items()
        }
        forward: dict[str, list[Edge]] = defaultdict(list)
        reverse: dict[str, list[Edge]] = defaultdict(list)

        for source_id, meta in metadatas.items():
            source_category = self._category.get(source_id, "")
            for key in _RELATION_KEYS:
                raw = meta.get(key) or ""
                if not raw:
                    continue
                parts = [part.strip() for part in raw.split(",")]
                parts = [part for part in parts if part]
                list_size = max(len(parts), 1)
                for position, target_id in enumerate(parts):
                    if not target_id or target_id == source_id:
                        continue
                    target_category = self._category.get(target_id)
                    if target_category is None:
                        # Dangling reference: the KB names an entity that is not
                        # indexed. Silently skipped -- scripts/audit_kb_references
                        # is the place that reports those.
                        continue
                    forward[source_id].append(
                        Edge(target_id, source_category, target_category,
                             True, position, list_size)
                    )
                    reverse[target_id].append(
                        Edge(source_id, target_category, source_category,
                             False, position, list_size)
                    )

        self._forward = dict(forward)
        self._reverse = dict(reverse)
        logger.info(
            "RelationGraph: %d entities, %d forward edges, %d reverse edges",
            len(self._category),
            sum(len(v) for v in self._forward.values()),
            sum(len(v) for v in self._reverse.values()),
        )

    def category(self, entity_id: str) -> str:
        return self._category.get(entity_id, "")

    def edges(self, entity_id: str, include_reverse: bool = True) -> list[Edge]:
        """Every link touching `entity_id`, anchor-side view."""
        out = list(self._forward.get(entity_id, ()))
        if include_reverse:
            out.extend(self._reverse.get(entity_id, ()))
        return out

    def __len__(self) -> int:
        return len(self._category)


# ── Process-wide singleton ───────────────────────────────────────────────────
#
# Built once from a single ChromaDB `get()`. ~4k entities, a few hundred
# milliseconds, then pure dict lookups on every query.

_graph_lock = threading.Lock()
_default_graph: RelationGraph | None = None


def get_graph(store: VectorStore | None = None) -> RelationGraph:
    """Shared RelationGraph. Pass `store` in tests to build an isolated one."""
    global _default_graph
    if store is not None:
        return RelationGraph(store.all_metadatas())
    if _default_graph is None:
        with _graph_lock:
            if _default_graph is None:
                _default_graph = RelationGraph(get_store().all_metadatas())
    return _default_graph


def reset_graph() -> None:
    """Drop the cached graph. Used after re-indexing and by tests."""
    global _default_graph
    with _graph_lock:
        _default_graph = None
