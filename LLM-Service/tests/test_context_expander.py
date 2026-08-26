"""
اختبارات context_expander.py — Multi-Pass + Batching + Intent-Aware Expansion
================================================================================
تغطي:
1. السيناريو الكامل: symptom → disease → medication + vaccine + diagnostic + emergency + product
2. كل expansion path مستقل لكل category
3. Terminal categories لا تُوسَّع (emergency, diagnostics, vaccines, medical_products)
4. حالات الحدود: قوائم فارغة، تكرار، فشل الـ store، IDs مفقودة
5. vet_required يصل للـ context عبر emergency
6. Batching: call واحدة لكل pass مهما كان عدد الـ hits
7. medications → products
"""
from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from RAG_System.indexing.vector_store import SearchHit
from RAG_System.retrieval import context_expander


# ══════════════════════════════════════════════════════════════════════════════
# Helpers
# ══════════════════════════════════════════════════════════════════════════════

def _hit(id_: str, category: str, extra_meta: dict | None = None) -> SearchHit:
    """إنشاء SearchHit مع metadata يحتوي relationship IDs."""
    meta = {
        "id": id_,
        "name": f"Name of {id_}",
        "animal": "dog",
        "category": category,
        **(extra_meta or {}),
    }
    return SearchHit(
        id=id_,
        text=f"Text content for {id_}",
        metadata=meta,
        distance=0.5,
    )


def _doc(id_: str, category: str, extra_meta: dict | None = None) -> dict:
    """مثيل المستند كما يُعيده store.get_by_ids()."""
    meta = {
        "id": id_,
        "name": f"Name of {id_}",
        "animal": "dog",
        "category": category,
        **(extra_meta or {}),
    }
    return {
        "id": id_,
        "text": f"Text content for {id_}",
        "metadata": meta,
    }


def _mock_store(docs_by_id: dict[str, dict]) -> MagicMock:
    """
    mock لـ VectorStore.get_by_ids يُعيد المستندات المطلوبة فقط.
    يتجاهل IDs غير الموجودة (سلوك ChromaDB الحقيقي).
    """
    mock = MagicMock()
    mock.get_by_ids.side_effect = (
        lambda ids: [docs_by_id[i] for i in ids if i in docs_by_id]
    )
    return mock


# ══════════════════════════════════════════════════════════════════════════════
# 1. السيناريو الكامل — symptom إلى كل شيء عبر pass 1 + pass 2
# ══════════════════════════════════════════════════════════════════════════════

