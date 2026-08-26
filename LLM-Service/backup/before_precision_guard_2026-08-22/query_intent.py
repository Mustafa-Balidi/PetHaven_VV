"""Deterministic query-intent detection.

No model, no API call, no training. A small ordered rule table maps the raw
question onto the KB categories the answer is most likely to live in.

The result is a *ranking hint only*. It never filters: an entity whose category
is not in the intent still competes, it just does not collect the bonus. A
clinically relevant disease can therefore never be dropped because the question
happened to use the word "product".

    >>> detect("What medication treats Canine Infectious Hepatitis?").name
    'medications'
    >>> detect("Describe the Maine Coon cat breed.").primary
    ('breeds',)
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass(frozen=True)
class QueryIntent:
    """Which categories the answer probably lives in.

    primary    strongest hint -- full relation weight, full category bonus
    secondary  supporting evidence categories -- reduced weight and bonus
    matched    the keyword that fired, kept for the report/defence
    """

    name: str
    primary: tuple[str, ...]
    secondary: tuple[str, ...] = field(default=())
    matched: str = ""

    def weight_for(self, category: str) -> float:
        """Intent multiplier applied to *relation* support.

        Allowed above 1.0: an edge of the shape the question is literally
        asking about ("what medication treats X" -> disease->medication) is
        the strongest evidence the KB can offer, and it is the only evidence
        when the target entity never entered the vector pool at all.
        """
        if category in self.primary:
            return RELATION_PRIMARY
        if category in self.secondary:
            return RELATION_SECONDARY
        return RELATION_OTHER

    def scale_for(self, category: str) -> float:
        """Multiplier applied to the whole fused score.

        Capped at 1.0: an on-target entity is never inflated beyond what its
        own evidence earned, an off-target one is demoted. This is what keeps
        the diversity pass from promoting emergency protocols and diagnostics
        into the top 5 of a symptom question when the repeated-symptom penalty
        pushes the symptoms down.
        """
        if category in self.primary:
            return 1.0
        if category in self.secondary:
            return SCALE_SECONDARY
        return SCALE_OTHER

    def bonus_for(self, category: str) -> float:
        """Additive category bonus in the final fusion score."""
        if category in self.primary:
            return PRIMARY_BONUS
        if category in self.secondary:
            return SECONDARY_BONUS
        return 0.0


PRIMARY_BONUS = 0.15
SECONDARY_BONUS = 0.06

RELATION_PRIMARY = 1.25
RELATION_SECONDARY = 0.85
RELATION_OTHER = 0.45

SCALE_SECONDARY = 0.92
SCALE_OTHER = 0.55

# The default when nothing else fires: an owner describing what they observe.
SYMPTOMATIC = QueryIntent(
    name="symptomatic",
    primary=("symptoms", "diseases"),
    secondary=("emergency", "diagnostics"),
    matched="<default>",
)

# Ordered. The first rule whose pattern matches wins, so the more specific
# phrasings are listed before the more general ones -- "what product helps with
# recovery" must not be swallowed by the "treat" rule of the medication intent.
_RULES: tuple[tuple[str, QueryIntent], ...] = (
    (
        r"\bproducts?\b|\bsupplement|\bcollar\b|\bbowl\b|\bchews?\b|"
        r"\bmonitoring\b|\bhelps? with recovery\b|\bshampoo\b|\bmuzzle\b",
        QueryIntent(
            name="medical_products",
            primary=("medical_products",),
            secondary=("symptoms", "diseases", "medications"),
        ),
    ),
    (
        r"\bbreeds?\b|\bcharacteristics\b|\btemperament\b|\bgrooming\b",
        QueryIntent(
            name="breeds",
            primary=("breeds",),
            secondary=("diseases",),
        ),
    ),
    (
        r"\btests?\b|\btesting\b|\bcbc\b|\bcomplete blood count\b|"
        r"\burinalysis\b|\bbiochemistr|\bradiograph|\bx-?ray\b|"
        r"\bultrasound\b|\bpanel\b|\bscreening\b|\bdiagnos",
        QueryIntent(
            name="diagnostics",
            primary=("diagnostics",),
            secondary=("diseases", "symptoms"),
        ),
    ),
    (
        r"\bmedications?\b|\bmedicines?\b|\bdrugs?\b|\bprescrib|"
        r"\btreats?\b|\btreated\b|\btreatment\b|\btherapy\b|"
        r"\bantibiotics?\b|\bdosage\b|\bdose\b",
        QueryIntent(
            name="medications",
            primary=("medications",),
            secondary=("diseases", "medical_products"),
        ),
    ),
    (
        r"\bemergenc|\burgent\b|\bfirst aid\b|\bpoison|\bcollapse",
        QueryIntent(
            name="emergency",
            primary=("emergency",),
            secondary=("symptoms", "diseases"),
        ),
    ),
    # Last rule before the default. A definitional question names the entity it
    # wants described, so the answer is that entity and its reference context --
    # not a differential. Without this, "What is Canine Parvovirus?" is read as
    # a symptom description, the disease's own symptom list is walked backwards
    # at full primary weight, and it crowds the vaccine and the diagnostics out
    # of the LLM context. None of the 30 eval queries reaches this rule -- the
    # category rules above match them all first.
    (
        r"^\s*(what (is|are)|tell me about|describe|explain)\b",
        QueryIntent(
            name="definitional",
            primary=(
                "diseases", "diagnostics", "medications", "vaccines",
                "medical_products", "emergency", "breeds",
            ),
            secondary=("symptoms",),
        ),
    ),
)

_COMPILED = tuple((re.compile(pattern, re.IGNORECASE), intent) for pattern, intent in _RULES)


def detect(query: str) -> QueryIntent:
    """Classify `query` into a QueryIntent. Never raises, never returns None."""
    text = query or ""
    for pattern, intent in _COMPILED:
        match = pattern.search(text)
        if match:
            return QueryIntent(
                name=intent.name,
                primary=intent.primary,
                secondary=intent.secondary,
                matched=match.group(0).lower(),
            )
    return SYMPTOMATIC
