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
    rank_k: int = 10               # rank_score softness (vector component)
    anchor_rank_k: int = 10        # rank_score softness (anchor confidence)
    pass_decay: tuple[float, ...] = (1.0, 0.35)
    pass2_target_decay: float = 0.35   # pass-2 decay for on-intent categories
    reverse_penalty: float = 0.90  # traversing against the authored direction
    relation_cap: float = 1.80     # runaway guard only
    multi_evidence_decay: float = 1.0  # discount on the n-th supporting anchor
    exact_anchor_weight: float = 0.0   # 0 disables the named-entity anchor
    primary_relation_gain: float = 1.0  # extra gain on on-intent edges
    max_edges_per_anchor: int = 40
    vector_weight: float = 1.0
    relation_boost: float = 1.8    # global gain on relation evidence
    inferred_penalty: float = 1.0  # scale for entities with no vector evidence
    min_relation_score: float = 0.0  # admission floor for inferred entities
    pin_anchor: str = "on_target"  # "always" | "on_target" | "off"
    enable_reverse: bool = True
    category_decay: float = 0.0    # 0 disables diversified selection
    # Top-1 precision guard. "off" | "exact" | "intent" | "both".
    guard_mode: str = "off"
    guard_window: int = 3          # ranks 2..guard_window may be promoted
    guard_floor: float = 0.75      # candidate.final / rank1.final must clear


