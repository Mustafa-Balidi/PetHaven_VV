"""اختبارات prompt_builder.py — category priority + vet_required enforcement."""
from __future__ import annotations

from RAG_System.indexing.vector_store import SearchHit
from RAG_System.llm.prompt_builder import (
    NO_CONTEXT_MESSAGE,
    VET_DISCLAIMER_LINE,
    _CATEGORY_PRIORITY,
    build_prompt,
)


def _hit(id_: str, category: str, text: str = "some retrieved text") -> SearchHit:
    return SearchHit(
        id=id_,
        text=text,
        metadata={
            "id": id_,
            "name": id_,
            "animal": "dog",
            "category": category,
        },
        distance=0.1,
    )


# ══════════════════════════════════════════════════════════════════════════════
# الأساسيات
# ══════════════════════════════════════════════════════════════════════════════

def test_empty_context_instructs_no_info():
    prompt = build_prompt("q", [])
    assert NO_CONTEXT_MESSAGE in prompt


def test_vet_line_always_present():
    prompt = build_prompt("q", [_hit("a", "diseases")])
    assert VET_DISCLAIMER_LINE in prompt


def test_question_included():
    prompt = build_prompt("What is X?", [_hit("a", "diseases")])
    assert "What is X?" in prompt


def test_hit_text_included_as_context():
    prompt = build_prompt("q", [_hit("a", "diseases", text="unique context marker")])
    assert "unique context marker" in prompt


def test_history_block_included_before_context():
    history = [("user", "previous question"), ("assistant", "previous answer")]
    prompt = build_prompt("q", [_hit("a", "diseases")], history=history)
    assert "Previous conversation:" in prompt
    assert "previous question" in prompt
    assert prompt.index("Previous conversation:") < prompt.index("Context:")


# ══════════════════════════════════════════════════════════════════════════════
# Priority Ordering
# ══════════════════════════════════════════════════════════════════════════════

class TestCategoryPriority:
    """الترتيب في الـ context حسب الأولوية الطبية."""

    def test_emergency_comes_first(self):
        hits = [
            _hit("a", "diseases"),
            _hit("b", "emergency"),
            _hit("c", "symptoms"),
        ]
        prompt = build_prompt("q", hits)
        assert prompt.index("[emergency]") < prompt.index("[diseases]")
        assert prompt.index("[emergency]") < prompt.index("[symptoms]")

    def test_symptom_before_disease(self):
        hits = [_hit("a", "diseases"), _hit("b", "symptoms")]
        prompt = build_prompt("q", hits)
        assert prompt.index("[symptoms]") < prompt.index("[diseases]")

    def test_disease_before_medication(self):
        hits = [_hit("a", "medications"), _hit("b", "diseases")]
        prompt = build_prompt("q", hits)
        assert prompt.index("[diseases]") < prompt.index("[medications]")

    def test_medication_before_product(self):
        hits = [
            _hit("a", "medical_products"),
            _hit("b", "medications"),
        ]
        prompt = build_prompt("q", hits)
        assert prompt.index("[medications]") < prompt.index("[medical_products]")

    def test_full_priority_order(self):
        """كل الفئات مرتبة حسب _CATEGORY_PRIORITY."""
        hits = [
            _hit("v", "vaccines"),
            _hit("br", "breeds"),
            _hit("p", "medical_products"),
            _hit("dia", "diagnostics"),
            _hit("m", "medications"),
            _hit("d", "diseases"),
            _hit("s", "symptoms"),
            _hit("e", "emergency"),
        ]
        prompt = build_prompt("q", hits)

        categories = ["emergency", "symptoms", "diseases", "medications",
                      "diagnostics", "medical_products", "vaccines", "breeds"]
        positions = [prompt.index(f"[{c}]") for c in categories]
        assert positions == sorted(positions), "الترتيب يجب أن يطابق الأولوية"

    def test_same_category_ordered_by_distance(self):
        """ضمن نفس الفئة، الأقرب distance يأتي أولاً."""
        hits = [
            SearchHit(
                id="d1", text="far",
                metadata={"category": "diseases", "name": "D1"},
                distance=0.8,
            ),
            SearchHit(
                id="d2", text="near",
                metadata={"category": "diseases", "name": "D2"},
                distance=0.1,
            ),
        ]
        prompt = build_prompt("q", hits)
        assert prompt.index("[diseases] D2") < prompt.index("[diseases] D1")


# ══════════════════════════════════════════════════════════════════════════════
# Vet Required Instructions
# ══════════════════════════════════════════════════════════════════════════════

def test_instructions_mention_vet_required():
    """الـ instructions يجب أن تُجبر الـ LLM على ذكر vet_required."""
    prompt = build_prompt("q", [_hit("a", "diseases")])
    assert "vet" in prompt.lower() or "طبيب" in prompt


def test_instructions_mention_emergency_first():
    """الـ instructions يجب أن تأمر بذكر الطوارئ أولاً."""
    prompt = build_prompt("q", [_hit("a", "diseases")])
    assert "emergency" in prompt.lower()


def test_instructions_forbid_hallucinated_products():
    """الـ instructions تمنع ذكر منتجات غير موجودة في الـ context."""
    prompt = build_prompt("q", [_hit("a", "diseases")])
    assert "product" in prompt.lower()


# ══════════════════════════════════════════════════════════════════════════════
# _CATEGORY_PRIORITY values
# ══════════════════════════════════════════════════════════════════════════════

def test_priority_dict_completeness():
    """كل الفئات المدعومة موجودة في _CATEGORY_PRIORITY."""
    from RAG_System.config import settings
    for category in settings.SUPPORTED_CATEGORIES:
        assert category in _CATEGORY_PRIORITY, f"{category} missing from priority"


def test_emergency_has_lowest_priority_value():
    """emergency = 0 (الأعلى أولوية)."""
    assert _CATEGORY_PRIORITY["emergency"] == 0
    assert all(
        _CATEGORY_PRIORITY["emergency"] <= v
        for v in _CATEGORY_PRIORITY.values()
    )


def test_all_priorities_are_unique():
    """لا توجد أولويات مكررة."""
    values = list(_CATEGORY_PRIORITY.values())
    assert len(values) == len(set(values))