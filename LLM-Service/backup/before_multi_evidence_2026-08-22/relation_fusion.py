"""Relation-aware candidate expansion and intent-aware rank fusion.

The problem this solves
-----------------------
Bi-encoder retrieval answers "what text looks like the question". A symptom
question ("my dog seems tired and has no energy") therefore returns *other
symptom descriptions*, and the disease that explains the complaint is not in
the neighbour list at any pool width -- the threshold sweep showed Recall@5
pinned at 0.717 across every threshold from 0.55 down to 0.35 and every pool
from 10 to 30. The missing entity is not badly ranked, it is absent.

The KB already states the link the query is asking about:

    Lethargy --possible_diseases--> Canine Distemper

So: vector search finds the *anchor*, and the authored relations supply the
*inference*. No lexical method can do this -- the words "Canine Distemper" do
not appear in the question.

Scoring
-------
Deterministic rank fusion, no training, no second neural model:

    final_score = vector_component + relation_support + intent_bonus

    vector_component   rank_score(vector rank), 0 if the entity was never a
                       vector neighbour
    relation_support   accumulated over the edges that reached the entity,
                       each weighted by relationship type, intent, pass depth
                       and the rank of the anchor it came from
    intent_bonus       additive, from query_intent

An expanded entity is deliberately NOT given distance 0.0. It carries no
vector evidence at all; pretending otherwise would put an inferred entity above
a directly matched one.

Safety
------
Expansion is anchored to retrieved evidence: it starts only from the top
`anchor_top_n` entities that actually survived the vector threshold, and runs
at most `max_passes` (2) hops. Arbitrary KB traversal is impossible by
construction.
"""
from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field

from RAG_System.config import settings
from RAG_System.indexing.vector_store import SearchHit, VectorStore, get_store
from RAG_System.retrieval.query_intent import QueryIntent, detect
from RAG_System.retrieval.relation_graph import Edge, RelationGraph, get_graph

logger = logging.getLogger(__name__)


# ── Relationship weights ─────────────────────────────────────────────────────
#
# Keyed by the direction the KB *author* wrote the link in, not by the direction
# we happen to walk it. That distinction is the whole ranking signal:
#
#   symptoms.possible_diseases    "if you see this, consider these"  -> strong
#   diseases.symptoms             "this illness presents like this"  -> weak as
#                                 a diagnostic inference, because every disease
#                                 that mentions Hematuria would otherwise become
#                                 an equally good answer to "blood in the urine"
#   medications.related_diseases  "this drug treats these"           -> strong,
#                                 and it is the *only* place that claim is
#                                 written, so walking it backwards from a
#                                 disease anchor must stay strong
#
# The first run keyed on the traversal direction instead and put Urinary Tract
# Infection above Leptospirosis for "blood in my dog's urine", purely because
# more diseases happen to list Hematuria than Hematuria lists diseases.

_RELATION_WEIGHTS: dict[tuple[str, str], float] = {
    ("symptoms", "diseases"): 0.85,
    ("symptoms", "diagnostics"): 0.45,
    ("symptoms", "emergency"): 0.35,
    ("diseases", "medications"): 0.85,
    ("diseases", "medical_products"): 0.80,
    ("diseases", "diagnostics"): 0.45,
    ("diseases", "vaccines"): 0.40,
    ("diseases", "emergency"): 0.35,
    ("diseases", "symptoms"): 0.30,
    ("diseases", "breeds"): 0.25,
    ("medications", "diseases"): 0.85,
    ("medications", "medical_products"): 0.60,
    ("medical_products", "diseases"): 0.80,
    ("medical_products", "medications"): 0.45,
    ("diagnostics", "diseases"): 0.40,
    ("vaccines", "diseases"): 0.40,
    ("emergency", "diseases"): 0.40,
    ("emergency", "symptoms"): 0.30,
    ("breeds", "diseases"): 0.35,
}

_DEFAULT_RELATION_WEIGHT = 0.30


@dataclass(frozen=True)
class FusionParams:
    """Every knob in one place, so a configuration is reproducible."""

    anchor_top_n: int = 7          # vector hits allowed to seed expansion
    pass2_top_m: int = 5           # pass-1 candidates allowed to seed pass 2
    max_passes: int = 2            # hard cap -- section 8 of the brief
    rank_k: int = 10               # rank_score softness
    pass_decay: tuple[float, ...] = (1.0, 0.35)
    reverse_penalty: float = 0.90  # traversing against the authored direction
    relation_cap: float = 1.80     # runaway guard only -- rarely binds
    max_edges_per_anchor: int = 40
    vector_weight: float = 1.0
    relation_boost: float = 1.8    # global gain on relation evidence
    inferred_penalty: float = 1.0  # scale for entities with no vector evidence
    min_relation_score: float = 0.0  # admission floor for inferred entities
    pin_anchor: str = "on_target"  # "always" | "on_target" | "off"
    enable_reverse: bool = True
    category_decay: float = 0.0    # 0 disables diversified selection


