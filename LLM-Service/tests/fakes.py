"""Deterministic fakes for offline tests."""


class FakeEmbedder:
    """Hash-based embedder. Deterministic, offline, free."""

    dim = 8

    def embed(self, texts: list[str]) -> list[list[float]]:
        vectors = []
        for text in texts:
            total = sum(ord(c) for c in text)
            vec = [float((total >> i) % 2) for i in range(self.dim)]
            norm = sum(v * v for v in vec) ** 0.5 or 1.0
            vectors.append([v / norm for v in vec])
        return vectors