"""Query → hits with HyDE (Hypothetical Document Embeddings).

HyDE يحسّن الـ recall:
  السؤال: "My dog is vomiting blood"
  HyDE يولد: "Hematemesis in dogs can indicate GDV or parvovirus..."
  البحث يجد: DOG_SYM_Hematemesis, DOG_DIS_GDV, DOG_DIS_Parvo

الإصلاحات عن النسخة السابقة:
  1. DiskCache مُعاد — OpenRouterEmbedder بدل OpenAIEmbeddings المباشر
  2. type hint مُصحَّح — _build_hyde_chain() → Runnable وليس ChatOpenAI
  3. temperature=0.0 — HyDE ثابت: نفس السؤال ينتج نفس الـ retrieval

Pipeline
--------
    query
      -> HyDE (hypothetical answer)
      -> vector search x2, RETRIEVAL_TOP_K candidates each
      -> dedup (best distance per entity)
      -> similarity threshold (+ looser fallback)
      -> optional BM25 arm, fused with the vector order by RRF
      -> relation-aware expansion + intent-aware rank fusion
      -> optional CrossEncoder rerank, then trim to RERANK_TOP_N
      -> generator (expand -> _trim_context -> LLM)

Why the relation stage
----------------------
A symptom-shaped question ("my dog is tired and weak") retrieves other
*symptoms*, because that is what its wording looks like. The explaining disease
is not merely low in the neighbour list -- it is absent from it. The threshold
sweep (reports/threshold_candidate_sweep.md) measured Recall@5 at 0.717 for all
fifteen combinations of threshold 0.55-0.35 and pool 10-30: widening the pool
cannot retrieve something the embedding never places nearby.

The KB already states the missing link (Lethargy -> possible_diseases ->
Canine Distemper), so the vector search supplies the anchor and the authored
relations supply the inference. See RAG_System/retrieval/relation_fusion.py.

The CrossEncoder is off by default -- it regressed every headline metric on
this KB (reports/retrieval_reranker_comparison.json) -- so `rerank()` is a
pure trim unless RERANKER_ENABLED is set back to true.
"""
from __future__ import annotations

import logging

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import Runnable
from langchain_openai import ChatOpenAI

from RAG_System.config import settings
from RAG_System.indexing.embedder import DiskCache, OpenRouterEmbedder
from RAG_System.indexing.vector_store import SearchHit, VectorStore, get_store
from RAG_System.retrieval.bm25_retriever import (
    get_index as get_bm25_index,
    reciprocal_rank_fusion,
)
from RAG_System.retrieval.query_intent import detect as detect_intent
from RAG_System.retrieval.relation_fusion import expand_and_fuse, params_from_settings
from RAG_System.retrieval.reranker import rerank

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


# ── HyDE cache ────────────────────────────────────────────────────────────────
#
# Same JSON-on-disk store as the embeddings, keyed by SHA256 of the question
# under the model name. temperature=0.0 is not bit-reproducible at the
# provider: two runs of eval/eval.jsonl differed by 0.017 Recall@5 from HyDE
# resampling alone. Caching makes a repeated question take the identical
# retrieval path, and saves the LLM call outright.

_hyde_cache: DiskCache | None = None


def _get_hyde_cache() -> DiskCache | None:
    global _hyde_cache
    if not getattr(settings, "HYDE_CACHE_ENABLED", True):
        return None
    if _hyde_cache is None:
        _hyde_cache = DiskCache(settings.CACHE_PATH / "hyde", settings.LLM_MODEL)
    return _hyde_cache


