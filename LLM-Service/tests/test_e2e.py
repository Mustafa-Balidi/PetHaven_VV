"""Live end-to-end test: real retrieval (OpenRouter) + generation (Ollama)."""

from __future__ import annotations

import socket

import pytest

from RAG_System.config import settings
from RAG_System.indexing.embedder import EmbedderError
from RAG_System.llm.client import LLMError
from RAG_System.llm.generator import answer


def _reachable(host: str, port: int) -> bool:
    try:
        socket.create_connection((host, port), timeout=3).close()
        return True
    except OSError:
        return False


def _openrouter_reachable() -> bool:
    return _reachable("openrouter.ai", 443)


def _ollama_reachable() -> bool:
    try:
        host_port = settings.OLLAMA_BASE_URL.split("://", 1)[-1]
        host, port = host_port.split(":", 1)
        return _reachable(host, int(port))
    except (ValueError, IndexError):
        return False


pytestmark = [
    pytest.mark.live,
    pytest.mark.skipif(
        not (_openrouter_reachable() and _ollama_reachable()),
        reason="OpenRouter or Ollama unreachable",
    ),
]


def test_answer_returns_grounded_text():
    try:
        result = answer("My dog is vomiting blood", animal="dog")
    except (EmbedderError, LLMError) as exc:
        pytest.skip(f"live dependency failed in this environment: {exc}")
    assert isinstance(result, str)
    assert result.strip()
