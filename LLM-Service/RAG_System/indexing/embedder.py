from __future__ import annotations
import hashlib
import json
import logging
from pathlib import Path
from typing import Protocol
from langchain_openai import OpenAIEmbeddings
from RAG_System.config import settings
logger = logging.getLogger(__name__)

class EmbedderError(Exception):
    """Raised when embedding fails after all retries."""
class Embedder(Protocol):

    def embed(self, texts: list[str]) -> list[list[float]]: ...
class DiskCache:

    def __init__(self, path: Path, namespace: str) -> None:
        safe = namespace.replace("/", "_").replace(":", "_")
        self._dir = path / safe
        self._dir.mkdir(parents=True, exist_ok=True)

    def _key(self, text: str) -> Path:
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
        return self._dir / f"{digest}.json"

    def get(self, text: str) -> list[float] | None:
        key = self._key(text)
        if not key.exists():
            return None
        try:
            return json.loads(key.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return None

    def put(self, text: str, vector: list[float]) -> None:
        try:
            self._key(text).write_text(json.dumps(vector), encoding="utf-8")
        except OSError as exc:
            logger.warning("Embed cache write failed: %s", exc)

class OpenRouterEmbedder:

    def __init__(self) -> None:
        self._lc = OpenAIEmbeddings(
            model=settings.EMBEDDING_MODEL,
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
            max_retries=3,
            check_embedding_ctx_length=False,  
        )
        self._cache = DiskCache(
            settings.DATA_PATH / "embed_cache", settings.EMBEDDING_MODEL
        )

    def embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        vectors: list[list[float] | None] = [None] * len(texts)
        missing: list[int] = []
        for i, text in enumerate(texts):
            cached = self._cache.get(text)
            if cached is not None:
                vectors[i] = cached
            else:
                missing.append(i)
        if missing:
            try:
                fresh = self._lc.embed_documents([texts[i] for i in missing])
            except Exception as exc:
                raise EmbedderError(str(exc)) from exc
            for i, vec in zip(missing, fresh):
                vectors[i] = vec
                self._cache.put(texts[i], vec)
        return vectors 

    def embed_query(self, text: str) -> list[float]:
        cached = self._cache.get(text)
        if cached is not None:
            return cached
        try:
            vec = self._lc.embed_query(text)
        except Exception as exc:
            raise EmbedderError(str(exc)) from exc
        self._cache.put(text, vec)
        return vec