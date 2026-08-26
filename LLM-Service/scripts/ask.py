"""Manual CLI to test retrieval + generation end-to-end."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.config import settings
from RAG_System.llm.generator import answer_with_hits


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Ask Pet Haven AI a question.")
    parser.add_argument("--animal", choices=settings.SUPPORTED_ANIMALS)
    parser.add_argument("--category", choices=settings.SUPPORTED_CATEGORIES)
    parser.add_argument("--question", required=True)
    parser.add_argument("--conversation")
    return parser.parse_args()


def main() -> None:
    """Run one retrieve + generate cycle and print the answer."""
    args = parse_args()
    result, _ = answer_with_hits(
        args.question,
        animal=args.animal,
        category=args.category,
        conversation_id=args.conversation,
    )
    print(result)


if __name__ == "__main__":
    main()
