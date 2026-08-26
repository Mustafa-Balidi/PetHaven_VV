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
TOP_K = int(os.getenv("TOP_K", 5))
# Empirically tuned for text-embedding-3-small cosine distances on this KB
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", 0.55))
# Secondary threshold used only when the primary one keeps nothing.
SIMILARITY_THRESHOLD_FALLBACK = float(
    os.getenv("SIMILARITY_THRESHOLD_FALLBACK", 0.35)
)

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