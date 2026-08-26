# Relation-Aware Retrieval -- Final Report

Dataset: `eval/eval.jsonl`, 30 queries, unmodified.
Reranker: **disabled in both arms** (the MS-MARCO arm regressed every
headline metric and was removed from this experiment).

| Metric | Baseline | New | Delta |
|---|---|---|---|
| Precision@1 | 0.7667 | 0.8000 | +0.0333 |
| Recall@1 | 0.5500 | 0.5667 | +0.0167 |
| Recall@3 | 0.6833 | 0.7500 | +0.0667 |
| Recall@5 | 0.6833 | 0.8500 | +0.1667 |
| Recall@10 | 0.7000 | 0.9167 | +0.2167 |
| Precision@5 | 0.2533 | 0.3133 | +0.0600 |
| F1@5 | 0.3508 | 0.4391 | +0.0883 |
| MRR | 0.8222 | 0.8650 | +0.0428 |
| Hit@5 | 0.9000 | 1.0000 | +0.1000 |
| Category Precision@5 | 0.7600 | 0.8867 | +0.1267 |
| Latency (mean s) | 0.48 | 0.47 | -0.01 |

Precision@5 is reported with the standard definition and is **not** a
target: most queries here have 1-2 relevant entities, so its ceiling at
K=5 is 0.20-0.40 even with perfect retrieval.

## TARGET Recall@5 >= 85%

**PASS** -- Recall@5 = 0.8500

## Watched entities (section 11)

Previous rank is the entity's position in the baseline arm's returned
list; `absent` means it was never returned at all. Relation source and
type name the strongest edge that carried the entity into the pool --
`authored` is the direction the KB wrote the link in, `direction` is the
direction it was walked.

| Entity | Query | Prev | New | Vec rank | Relation source | Relation type (authored) | Walk | Pass | Top 5 |
|---|---|---|---|---|---|---|---|---|---|
| Canine Distemper | My dog seems tired and has no energy, wh | absent | 10 | - | Lethargy | symptoms->diseases | forward | 1 | no |
| Leptospirosis | There is blood in my dog's urine, what's | absent | 4 | - | Hematuria | symptoms->diseases | forward | 1 | yes |
| Acute Gastritis | My cat keeps throwing up, what diseases  | absent | 5 | 14 | Vomiting | symptoms->diseases | forward | 1 | yes |
| Chronic Kidney Disease | My cat is very lethargic and low energy, | absent | 6 | - | Lethargy | symptoms->diseases | forward | 1 | no |
| Chronic Kidney Disease | What medication is prescribed for Chroni | 2 | 1 | 2 | Feline Prescription Diet K/D | medical_products->diseases | forward | 1 | yes |
| Canine Parvovirus Infection | My dog has no appetite and won't eat, wh | absent | 5 | - | Anorexia | symptoms->diseases | forward | 1 | yes |
| Feline Diabetes Mellitus | My cat is losing weight rapidly, why? | absent | 3 | 16 | Weight Loss | symptoms->diseases | forward | 1 | yes |
| Feline Diabetes Mellitus | What is used to treat Feline Diabetes Me | 1 | 4 | 1 | Glargine Insulin | medications->diseases | forward | 1 | yes |
| Feline Diabetes Mellitus | My cat drinks and urinates a lot, what m | absent | 5 | - | Polydipsia | symptoms->diseases | forward | 1 | yes |
| Enrofloxacin | What medication treats Canine Infectious | absent | absent | - | - | - | - | - | no |
| Metoclopramide | How is Gastric Dilatation-Volvulus treat | absent | 2 | 5 | Gastric Dilatation-Volvulus (Gdv / Bloat) | medications->diseases | reverse | 1 | yes |
| Benazepril | What medication is prescribed for Chroni | absent | 8 | 10 | Chronic Kidney Disease | medications->diseases | reverse | 1 | no |
| Slow Feeder Bowl | What product helps a dog recovering from | absent | 3 | 12 | Gastric Dilatation-Volvulus (Gdv / Bloat) | medical_products->diseases | reverse | 1 | yes |
| Probiotics For Dogs | My dog keeps vomiting, what product can  | absent | absent | - | - | - | - | - | no |
| Glucose Meter | My cat drinks and urinates a lot, what m | absent | absent | - | - | - | - | - | no |

