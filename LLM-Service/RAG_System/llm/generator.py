"""Question → retrieved context → grounded LLM answer via OpenRouter."""

from __future__ import annotations

import logging
from collections import defaultdict

from langchain_openai import ChatOpenAI

from RAG_System.config import settings
from RAG_System.indexing.vector_store import SearchHit
from RAG_System.llm import history
from RAG_System.llm.prompt_builder import build_prompt
from RAG_System.retrieval.context_expander import expand
from RAG_System.retrieval.retriever import retrieve


logger = logging.getLogger(__name__)


# ── Constants ─────────────────────────────────────────────────────────────────

_MAX_ENTITIES = 10


# Maximum entities kept per category. Nothing is *reserved*: a category that
# has no relevant entity simply contributes nothing to the final context.
_CATEGORY_CAPS: dict[str, int] = {
    "emergency":        1,
    "symptoms":         3,
    "diseases":         3,
    "diagnostics":      2,
    "medications":      1,
    "vaccines":         1,
    "medical_products": 1,
    "breeds":           1,
}


# Order in which *expanded* (linked, non-retrieved) entities may fill the
# remaining slots. Emergency is last: an emergency protocol must never push
# out a symptom / disease / diagnostic just because expansion produced it.
_EXPANSION_ORDER: tuple[str, ...] = (
    "diseases",
    "symptoms",
    "diagnostics",
    "medications",
    "vaccines",
    "medical_products",
    "breeds",
    "emergency",
)


# target category -> ((source category, metadata key holding linked IDs), ...)
#
# An expanded entity is admitted only when an entity already kept in the
# final context explicitly links to it. That is what makes a medication /
# vaccine / product "actually related to the primary evidence" instead of
# "present somewhere in the expansion graph".
_LINK_SOURCES: dict[str, tuple[tuple[str, str], ...]] = {
    "diseases": (
        ("symptoms",  "related_disease_ids"),
        ("breeds",    "related_disease_ids"),
        ("emergency", "related_disease_ids"),
    ),
    "symptoms": (
        ("diseases",  "related_symptom_ids"),
        ("emergency", "related_symptom_ids"),
    ),
    "diagnostics": (
        ("diseases", "related_diagnostic_ids"),
        ("symptoms", "related_diagnostic_ids"),
    ),
    "medications": (
        ("diseases", "related_medication_ids"),
    ),
    "vaccines": (
        ("diseases", "related_vaccine_ids"),
    ),
    "medical_products": (
        ("diseases",    "related_product_ids"),
        ("medications", "related_product_ids"),
    ),
    "breeds": (
        ("diseases", "related_breed_ids"),
    ),
    "emergency": (
        ("symptoms", "emergency_ids"),
        ("diseases", "related_emergency_ids"),
    ),
}


# ── LLM builder ───────────────────────────────────────────────────────────────

# Models whose reasoning output is billed separately from `max_tokens`,
# so asking for low-effort reasoning does not starve the visible answer.
#
# NOTE — "qwen3" is deliberately NOT in this set. On OpenRouter,
# qwen/qwen3.5-9b spends its reasoning tokens *inside* `max_tokens`:
# a 200-token HyDE call produced 172 reasoning tokens and an EMPTY
# message, and a 2048-token call spent 1727 tokens reasoning. Since the
# model also reasons by default, every LLM builder here explicitly sends
# `{"reasoning": {"enabled": False}}` when reasoning is not supported.
_REASONING_MODELS = {
    "claude",
    "deepseek/deepseek-r1",
    "qwen/qwq",
    "openai/o1",
    "openai/o3",
}


def _supports_reasoning(model: str) -> bool:
    """True when the model can take a reasoning budget without losing content."""
    return any(tag in model.lower() for tag in _REASONING_MODELS)


def _build_llm() -> ChatOpenAI:
    """
    Build the OpenRouter LLM.

    Low reasoning is used only for models that support it. For every other
    model reasoning is switched off explicitly, otherwise a reasoning-by-
    default model consumes the whole token budget and returns empty content.
    """

    kwargs: dict = {
        "model":       settings.LLM_MODEL,
        "api_key":     settings.OPENROUTER_API_KEY,
        "base_url":    settings.OPENROUTER_BASE_URL,
        "temperature": settings.LLM_TEMPERATURE,
        "max_tokens":  settings.LLM_MAX_TOKENS,
        "timeout":     settings.LLM_TIMEOUT,
    }

    if _supports_reasoning(settings.LLM_MODEL):
        kwargs["extra_body"] = {"reasoning": {"effort": "low"}}
    else:
        kwargs["extra_body"] = {"reasoning": {"enabled": False}}

    return ChatOpenAI(**kwargs)


# ── LLM response helper ───────────────────────────────────────────────────────