class TestFullSymptomFlow:
    """
    المستخدم يُدخل عرضاً (vomiting) →
    Pass 1: symptom → emergency + diseases + diagnostics
    Pass 2: disease → medication + vaccine + diagnostic + product
    النتيجة: كل الكيانات في الـ context
    """

    def _build_scenario(self) -> tuple[SearchHit, MagicMock]:
        """ابنِ السيناريو الكامل: symptom + disease + كل شيء مرتبط."""
        symptom_hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_003",
            "emergency_ids": "DOG_EME_001",
            "related_diagnostic_ids": "DOG_DIA_001",
        })

        disease_doc = _doc("DOG_DIS_003", "diseases", {
            "related_emergency_ids": "DOG_EME_001",
            "related_medication_ids": "DOG_MED_001",
            "related_vaccine_ids": "DOG_VAC_001",
            "related_diagnostic_ids": "DOG_DIA_002",
            "related_product_ids": "DOG_PRD_001",
        })

        docs = {
            "DOG_DIS_003": disease_doc,
            "DOG_EME_001": _doc("DOG_EME_001", "emergency"),
            "DOG_DIA_001": _doc("DOG_DIA_001", "diagnostics"),
            "DOG_MED_001": _doc("DOG_MED_001", "medications"),
            "DOG_VAC_001": _doc("DOG_VAC_001", "vaccines"),
            "DOG_DIA_002": _doc("DOG_DIA_002", "diagnostics"),
            "DOG_PRD_001": _doc("DOG_PRD_001", "medical_products"),
        }

        return symptom_hit, _mock_store(docs)

    def test_all_entities_present_after_expansion(self):
        """كل الفئات يجب أن تظهر في النتيجة النهائية."""
        symptom_hit, store = self._build_scenario()
        result = context_expander.expand([symptom_hit], store=store)
        ids = {h.id for h in result}

        # الأصلي
        assert "DOG_SYM_001" in ids, "العرَض الأصلي يجب أن يبقى"

        # Pass 1: من symptom
        assert "DOG_DIS_003" in ids, "المرض يجب أن يُجلب في pass 1"
        assert "DOG_EME_001" in ids, "الطوارئ يجب أن تُجلب في pass 1"
        assert "DOG_DIA_001" in ids, "الفحص يجب أن يُجلب في pass 1"

        # Pass 2: من disease
        assert "DOG_MED_001" in ids, "الدواء يجب أن يُجلب في pass 2"
        assert "DOG_VAC_001" in ids, "اللقاح يجب أن يُجلب في pass 2"
        assert "DOG_DIA_002" in ids, "فحص ثاني من المرض يجب أن يُجلب"
        assert "DOG_PRD_001" in ids, "المنتج يجب أن يُجلب في pass 2"

    def test_linked_hits_have_zero_distance(self):
        """الكيانات المُضافة عبر التوسعة تحصل على distance=0.0."""
        symptom_hit, store = self._build_scenario()
        result = context_expander.expand([symptom_hit], store=store)

        linked = [h for h in result if h.id != "DOG_SYM_001"]
        assert len(linked) > 0, "يجب أن يكون هناك linked entities"
        for hit in linked:
            assert hit.distance == 0.0, f"{hit.id} يجب أن يكون distance=0.0"

    def test_original_hit_distance_preserved(self):
        """الـ hit الأصلي يحافظ على distance الخاصة به."""
        symptom_hit, store = self._build_scenario()
        result = context_expander.expand([symptom_hit], store=store)

        original = next(h for h in result if h.id == "DOG_SYM_001")
        assert original.distance == 0.5, "الـ distance الأصلية يجب أن تبقى"

    def test_max_passes_is_two(self):
        """Pass 3 لا يحدث — نتوقف عند pass 2."""
        symptom_hit, store = self._build_scenario()
        context_expander.expand([symptom_hit], store=store)

        # عدد استدعاءات get_by_ids يجب أن يكون 2 (pass 1 + pass 2)
        assert store.get_by_ids.call_count == 2


# ══════════════════════════════════════════════════════════════════════════════
# 2. كل expansion path مستقل
# ══════════════════════════════════════════════════════════════════════════════

class TestSymptomExpansion:
    """symptoms → emergency + diseases + diagnostics."""

    def test_symptom_expands_to_diseases(self):
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_001,DOG_DIS_002",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
        })
        result = context_expander.expand([hit], store=store)
        ids = {h.id for h in result}
        assert "DOG_DIS_001" in ids
        assert "DOG_DIS_002" in ids

    def test_symptom_expands_to_emergency(self):
        """عرَض خطير → يجلب بروتوكول الطوارئ مباشرة."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "emergency_ids": "DOG_EME_001",
        })
        store = _mock_store({"DOG_EME_001": _doc("DOG_EME_001", "emergency")})
        result = context_expander.expand([hit], store=store)
        assert any(h.id == "DOG_EME_001" for h in result)

    def test_symptom_expands_to_diagnostics(self):
        """العرَض يجلب الفحوصات الموصى بها مباشرة."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_diagnostic_ids": "DOG_DIA_001,DOG_DIA_002",
        })
        store = _mock_store({
            "DOG_DIA_001": _doc("DOG_DIA_001", "diagnostics"),
            "DOG_DIA_002": _doc("DOG_DIA_002", "diagnostics"),
        })
        result = context_expander.expand([hit], store=store)
        ids = {h.id for h in result}
        assert "DOG_DIA_001" in ids
        assert "DOG_DIA_002" in ids

    def test_symptom_with_no_related_ids_unchanged(self):
        hit = _hit("DOG_SYM_001", "symptoms", {})
        store = _mock_store({})
        result = context_expander.expand([hit], store=store)
        assert len(result) == 1
        store.get_by_ids.assert_not_called()


