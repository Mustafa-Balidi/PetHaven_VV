from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator
from RAG_System.config import settings
logger = logging.getLogger(__name__)


class LoaderError(Exception):
    """Raised when loading a knowledge base entity fails."""

@dataclass(frozen=True)
class RawEntity:
    """One JSON entity. JSON is truth; category from folder only."""

    path: Path
    category: str
    data: dict

    @property
    def id(self) -> str:
        return self.data["id"]

    @property
    def name(self) -> str:
        return self.data["name"]

    @property
    def animal(self) -> str:
        return self.data["animal"]


def folder_location(path: Path) -> tuple[str, str]:
    """Derive (animal, category) folder names from a path."""
    return path.parent.parent.name, path.parent.name

def _strip_strings(obj):
    if isinstance(obj, dict):
        return {k.strip(): _strip_strings(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_strip_strings(v) for v in obj]
    if isinstance(obj, str):
        return obj.strip()
    return obj

def load_file(path: Path) -> RawEntity:
    """Load a single entity JSON file."""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise LoaderError(f"Invalid JSON in {path}: {exc}") from exc
    data = _strip_strings(data)
    if not isinstance(data, dict):
        raise LoaderError(f"Entity must be a JSON object: {path}")

    _, category = folder_location(path)
    if category not in settings.SUPPORTED_CATEGORIES:
        raise LoaderError(f"Unknown category folder: {path}")

    return RawEntity(path=path, category=category, data=data)


def iter_category(folder: Path) -> Iterator[RawEntity]:
    """Stream all entities in one category folder."""
    if not folder.is_dir():
        raise LoaderError(f"Category folder not found: {folder}")
    for path in sorted(folder.glob("*.json")):
        if path.stem.startswith("#"):
            logger.warning("Skipping malformed filename: %s", path.name)
            continue
        yield load_file(path)


def iter_all() -> Iterator[RawEntity]:
    """Stream every entity in the Knowledge Base."""
    for animal in settings.SUPPORTED_ANIMALS:
        for category in settings.SUPPORTED_CATEGORIES:
            folder = settings.KNOWLEDGE_BASE_PATH / animal / category
            if folder.is_dir():
                yield from iter_category(folder)