def _extract_text(response) -> str:
    """
    Extract text safely from the LangChain AI response.
    """

    content = response.content

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts: list[str] = []

        for block in content:
            if isinstance(block, str):
                parts.append(block)

            elif isinstance(block, dict):
                text = block.get("text")

                if isinstance(text, str):
                    parts.append(text)

        return "\n".join(parts).strip()

    return str(content or "").strip()


# ── Context trimming ──────────────────────────────────────────────────────────

def _category(hit: SearchHit) -> str:
    return (hit.metadata or {}).get("category", "unknown")


def _name_key(hit: SearchHit) -> tuple[str, str]:
    """Normalized identity of an entity: same category + same name = duplicate."""

    name = (hit.metadata or {}).get("name", "")

    return (
        _category(hit),
        " ".join(name.lower().split()),
    )


def _dedup_by_name(hits: list[SearchHit]) -> list[SearchHit]:
    """
    Drop entities that repeat an already-present category+name.

    Linked records sometimes arrive twice under different IDs
    (e.g. "Diabetic Ketoacidosis Protocol"). A duplicate name carries no
    new information, so it must not consume a context slot.
    """

    seen: set[tuple[str, str]] = set()
    unique: list[SearchHit] = []

    for hit in hits:

        key = _name_key(hit)

        if key in seen:
            continue

        seen.add(key)
        unique.append(hit)

    return unique


def _linked_ids(
    kept: list[SearchHit],
    sources: tuple[tuple[str, str], ...],
) -> set[str]:
    """IDs explicitly linked from the entities already kept in the context."""

    ids: set[str] = set()

    for hit in kept:

        category = _category(hit)

        for source_category, key in sources:

            if category != source_category:
                continue

            raw = (hit.metadata or {}).get(key, "") or ""

            for one_id in raw.split(","):

                one_id = one_id.strip()

                if one_id:
                    ids.add(one_id)

    return ids


def _trim_context(
    hits: list[SearchHit],
    max_entities: int = _MAX_ENTITIES,
    retrieved_ids: set[str] | None = None,
) -> list[SearchHit]:
    """
    Keep the most medically relevant entities — relevance-aware, not quota-based.

    Rules:
    - Real retrieved evidence (semantic hits) is placed first. An expanded
      entity carries distance=0.0, which is a marker, NOT a similarity score,
      so it never outranks a genuine hit.
    - An expanded entity is admitted only when an entity already kept links
      to it explicitly (a medication of a kept disease, a diagnostic of a kept
      disease/symptom, ...). No slot is reserved for a category that has no
      relevant entity.
    - Emergency protocols coming from expansion are filled last and only when
      linked from real retrieved evidence.
    """

    hits = _dedup_by_name(hits)

    if len(hits) <= max_entities:
        return hits

    if retrieved_ids is None:
        # Expanded entities are created with distance exactly 0.0.
        retrieved_ids = {hit.id for hit in hits if hit.distance > 0.0}

    core = sorted(
        (hit for hit in hits if hit.id in retrieved_ids),
        key=lambda hit: hit.distance,
    )

    expanded_by_cat: dict[str, list[SearchHit]] = defaultdict(list)

    for hit in hits:

        if hit.id not in retrieved_ids:
            expanded_by_cat[_category(hit)].append(hit)

    kept: list[SearchHit] = []
    counts: dict[str, int] = defaultdict(int)

    def _add(hit: SearchHit) -> bool:

        category = _category(hit)

        if len(kept) >= max_entities:
            return False

        if counts[category] >= _CATEGORY_CAPS.get(category, 1):
            return False

        kept.append(hit)
        counts[category] += 1

        return True

    # ── Phase A — real retrieved evidence ────────────────────────────────────

    for hit in core:
        _add(hit)

    # ── Phase B — linked expansion, category by category ─────────────────────

    for category in _EXPANSION_ORDER:

        if len(kept) >= max_entities:
            break

        candidates = expanded_by_cat.get(category)

        if not candidates:
            continue

        if counts[category] >= _CATEGORY_CAPS.get(category, 1):
            continue

        sources = _LINK_SOURCES.get(category, ())

        # An expanded emergency protocol is only relevant when it is linked
        # from evidence the retriever actually matched against the question.
        anchors = (
            [hit for hit in kept if hit.id in retrieved_ids]
            if category == "emergency"
            else kept
        )

        allowed = _linked_ids(anchors, sources)

        if not allowed:
            continue

        linked = [hit for hit in candidates if hit.id in allowed]

        if not linked:
            continue

        # Prefer the expanded entity supported by the strongest evidence:
        # a link from the top-ranked entity counts more than a link from a
        # weakly related one further down the context.
        support = {
            hit.id: sum(
                1.0 / (rank + 1)
                for rank, anchor in enumerate(anchors)
                if hit.id in _linked_ids([anchor], sources)
            )
            for hit in linked
        }

        linked.sort(key=lambda hit: -support[hit.id])

        for hit in linked:
            _add(hit)

    # ── Phase C — never drop the primary condition's own evidence ────────────

    _ensure_primary_links(
        kept,
        hits,
        max_entities,
    )

    return kept


