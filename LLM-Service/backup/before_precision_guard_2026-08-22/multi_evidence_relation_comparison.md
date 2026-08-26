# Multi-Evidence Relation Ranking -- Comparison

Dataset: `eval/eval.jsonl`, 30 queries, unmodified. Gold ground truth untouched.
BM25 disabled, reranker disabled, KB / embeddings / Chroma index / generator / prompts / translator / history unchanged.

`Current` is the published Relation-Aware measurement (`reports/relation_aware_retrieval_report.json`); `New` is a live run of the same methodology through the production `retrieve()`.

| Metric | Current | New | Delta |
|---|---|---|---|
| Precision@1 | 0.8000 | 0.8000 | +0.0000 |
| Precision@3 | 0.4222 | 0.4222 | +0.0000 |
| Precision@5 | 0.3133 | 0.3133 | +0.0000 |
| Recall@3 | 0.7500 | 0.7333 | -0.0167 |
| Recall@5 | 0.8500 | 0.8667 | +0.0167 |
| Recall@10 | 0.9167 | 0.9167 | +0.0000 |
| F1@5 | 0.4391 | 0.4440 | +0.0049 |
| MRR | 0.8650 | 0.8661 | +0.0011 |
| Hit@5 | 1.0000 | 1.0000 | +0.0000 |
| CategoryPrecision@5 | 0.8867 | 0.8867 | +0.0000 |
| Latency (mean s) | 0.465 | 0.528 | +0.063 |

## Acceptance (section 14)

| Gate | Floor | Measured | |
|---|---|---|---|
| recall@5 | >= 0.85 | 0.8667 | PASS |
| precision@1 | >= 0.80 | 0.8000 | PASS |
| mrr | >= 0.85 | 0.8661 | PASS |
| hit@5 | >= 0.95 | 1.0000 | PASS |
| category_precision@5 | >= 0.85 | 0.8867 | PASS |
| at least one metric improves | - | Recall@5, F1@5, MRR | PASS |

## Watched entities (section 12)

`Rank` is the position in the 10 hits `retrieve()` returns; `Fused` is the position in the full fused ranking before the trim, so an entity that never enters the returned list still has a measurable movement. `Vector rank` is `none` for an entity with no vector evidence at all -- it entered purely by inference.

| Entity | Query | Rank old | Rank new | Fused old | Fused new | Vector rank | Fwd edges | Rev edges | Anchors | Relation | Intent bonus | Final | Top 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Canine Distemper | My dog seems tired and has no energy,  | 10 | 7 | 10 | 7 | none | 2 | 0 | 2 | 1.075 | 0.15 | 1.225 | no |
| Chronic Kidney Disease | My cat is very lethargic and low energ | 6 | 4 | 6 | 4 | none | 2 | 0 | 2 | 1.352 | 0.15 | 1.502 | yes |
| Chronic Kidney Disease | What medication is prescribed for Chro | 1 | 1 | 1 | 1 | 2 | 4 | 0 | 11 | 2.400 | 0.06 | 3.030 | yes |
| Enrofloxacin | What medication treats Canine Infectio | - | - | 13 | 12 | none | 0 | 1 | 1 | 1.156 | 0.15 | 1.306 | no |
| Benazepril | What medication is prescribed for Chro | 8 | 8 | 8 | 8 | 10 | 0 | 2 | 2 | 1.543 | 0.15 | 2.193 | no |
| Probiotics For Dogs | My dog keeps vomiting, what product ca | - | - | 14 | 14 | 24 | 0 | 1 | 1 | 0.273 | 0.15 | 0.717 | no |
| Glucose Meter | My cat drinks and urinates a lot, what | - | - | 17 | 27 | none | 1 | 1 | 1 | 0.378 | 0.15 | 0.528 | no |
| Leptospirosis | There is blood in my dog's urine, what | 4 | 3 | 4 | 3 | none | 1 | 1 | 2 | 1.495 | 0.15 | 1.645 | yes |
| Acute Gastritis | My cat keeps throwing up, what disease | 5 | 5 | 5 | 5 | 14 | 2 | 1 | 2 | 1.352 | 0.15 | 1.919 | yes |
| Canine Parvovirus Infection | My dog has no appetite and won't eat,  | 5 | 5 | 5 | 5 | none | 3 | 1 | 3 | 1.536 | 0.15 | 1.685 | yes |
| Feline Diabetes Mellitus | My cat is losing weight rapidly, why? | 3 | 3 | 2 | 2 | 16 | 4 | 0 | 4 | 1.589 | 0.15 | 2.123 | yes |
| Feline Diabetes Mellitus | What is used to treat Feline Diabetes  | 4 | 1 | 4 | 1 | 1 | 4 | 0 | 8 | 2.400 | 0.06 | 3.100 | yes |
| Feline Diabetes Mellitus | My cat drinks and urinates a lot, what | 5 | 5 | 5 | 5 | none | 4 | 0 | 4 | 1.365 | 0.06 | 1.311 | yes |
| Metoclopramide | How is Gastric Dilatation-Volvulus tre | 2 | 2 | 2 | 2 | 5 | 0 | 1 | 1 | 1.635 | 0.15 | 2.452 | yes |
| Slow Feeder Bowl | What product helps a dog recovering fr | 3 | 2 | 3 | 2 | 12 | 0 | 1 | 1 | 1.539 | 0.15 | 2.143 | yes |