class TestDiseaseExpansion:
    """diseases → emergency + medication + vaccine + diagnostic + product."""

    def _disease_hit(self, **extra) -> SearchHit:
        return _hit("DOG_DIS_001", "diseases", {
            "related_emergency_ids": "DOG_EME_001",
            "related_medication_ids": "DOG_MED_001",
            "related_vaccine_ids": "DOG_VAC_001",
            "related_diagnostic_ids": "DOG_DIA_001",
            "related_product_ids": "DOG_PRD_001",
            **extra,
        })

    def test_disease_expands_to_medications(self):
        store = _mock_store({"DOG_MED_001": _doc("DOG_MED_001", "medications")})
        result = context_expander.expand([self._disease_hit()], store=store)
        assert any(h.id == "DOG_MED_001" for h in result)

    def test_disease_expands_to_emergency(self):
        store = _mock_store({"DOG_EME_001": _doc("DOG_EME_001", "emergency")})
        result = context_expander.expand([self._disease_hit()], store=store)
        assert any(h.id == "DOG_EME_001" for h in result)

    def test_disease_expands_to_products(self):
        store = _mock_store({"DOG_PRD_001": _doc("DOG_PRD_001", "medical_products")})
        result = context_expander.expand([self._disease_hit()], store=store)
        assert any(h.id == "DOG_PRD_001" for h in result)

    def test_disease_expands_to_vaccines(self):
        store = _mock_store({"DOG_VAC_001": _doc("DOG_VAC_001", "vaccines")})
        result = context_expander.expand([self._disease_hit()], store=store)
        assert any(h.id == "DOG_VAC_001" for h in result)

    def test_disease_expands_to_diagnostics(self):
        store = _mock_store({"DOG_DIA_001": _doc("DOG_DIA_001", "diagnostics")})
        result = context_expander.expand([self._disease_hit()], store=store)
        assert any(h.id == "DOG_DIA_001" for h in result)


class TestMedicationExpansion:
    """medications → products."""

    def test_medication_expands_to_products(self):
        hit = _hit("HAM_MED_075", "medications", {
            "related_product_ids": "HAM_PRD_001,HAM_PRD_003",
        })
        store = _mock_store({
            "HAM_PRD_001": _doc("HAM_PRD_001", "medical_products"),
            "HAM_PRD_003": _doc("HAM_PRD_003", "medical_products"),
        })
        result = context_expander.expand([hit], store=store)
        ids = {h.id for h in result}
        assert "HAM_PRD_001" in ids
        assert "HAM_PRD_003" in ids


class TestBreedExpansion:
    """breeds → diseases (predisposed)."""

    def test_breed_expands_to_predisposed_diseases(self):
        hit = _hit("DOG_BRD_001", "breeds", {
            "related_disease_ids": "DOG_DIS_001,DOG_DIS_002",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
        })
        result = context_expander.expand([hit], store=store)
        ids = {h.id for h in result}
        assert "DOG_DIS_001" in ids
        assert "DOG_DIS_002" in ids


# ══════════════════════════════════════════════════════════════════════════════
# 3. Terminal categories — لا تُوسَّع
# ══════════════════════════════════════════════════════════════════════════════

class TestNoExpansionCategories:
    """emergency / diagnostics / vaccines / medical_products لا تُوسَّع."""

    @pytest.mark.parametrize("category", [
        "emergency", "diagnostics", "vaccines", "medical_products",
    ])
    def test_terminal_categories_not_expanded(self, category):
        """كيان من فئة terminal → لا يوسّع، حتى لو كان يحتوي related IDs."""
        hit = _hit("X_001", category, {
            "related_disease_ids": "DOG_DIS_001",
        })
        store = _mock_store({"DOG_DIS_001": _doc("DOG_DIS_001", "diseases")})
        result = context_expander.expand([hit], store=store)
        assert len(result) == 1, "لا يجب أن تُضاف كيانات جديدة"
        store.get_by_ids.assert_not_called()