# Categories whose entity must belong to the primary condition, otherwise the
# LLM is left describing a disease with another disease's tests or drugs.
_PRIMARY_LINKS: tuple[tuple[str, str], ...] = (
    ("diagnostics", "related_diagnostic_ids"),
    ("medications", "related_medication_ids"),
)


def _ensure_primary_links(
    kept: list[SearchHit],
    available: list[SearchHit],
    max_entities: int,
) -> None:
    """
    Guarantee the most likely disease keeps its own diagnostic and medication.

    A category quota filled by entities linked to *other* diseases is exactly
    the case where the LLM starts inventing the missing name from its own
    knowledge. When that happens, the unrelated entity is replaced in place
    rather than the relevant one being dropped.
    """

    primary = next(
        (hit for hit in kept if _category(hit) == "diseases"),
        None,
    )

    if primary is None:
        return

    for category, key in _PRIMARY_LINKS:

        linked = _linked_ids([primary], (("diseases", key),))

        if not linked:
            continue

        in_context = [hit for hit in kept if _category(hit) == category]

        if any(hit.id in linked for hit in in_context):
            continue

        replacement = next(
            (
                hit
                for hit in available
                if hit.id in linked and hit not in kept
            ),
            None,
        )

        if replacement is None:
            continue

        if len(kept) < max_entities:
            kept.append(replacement)
            continue

        if in_context:
            kept[kept.index(in_context[-1])] = replacement


# ── Public API ────────────────────────────────────────────────────────────────

def answer_with_hits(
    question: str,
    animal: str | None = None,
    category: str | None = None,
    conversation_id: str | None = None,
    llm: ChatOpenAI | None = None,
) -> tuple[str, list[SearchHit]]:
    """
    Retrieve → expand → trim → generate.

    Steps:
    1. Retrieve relevant entities.
    2. Use conversation fallback for follow-up questions.
    3. Expand related medical entities.
    4. Keep the strongest relevant entities.
    5. Generate grounded answer through OpenRouter.
    6. Store conversation history.
    """

    _llm = llm or _build_llm()

    past_turns = (
        history.get_recent(conversation_id)
        if conversation_id
        else None
    )


    # ── 1. Retrieve ───────────────────────────────────────────────────────────

    hits = retrieve(
        question,
        animal=animal,
        category=category,
    )


    # ── 2. Follow-up fallback ─────────────────────────────────────────────────

    if not hits and past_turns:

        last_user = next(
            (
                content
                for role, content in reversed(past_turns)
                if role == "user"
            ),
            None,
        )

        if last_user and last_user != question:

            anchor = (
                f"{last_user} — follow-up: {question}"
            )

            hits = retrieve(
                anchor,
                animal=animal,
                category=category,
            )

            logger.info(
                "Follow-up anchor=%r → %d hits",
                anchor,
                len(hits),
            )


    # ── 3. Expand + 4. Trim (only when there is context) ──────────────────────

    if hits:

        # IDs the retriever actually matched semantically. Everything added by
        # expand() is linked evidence, not retrieved evidence, and must not be
        # ranked as if its distance=0.0 were a similarity score.
        retrieved_ids = {hit.id for hit in hits}

        hits = expand(
            hits,
            animal=animal,
        )

        before = len(hits)

        hits = _trim_context(
            hits,
            retrieved_ids=retrieved_ids,
        )

        if before > len(hits):

            logger.debug(
                "trim: %d → %d entities",
                before,
                len(hits),
            )

    else:

        # No early return. Greetings, off-topic messages and vague reports
        # must still reach the LLM so it can classify intent (TYPE A/B/C/D).
        logger.info(
            "No RAG context for q=%r — LLM classifies intent (TYPE A/B/C/D).",
            question,
        )


    # ── 5. Generate ───────────────────────────────────────────────────────────

    prompt = build_prompt(
        question,
        hits,
        history=past_turns,
    )

    response = _llm.invoke(prompt)

    text = _extract_text(response)


    if not text:

        logger.error(
            "OpenRouter returned empty LLM content. "
            "response_metadata=%r additional_kwargs=%r",
            getattr(response, "response_metadata", None),
            getattr(response, "additional_kwargs", None),
        )

        raise RuntimeError(
            "OpenRouter returned an empty LLM response."
        )


    # ── 6. History ────────────────────────────────────────────────────────────

    if conversation_id:

        history.add_turn(
            conversation_id,
            question,
            text,
        )


    return text, hits


def answer(
    question: str,
    animal: str | None = None,
    category: str | None = None,
    llm: ChatOpenAI | None = None,
) -> str:
    """
    Wrapper that returns only the final answer.
    """

    text, _ = answer_with_hits(
        question,
        animal=animal,
        category=category,
        llm=llm,
    )

    return text