def _hyde_answer(query: str) -> str:
    """Hypothetical answer for `query`. Returns "" if HyDE is unavailable."""
    cache = _get_hyde_cache()
    if cache is not None:
        cached = cache.get(query)
        if isinstance(cached, str) and cached:
            logger.debug("HyDE cache hit")
            return cached
    try:
        answer = _build_hyde_chain().invoke({"question": query})
    except Exception as exc:
        logger.warning("HyDE failed, using original query only: %s", exc)
        return ""
    if answer and cache is not None:
        cache.put(query, answer)
    logger.debug("HyDE answer: %s", answer[:120])
    return answer


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
    final_k:  int | None       = None,
) -> list[SearchHit]:
    """
    HyDE retrieval + CrossEncoder reranking:
      1. LLM يُولّد إجابة افتراضية للسؤال (temperature=0.0)
      2. نُضمِّن السؤال الأصلي + الإجابة الافتراضية (DiskCache يمنع تكرار API)
      3. بحث مزدوج في ChromaDB — candidate pool واسع (RETRIEVAL_TOP_K)
      4. dedup (best distance) + threshold filter
      5. CrossEncoder rerank على السؤال الأصلي
      6. trim إلى final_k

    Parameters
    ----------
    top_k :
        Candidate pool size *per sub-query* (original + HyDE), i.e. how many
        neighbours ChromaDB returns. Defaults to settings.RETRIEVAL_TOP_K.
        This is an internal pool — it never reaches the LLM at this size.
    final_k :
        How many reranked hits are returned. Defaults to
        settings.RERANK_TOP_N. Passing an explicit `top_k` without a
        `final_k` returns the whole filtered pool, which is what the
        candidate-pool diagnostics in scripts/ rely on.

    DiskCache:
      OpenRouterEmbedder يحفظ كل embedding على disk بالـ SHA256.
      السؤال المكرر لا يُكلّف API call جديد — مهم لـ HyDE الذي يُضمِّن مرتين.
    """
    _store   = store or get_store()
    embedder = OpenRouterEmbedder()          # ← DiskCache مُفعَّل

    # Candidate pool. TOP_K stays the *final* context knob; the pool has its
    # own setting so widening recall cannot silently widen the LLM context.
    k = top_k or getattr(settings, "RETRIEVAL_TOP_K", settings.TOP_K)

    # An explicit top_k means the caller is probing the pool itself and wants
    # all of it back (scripts/evaluate_retrieval_metrics.py --candidate-pool).
    if final_k is None and top_k is None:
        final_k = getattr(settings, "RERANK_TOP_N", settings.TOP_K)

    # ── 1. HyDE: إجابة افتراضية ───────────────────────────────────────────────
    hypothetical_answer = _hyde_answer(query)

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

    # ── 3b. Optional lexical arm, fused by RRF ───────────────────────────────
    #
    # BM25 runs over the same 4046 ChromaDB entities with the same animal /
    # category filters. The two rankings are fused by rank, not by score: a
    # cosine distance and a BM25 score are not on a common scale. The fused
    # list is what the relation stage then expands, so the relation weights are
    # untouched by this arm.
    bm25_count = 0
    if getattr(settings, "BM25_ENABLED", False) and kept:
        index = get_bm25_index()
        if index is not None:
            try:
                lexical = index.search(
                    query,
                    animal=animal,
                    category=category,
                    top_k=getattr(settings, "BM25_TOP_K", 10),
                )
                if lexical:
                    bm25_count = len(lexical)
                    kept = reciprocal_rank_fusion([kept, lexical])
            except Exception as exc:
                # Never fatal: a lexical problem degrades to the vector order.
                logger.warning("BM25 arm failed, using vector order: %s", exc)

    # ── 4. Relation-aware expansion + intent-aware fusion ────────────────────
    #
    # Anchored to `kept` only, at most RELATION_MAX_PASSES hops, using the KB
    # links already stored in ChromaDB metadata. Expanded entities carry no
    # vector evidence and are scored as inference, not as perfect matches.
    pool_size = len(kept)
    intent    = detect_intent(query)
    fused     = kept
    if getattr(settings, "RELATION_AWARE_ENABLED", True):
        try:
            fused = expand_and_fuse(
                query,
                kept,
                animal=animal,
                store=_store,
                intent=intent,
                params=params_from_settings(),
            )
        except Exception as exc:
            # Never fatal: a graph problem must degrade to plain vector order,
            # exactly like the reranker does.
            logger.warning("Relation fusion failed, using vector order: %s", exc)
            fused = kept

    # ── 5. Optional rerank + trim ────────────────────────────────────────────
    #
    # With RERANKER_ENABLED=false (the default) this is a pure trim to final_k.
    # When enabled, the CrossEncoder is scored against the ORIGINAL question,
    # not the HyDE answer.
    ranked = rerank(query, fused, top_n=final_k)

    logger.info(
        "retrieve query=%r hyde=%s raw=%d pool=%d bm25=%d fused=%d intent=%s "
        "returned=%d animal=%s",
        query,
        bool(hypothetical_answer),
        len(raw_hits),
        pool_size,
        bm25_count,
        len(fused),
        intent.name,
        len(ranked),
        animal,
    )
    return ranked