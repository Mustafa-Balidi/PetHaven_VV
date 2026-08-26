from pathlib import Path
from dotenv import load_dotenv
import logging
import os

# ==========================================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================================
load_dotenv()

# ==========================================================
# PROJECT PATHS
# ==========================================================
PROJECT_ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE_BASE_PATH = PROJECT_ROOT.parent / "Knowledge_Base"
DATA_PATH = PROJECT_ROOT / "data"
CHROMA_DB_PATH = DATA_PATH / "chroma_db"
CACHE_PATH = DATA_PATH / "cache"
LOGS_PATH = PROJECT_ROOT / "logs"

# Create directories
for path in [DATA_PATH, CHROMA_DB_PATH, CACHE_PATH, LOGS_PATH]:
    path.mkdir(parents=True, exist_ok=True)

# ==========================================================
# OPENROUTER (EMBEDDINGS)
# ==========================================================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    logging.warning(
        "OPENROUTER_API_KEY is not set. "
        "Service starts but /ask returns HTTP 503."
    )

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# ==========================================================
# EMBEDDING
# ==========================================================
EMBEDDING_MODEL = "openai/text-embedding-3-small"

# ==========================================================
# # LLM (OpenRouter — Cloud)                                       
# ==========================================================
LLM_MODEL      = os.getenv("LLM_MODEL","qwen/qwen3.5-9b") 
LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", 2048))   
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", 0.0))
LLM_TIMEOUT = int(os.getenv("LLM_TIMEOUT", 60))

# ==========================================================
# CHROMADB
# ==========================================================
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "pet_haven_kb")
DISTANCE_METRIC = "cosine"

# ==========================================================
# RETRIEVAL
# ==========================================================
# Final number of hits handed back by retrieve() — this is what reaches the
# generator (which trims again to _MAX_ENTITIES). Kept at the previous
# effective output size so the LLM context does not grow.
TOP_K = int(os.getenv("TOP_K", 5))

# Internal candidate pool per sub-query (original question + HyDE answer).
# Widening this is what fixes candidate recall: the related disease /
# medication often sits at rank 8-20 for a symptom-shaped question, so it was
# never even a candidate at TOP_K=5. Nothing here reaches the LLM directly —
# the pool is deduped, threshold-filtered, reranked and trimmed first.
RETRIEVAL_TOP_K = int(os.getenv("RETRIEVAL_TOP_K", 20))

# How many reranked candidates retrieve() returns. Matches the previous
# effective maximum (2 sub-queries x TOP_K=5 = 10 deduped hits), so the
# downstream context size is unchanged.
RERANK_TOP_N = int(os.getenv("RERANK_TOP_N", 10))

# Empirically tuned for text-embedding-3-small cosine distances on this KB
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", 0.50))
# Secondary threshold used only when the primary one keeps nothing.
SIMILARITY_THRESHOLD_FALLBACK = float(
    os.getenv("SIMILARITY_THRESHOLD_FALLBACK", 0.35)
)

# ==========================================================
# RERANKER
# ==========================================================
# Local CrossEncoder. Set RERANKER_ENABLED=false to fall back to the previous
# pure-vector ordering without touching any code.
# Default OFF. The cross-encoder/ms-marco-MiniLM-L-6-v2 arm was measured on
# eval/eval.jsonl and regressed every headline metric:
#   Recall@5 0.7167 -> 0.6500, MRR 0.8500 -> 0.7929, P@1 0.7667 -> 0.7000
# See reports/retrieval_reranker_comparison.json. Set RERANKER_ENABLED=true to
# re-enable it; with it off, rerank() is a pure trim to RERANK_TOP_N.
RERANKER_ENABLED = os.getenv("RERANKER_ENABLED", "false").strip().lower() not in (
    "0", "false", "no", "off"
)
RERANKER_MODEL = os.getenv(
    "RERANKER_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2"
)
# Local snapshot of RERANKER_MODEL. When this folder exists it is loaded from
# disk instead of the hub — no network on the first query, and no hang if the
# hub transfer stalls. Populate it with scripts/fetch_reranker_model.py.
RERANKER_MODEL_PATH = Path(
    os.getenv("RERANKER_MODEL_PATH", str(DATA_PATH / "models" / "ms-marco-MiniLM-L-6-v2"))
)
# Truncation length for the (question, document) pair fed to the CrossEncoder.
RERANKER_MAX_LENGTH = int(os.getenv("RERANKER_MAX_LENGTH", 512))
# Hard cap on how many candidates are scored, so a pathological pool cannot
# turn one retrieval into a multi-second CPU job.
RERANKER_MAX_CANDIDATES = int(os.getenv("RERANKER_MAX_CANDIDATES", 60))
RERANKER_BATCH_SIZE = int(os.getenv("RERANKER_BATCH_SIZE", 32))