def params_from_settings() -> FusionParams:
    """The production configuration, so ops can tune without a code change."""
    return FusionParams(
        anchor_top_n=getattr(settings, "RELATION_ANCHOR_TOP_N", 4),
        max_passes=getattr(settings, "RELATION_MAX_PASSES", 2),
        relation_boost=getattr(settings, "RELATION_BOOST", 1.7),
        pin_anchor=getattr(settings, "RELATION_PIN_ANCHOR", "on_target"),
        min_relation_score=getattr(settings, "RELATION_MIN_SCORE", 0.35),
    )


DEFAULT_PARAMS = params_from_settings()


@dataclass
class Support:
    """Why an entity is a candidate. Kept for the report and for defence."""

    entity_id: str
    name: str = ""
    category: str = ""
    vector_rank: int = 0
    vector_distance: float | None = None
    edges: list[dict] = field(default_factory=list)
    relation_score: float = 0.0
    vector_score: float = 0.0
    intent_bonus: float = 0.0
    final_score: float = 0.0


def rank_score(rank: int, rank_k: int) -> float:
    """1-based rank -> (0, 1]. rank 1 -> 0.909 at rank_k=10, rank 30 -> 0.25."""
    return rank_k / (rank_k + rank)


def _specificity(list_size: int) -> float:
    """How exclusive the authored list that carried this edge is.

    `Slow Feeder Bowl.related_diseases = [GDV]` is a one-item list: the product
    exists *for* that disease, so the edge is near-certain evidence. A disease
    that lists ten symptoms says much less about any one of them. Without this,
    every entity reachable from a rank-1 anchor scores identically and the
    relation signal carries no ordering information at all -- which is exactly
    what the first run showed (every expanded disease pinned at the cap).

    1/sqrt(n): full weight at n=1, 0.71 at n=2, 0.32 at n=10.
    """
    return 1.0 / math.sqrt(max(list_size, 1))


def _edge_weight(edge: Edge, intent: QueryIntent, params: FusionParams) -> float:
    # The authored pair, not the walked pair.
    authored = (
        (edge.source_category, edge.target_category)
        if edge.forward
        else (edge.target_category, edge.source_category)
    )
    base = _RELATION_WEIGHTS.get(authored, _DEFAULT_RELATION_WEIGHT)
    if not edge.forward:
        base *= params.reverse_penalty
    return (
        base
        * _specificity(edge.list_size)
        * intent.weight_for(edge.target_category)
        * params.relation_boost
    )


def _accumulate(supports: list[float], cap: float) -> float:
    """Diminishing-returns sum: s0 + s1/2 + s2/3 ... capped.

    Plain summation would let a hub entity linked from five anchors outrank the
    top vector hit purely by degree. Diminishing returns still rewards an
    entity that several independent anchors agree on -- which is exactly the
    signal that separates the right disease from its five siblings under the
    same symptom -- without letting graph degree dominate.
    """
    ordered = sorted(supports, reverse=True)
    total = sum(value / (index + 1) for index, value in enumerate(ordered))
    return min(total, cap)


def _diversify(
    scored: list[tuple[float, float, SearchHit]],
    decay: float,
    primary: tuple[str, ...],
) -> list[SearchHit]:
    """Greedy selection with a repeated-category penalty.

    A question like "my dog is vomiting blood, what could be wrong?" expects a
    symptom *and* the disease behind it. Pure score order fills the head of the
    list with four more symptoms that share the same vocabulary, and pushes the
    explaining disease to rank 8. Charging each additional entity of an
    already-represented category `1/(1 + decay*seen)` makes the list answer the
    question in both halves without hard-filtering anything: a category that
    genuinely dominates still keeps consecutive slots, it just has to earn them.

    The penalty applies only to the intent's *primary* categories -- the ones
    the answer is supposed to span. Charging it to every category as well made
    off-target entities (emergency protocols, diagnostics) float into the top 5
    and cost 0.19 of Category Precision@5 for 0.016 of Recall@5.

    decay = 0 restores plain score order.
    """
    if decay <= 0.0 or not scored:
        return [item[2] for item in scored]

    remaining = list(scored)
    seen: dict[str, int] = {}
    out: list[SearchHit] = []
    while remaining:
        best_index, best_key = 0, None
        for index, (score, tie, hit) in enumerate(remaining):
            category = (hit.metadata or {}).get("category", "")
            penalty = (
                1.0 + decay * seen.get(category, 0)
                if category in primary
                else 1.0
            )
            adjusted = score / penalty
            key = (adjusted, tie)
            if best_key is None or key > best_key:
                best_index, best_key = index, key
        _, _, hit = remaining.pop(best_index)
        category = (hit.metadata or {}).get("category", "")
        seen[category] = seen.get(category, 0) + 1
        out.append(hit)
    return out