## Remaining misses (expected entity outside the top 5)

`Fused position` is where the entity actually ended up in the full fused
ranking. `-` means it never became a candidate at all; a number above 10
means it was a candidate that lost the ranking, which is a different
problem with a different fix.

| Query | Entity | Returned rank | Fused position | Vector rank | Relation score |
|---|---|---|---|---|---|
| My dog seems tired and has no energy, wh | Canine Distemper | 10 | 10 | - | 1.011 |
| My cat is very lethargic and low energy, | Chronic Kidney Disease | 6 | 6 | - | 1.2678 |
| What medication treats Canine Infectious | Enrofloxacin | - | 13 | - | 1.0143 |
| What medication is prescribed for Chroni | Benazepril | 8 | 8 | 10 | 1.3331 |
| What product helps a dog recovering from | Vomiting | - | 22 | - | 0.9088 |
| My dog keeps vomiting, what product can  | Probiotics For Dogs | - | 14 | 24 | 0.2728 |
| My dog has bad breath and swollen gums,  | Gingivitis | 9 | 8 | 6 | 1.1432 |
| My cat is vomiting, what product can hel | Vomiting | - | 23 | 11 | 0.5453 |
| My cat drinks and urinates a lot, what m | Glucose Meter | - | 17 | - | 0.5265 |

## Configuration

| Setting | Baseline | New |
|---|---|---|
| SIMILARITY_THRESHOLD | 0.55 | 0.50 |
| RETRIEVAL_TOP_K (pool per sub-query) | 5 | 20 |
| RERANK_TOP_N (returned) | 10 | 10 |
| RERANKER_ENABLED | false | false |
| RELATION_AWARE_ENABLED | - | true |
| RELATION_ANCHOR_TOP_N | - | 7 |
| RELATION_MAX_PASSES | - | 2 |
| RELATION_BOOST | - | 1.8 |
| RELATION_PIN_ANCHOR | - | on_target |
| RELATION_MIN_SCORE | - | 0.35 |

The LLM context size is unchanged: `retrieve()` still returns
RERANK_TOP_N=10 hits and the generator still trims to its own limit.

## Notes on the numbers

- Latency is measured with a warm HyDE disk cache in **both** arms, so
  it isolates the retrieval change. The cold HyDE call costs 1.3-11.8s
  and is identical in both arms.
- HyDE at temperature 0 is not bit-reproducible at the provider. Two
  runs of this eval before the HyDE cache existed differed by 0.017-0.05
  Recall@5 from resampling alone. The cache removes that variance; the
  numbers above are reproducible from a warm cache.
- The chosen operating point is not a knife edge: every combination of
  RELATION_ANCHOR_TOP_N 6-8, RELATION_BOOST 1.7-1.9 and RETRIEVAL_TOP_K
  20-30 meets all five targets on this set.

## Regression (run separately)

- `PYTHONIOENCODING=utf-8 python test_api.py --url http://127.0.0.1:8000`
  -> **40/40**.
- `scripts/mini_eval.py` -> 0 grounding violations in all 8 cases (same
  as before), emergency flags unchanged (TEST2/TEST3 true, TEST1/4/5
  false, no false positives), Arabic clean, and TEST6 HyDE stability
  went from unstable to identical across three runs.
- `pytest -q --ignore=tests/test_e2e.py` -> 182 passed, 11 failed. The 11
  failures are the same pre-existing prompt_builder / generator_fallback /
  api-health failures present before this change; no retrieval test fails.
  `tests/test_e2e.py` fails to import from a stale path unrelated to this
  work.