def params_from_settings() -> FusionParams:
    """The production configuration, so ops can tune without a code change."""
    return FusionParams(
        anchor_top_n=getattr(settings, "RELATION_ANCHOR_TOP_N", 4),
        max_passes=getattr(settings, "RELATION_MAX_PASSES", 2),
        relation_boost=getattr(settings, "RELATION_BOOST", 1.7),
        pin_anchor=getattr(settings, "RELATION_PIN_ANCHOR", "on_target"),
        min_relation_score=getattr(settings, "RELATION_MIN_SCORE", 0.35),
        anchor_rank_k=getattr(settings, "RELATION_ANCHOR_RANK_K", 10),
        pass2_target_decay=getattr(settings, "RELATION_PASS2_TARGET_DECAY", 0.35),
        multi_evidence_decay=getattr(settings, "RELATION_MULTI_EVIDENCE_DECAY", 1.0),
        exact_anchor_weight=getattr(settings, "RELATION_EXACT_ANCHOR_WEIGHT", 0.0),
        primary_relation_gain=getattr(settings, "RELATION_PRIMARY_GAIN", 1.0),
        reverse_penalty=getattr(settings, "RELATION_REVERSE_PENALTY", 0.90),
        relation_cap=getattr(settings, "RELATION_CAP", 1.80),
        category_decay=getattr(settings, "RELATION_CATEGORY_DECAY", 0.0),
        guard_mode=getattr(settings, "PRECISION_GUARD_MODE", "off"),
        guard_window=getattr(settings, "PRECISION_GUARD_WINDOW", 3),
        guard_floor=getattr(settings, "PRECISION_GUARD_FLOOR", 0.75),
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
    anchor_count: int = 0  # independent retrieved anchors that support it
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
    if edge.target_category in intent.primary:
        # The edge shape the question is literally asking about. "What
        # medication treats X" wants disease<->medication; "what monitoring
        # product helps" wants disease<->medical_product. This is a ranking
        # gain on top of intent.weight_for, never a filter -- an off-intent
        # but clinically relevant category still competes on its own evidence.
        base *= params.primary_relation_gain
    return (
        base
        * _specificity(edge.list_size)
        * intent.weight_for(edge.target_category)
        * params.relation_boost
    )


def _accumulate(
    per_anchor: dict[str, float], cap: float, decay: float
) -> float:
    """Multi-evidence sum over *independent* anchors, capped.

    `per_anchor` is already keyed by the retrieved anchor the evidence came
    from, holding that anchor's strongest edge to this entity. Two consequences:

    * the identical edge reached twice (a pass-1 anchor that is also a pass-2
      frontier entity, or two authored lists that name the same pair) is
      counted once, not twice;
    * an anchor that links to the entity through several parallel relations
      still counts as *one* piece of evidence, because it is one observation.

    Accumulation is the point of this stage. Under one symptom anchor,
    Lethargy -> {Distemper, Leptospirosis, Parvovirus, ...} gives every
    candidate disease the same score and the ranking carries no information.
    What separates the right disease from its siblings is that *several* of
    the retrieved anchors point at it: Lethargy and Weakness and Anorexia all
    reach Distemper, while Polyphagia reaches only one thing. Summing over
    distinct anchors is exactly that signal.

    The n-th anchor is discounted by 1/(1 + decay*n) so graph degree alone
    cannot win: decay=1.0 is the old harmonic series (1, 1/2, 1/3 ...) and
    barely rewards agreement; decay=0.4 gives (1, 0.71, 0.56, 0.45), so three
    independent anchors beat one strong one but ten weak ones still cannot
    outrun the cap.
    """
    ordered = sorted(per_anchor.values(), reverse=True)
    total = sum(
        value / (1.0 + decay * index) for index, value in enumerate(ordered)
    )
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


# ── Top-1 precision guard ────────────────────────────────────────────────────

# Intents with a single unambiguous target category. The symptomatic and
# definitional intents are deliberately absent: their `primary` spans several
# categories, so "is rank 1 on-intent" carries no information, and section 8
# of the brief requires the symptomatic head to stay as it is.
_SINGLE_PRIMARY_INTENTS = frozenset({
    "medications", "medical_products", "diagnostics", "breeds", "emergency",
})


def _precision_guard(
    ordered: list[SearchHit],
    supports: dict[str, Support],
    intent: QueryIntent,
    named: set[str],
    params: FusionParams,
) -> tuple[list[SearchHit], str]:
    """Optionally move ONE candidate from ranks 2..window into rank 1.

    Membership-preserving by construction: it pops one element and reinserts it
    at the head, so the same entities occupy the same top-K for every K >= the
    window. Recall@5 and Hit@5 cannot move; only the ordering within the head
    does. Returns the list and which rule fired.

    Two rules, both generic -- no entity is named in code:

    EXACT_ENTITY
        The question states an entity's name outright, that entity is already
        in the head, and rank 1 is *not* itself a named entity. A question that
        names a disease is partly a question about that disease.

    PRIMARY_INTENT_HEAD
        Rank 1 is outside the single category the question asked for, and a
        candidate inside it sits in the window. "What product helps ..." headed
        by a disease answers a question the user did not ask.

    Both are gated on `guard_floor`: the candidate's fused score must be at
    least that fraction of rank 1's. A promotion is a claim that the head is
    wrong, and a candidate scoring far below the head is not evidence of that.
    """
    if params.guard_mode == "off" or len(ordered) < 2:
        return ordered, "NONE"

    window = min(params.guard_window, len(ordered))
    top = ordered[0]
    top_score = supports.get(top.id, Support(entity_id=top.id)).final_score
    if top_score <= 0.0:
        return ordered, "NONE"

    def score(hit: SearchHit) -> float:
        return supports.get(hit.id, Support(entity_id=hit.id)).final_score

    def has_evidence(hit: SearchHit) -> bool:
        """Section 7: no purely weak inference may take rank 1."""
        support = supports.get(hit.id)
        if support is None:
            return False
        return (
            support.vector_rank > 0
            or hit.id in named
            or support.anchor_count >= 1
        )

    candidates = ordered[1:window]
    top_category = (top.metadata or {}).get("category", "")

    if params.guard_mode in ("exact", "both") and top.id not in named:
        for hit in candidates:
            if (
                hit.id in named
                and has_evidence(hit)
                and score(hit) >= params.guard_floor * top_score
            ):
                return [hit] + [h for h in ordered if h.id != hit.id],                     "EXACT_ENTITY"

    if (
        params.guard_mode in ("intent", "both")
        and intent.name in _SINGLE_PRIMARY_INTENTS
        and top_category not in intent.primary
    ):
        for hit in candidates:
            if (
                (hit.metadata or {}).get("category", "") in intent.primary
                and has_evidence(hit)
                and score(hit) >= params.guard_floor * top_score
            ):
                return [hit] + [h for h in ordered if h.id != hit.id],                     "PRIMARY_INTENT_HEAD"

    return ordered, "NONE"


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
    # `raw_support[target][anchor]` holds that anchor's strongest link to the
    # target, so evidence accumulates across independent anchors while an
    # identical edge reached twice is counted once (see _accumulate).
    raw_support: dict[str, dict[str, float]] = {}
    frontier: list[tuple[str, int]] = [
        (hit.id, rank)
        for rank, hit in enumerate(hits[: params.anchor_top_n], start=1)
    ]
    discovered: set[str] = set()

    # Entities the question names outright, restricted to those that were
    # actually retrieved. An entity the user typed is a far better anchor than
    # its vector rank implies -- a question is mostly not entity text, so the
    # bi-encoder scores "What medication treats Canine Infectious Hepatitis?"
    # against the disease article at rank 2-4 even though the question is
    # entirely about that disease. Restricting to `known` keeps the guarantee
    # that expansion starts only from retrieved evidence.
    named: set[str] = set()
    if params.exact_anchor_weight > 0.0:
        try:
            named = {
                entity_id for entity_id in _graph.named_in(query)
                if entity_id in known
            }
        except Exception as exc:  # noqa: BLE001
            logger.warning("named-entity anchor lookup failed: %s", exc)

    def anchor_confidence(anchor_id: str, anchor_rank: int) -> float:
        """How much this anchor's evidence is worth. Smooth, deterministic.

        rank_score with its own softness constant, so anchor confidence can
        fall off faster than the vector component it shares a formula with:
        at anchor_rank_k=4 ranks 1..7 give 0.80, 0.67, 0.57, 0.50, 0.44, 0.40,
        0.36 -- a rank-1 anchor is worth more than twice a rank-7 one, where
        the flat k=10 curve made them nearly interchangeable.
        """
        base = rank_score(anchor_rank, params.anchor_rank_k)
        if anchor_id in named:
            return max(base, params.exact_anchor_weight)
        return base

    for pass_index in range(params.max_passes):
        if not frontier:
            break
        decay = (
            params.pass_decay[pass_index]
            if pass_index < len(params.pass_decay)
            else params.pass_decay[-1]
        )
        pass_hits: dict[str, dict[str, float]] = {}
        pass_edges: dict[str, list[dict]] = {}

        for anchor_id, anchor_rank in frontier:
            anchor_weight = anchor_confidence(anchor_id, anchor_rank)
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
                # Intent-conditioned pass decay. A second hop is normally weak
                # evidence, and it should be: symptom -> disease -> anything is
                # a long inference. But when the question explicitly asks for
                # the category that only lives two hops out -- "what monitoring
                # product helps", where the product hangs off the disease, not
                # off the symptom the owner described -- charging the generic
                # second-hop penalty punishes the entity for the shape of the
                # KB rather than for weak evidence. Only the categories the
                # intent asked for get the softer decay; everything else keeps
                # the full penalty, so this is not a blanket pass-2 boost.
                edge_decay = decay
                if (
                    pass_index >= 1
                    and edge.target_category in _intent.primary
                ):
                    edge_decay = max(decay, params.pass2_target_decay)
                value = weight * anchor_weight * edge_decay
                bucket = pass_hits.setdefault(edge.target_id, {})
                if value > bucket.get(anchor_id, 0.0):
                    bucket[anchor_id] = value
                pass_edges.setdefault(edge.target_id, []).append({
                    "from": anchor_id,
                    "from_name": supports[anchor_id].name
                    if anchor_id in supports else "",
                    "anchor_rank": anchor_rank,
                    "anchor_weight": round(anchor_weight, 4),
                    "named_anchor": anchor_id in named,
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

        for target_id, by_anchor in pass_hits.items():
            merged = raw_support.setdefault(target_id, {})
            for anchor_id, value in by_anchor.items():
                if value > merged.get(anchor_id, 0.0):
                    merged[anchor_id] = value
            discovered.add(target_id)

        # Seed the next pass from the best of what this pass produced.
        ordered = sorted(
            pass_hits.items(), key=lambda kv: max(kv[1].values()), reverse=True
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
            raw_support.get(entity_id, {}),
            params.relation_cap,
            params.multi_evidence_decay,
        )
        support.anchor_count = len(raw_support.get(entity_id, {}))
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

    # Final head selection. Runs last, on the finished ordering, and may only
    # rotate one candidate into rank 1 -- it adds nothing, drops nothing, and
    # touches no rank below the window.
    ordered_hits, guard_rule = _precision_guard(
        ordered_hits, supports, _intent, named, params
    )

    logger.info(
        "relation fusion: intent=%s(%r) vector=%d expanded=%d weak=%d fused=%d "
        "guard=%s",
        _intent.name, _intent.matched, len(hits),
        len(known) - len(hits), dropped_weak, len(ordered_hits), guard_rule,
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
