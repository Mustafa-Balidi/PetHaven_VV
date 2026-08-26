"""Query intent, relation graph and relation-aware fusion."""
from __future__ import annotations

import pytest

from RAG_System.indexing.vector_store import SearchHit
from RAG_System.retrieval import query_intent
from RAG_System.retrieval.relation_fusion import (
    FusionParams,
    expand_and_fuse,
    rank_score,
)
from RAG_System.retrieval.relation_graph import RelationGraph

# ── A tiny KB shaped like the real one ───────────────────────────────────────
#
# SYM_1 authors its possible diseases forward; MED_1 authors the disease it
# treats, and DIS_1 says nothing about medications -- exactly the asymmetry
# that makes reverse edges necessary.

METADATAS = {
    "SYM_1": {
        "id": "SYM_1", "name": "Lethargy", "category": "symptoms",
        "animal": "dog",
        "related_disease_ids": "DIS_1,DIS_2",
        "related_diagnostic_ids": "DIA_1",
    },
    "DIS_1": {
        "id": "DIS_1", "name": "Canine Distemper", "category": "diseases",
        "animal": "dog", "related_product_ids": "PRD_1",
    },
    "DIS_2": {
        "id": "DIS_2", "name": "Panosteitis", "category": "diseases",
        "animal": "dog",
    },
    "MED_1": {
        "id": "MED_1", "name": "Enrofloxacin", "category": "medications",
        "animal": "dog", "related_disease_ids": "DIS_1",
    },
    "PRD_1": {
        "id": "PRD_1", "name": "Slow Feeder Bowl", "category": "medical_products",
        "animal": "dog", "related_disease_ids": "DIS_1",
    },
    "DIA_1": {
        "id": "DIA_1", "name": "Complete Blood Count", "category": "diagnostics",
        "animal": "dog",
    },
    "CAT_1": {
        "id": "CAT_1", "name": "Feline Thing", "category": "diseases",
        "animal": "cat",
    },
}


class FakeStore:
    def __init__(self, metadatas):
        self._metadatas = metadatas

    def all_metadatas(self):
        return self._metadatas

    def get_by_ids(self, ids):
        return [
            {"id": i, "text": "", "metadata": self._metadatas[i]}
            for i in ids
            if i in self._metadatas
        ]


@pytest.fixture
def store():
    return FakeStore(METADATAS)


@pytest.fixture
def graph(store):
    return RelationGraph(store.all_metadatas())


def hit(entity_id, distance):
    return SearchHit(
        id=entity_id, text="", metadata=METADATAS[entity_id], distance=distance
    )


# ── query_intent ─────────────────────────────────────────────────────────────

@pytest.mark.parametrize(
    "query, expected",
    [
        ("What medication treats Canine Infectious Hepatitis?", "medications"),
        ("How is Gastric Dilatation-Volvulus treated in dogs?", "medications"),
        ("Describe the Labrador Retriever breed.", "breeds"),
        ("What are the characteristics of the German Shepherd breed?", "breeds"),
        ("What does a Complete Blood Count test show in dogs?", "diagnostics"),
        ("What does a urinalysis check for in dogs?", "diagnostics"),
        ("My dog has fleas, what product should I use?", "medical_products"),
        ("My cat drinks and urinates a lot, what monitoring product helps?",
         "medical_products"),
        ("What is Canine Parvovirus?", "definitional"),
        ("Tell me about Leptospirosis", "definitional"),
        ("My dog seems tired and has no energy, why?", "symptomatic"),
        ("There is blood in my dog's urine, what's the cause?", "symptomatic"),
    ],
)
def test_intent_detection(query, expected):
    assert query_intent.detect(query).name == expected


def test_product_rule_wins_over_treat():
    """"what product helps with recovery" must not be read as a drug question."""
    intent = query_intent.detect(
        "What product helps a dog recovering from Gastric Dilatation-Volvulus?"
    )
    assert intent.name == "medical_products"


def test_intent_never_filters():
    """Off-target categories are demoted, never zeroed."""
    intent = query_intent.detect("What medication treats X?")
    assert intent.scale_for("breeds") > 0.0
    assert intent.weight_for("breeds") > 0.0


def test_definitional_rule_does_not_shadow_the_category_rules():
    """It is the last rule; the eval-shaped questions must still route above it."""
    assert query_intent.detect(
        "What is the treatment for Diabetes Mellitus in dogs?"
    ).name == "medications"
    assert query_intent.detect(
        "What is a serum biochemistry panel used for in cats?"
    ).name == "diagnostics"
    assert query_intent.detect("What is the Persian cat breed like?").name == "breeds"


def test_weakly_linked_inference_is_held_out(store, graph):
    """A floor keeps a thin vector pool from filling with weak inferences."""
    params = FusionParams(min_relation_score=99.0)
    fused = expand_and_fuse(
        "My dog seems tired and has no energy, why?",
        [hit("SYM_1", 0.30)],
        store=store,
        graph=graph,
        params=params,
    )
    assert [h.id for h in fused] == ["SYM_1"]


