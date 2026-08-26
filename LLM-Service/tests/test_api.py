from fastapi.testclient import TestClient

from RAG_System.api import app as app_module
from RAG_System.indexing.vector_store import SearchHit


def _hit() -> SearchHit:
    return SearchHit(
        id="DOG_DIS_003",
        text="some text",
        metadata={"id": "DOG_DIS_003", "name": "Gastritis", "animal": "dog", "category": "diseases"},
        distance=0.2,
    )


def test_ask_returns_answer_and_hits(monkeypatch):
    def fake_answer_with_hits(question, animal=None, category=None, conversation_id=None, client=None):
        return "some answer", [_hit()]

    monkeypatch.setattr(app_module, "answer_with_hits", fake_answer_with_hits)
    client = TestClient(app_module.app)

    response = client.post("/ask", json={"question": "My dog is vomiting blood"})

    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == "some answer"
    assert body["hits"] == [
        {"id": "DOG_DIS_003", "name": "Gastritis", "category": "diseases", "distance": 0.2}
    ]


def test_ask_without_question_is_422():
    client = TestClient(app_module.app)

    response = client.post("/ask", json={})

    assert response.status_code == 422


def test_health_reports_status(monkeypatch):
    monkeypatch.setattr(app_module.VectorStore, "count", lambda self: 42)
    monkeypatch.setattr(app_module, "_ollama_reachable", lambda: True)
    client = TestClient(app_module.app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "chroma_count": 42, "ollama_reachable": True}