# HyDE answers are cached on disk by (model, question) like embeddings are.
# temperature=0.0 is not bit-reproducible at the provider, and two runs of the
# same eval differed by 0.017 Recall@5 purely from HyDE resampling. Caching
# removes that variance, removes one LLM call per repeated question, and makes
# A/B arms see identical input.
HYDE_CACHE_ENABLED = os.getenv("HYDE_CACHE_ENABLED", "true").strip().lower() not in (
    "0", "false", "no", "off"
)

# ==========================================================
# RELATION-AWARE RETRIEVAL
# ==========================================================
# Vector search finds the anchor; the KB's own authored links supply the
# inference ("Lethargy -> Canine Distemper"). Threshold and pool width alone
# cannot fix this: reports/threshold_candidate_sweep.md shows Recall@5 pinned
# at 0.717 across every threshold 0.55-0.35 and every pool 10-30, because the
# explaining disease is absent from the neighbour list, not merely low in it.
RELATION_AWARE_ENABLED = os.getenv(
    "RELATION_AWARE_ENABLED", "true"
).strip().lower() not in ("0", "false", "no", "off")

# How many of the threshold-surviving vector hits may seed graph expansion.
# Expansion is anchored to retrieved evidence only -- never a free KB walk.
RELATION_ANCHOR_TOP_N = int(os.getenv("RELATION_ANCHOR_TOP_N", 7))

# Hard cap on relation hops. 2 = symptom -> disease -> medication/product.
RELATION_MAX_PASSES = int(os.getenv("RELATION_MAX_PASSES", 2))

# Global gain on relation evidence relative to vector rank evidence. Every
# combination of RELATION_ANCHOR_TOP_N 6-8, RELATION_BOOST 1.7-1.9 and
# RETRIEVAL_TOP_K 20-30 meets all five targets on eval/eval.jsonl; this is the
# centre of that plateau, not a knife edge. Above 2.0 inference starts evicting
# direct matches and Precision@1 falls.
RELATION_BOOST = float(os.getenv("RELATION_BOOST", 1.8))

# "on_target" keeps the nearest neighbour at rank 1 when its category matches
# the detected intent. Worth +0.066 Precision@1 and +0.033 MRR over "off".
RELATION_PIN_ANCHOR = os.getenv("RELATION_PIN_ANCHOR", "on_target")

# An entity with no vector evidence at all must clear this relation score to
# enter the list. Guards the case the eval set does not contain: a definitional
# question has only two or three neighbours above the threshold, and without a
# floor the remaining slots fill with weakly-linked inferences.
RELATION_MIN_SCORE = float(os.getenv("RELATION_MIN_SCORE", 0.35))

# ── Multi-evidence relation ranking ──────────────────────────────────────────
#
# Relation support is accumulated over *independent retrieved anchors*, not
# taken from the single best edge. Under one symptom anchor every candidate
# disease scores identically (Lethargy reaches Distemper, Leptospirosis and
# Parvovirus with the same weight), so the ranking carries no information; what
# separates them is that several of the retrieved anchors agree on one of them.
# See RAG_System/retrieval/relation_fusion.py::_accumulate.

# Discount on the n-th supporting anchor: value / (1 + decay*n).
# 1.0 is the old harmonic series (1, 1/2, 1/3) and barely rewards agreement.
# 0.65 gives (1, 0.61, 0.43, 0.34) -- three agreeing anchors beat one strong
# one, ten weak ones still cannot. Measured on eval/eval.jsonl: 0.50 and 0.55
# over-accumulate and cost Category Precision@5; 1.0 loses the Recall@5 gain.
RELATION_MULTI_EVIDENCE_DECAY = float(
    os.getenv("RELATION_MULTI_EVIDENCE_DECAY", 0.65)
)

# Runaway guard on the accumulated support. Raised from 1.80 because that value
# was *binding*, not idle: with multi-anchor accumulation a dozen entities
# pinned at exactly 1.80 and the ranking between them collapsed to dict order.
RELATION_CAP = float(os.getenv("RELATION_CAP", 2.4))

# Anchor confidence for an entity the question names outright ("What medication
# treats Canine Infectious Hepatitis?"). A question is mostly not entity text,
# so the bi-encoder puts the named disease at rank 2-4 even when the question
# is entirely about it. Restricted to entities that were actually retrieved --
# never a free KB walk. 0 disables. 1.10 over-weights and costs Recall@5.
RELATION_EXACT_ANCHOR_WEIGHT = float(
    os.getenv("RELATION_EXACT_ANCHOR_WEIGHT", 0.95)
)