def expand_and_fuse(
    query: str,
    hits: list[SearchHit],
    *,
    animal: str | None = None,
    store: VectorStore | None = None,
    graph: RelationGraph | None = None,
    intent: QueryIntent | None = None,
    params: FusionParams = DEFAULT_PARAMS,
    return_supports: bool = False,
):
    """Expand `hits` along KB relations, then re-rank everything by fusion.

    `hits` must already be deduped and threshold-filtered, ordered by distance
    (that is exactly what retriever.retrieve() has at that point).

    Returns the fused, ordered SearchHit list -- or `(hits, supports)` when
    `return_supports` is set, which the evaluation scripts use to report *why*
    each entity ranked where it did.
    """
    if not hits:
        return ([], {}) if return_supports else []

    _store = store or get_store()
    _graph = graph or get_graph()
    _intent = intent or detect(query)

    supports: dict[str, Support] = {}
    known: dict[str, SearchHit] = {}

    for rank, hit in enumerate(hits, start=1):
        meta = hit.metadata or {}
        known[hit.id] = hit
        supports[hit.id] = Support(
            entity_id=hit.id,
            name=meta.get("name", ""),
            category=meta.get("category", ""),
            vector_rank=rank,
            vector_distance=hit.distance,
            vector_score=params.vector_weight * rank_score(rank, params.rank_k),
        )

    # ── Relation passes ──────────────────────────────────────────────────────
    #
    # Pass 1 seeds from vector anchors only. Pass 2 seeds from the strongest
    # pass-1 candidates, so the walk stays anchored to retrieved evidence.
    raw_support: dict[str, list[float]] = {}
    frontier: list[tuple[str, int]] = [
        (hit.id, rank)
        for rank, hit in enumerate(hits[: params.anchor_top_n], start=1)
    ]
    discovered: set[str] = set()

    for pass_index in range(params.max_passes):
        if not frontier:
            break
        decay = (
            params.pass_decay[pass_index]
            if pass_index < len(params.pass_decay)
            else params.pass_decay[-1]
        )
        pass_hits: dict[str, list[float]] = {}
        pass_edges: dict[str, list[dict]] = {}

        for anchor_id, anchor_rank in frontier:
            anchor_weight = rank_score(anchor_rank, params.rank_k) * decay
            edges = _graph.edges(anchor_id, include_reverse=params.enable_reverse)
            # Keep the *strongest* edges, not the first ones the index happened
            # to emit. A hub entity such as GDV carries dozens of reverse edges;
            # truncating in storage order silently dropped the one-item, highly
            # specific link (Slow Feeder Bowl -> GDV) that actually answers the
            # question.
            weighted = sorted(
                (
                    (_edge_weight(edge, _intent, params), edge)
                    for edge in edges
                ),
                key=lambda pair: pair[0],
                reverse=True,
            )[: params.max_edges_per_anchor]
            for weight, edge in weighted:
                if weight <= 0.0:
                    continue
                value = weight * anchor_weight
                pass_hits.setdefault(edge.target_id, []).append(value)
                pass_edges.setdefault(edge.target_id, []).append({
                    "from": anchor_id,
                    "from_name": supports[anchor_id].name
                    if anchor_id in supports else "",
                    "anchor_rank": anchor_rank,
                    "relation": f"{edge.source_category}->{edge.target_category}",
                    "authored": "{}->{}".format(*(
                        (edge.source_category, edge.target_category)
                        if edge.forward
                        else (edge.target_category, edge.source_category)
                    )),
                    "direction": "forward" if edge.forward else "reverse",
                    "list_size": edge.list_size,
                    "pass": pass_index + 1,
                    "support": round(value, 4),
                })

        for target_id, values in pass_hits.items():
            raw_support.setdefault(target_id, []).extend(values)
            discovered.add(target_id)

        # Seed the next pass from the best of what this pass produced.
        ordered = sorted(
            pass_hits.items(), key=lambda kv: max(kv[1]), reverse=True
        )[: params.pass2_top_m]
        frontier = [
            (target_id, position)
            for position, (target_id, _) in enumerate(ordered, start=1)
        ]

        for target_id, edge_list in pass_edges.items():
            supports.setdefault(target_id, Support(entity_id=target_id))
            supports[target_id].edges.extend(edge_list)

    # ── Materialise the entities the graph produced ──────────────────────────
    missing = sorted(entity_id for entity_id in discovered if entity_id not in known)
    if missing:
        try:
            for doc in _store.get_by_ids(missing):
                doc_id = (doc.get("id") or "").strip()
                meta = doc.get("metadata") or {}
                if not doc_id:
                    continue
                if animal and meta.get("animal") and meta["animal"] != animal:
                    continue
                known[doc_id] = SearchHit(
                    id=doc_id,
                    text=doc.get("text", ""),
                    metadata=meta,
                    # No vector evidence exists for an inferred entity. The
                    # sentinel keeps it distinguishable downstream; it is never
                    # read as a similarity.
                    distance=1.0,
                )
        except Exception as exc:  # noqa: BLE001
            logger.warning("relation expansion: get_by_ids failed: %s", exc)

    # ── Score ────────────────────────────────────────────────────────────────
    scored: list[tuple[float, float, SearchHit]] = []
    dropped_weak = 0
    for entity_id, hit in known.items():
        meta = hit.metadata or {}
        support = supports.setdefault(entity_id, Support(entity_id=entity_id))
        support.name = meta.get("name", "") or support.name
        support.category = meta.get("category", "") or support.category
        support.relation_score = _accumulate(
            raw_support.get(entity_id, []), params.relation_cap
        )
        support.intent_bonus = _intent.bonus_for(support.category)
        support.final_score = (
            support.vector_score + support.relation_score + support.intent_bonus
        ) * _intent.scale_for(support.category)
        if support.vector_rank == 0:
            # Purely inferred: the entity never appeared as a neighbour of the
            # question or of the HyDE answer. It is a legitimate candidate, but
            # direct similarity evidence outranks inference at the head of the
            # list -- otherwise raising the relation gain enough to recover the
            # missing diseases also evicts the correctly matched anchor from
            # rank 1 and costs Precision@1 and MRR.
            support.final_score *= params.inferred_penalty
        if (
            support.vector_rank == 0
            and support.relation_score < params.min_relation_score
        ):
            # Purely inferred *and* weakly linked. Without this floor a
            # definitional question ("What is Canine Parvovirus?") -- which has
            # only two or three real neighbours above the threshold -- gets its
            # list filled with the disease's own symptom list walked backwards,
            # and the genuinely relevant vaccine is trimmed out of the LLM
            # context. Entities with vector evidence are never affected.
            dropped_weak += 1
            continue
        # Tie-break on real similarity, so equal-score entities keep the
        # vector ordering instead of dict ordering.
        scored.append((support.final_score, -hit.distance, hit))

    scored.sort(key=lambda item: (item[0], item[1]), reverse=True)
    ordered_hits = _diversify(scored, params.category_decay, _intent.primary)

    anchor_category = (hits[0].metadata or {}).get("category", "")
    pin = params.pin_anchor == "always" or (
        params.pin_anchor == "on_target"
        and anchor_category in _intent.primary
    )
    if pin and ordered_hits and ordered_hits[0].id != hits[0].id:
        # The nearest neighbour of the question keeps rank 1. Relation support
        # is *inference about* the anchor -- "given Lethargy, consider
        # Hypothyroidism" -- so letting it overtake the anchor answers a
        # question the user did not ask and costs Precision@1 and MRR outright
        # (0.767 -> 0.700 and 0.872 -> 0.825 in the gain sweep). Everything
        # below rank 1 keeps its fused order, so the recall gain is untouched.
        anchor = hits[0]
        ordered_hits = [anchor] + [
            hit for hit in ordered_hits if hit.id != anchor.id
        ]

    logger.info(
        "relation fusion: intent=%s(%r) vector=%d expanded=%d weak=%d fused=%d",
        _intent.name, _intent.matched, len(hits),
        len(known) - len(hits), dropped_weak, len(ordered_hits),
    )

    if return_supports:
        return ordered_hits, supports
    return ordered_hits


__all__ = [
    "DEFAULT_PARAMS",
    "params_from_settings",
    "FusionParams",
    "Support",
    "expand_and_fuse",
    "rank_score",
]
