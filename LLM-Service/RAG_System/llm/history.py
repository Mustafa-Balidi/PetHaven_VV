"""Conversation history storage (stdlib sqlite only)."""

from __future__ import annotations

import sqlite3
from pathlib import Path

from RAG_System.config import settings

_DB_PATH = settings.PROJECT_ROOT / "data" / "history.db"


def _connect() -> sqlite3.Connection:
    _DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(_DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=NORMAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS turns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    return conn


def add_turn(conversation_id: str, question: str, answer: str) -> None:
    """Persist one question/answer turn for a conversation."""
    with _connect() as conn:
        conn.execute(
            "INSERT INTO turns (conversation_id, role, content) VALUES (?, ?, ?)",
            (conversation_id, "user", question),
        )
        conn.execute(
            "INSERT INTO turns (conversation_id, role, content) VALUES (?, ?, ?)",
            (conversation_id, "assistant", answer),
        )


def get_recent(conversation_id: str, limit: int = 6) -> list[tuple[str, str]]:
    """Return up to `limit` most recent (role, content) turns, oldest-first."""
    with _connect() as conn:
        rows = conn.execute(
            "SELECT role, content FROM turns WHERE conversation_id = ? "
            "ORDER BY id DESC LIMIT ?",
            (conversation_id, limit),
        ).fetchall()
    return list(reversed(rows))
