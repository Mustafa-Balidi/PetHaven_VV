"""FastAPI surface for the Pet Haven RAG generator."""

from __future__ import annotations

import logging
import uuid

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from RAG_System.config import settings
from RAG_System.indexing.vector_store import get_store
from RAG_System.llm.generator import answer_with_hits
from RAG_System.llm.translator import (
    arabic_to_english,
    english_to_arabic,
)


# Uvicorn only configures its own loggers, so without this the retrieval
# diagnostics and pipeline warnings never reach the service log.
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL, logging.INFO),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[
        logging.FileHandler(settings.LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger(__name__)


# =========================================================
# FastAPI App
# =========================================================

app = FastAPI(
    title="Pet Haven RAG Service",
    description="Veterinary RAG service powered by OpenRouter.",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Request / Response Models
# =========================================================

class AskRequest(BaseModel):
    question:        str
    animal:          str | None = None
    category:        str | None = None
    conversation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    language:        str = "en"

    @field_validator("animal", mode="before")
    @classmethod
    def normalize_animal(cls, v):
        if v is None:
            return None
        normalized = str(v).strip().lower()
        if normalized not in settings.SUPPORTED_ANIMALS:
            raise ValueError(
                f"Unsupported animal '{v}'. "
                f"Supported: {settings.SUPPORTED_ANIMALS}"
            )
        return normalized

    @field_validator("conversation_id", mode="before")
    @classmethod
    def normalize_conversation_id(cls, v):
        if not v:
            return str(uuid.uuid4())
        normalized = str(v).strip()
        return normalized if normalized else str(uuid.uuid4())

    @field_validator("language", mode="before")
    @classmethod
    def normalize_language(cls, v):
        return str(v or "en").strip().lower()


class HitOut(BaseModel):
    id: str
    name: str
    category: str
    distance: float


class AskResponse(BaseModel):
    answer:          str
    hits:            list[HitOut]
    conversation_id: str


class HealthResponse(BaseModel):
    status: str
    chroma_count: int
    openrouter_configured: bool
    openrouter_reachable: bool
    embedding_model: str
    llm_model: str


# =========================================================
# OpenRouter Health Check
# =========================================================

def _openrouter_reachable() -> bool:
    """
    Check whether OpenRouter is configured and reachable.
    """

    api_key = settings.OPENROUTER_API_KEY

    if not api_key:
        logger.warning("OPENROUTER_API_KEY is not configured.")
        return False

    try:
        response = requests.get(
            f"{settings.OPENROUTER_BASE_URL}/models",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            timeout=5,
        )

        return response.status_code == 200

    except requests.RequestException as exc:
        logger.warning("OpenRouter health check failed: %s", exc)
        return False


# =========================================================
# Ask Endpoint
# =========================================================

@app.post("/ask", response_model=AskResponse)
def ask(request: AskRequest) -> AskResponse:
    """
    Retrieve context from the English knowledge base
    and generate an answer in the user's selected language.
    """

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    if not settings.OPENROUTER_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="OpenRouter API key is not configured.",
        )

    try:
        # Determine selected frontend language
        is_arabic = request.language.startswith("ar")

        # =================================================
        # 1. Prepare question for the English RAG system
        # =================================================

        rag_question = question

        if is_arabic:
            rag_question = arabic_to_english(question)

            logger.info(
                "Arabic question translated to English for RAG."
            )

        # =================================================
        # 2. Run the normal RAG pipeline
        # =================================================

        text, hits = answer_with_hits(
            rag_question,
            animal=request.animal,
            category=request.category,
            conversation_id=request.conversation_id,
        )

        # =================================================
        # 3. Translate answer back to Arabic when needed
        # =================================================

        final_answer = text

        if is_arabic:
            final_answer = english_to_arabic(text)

        # =================================================
        # 4. Return response to frontend
        # =================================================

        return AskResponse(
            answer=final_answer,
            hits=[
                HitOut(
                    id=hit.id,
                    name=hit.metadata.get("name", ""),
                    category=hit.metadata.get("category", ""),
                    distance=float(hit.distance),
                )
                for hit in hits
            ],
            conversation_id=request.conversation_id,
        )

    except HTTPException:
        raise

    except RuntimeError as exc:
        # Translation failures must be distinguishable from generic errors:
        # a medical answer in the wrong language is not an acceptable fallback.
        if "translation" in str(exc).lower():
            logger.exception("Translation layer failed.")
            raise HTTPException(
                status_code=503,
                detail=str(exc),
            ) from exc

        logger.exception("RAG pipeline failed for q=%r", request.question)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate an answer.",
        ) from exc

    except Exception as exc:
        logger.exception("Failed to generate RAG answer.")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate an answer.",
        ) from exc


# =========================================================
# Health Endpoint
# =========================================================

@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """
    Report ChromaDB and OpenRouter health.
    """

    try:
        chroma_count = get_store().count()
    except Exception:
        logger.exception("Failed to access ChromaDB.")
        chroma_count = 0

    openrouter_configured = bool(settings.OPENROUTER_API_KEY)
    openrouter_reachable = _openrouter_reachable()

    overall_status = (
        "ok"
        if chroma_count > 0
        and openrouter_configured
        and openrouter_reachable
        else "degraded"
    )

    return HealthResponse(
        status=overall_status,
        chroma_count=chroma_count,
        openrouter_configured=openrouter_configured,
        openrouter_reachable=openrouter_reachable,
        embedding_model=settings.EMBEDDING_MODEL,
        llm_model=settings.LLM_MODEL,
    )


# =========================================================
# Root Endpoint
# =========================================================

@app.get("/")
def root():
    return {
        "service": "Pet Haven RAG Service",
        "status": "running",
        "provider": "OpenRouter",
        "docs": "/docs",
        "health": "/health",
    }