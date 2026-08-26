from RAG_System.llm import history


def test_roundtrip(tmp_path, monkeypatch):
    monkeypatch.setattr(history, "_DB_PATH", tmp_path / "history.db")

    history.add_turn("c1", "question one", "answer one")

    recent = history.get_recent("c1")

    assert recent == [("user", "question one"), ("assistant", "answer one")]


def test_limit_returns_most_recent_oldest_first(tmp_path, monkeypatch):
    monkeypatch.setattr(history, "_DB_PATH", tmp_path / "history.db")

    for i in range(4):
        history.add_turn("c1", f"q{i}", f"a{i}")

    recent = history.get_recent("c1", limit=2)

    assert recent == [("user", "q3"), ("assistant", "a3")]