# ══════════════════════════════════════════════════════════════════════════════
# 4. حالات الحدود
# ══════════════════════════════════════════════════════════════════════════════

class TestEdgeCases:

    def test_empty_input_returns_empty(self):
        store = _mock_store({})
        assert context_expander.expand([], store=store) == []
        store.get_by_ids.assert_not_called()

    def test_no_duplicates_when_ids_overlap(self):
        """symptom وdisease يشيران لنفس الدواء → يظهر مرة واحدة فقط."""
        sym = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_001",
        })
        dis = _hit("DOG_DIS_001", "diseases", {
            "related_medication_ids": "DOG_MED_001",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_MED_001": _doc("DOG_MED_001", "medications"),
        })
        result = context_expander.expand([sym, dis], store=store)
        ids = [h.id for h in result]
        assert ids.count("DOG_DIS_001") == 1, "DOG_DIS_001 يجب أن يظهر مرة واحدة"
        assert ids.count("DOG_MED_001") == 1, "DOG_MED_001 يجب أن يظهر مرة واحدة"

    def test_store_failure_does_not_crash(self):
        """فشل get_by_ids → يُسجَّل ويُتخطى دون crash، والـ hit الأصلي يبقى."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_001",
        })
        store = MagicMock()
        store.get_by_ids.side_effect = RuntimeError("DB unavailable")
        result = context_expander.expand([hit], store=store)
        assert len(result) == 1
        assert result[0].id == "DOG_SYM_001"

    def test_missing_ids_in_store_ignored(self):
        """ID غير موجود في الـ store → يُتجاهل بصمت."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_GHOST",
        })
        store = _mock_store({})  # فارغ
        result = context_expander.expand([hit], store=store)
        assert len(result) == 1

    def test_multiple_ids_in_one_field(self):
        """حقل واحد يحتوي IDs متعددة مفصولة بفاصلة."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_001,DOG_DIS_002,DOG_DIS_003",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
            "DOG_DIS_003": _doc("DOG_DIS_003", "diseases"),
        })
        result = context_expander.expand([hit], store=store)
        assert len(result) == 4  # 1 symptom + 3 diseases

    def test_animal_param_accepted_without_error(self):
        """animal parameter محجوز للـ API — يجب أن يُقبل دون خطأ."""
        hit = _hit("DOG_SYM_001", "symptoms", {})
        store = _mock_store({})
        result = context_expander.expand([hit], animal="dog", store=store)
        assert len(result) == 1

    def test_whitespace_in_ids_stripped(self):
        """IDs مع مسافات → تُزال المسافات وتُستخدم بشكل صحيح."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": " DOG_DIS_001 , DOG_DIS_002 ",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
        })
        result = context_expander.expand([hit], store=store)
        ids = {h.id for h in result}
        assert "DOG_DIS_001" in ids
        assert "DOG_DIS_002" in ids


# ══════════════════════════════════════════════════════════════════════════════
# 5. Batching — call واحدة لكل pass
# ══════════════════════════════════════════════════════════════════════════════

class TestBatching:

    def test_single_store_call_per_pass(self):
        """مهما كان عدد الـ hits الأصلية → call واحدة لكل pass."""
        sym1 = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_001",
        })
        sym2 = _hit("DOG_SYM_002", "symptoms", {
            "related_disease_ids": "DOG_DIS_002",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
        })
        context_expander.expand([sym1, sym2], store=store)

        # pass 1: fetch DIS_001 + DIS_002 في call واحدة
        # pass 2: diseases لا تملك related IDs → لا call
        assert store.get_by_ids.call_count == 1

    def test_correct_ids_requested_in_batch(self):
        """يتحقق أن الـ store يُستدعى بالـ IDs الصحيحة."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_001,DOG_DIS_002",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
        })
        context_expander.expand([hit], store=store)

        store.get_by_ids.assert_called_once()
        requested_ids = store.get_by_ids.call_args[0][0]
        assert set(requested_ids) == {"DOG_DIS_001", "DOG_DIS_002"}

    def test_ids_sorted_for_determinism(self):
        """الـ IDs تُرسَل مرتبة للحتمية في الـ logging والـ debugging."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "related_disease_ids": "DOG_DIS_003,DOG_DIS_001,DOG_DIS_002",
        })
        store = _mock_store({
            "DOG_DIS_001": _doc("DOG_DIS_001", "diseases"),
            "DOG_DIS_002": _doc("DOG_DIS_002", "diseases"),
            "DOG_DIS_003": _doc("DOG_DIS_003", "diseases"),
        })
        context_expander.expand([hit], store=store)

        requested_ids = store.get_by_ids.call_args[0][0]
        assert requested_ids == sorted(requested_ids)