## Remaining misses (expected entity outside the top 5)

| Query | Entity | Returned rank | Fused old | Fused new | Vector rank | Anchors | Relation |
|---|---|---|---|---|---|---|---|
| My dog seems tired and has no energy,  | Canine Distemper | 7 | 10 | 7 | none | 2 | 1.075 |
| What medication treats Canine Infectio | Enrofloxacin | - | 13 | 12 | none | 1 | 1.156 |
| What medication is prescribed for Chro | Benazepril | 8 | 8 | 8 | 10 | 2 | 1.543 |
| What product helps a dog recovering fr | Vomiting | - | 22 | 20 | none | 2 | 1.052 |
| My dog keeps vomiting, what product ca | Probiotics For Dogs | - | 14 | 14 | 24 | 1 | 0.273 |
| My dog has bad breath and swollen gums | Gingivitis | 9 | 8 | 8 | 6 | 6 | 1.119 |
| My cat is vomiting, what product can h | Vomiting | - | 23 | 24 | 11 | 2 | 0.474 |
| My cat drinks and urinates a lot, what | Glucose Meter | - | 17 | 27 | none | 1 | 0.378 |

## Parameter sweep (section 13)

`PYTHONPATH=. python scripts/multi_evidence_sweep.py --sweep`. Twenty configurations over three knobs -- multi-evidence decay, target-category pass-2 decay, reverse penalty -- plus the named-anchor ablation. Every row replays the identical cached HyDE answers and identical ChromaDB neighbour lists, so the deltas are the ranking change and nothing else. Ordered by the section-13 selection criteria: Recall@5, Precision@1, MRR, CategoryPrecision@5.

| Config | Recall@5 | Precision@1 | MRR | Hit@5 | CategoryPrecision@5 |
|---|---|---|---|---|---|
| R2 me.65 (SHIPPED) | 0.8667 | 0.8000 | 0.8661 | 1.0000 | 0.8867 |
| A2 me.70 | 0.8667 | 0.8000 | 0.8661 | 1.0000 | 0.8867 |
| C01 me.55 cap2.4 | 0.8667 | 0.8000 | 0.8661 | 1.0000 | 0.8733 |
| C04 +exact.95 | 0.8667 | 0.8000 | 0.8661 | 1.0000 | 0.8733 |
| R4 cap2.8 | 0.8667 | 0.8000 | 0.8661 | 1.0000 | 0.8733 |
| A1 me.65 exact OFF | 0.8667 | 0.8000 | 0.8606 | 1.0000 | 0.8933 |
| R3 cap2.0 | 0.8667 | 0.7667 | 0.8494 | 1.0000 | 0.8667 |
| C02 me.40 cap2.4 | 0.8500 | 0.8000 | 0.8633 | 0.9667 | 0.8667 |
| R1 me.50 | 0.8500 | 0.8000 | 0.8633 | 0.9667 | 0.8667 |
| R6 exact1.10 | 0.8500 | 0.8000 | 0.8617 | 1.0000 | 0.8600 |
| R5 pass2_target.45 | 0.8500 | 0.7667 | 0.8483 | 0.9667 | 0.8933 |
| C09 BASE reverse.80 | 0.8500 | 0.7667 | 0.8348 | 0.9667 | 0.9000 |
| C07 BASE me.40 | 0.8333 | 0.7667 | 0.8386 | 0.9667 | 0.8933 |
| C03 +anchor_k5 | 0.8167 | 0.8000 | 0.8570 | 0.9333 | 0.8933 |
| C05 +exact +anchor_k5 | 0.8167 | 0.8000 | 0.8570 | 0.9333 | 0.8933 |
| C12 BASE pass2_target.70 anchor8 | 0.8167 | 0.7667 | 0.8333 | 1.0000 | 0.9133 |
| C08 BASE primary_gain1.15 | 0.8167 | 0.7667 | 0.8312 | 0.9333 | 0.9200 |
| C11 BASE category_decay.20 | 0.8000 | 0.7667 | 0.8400 | 0.9333 | 0.7133 |
| C06 +pass2_target.60 (BASE) | 0.8000 | 0.7667 | 0.8320 | 0.9333 | 0.9067 |
| C10 BASE cap3.0 | 0.8000 | 0.7667 | 0.8320 | 0.9333 | 0.9067 |

