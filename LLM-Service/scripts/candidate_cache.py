#!/usr/bin/env python3
"""Build a reusable candidate cache for retrieval experiments.

One pass over eval/eval.jsonl. For every query it runs exactly the production
candidate-generation front end -- HyDE, embed(original), embed(HyDE), two
ChromaDB searches -- and stores the *unfiltered* neighbour lists.

Why a cache: threshold and pool-size sweeps only ever *filter or truncate*
those lists. ChromaDB returns neighbours in distance order, so the top-10 pool
is a strict prefix of the top-30 pool. Caching the widest pool once therefore
lets every configuration be evaluated exactly, without re-paying the HyDE LLM
call (~5s) 15 times per query.

Output: reports/_candidate_cache.json
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.indexing.embedder import OpenRouterEmbedder  # noqa: E402
from RAG_System.indexing.vector_store import get_store  # noqa: E402
from RAG_System.retrieval.retriever import _hyde_answer  # noqa: E402

DATASET = ROOT / "eval" / "eval.jsonl"
OUT = ROOT / "reports" / "_candidate_cache.json"

MAX_POOL = 30


def _load(path: Path) -> list[dict]:
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset", default=str(DATASET))
    ap.add_argument("--out", default=str(OUT))
    ap.add_argument("--pool", type=int, default=MAX_POOL)
    args = ap.parse_args()

    cases = _load(Path(args.dataset))
    store = get_store()
    embedder = OpenRouterEmbedder()

    # Uses the production HyDE path (and therefore the production HyDE disk
    # cache), so the replayed candidate lists are byte-identical to what
    # retrieve() sees. Anything tuned offline transfers to the service.
    hyde_cache: dict[str, str] = {}

    entries = []
    for i, case in enumerate(cases, 1):
        query = case["query"]
        animal = case.get("animal")

        t0 = time.monotonic()
        hyde = _hyde_answer(query)
        hyde_fresh = False
        hyde_cache[query] = hyde
        hyde_s = time.monotonic() - t0

        subqueries = [("original", query)]
        if hyde:
            subqueries.append(("hyde", hyde))

        t1 = time.monotonic()
        sub_hits = {}
        for label, text in subqueries:
            vector = embedder.embed_query(text)
            hits = store.search(vector, animal=animal, top_k=args.pool)
            sub_hits[label] = [
                {
                    "id": h.id,
                    "name": (h.metadata or {}).get("name", ""),
                    "category": (h.metadata or {}).get("category", ""),
                    "distance": h.distance,
                    "metadata": h.metadata or {},
                }
                for h in hits
            ]
        search_s = time.monotonic() - t1

        entries.append({
            "query": query,
            "animal": animal,
            "expected_keywords": case["expected_keywords"],
            "expected_categories": case.get("expected_categories") or [],
            "hyde": hyde,
            "sub_hits": sub_hits,
            "timing": {
                "hyde_s": round(hyde_s, 3),
                "hyde_fresh": hyde_fresh,
                "search_s": round(search_s, 3),
            },
        })
        print(f"[{i:2}/{len(cases)}] {query[:48]:48} "
              f"hyde={'new' if hyde_fresh else 'cached'} "
              f"pool={sum(len(v) for v in sub_hits.values())} "
              f"{hyde_s + search_s:.2f}s")

    Path(args.out).write_text(
        json.dumps({"pool": args.pool, "entries": entries}, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"\nSaved {args.out}  ({len(entries)} queries)")


if __name__ == "__main__":
    main()