# Softness of the anchor-confidence curve, separate from the vector component's
# rank_k so the two can differ. 5 was measured and lost 0.03 Recall@5: it makes
# the rank-4..7 anchors too cheap, and the multi-anchor agreement signal lives
# exactly there.
RELATION_ANCHOR_RANK_K = int(os.getenv("RELATION_ANCHOR_RANK_K", 10))

# Pass-2 decay for entities whose category the query intent explicitly asked
# for (a monitoring product that hangs off the disease, not off the symptom the
# owner described). Implemented and swept; every value above the generic
# pass-2 decay of 0.35 regressed Precision@1 and MRR on this set, so it ships
# neutral. Raise it only with a measurement.
RELATION_PASS2_TARGET_DECAY = float(
    os.getenv("RELATION_PASS2_TARGET_DECAY", 0.35)
)

# Extra gain on an edge whose target category is what the intent asked for,
# on top of QueryIntent.weight_for. Ranking bonus only, never a filter.
# 1.15 was measured: +0.033 Category Precision@5 for -0.05 Recall@5.
RELATION_PRIMARY_GAIN = float(os.getenv("RELATION_PRIMARY_GAIN", 1.0))

# Penalty for walking an edge against the direction the KB authored it in.
# Reverse edges are the only evidence for "what treats X" when the medication
# declares the disease and the disease declares nothing back, so this stays
# close to 1.0 -- but strictly below it.
RELATION_REVERSE_PENALTY = float(os.getenv("RELATION_REVERSE_PENALTY", 0.90))

# Soft repeated-category penalty in the final selection. 0 disables. 0.20 was
# measured and cost 0.17 Category Precision@5 and 0.03 Recall@10 on this set.
RELATION_CATEGORY_DECAY = float(os.getenv("RELATION_CATEGORY_DECAY", 0.0))

# ── Top-1 precision guard ────────────────────────────────────────────────────
#
# A final head-selection step that may rotate ONE candidate from ranks
# 2..PRECISION_GUARD_WINDOW into rank 1 and nothing else. Membership preserving:
# Recall@5 and Hit@5 cannot move, only the ordering within the head.
#
# Ships "off". Measured on eval/eval.jsonl at every combination the brief
# specified (window 3, floors 0.75 / 0.85 / 0.95, modes exact / intent / both):
# see reports/precision_guard_comparison.md. The intent rule is net-negative --
# the three medication/product queries it would fix are outnumbered by the ones
# where rank 1 is already the relevant entity and the promoted sibling is not.
# The exact rule is a no-op at every floor >= 0.75, because the only two
# queries it can fire on sit at score ratios 0.644 and 0.675.
#
# "off" | "exact" | "intent" | "both"
PRECISION_GUARD_MODE = os.getenv("PRECISION_GUARD_MODE", "off").strip().lower()
PRECISION_GUARD_WINDOW = int(os.getenv("PRECISION_GUARD_WINDOW", 3))
PRECISION_GUARD_FLOOR = float(os.getenv("PRECISION_GUARD_FLOOR", 0.75))

# ==========================================================
# BM25 / HYBRID RETRIEVAL
# ==========================================================
# Lexical retrieval over the same ChromaDB entities, fused with the vector
# ranking by Reciprocal Rank Fusion before the relation stage runs. BM25 is
# complementary, not a replacement: it is exact where the embedding is fuzzy
# (a question that quotes an entity name), and blind where the embedding is
# strong (a symptom description that never names the disease).
BM25_ENABLED = os.getenv("BM25_ENABLED", "false").strip().lower() not in (
    "0", "false", "no", "off"
)

# How many lexical candidates enter the fusion.
BM25_TOP_K = int(os.getenv("BM25_TOP_K", 10))

# RRF constant. Rank-based fusion, because a cosine distance and a BM25 score
# are not on a common scale.
RRF_K = int(os.getenv("RRF_K", 60))

# ==========================================================
# INDEXING
# ==========================================================
BATCH_SIZE = int(os.getenv("BATCH_SIZE", 100))

# ==========================================================
# LOGGING
# ==========================================================
LOG_LEVEL = "INFO"
LOG_FILE = LOGS_PATH / "rag_system.log"

# ==========================================================
# SUPPORTED DATA
# ==========================================================
SUPPORTED_ANIMALS = [
    "dog", "cat", "bird", "rabbit",
    "hamster", "fish", "turtle"
]

SUPPORTED_CATEGORIES = [
    "diseases", "symptoms", "medications", "diagnostics",
    "vaccines", "emergency", "breeds", "medical_products"
]