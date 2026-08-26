"""CLI for the full assess scenario: expanded hits + prompt + answer."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.stdout.reconfigure(encoding="utf-8")

from RAG_System.config import settings
from RAG_System.llm.generator import answer_with_hits
from RAG_System.llm.prompt_builder import build_prompt


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Run one full assess scenario.")
    parser.add_argument("--animal", choices=settings.SUPPORTED_ANIMALS)
    parser.add_argument("--question", required=True)
    return parser.parse_args()


def main() -> None:
    """Retrieve, expand, build the prompt, generate, and print each stage."""
    args = parse_args()

    text, hits = answer_with_hits(args.question, animal=args.animal)

    print("Expanded hits:")
    for hit in hits:
        print(f"  [{hit.metadata.get('category')}] {hit.id} - {hit.metadata.get('name')}")

    print("\nPrompt:")
    print(build_prompt(args.question, hits))

    print("\nAnswer:")
    print(text)


if __name__ == "__main__":
    main()