## Configuration

| Setting | Current | New |
|---|---|---|
| RETRIEVAL_TOP_K | 20 | 20 |
| SIMILARITY_THRESHOLD | 0.50 | 0.50 |
| RERANK_TOP_N | 10 | 10 |
| BM25_ENABLED | false | false |
| RERANKER_ENABLED | false | false |
| RELATION_ANCHOR_TOP_N | 7 | 7 |
| RELATION_MAX_PASSES | 2 | 2 |
| RELATION_BOOST | 1.8 | 1.8 |
| RELATION_PIN_ANCHOR | on_target | on_target |
| RELATION_MIN_SCORE | 0.35 | 0.35 |
| RELATION_MULTI_EVIDENCE_DECAY | - (per-edge harmonic, = 1.0) | 0.65 |
| RELATION_CAP | 1.8 | 2.4 |
| RELATION_EXACT_ANCHOR_WEIGHT | - (0) | 0.95 |
| RELATION_ANCHOR_RANK_K | - (10) | 10 |
| RELATION_PASS2_TARGET_DECAY | - (0.35) | 0.35 |
| RELATION_PRIMARY_GAIN | - (1.0) | 1.0 |
| RELATION_REVERSE_PENALTY | 0.90 | 0.9 |
| RELATION_CATEGORY_DECAY | - (0) | 0.0 |

Architecture unchanged: HyDE, vector search, relation graph, intent detection, relation-aware expansion, context expansion, generator. Only the relation *scoring* changed.

## Notes on the numbers

- **Latency.** Whatever the mean shows above is front-end variance, not the ranking: the fusion stage itself got *faster*, 14.90ms -> 13.06ms per query measured over the cached candidate lists (per-anchor bucketing does less work than the old per-edge list), and the named-entity scan costs 0.99ms on top. Two consecutive runs of this script differed by 0.16s in the mean; latency is dominated by the embedding call and the ChromaDB search, both untouched.
- **Sections 6, 9 and 10 ship neutral.** Query-aware relation-type gain (`RELATION_PRIMARY_GAIN`), intent-conditioned pass-2 decay (`RELATION_PASS2_TARGET_DECAY`) and soft category diversity (`RELATION_CATEGORY_DECAY`) are all implemented and swept. Every non-neutral value regressed the acceptance metrics on this set (C06-C12, R5), so they ship at their identity values with the knob exposed. They are code that is off, not code that is missing.
- **Enrofloxacin is at the KB's information limit.** `DOG_DIS_003` declares no medications; five medications (Enrofloxacin, Amoxicillin, Ampicillin, Azithromycin, Penicillin) each declare it in a two-item `related_diseases` list. Their relation evidence is therefore *identical* -- same authored pair, same direction, same list size, same anchor -- and no ranking function can separate them without naming the entity in code. It moves 13 -> 12 and stays outside the returned 10. The fix is a KB edit (`recommended_medications` on the disease), which section 7 explicitly forbids here.
- **Glucose Meter regressed within the tail**, fused 17 -> 27. It was reached by several parallel edges from one anchor, which the old per-edge sum counted as several pieces of evidence; per-anchor bucketing counts it once, correctly. It was absent from the returned list in both arms, so no metric moves. Recovering it needs the target-category pass-2 decay of section 9, which costs more than it returns on this set (C06: Recall@5 0.80, Precision@1 0.767).
- **HyDE is served from its disk cache in both arms**, so the comparison is not contaminated by LLM resampling.

## Regression (section 15)

The API server was restarted before these ran -- it had been started before the change and would otherwise have exercised the old ranking.

- `PYTHONIOENCODING=utf-8 python test_api.py --url http://127.0.0.1:8000` -> **40/40**.
- `PYTHONPATH=. python scripts/mini_eval.py` -> **0 grounding violations** in all 8 cases; emergency flags unchanged and with no false positives (TEST2/TEST3 true, TEST1/TEST4/TEST5 false); Arabic cases TEST7/TEST8 clean; TEST6 HyDE identical across three runs. Byte-identical to `reports/mini_eval_relation_aware.json` on every one of those fields.
- `pytest -q --ignore=tests/test_e2e.py` -> 202 passed, 11 failed. The 11 are the same pre-existing prompt_builder / generator_fallback / api-health failures recorded against the current baseline; no retrieval test fails.

## Verdict

**KEEP MULTI-EVIDENCE RELATION RANKING**