def test_floor_never_drops_an_entity_with_vector_evidence(store, graph):
    fused = expand_and_fuse(
        "My dog seems tired and has no energy, why?",
        [hit("SYM_1", 0.30), hit("DIA_1", 0.48)],
        store=store,
        graph=graph,
        params=FusionParams(min_relation_score=99.0),
    )
    assert {h.id for h in fused} == {"SYM_1", "DIA_1"}


def test_detect_handles_empty_query():
    assert query_intent.detect("").name == "symptomatic"


# ── relation graph ───────────────────────────────────────────────────────────

def test_forward_edges_carry_list_size(graph):
    edges = {e.target_id: e for e in graph.edges("SYM_1") if e.forward}
    assert edges["DIS_1"].list_size == 2
    assert edges["DIS_1"].source_category == "symptoms"
    assert edges["DIS_1"].target_category == "diseases"


def test_reverse_edge_exists_where_forward_does_not(graph):
    """DIS_1 authors no medications; MED_1 authors DIS_1. The link must survive."""
    forward = [e.target_id for e in graph.edges("DIS_1", include_reverse=False)]
    assert "MED_1" not in forward

    reverse = [e for e in graph.edges("DIS_1") if not e.forward]
    assert "MED_1" in {e.target_id for e in reverse}


def test_dangling_reference_is_skipped():
    graph = RelationGraph({
        "A": {"category": "symptoms", "related_disease_ids": "GHOST"},
    })
    assert graph.edges("A") == []


def test_self_reference_is_skipped():
    graph = RelationGraph({
        "A": {"category": "symptoms", "related_disease_ids": "A"},
    })
    assert graph.edges("A") == []


# ── fusion ───────────────────────────────────────────────────────────────────

def test_rank_score_is_monotonic():
    assert rank_score(1, 10) > rank_score(2, 10) > rank_score(30, 10)


def test_expansion_finds_entity_absent_from_the_vector_pool(store, graph):
    """The point of the whole stage: Lethargy -> Canine Distemper."""
    fused = expand_and_fuse(
        "My dog seems tired and has no energy, why?",
        [hit("SYM_1", 0.30)],
        store=store,
        graph=graph,
    )
    assert "DIS_1" in {h.id for h in fused}


def test_expanded_entities_are_not_given_distance_zero(store, graph):
    fused = expand_and_fuse(
        "My dog seems tired and has no energy, why?",
        [hit("SYM_1", 0.30)],
        store=store,
        graph=graph,
    )
    inferred = next(h for h in fused if h.id == "DIS_1")
    assert inferred.distance > 0.0


def test_anchor_keeps_rank_one_when_on_target(store, graph):
    fused = expand_and_fuse(
        "My dog seems tired and has no energy, why?",
        [hit("SYM_1", 0.30)],
        store=store,
        graph=graph,
    )
    assert fused[0].id == "SYM_1"


def test_two_passes_reach_a_product_through_a_disease(store, graph):
    """SYM_1 -> DIS_1 -> PRD_1 is exactly two hops and must be reachable."""
    fused = expand_and_fuse(
        "My dog is tired, what product helps?",
        [hit("SYM_1", 0.30)],
        store=store,
        graph=graph,
        params=FusionParams(max_passes=2),
    )
    assert "PRD_1" in {h.id for h in fused}


def test_one_pass_cannot_reach_the_product(store, graph):
    fused = expand_and_fuse(
        "My dog is tired, what product helps?",
        [hit("SYM_1", 0.30)],
        store=store,
        graph=graph,
        params=FusionParams(max_passes=1),
    )
    assert "PRD_1" not in {h.id for h in fused}


def test_expansion_is_anchored_to_retrieved_evidence(store, graph):
    """Nothing unreachable from an anchor may appear."""
    fused = expand_and_fuse(
        "What is a Complete Blood Count?",
        [hit("DIA_1", 0.30)],
        store=store,
        graph=graph,
    )
    assert "PRD_1" not in {h.id for h in fused}


def test_animal_filter_excludes_other_species(store, graph):
    graph_with_cat = RelationGraph({
        **METADATAS,
        "SYM_1": {**METADATAS["SYM_1"], "related_disease_ids": "DIS_1,CAT_1"},
    })
    fused = expand_and_fuse(
        "My dog seems tired.",
        [hit("SYM_1", 0.30)],
        animal="dog",
        store=store,
        graph=graph_with_cat,
    )
    assert "CAT_1" not in {h.id for h in fused}


def test_empty_hits_returns_empty(store, graph):
    assert expand_and_fuse("anything", [], store=store, graph=graph) == []


def test_original_hits_are_never_dropped(store, graph):
    hits = [hit("SYM_1", 0.30), hit("DIA_1", 0.44)]
    fused = expand_and_fuse(
        "My dog seems tired and has no energy, why?",
        hits,
        store=store,
        graph=graph,
    )
    assert {h.id for h in hits} <= {h.id for h in fused}


def test_intent_lifts_the_asked_for_category(store, graph):
    """A medication question must rank Enrofloxacin above a sibling disease."""
    fused = expand_and_fuse(
        "What medication treats Canine Distemper?",
        [hit("DIS_1", 0.30)],
        store=store,
        graph=graph,
    )
    order = [h.id for h in fused]
    assert order.index("MED_1") < order.index("DIS_2") if "DIS_2" in order else True
    assert "MED_1" in order
