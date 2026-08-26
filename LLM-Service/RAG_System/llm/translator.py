"""Arabic ⇄ English translation layer around the English-only RAG core.

Medical safety rule: a failed translation raises instead of falling back.
Returning a medical answer in the wrong language — or feeding an Arabic
question straight into the English RAG — is worse than a clear failure.
"""

from __future__ import annotations

import logging

from langchain_openai import ChatOpenAI

from RAG_System.config import settings

logger = logging.getLogger(__name__)


# Same policy as generator.py: reasoning is enabled only for models that
# bill it outside `max_tokens`. Translation never needs reasoning anyway —
# it only adds latency — so it is switched off explicitly.
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


def _build_translation_llm() -> ChatOpenAI:
    return ChatOpenAI(
        model=settings.LLM_MODEL,
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
        temperature=0,
        # Arabic needs clearly more tokens than the English source, and a
        # translation cut in half loses the closing veterinary disclaimer.
        max_tokens=settings.LLM_MAX_TOKENS,
        timeout=settings.LLM_TIMEOUT,
        extra_body={"reasoning": {"enabled": False}},
    )


_translation_llm: ChatOpenAI | None = None


def _get_translation_llm() -> ChatOpenAI:
    """Lazy singleton. Importing this module must not require an API key."""
    global _translation_llm
    if _translation_llm is None:
        _translation_llm = _build_translation_llm()
    return _translation_llm


def _translate(prompt: str, direction: str) -> str:
    """Run one translation call. Raises RuntimeError on any failure."""
    try:
        result = _get_translation_llm().invoke(prompt)
    except Exception as exc:
        logger.exception("Translation failed (%s).", direction)
        raise RuntimeError(
            f"Translation service temporarily unavailable ({direction}). "
            "Please try in English."
        ) from exc

    text = str(result.content or "").strip()

    if not text:
        logger.exception(
            "Translation returned empty content (%s). metadata=%r",
            direction,
            getattr(result, "response_metadata", None),
        )
        raise RuntimeError(
            f"Translation service returned an empty result ({direction}). "
            "Please try in English."
        )

    return text


def arabic_to_english(text: str) -> str:
    """Translate Arabic user text to English for the RAG system."""

    prompt = f"""
Translate the following veterinary user message from Arabic to English.

Rules:
- Preserve the exact medical meaning.
- Preserve animal names, symptoms, diseases, medications and measurements.
- Use the official English medical name of a disease or drug when the Arabic
  text refers to it, e.g. "فيروس بارفو الكلاب" -> "Canine Parvovirus".
- Never invent a disease or drug that the Arabic text does not mention.
- Do not answer the question.
- Do not explain anything.
- Return ONLY the English translation.

Arabic text:
{text}
"""

    return _translate(prompt, "arabic_to_english")


def english_to_arabic(text: str) -> str:
    """Translate the RAG answer from English to Arabic."""

    prompt = f"""
Translate the following veterinary answer from English to Arabic.

General rules:
- Preserve the exact medical meaning.
- Do not add new medical information.
- Do not remove warnings or safety information.
- Do not add or remove any named disease, test, medication or product.
- Use clear Modern Standard Arabic.
- Keep every emoji, warning symbol and formatting marker as-is.
- Return ONLY the Arabic translation.

MEDICAL TERMINOLOGY RULES (highest priority):
- NEVER invent an Arabic transliteration for a disease, drug, test,
  vaccine or product name.
- ALWAYS keep the official English name in parentheses directly after the
  Arabic rendering of a named disease, drug, test, vaccine or product.
- If no confident standard Arabic name exists, transliterate conservatively
  or keep the English medical name unchanged.
- Preserve the exact identity of the disease. Never generalise
  "Canine Parvovirus" into "فيروس الكلب" or any other broader name.
- Never translate "Canine" as if it were the disease name itself.
- "Canine" as a species qualifier is "الكلابي" / "لدى الكلاب",
  never "القانوي" or "القانيني" — those words do not exist.

Required examples:

Canine Parvovirus Infection
-> عدوى فيروس بارفو الكلابي (Canine Parvovirus Infection)

Canine Parvovirus
-> فيروس بارفو الكلابي (Canine Parvovirus)

Canine Parvovirus Vaccine
-> لقاح فيروس بارفو الكلابي (Canine Parvovirus Vaccine)

Gastric Dilatation-Volvulus (GDV)
-> تمدد والتواء المعدة (Gastric Dilatation-Volvulus, GDV)

Carprofen
-> كاربروفين (Carprofen)

Metronidazole
-> ميترونيدازول (Metronidazole)

Complete Blood Count (CBC)
-> تعداد الدم الكامل (Complete Blood Count, CBC)

Forbidden output, never produce these:
الفيروس القانوي
الفيروس القانيني
فيروس الكلب (as a translation of Canine Parvovirus)

English text:
{text}
"""

    return _translate(prompt, "english_to_arabic")