# ══════════════════════════════════════════════════════════════════════════════
# 6. vet_required يصل للـ context
# ══════════════════════════════════════════════════════════════════════════════

class TestVetRequiredReachesContext:
    """vet_required موجود في نص الـ emergency → يصل للـ context."""

    def test_emergency_text_present_in_expanded_hits(self):
        hit = _hit("DOG_SYM_001", "symptoms", {
            "emergency_ids": "DOG_EME_001",
        })
        eme_doc = {
            "id": "DOG_EME_001",
            "text": (
                "Category: Emergency\n"
                "Name: Acute Vomiting Protocol\n"
                "Vet required: yes\n"
                "Immediate actions: Stop food and water"
            ),
            "metadata": {
                "id": "DOG_EME_001",
                "category": "emergency",
                "vet_required": "true",
            },
        }
        store = _mock_store({"DOG_EME_001": eme_doc})
        result = context_expander.expand([hit], store=store)

        eme_hit = next((h for h in result if h.id == "DOG_EME_001"), None)
        assert eme_hit is not None, "emergency hit يجب أن يكون في النتيجة"
        assert "Vet required: yes" in eme_hit.text
        assert "Immediate actions" in eme_hit.text
        assert eme_hit.metadata.get("vet_required") == "true"
        assert eme_hit.distance == 0.0

    def test_vet_required_in_metadata_reaches_context(self):
        """vet_required في metadata يصل للـ context للـ LLM."""
        hit = _hit("DOG_SYM_001", "symptoms", {
            "emergency_ids": "DOG_EME_001",
        })
        store = _mock_store({
            "DOG_EME_001": _doc("DOG_EME_001", "emergency", {
                "vet_required": "true",
            }),
        })
        result = context_expander.expand([hit], store=store)
        eme_hit = next(h for h in result if h.id == "DOG_EME_001")
        assert eme_hit.metadata.get("vet_required") == "true"


# ══════════════════════════════════════════════════════════════════════════════
# 7. اختبار سيناريو العينة الحقيقية (HAM_MED_075)
# ══════════════════════════════════════════════════════════════════════════════

class TestRealWorldScenario:

    def test_hamster_medication_expands_to_products(self):
        """
        سيناريو حقيقي من العينة: HAM_MED_075 (Enalapril)
        → HAM_PRD_001 (Critical Care Food)
        → HAM_PRD_003 (Hamster Vitamin Supplement)
        """
        hit = _hit("HAM_MED_075", "medications", {
            "related_disease_ids": "HAM_DIS_010,HAM_DIS_137",
            "related_product_ids": "HAM_PRD_001,HAM_PRD_003",
        })
        store = _mock_store({
            "HAM_DIS_010": _doc("HAM_DIS_010", "diseases"),
            "HAM_DIS_137": _doc("HAM_DIS_137", "diseases"),
            "HAM_PRD_001": _doc("HAM_PRD_001", "medical_products"),
            "HAM_PRD_003": _doc("HAM_PRD_003", "medical_products"),
        })
        result = context_expander.expand([hit], store=store)
        ids = {h.id for h in result}

        # medication الأصلي
        assert "HAM_MED_075" in ids

        # Pass 1: diseases + products من medication
        assert "HAM_DIS_010" not in ids, "medications لا توسّع إلى diseases"
        assert "HAM_PRD_001" in ids, "products يجب أن تُجلب من medication"
        assert "HAM_PRD_003" in ids, "products يجب أن تُجلب من medication"

        # medications → products فقط، ليس diseases
        assert len(result) == 3  # original + 2 products