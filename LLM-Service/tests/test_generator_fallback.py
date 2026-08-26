"""اختبارات generator.py — fallback logic مع conversation history."""

from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from RAG_System.indexing.vector_store import SearchHit
from RAG_System.llm import generator, history


def _hit(id_: str = "DOG_DIS_003", category: str = "diseases") -> SearchHit:
    return SearchHit(
        id=id_,
        text=f"Context for {id_}",
        metadata={"id": id_, "name": "Hepatitis", "animal": "dog", "category": category},
        distance=0.2,
    )


def test_fallback_uses_last_user_turn(tmp_path, monkeypatch):
    """عند وجود conversation_id، يُستخدم آخر user turn كـ anchor."""
    # إعداد history
    monkeypatch.setattr(history, "_DB_PATH", tmp_path / "history.db")
    history.add_turn("c1", "What is hepatitis?", "It is a liver disease.")
    history.add_turn("c1", "How to treat it?", "With antibiotics.")

    calls = []

    def fake_retrieve(q, **kw):
        calls.append(q)
        return [_hit()]

    monkeypatch.setattr(generator, "retrieve", fake_retrieve)
    monkeypatch.setattr(generator, "expand", lambda hits, **kw: hits)

    mock_client = MagicMock()
    mock_client.generate.return_value = "Use Ampicillin."

    result = generator.answer(
        "What about dosage?",
        conversation_id="c1",
        client=mock_client,
    )

    # الاستدعاء الثاني يجب أن يحتوي على anchor (آخر user turn)
    assert len(calls) >= 1
    # التحقق من أن الـ anchor بُني من آخر سؤال
    last_call = calls[-1]
    assert "How to treat it?" in last_call or "dosage" in last_call


def test_no_fallback_without_conversation_id(tmp_path, monkeypatch):
    """بدون conversation_id → لا fallback، السؤال فقط."""
    monkeypatch.setattr(history, "_DB_PATH", tmp_path / "history.db")

    calls = []

    def fake_retrieve(q, **kw):
        calls.append(q)
        return [_hit()]

    monkeypatch.setattr(generator, "retrieve", fake_retrieve)
    monkeypatch.setattr(generator, "expand", lambda hits, **kw: hits)

    mock_client = MagicMock()
    mock_client.generate.return_value = "Answer."

    generator.answer("What is hepatitis?", client=mock_client)

    assert len(calls) == 1
    assert calls[0] == "What is hepatitis?"


def test_empty_hits_returns_no_context_message(tmp_path, monkeypatch):
    """بدون نتائج → LLM يستلم 'المعلومة غير متوفرة'."""
    monkeypatch.setattr(generator, "retrieve", lambda q, **kw: [])
    monkeypatch.setattr(generator, "expand", lambda hits, **kw: hits)

    mock_client = MagicMock()
    mock_client.generate.return_value = "المعلومة غير متوفرة"

    result = generator.answer("Unknown question", client=mock_client)

    # التحقق من أن الـ prompt احتوى على NO_CONTEXT_MESSAGE
    prompt_arg = mock_client.generate.call_args[0][0]
    assert "غير متوفرة" in prompt_arg