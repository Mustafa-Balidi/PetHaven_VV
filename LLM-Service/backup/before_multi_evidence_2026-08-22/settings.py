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