"""Query → hits with HyDE (Hypothetical Document Embeddings).

HyDE يحسّن الـ recall:
  السؤال: "My dog is vomiting blood"
  HyDE يولد: "Hematemesis in dogs can indicate GDV or parvovirus..."
  البحث يجد: DOG_SYM_Hematemesis, DOG_DIS_GDV, DOG_DIS_Parvo

الإصلاحات عن النسخة السابقة:
  1. DiskCache مُعاد — OpenRouterEmbedder بدل OpenAIEmbeddings المباشر
  2. type hint مُصحَّح — _build_hyde_chain() → Runnable وليس ChatOpenAI
  3. temperature=0.0 — HyDE ثابت: نفس السؤال ينتج نفس الـ retrieval
"""
from __future__ import annotations

import logging

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import Runnable
from langchain_openai import ChatOpenAI

from RAG_System.config import settings
from RAG_System.indexing.embedder import OpenRouterEmbedder
from RAG_System.indexing.vector_store import SearchHit, VectorStore, get_store

logger = logging.getLogger(__name__)

_MAX_DISTANCE = 1.0 - settings.SIMILARITY_THRESHOLD

# Secondary (looser) threshold. Used only when the primary keeps nothing,
# so a slightly-off query still reaches the LLM with real evidence.
_FALLBACK_THRESHOLD    = float(
    getattr(settings, "SIMILARITY_THRESHOLD_FALLBACK", 0.35)
)
_MAX_DISTANCE_FALLBACK = 1.0 - _FALLBACK_THRESHOLD

# ── HyDE prompt ───────────────────────────────────────────────────────────────
_HYDE_PROMPT = PromptTemplate.from_template(
    "You are a veterinary medical assistant.\n"
    "Write a brief 2-3 sentence veterinary answer to this question.\n"
    "Use precise medical terminology.\n\n"
    "Question: {question}\n\n"
    "Answer:"
)


# ── Builders ──────────────────────────────────────────────────────────────────

def _build_hyde_chain() -> Runnable:
    """
    HyDE chain: question → hypothetical veterinary answer.

    type hint: Runnable (وليس ChatOpenAI) لأن prompt | llm | parser
    يُنتج RunnableSequence وليس ChatOpenAI مباشرة.

    temperature=0.0: HyDE حتمي. عند 0.3 كان نفس السؤال أحياناً يُنتج
    مستنداً افتراضياً مختلفاً فينهار الـ retrieval إلى كيانات غير مرتبطة
    (مثال: "My cat has not eaten for two days" → emergency فقط في تشغيل
    وFeline Hepatic Lipidosis في تشغيل آخر).
    """
    llm = ChatOpenAI(
        model=settings.LLM_MODEL,
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
        temperature=0.0,
        max_tokens=200,
        timeout=settings.LLM_TIMEOUT,
        # HyDE never needs a reasoning budget, and a reasoning-by-default
        # model would spend all 200 tokens thinking and return "".
        extra_body={"reasoning": {"enabled": False}},
    )
    return _HYDE_PROMPT | llm | StrOutputParser()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _dedup_hits(hits: list[SearchHit]) -> list[SearchHit]:
    """نفس الكيان من بحثين → يُبقي على أفضل (أقل) distance."""
    best: dict[str, SearchHit] = {}
    for hit in hits:
        if hit.id not in best or hit.distance < best[hit.id].distance:
            best[hit.id] = hit
    return sorted(best.values(), key=lambda h: h.distance)


# ── Public API ────────────────────────────────────────────────────────────────

def retrieve(
    query:    str,
    animal:   str | None       = None,
    category: str | None       = None,
    top_k:    int | None       = None,
    store:    VectorStore | None = None,
) -> list[SearchHit]:
    """
    HyDE retrieval:
      1. LLM يُولّد إجابة افتراضية للسؤال (temperature=0.0)
      2. نُضمِّن السؤال الأصلي + الإجابة الافتراضية (DiskCache يمنع تكرار API)
      3. بحث مزدوج في ChromaDB
      4. dedup (best distance) + threshold filter

    DiskCache:
      OpenRouterEmbedder يحفظ كل embedding على disk بالـ SHA256.
      السؤال المكرر لا يُكلّف API call جديد — مهم لـ HyDE الذي يُضمِّن مرتين.
    """
    _store   = store or get_store()
    embedder = OpenRouterEmbedder()          # ← DiskCache مُفعَّل
    k        = top_k or settings.TOP_K

    # ── 1. HyDE: إجابة افتراضية ───────────────────────────────────────────────
    hypothetical_answer = ""
    try:
        hyde_chain          = _build_hyde_chain()
        hypothetical_answer = hyde_chain.invoke({"question": query})
        logger.debug("HyDE answer: %s", hypothetical_answer[:120])
    except Exception as exc:
        logger.warning("HyDE failed, using original query only: %s", exc)

    # ── 2. بحث مزدوج ─────────────────────────────────────────────────────────
    queries = [query]
    if hypothetical_answer:
        queries.append(hypothetical_answer)

    raw_hits: list[SearchHit] = []
    for q in queries:
        vector = embedder.embed_query(q)
        hits   = _store.search(vector, animal=animal, category=category, top_k=k)
        raw_hits.extend(hits)

    # ── 3. Dedup + Threshold ──────────────────────────────────────────────────
    deduped = _dedup_hits(raw_hits)

    logger.info(
        "Retrieval diagnostic: raw=%d deduped=%d distances=%s animal=%s",
        len(raw_hits),
        len(deduped),
        [round(h.distance, 4) for h in deduped[:10]],
        animal,
    )

    kept = [h for h in deduped if h.distance <= _MAX_DISTANCE]

    if not kept:
        fallback_hits = [
            h for h in deduped if h.distance <= _MAX_DISTANCE_FALLBACK
        ]
        if fallback_hits:
            logger.info(
                "Primary threshold %.4f → 0 hits; fallback %.4f → %d for q=%r",
                _MAX_DISTANCE, _MAX_DISTANCE_FALLBACK, len(fallback_hits), query,
            )
            kept = fallback_hits

    logger.info(
        "retrieve query=%r hyde=%s raw=%d kept=%d animal=%s",
        query, bool(hypothetical_answer), len(raw_hits), len(kept), animal,
    )
    return kept