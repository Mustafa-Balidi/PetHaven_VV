"""CLI entry point for Knowledge Base indexing."""

from __future__ import annotations

import argparse
import logging

from RAG_System.config import settings
from RAG_System.indexing import loader
from RAG_System.indexing.embedder import OpenRouterEmbedder
from RAG_System.indexing.pipeline import index_entities
from RAG_System.indexing.vector_store import VectorStore


def configure_logging() -> None:
    """Configure application logging."""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.FileHandler(settings.LOG_FILE, encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Index Pet Haven Knowledge Base into ChromaDB."
    )

    parser.add_argument(
        "--animal",
        choices=settings.SUPPORTED_ANIMALS,
        help="Index only one animal.",
    )

    parser.add_argument(
        "--category",
        choices=settings.SUPPORTED_CATEGORIES,
        help="Index only one category.",
    )

    return parser.parse_args()


def get_entities(
    animal: str | None,
    category: str | None,
):
    """Return entities according to optional filters."""

    if animal and category:
        folder = settings.KNOWLEDGE_BASE_PATH / animal / category
        yield from loader.iter_category(folder)

    elif animal:
        for current_category in settings.SUPPORTED_CATEGORIES:
            folder = settings.KNOWLEDGE_BASE_PATH / animal / current_category

            if folder.is_dir():
                yield from loader.iter_category(folder)

    elif category:
        for current_animal in settings.SUPPORTED_ANIMALS:
            folder = (
                settings.KNOWLEDGE_BASE_PATH
                / current_animal
                / category
            )

            if folder.is_dir():
                yield from loader.iter_category(folder)

    else:
        yield from loader.iter_all()


def main() -> None:
    """Run the indexing pipeline."""
    configure_logging()

    args = parse_args()

    embedder = OpenRouterEmbedder()
    store = VectorStore()

    entities = get_entities(
        animal=args.animal,
        category=args.category,
    )

    report = index_entities(
        entities=entities,
        embedder=embedder,
        store=store,
    )

    print("\n=== Indexing Report ===")
    print(f"Indexed : {report.indexed}")
    print(f"Skipped : {report.skipped}")
    print(f"Failed  : {report.failed}")
    print(f"Warned  : {report.warned}")
    print(f"Total   : {report.total}")  
    print(f"ChromaDB: {store.count()}")

if __name__ == "__main__":
    main()