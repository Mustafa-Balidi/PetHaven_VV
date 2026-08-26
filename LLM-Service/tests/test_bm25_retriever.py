"""BM25 tokenizer, metadata filtering, exact-name matching and RRF.

The hybrid arm is OFF in production (the A/B rejected it -- see
reports/bm25_hybrid_comparison.md). These tests keep the module correct so the
negative result stays reproducible and the arm can be switched back on safely.
"""
from __future__ import annotations

import pytest

from RAG_System.indexing.vector_store import SearchHit
from RAG_System.retrieval.bm25_retriever import (
    BM25Index,
    reciprocal_rank_fusion,
    tokenize,
)

pytest.importorskip("rank_bm25")


DOCUMENTS = [
    {
        "id": "DOG_DIS_008",
        "text": (
            "Category: Disease\nName: Gastric Dilatation-Volvulus (GDV / Bloat)"
            "\nAnimal: dog\nDescription: The stomach distends and rotates."
        ),
        "metadata": {
            "id": "DOG_DIS_008",
            "name": "Gastric Dilatation-Volvulus (GDV / Bloat)",
            "category": "diseases",
            "animal": "dog",
        },
    },
    {
        "id": "DOG_MED_018",
        "text": (
            "Category: Medication\nName: Enrofloxacin\nAnimal: dog\n"
            "Description: A fluoroquinolone antibiotic."
        ),
        "metadata": {
            "id": "DOG_MED_018", "name": "Enrofloxacin",
            "category": "medications", "animal": "dog",
        },
    },
    {
        "id": "CAT_DIS_004",
        "text": (
            "Category: Disease\nName: Feline Diabetes Mellitus\nAnimal: cat\n"
            "Description: Insufficient insulin in cats."
        ),
        "metadata": {
            "id": "CAT_DIS_004", "name": "Feline Diabetes Mellitus",
            "category": "diseases", "animal": "cat",
        },
    },
    {
        "id": "DOG_SYM_001",
        "text": (
            "Category: Symptom\nAlso known as: Depression, Lack Of Energy\n"
            "Name: Lethargy\nAnimal: dog\nDescription: Lack of energy."
        ),
        "metadata": {
            "id": "DOG_SYM_001", "name": "Lethargy", "category": "symptoms",
            "animal": "dog", "aliases": "Depression, Lack Of Energy",
        },
    },
]


@pytest.fixture
def index():
    return BM25Index(DOCUMENTS)


# ── Tokenizer ────────────────────────────────────────────────────────────────

def test_tokenizer_is_lowercase_and_splits_punctuation():
    assert tokenize("Feline Diabetes Mellitus?") == [
        "feline", "diabetes", "mellitus"
    ]


def test_hyphenated_term_is_kept_whole_and_split():
    tokens = tokenize("Gastric Dilatation-Volvulus")
    assert "dilatation-volvulus" in tokens
    assert "dilatation" in tokens
    assert "volvulus" in tokens


def test_drug_names_are_not_stemmed():
    """A stemmer collapses drug names that differ by a suffix."""
    for name in ("Enrofloxacin", "Benazepril", "Metoclopramide",
                 "Levothyroxine"):
        assert tokenize(name) == [name.casefold()]


def test_query_and_corpus_share_the_tokenizer():
    assert tokenize("Canine  Parvovirus!") == tokenize("canine parvovirus")


def test_unicode_is_normalized():
    assert tokenize("Ｃanine") == tokenize("Canine")


def test_empty_text_gives_no_tokens():
    assert tokenize("") == []
    assert tokenize("   ---   ") == []


# ── Filtering ────────────────────────────────────────────────────────────────

def test_animal_filter_excludes_other_species(index):
    hits = index.search("diabetes mellitus", animal="dog", top_k=10)
    assert all(h.metadata["animal"] == "dog" for h in hits)
    assert "CAT_DIS_004" not in {h.id for h in hits}


def test_category_filter(index):
    hits = index.search("dog", animal="dog", category="medications", top_k=10)
    assert {h.id for h in hits} <= {"DOG_MED_018"}


def test_top_k_is_respected(index):
    assert len(index.search("dog", animal="dog", top_k=1)) <= 1


def test_no_match_returns_empty(index):
    assert index.search("xyzzy nonexistent term", animal="dog") == []


def test_empty_query_returns_empty(index):
    assert index.search("", animal="dog") == []


# ── Exact-name matching (Phase 8, generic) ───────────────────────────────────

def test_exact_name_quote_is_detected(index):
    hits = index.search(
        "What medication treats Enrofloxacin?", animal="dog", top_k=5
    )
    assert hits[0].id == "DOG_MED_018"


def test_alias_quote_is_detected(index):
    positions = index.exact_name_matches("my dog has a lack of energy")
    assert positions, "alias 'Lack Of Energy' should match"


def test_name_before_parenthetical_matches(index):
    positions = index.exact_name_matches(
        "How is Gastric Dilatation-Volvulus treated in dogs?"
    )
    assert positions


def test_short_phrases_do_not_match(index):
    """'gdv' is too short to be safe as a standalone trigger."""
    assert not index.exact_name_matches("gdv")


def test_exact_name_match_does_not_bypass_the_animal_filter(index):
    hits = index.search(
        "What is used to treat Feline Diabetes Mellitus?",
        animal="dog", top_k=10,
    )
    assert "CAT_DIS_004" not in {h.id for h in hits}


# ── RRF ──────────────────────────────────────────────────────────────────────

def hit(entity_id, distance=0.5):
    return SearchHit(id=entity_id, text="", metadata={}, distance=distance)


def test_rrf_rewards_agreement_between_lists():
    vector = [hit("A"), hit("B"), hit("C")]
    lexical = [hit("C"), hit("D")]
    fused = [h.id for h in reciprocal_rank_fusion([vector, lexical], k=1)]
    # C is 3rd and 1st; A is 1st and absent. C must outrank B.
    assert fused.index("C") < fused.index("B")


def test_rrf_deduplicates():
    fused = reciprocal_rank_fusion([[hit("A"), hit("B")], [hit("A")]], k=60)
    assert [h.id for h in fused].count("A") == 1


def test_rrf_keeps_the_first_lists_hit_object():
    """A hit carrying a real vector distance must not be replaced by a
    lexical stand-in that carries the sentinel."""
    fused = reciprocal_rank_fusion(
        [[hit("A", distance=0.21)], [hit("A", distance=1.0)]], k=60
    )
    assert fused[0].distance == pytest.approx(0.21)


def test_rrf_handles_empty_lists():
    assert reciprocal_rank_fusion([[], []]) == []
    fused = reciprocal_rank_fusion([[hit("A")], []])
    assert [h.id for h in fused] == ["A"]
