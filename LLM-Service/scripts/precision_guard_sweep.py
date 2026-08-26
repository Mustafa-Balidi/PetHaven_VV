#!/usr/bin/env python3
"""Offline sweep of the top-1 precision guard, over the cached candidate lists.

Every configuration replays the identical cached HyDE answers and identical
ChromaDB neighbour lists through the production fusion, so the only thing that
differs between rows is the guard.

Section 7 of the brief fixes the ratio thresholds at 0.75 / 0.85 / 0.95 and
section 6 suggests a head window of 3. Those are the rows that decide the
outcome. The sub-threshold rows (floor 0.60, window 5) are reported too, so the
ceiling of the idea is on record rather than inferred.

Usage:
    PYTHONPATH=. python scripts/precision_guard_sweep.py
"""
from __future__ import annotations

import dataclasses
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from RAG_System.retrieval import relation_fusion as rf  # noqa: E402
from scripts.multi_evidence_sweep import load, run_config  # noqa: E402

OUT = ROOT / "reports" / "precision_guard_sweep.json"

# The mandated grid, then the diagnostic extras.
CONFIGS = [
    ("guard off (current)", dict(guard_mode="off")),
    ("exact  w3 f0.75", dict(guard_mode="exact", guard_window=3, guard_floor=0.75)),
    ("exact  w3 f0.85", dict(guard_mode="exact", guard_window=3, guard_floor=0.85)),
    ("exact  w3 f0.95", dict(guard_mode="exact", guard_window=3, guard_floor=0.95)),
    ("intent w3 f0.75", dict(guard_mode="intent", guard_window=3, guard_floor=0.75)),
    ("intent w3 f0.85", dict(guard_mode="intent", guard_window=3, guard_floor=0.85)),
    ("intent w3 f0.95", dict(guard_mode="intent", guard_window=3, guard_floor=0.95)),
    ("both   w3 f0.75", dict(guard_mode="both", guard_window=3, guard_floor=0.75)),
    ("both   w3 f0.85", dict(guard_mode="both", guard_window=3, guard_floor=0.85)),
    ("both   w3 f0.95", dict(guard_mode="both", guard_window=3, guard_floor=0.95)),
    # Below the mandated floors -- documents the ceiling, not a candidate.
    ("exact  w3 f0.60", dict(guard_mode="exact", guard_window=3, guard_floor=0.60)),
    ("both   w5 f0.60", dict(guard_mode="both", guard_window=5, guard_floor=0.60)),
]

HEAD = ("precision@1", "precision@3", "precision@5", "recall@3", "recall@5",
        "recall@10", "f1@5", "mrr", "hit@5", "category_precision@5")

# Section 12.
ACCEPT = {"precision@1": 0.8667, "recall@5": 0.8667, "hit@5": 1.0,
          "mrr": 0.8660, "category_precision@5": 0.88}


def main() -> None:
    entries, graph, store = load()
    base = rf.params_from_settings()

    baseline_top1 = None
    rows = []
    for name, over in CONFIGS:
        result = run_config(
            entries, graph, store, dataclasses.replace(base, **over))
        top1 = {
            case["query"]: (case["names"][0] if case["names"] else None)
            for case in result["cases"]
        }
        correct = {
            case["query"]: case["scores"]["precision@1"]
            for case in result["cases"]
        }
        if baseline_top1 is None:
            baseline_top1, baseline_correct = top1, correct
            fixed = broke = 0
        else:
            fixed = sum(
                1 for q in correct
                if correct[q] > baseline_correct[q])
            broke = sum(
                1 for q in correct
                if correct[q] < baseline_correct[q])
        row = {k: result[k] for k in HEAD}
        row["name"], row["overrides"] = name, over
        row["top1_fixed"], row["top1_broken"] = fixed, broke
        row["head_changed"] = sum(
            1 for q in top1 if top1[q] != baseline_top1[q])
        row["accepted"] = all(row[k] >= v for k, v in ACCEPT.items())
        rows.append(row)
        print("{:22} P@1={:.4f} R@5={:.4f} MRR={:.4f} Hit@5={:.4f} "
              "CatP={:.4f} | heads changed={:2} fixed={} broke={} {}".format(
                  name, row["precision@1"], row["recall@5"], row["mrr"],
                  row["hit@5"], row["category_precision@5"],
                  row["head_changed"], fixed, broke,
                  "ACCEPT" if row["accepted"] else ""))

    OUT.write_text(json.dumps(rows, indent=2, ensure_ascii=False),
                   encoding="utf-8")
    print("\nSaved {}".format(OUT))


if __name__ == "__main__":
    main()
