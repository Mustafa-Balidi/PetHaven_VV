#!/usr/bin/env python3
"""
test_api.py — Pet Haven RAG اختبار شامل
الاستخدام:
  pip install httpx
  python test_api.py
  python test_api.py --url http://other-host:8000
"""
from __future__ import annotations
import argparse, sys, time, uuid
try:
    import httpx
except ImportError:
    sys.exit("❌ شغّل: pip install httpx")

BASE    = "http://localhost:8000"
TIMEOUT = 90.0
results: list[tuple[bool, str, str]] = []


def check(label: str, cond: bool, detail: str = "") -> None:
    icon = "✅" if cond else "❌"
    results.append((cond, label, detail))
    print(f"  {icon}  {label}" + (f"  [{str(detail)[:90]}]" if detail else ""))


def ask(client: httpx.Client, q: str, animal=None,
        lang: str = "en", conv: str | None = None) -> tuple[int, dict]:
    r = client.post("/ask",
        json={"question": q, "animal": animal,
              "language": lang, "conversation_id": conv},
        timeout=TIMEOUT)
    return r.status_code, (r.json() if r.content else {})


def sep(title: str) -> None:
    print(f"\n{'─'*60}\n  {title}\n{'─'*60}")


def run(url: str) -> int:
    NO_CTX = "not available"

    with httpx.Client(base_url=url) as c:

        # ── 1. Health ──────────────────────────────────────────────
        sep("1 — Health Check")
        r  = c.get("/health", timeout=10)
        hd = r.json() if r.content else {}
        check("HTTP 200",               r.status_code == 200)
        check("status field",           "status" in hd)
        check("chroma_count > 0",       hd.get("chroma_count", 0) > 0,
              f"count={hd.get('chroma_count')} → run python index.py if 0")
        check("openrouter_configured",  hd.get("openrouter_configured") is True)
        check("openrouter_reachable",   hd.get("openrouter_reachable") is True)
        print(f"       model    : {hd.get('llm_model')}")
        print(f"       documents: {hd.get('chroma_count')}")

        if hd.get("chroma_count", 0) == 0:
            print("\n⚠  ChromaDB فارغ — شغّل: python index.py  ثم أعد الاختبار\n")
            sys.exit(1)

        # ── 2. English Retrieval ───────────────────────────────────
        sep("2 — English Retrieval — hits يجب ألا تكون فارغة")
        for q, animal, lang in [
            ("My dog has been vomiting since yesterday with diarrhea", "dog", "en"),
            ("My cat is not eating for two days",                       "cat", "en"),
            ("What is Canine Parvovirus?",                              None,  "en"),
        ]:
            t0 = time.monotonic()
            code, data = ask(c, q, animal, lang)
            hits = data.get("hits", [])
            check(f"hits>0 | {q[:42]}", code == 200 and len(hits) > 0,
                  f"hits={len(hits)} | {time.monotonic()-t0:.1f}s")
            if hits:
                print(f"         top: [{hits[0]['category']}] {hits[0]['name']}")

        # ── 3. Dog / Cat filter ────────────────────────────────────
        sep("3 — Animal filter (dog / cat)")
        for animal in ("dog", "cat"):
            code, data = ask(c, "vomiting not eating tired", animal)
            hits = data.get("hits", [])
            check(f"{animal.upper()}: hits > 0", code == 200 and len(hits) > 0,
                  f"hits={len(hits)}")
            if hits:
                print(f"         top: {hits[0]['name']} ({hits[0]['category']})")

        # ── 4. Early Return removed ────────────────────────────────
        sep("4 — Early Return محذوف")

        code, data = ask(c, "Hello! How are you?")
        ans = data.get("answer", "")
        check("Greeting: HTTP 200",           code == 200)
        check("Greeting: not NO_CONTEXT_MSG", NO_CTX not in ans.lower(), ans[:80])
        check("Greeting: answer not empty",   bool(ans.strip()))

        code, data = ask(c, "My dog is sick.", animal="dog")
        ans = data.get("answer", "")
        check("Vague: HTTP 200",              code == 200)
        check("Vague: not NO_CONTEXT_MSG",    NO_CTX not in ans.lower(), ans[:80])
        check("Vague: يسأل Follow-up (?)",    "?" in ans, ans[:120])

        # ── 5. Enough symptoms → ONE condition ────────────────────
        sep("5 — Enough symptoms → ONE most likely condition")
        code, data = ask(c,
            "My dog has been vomiting since yesterday, has diarrhea, "
            "refuses food, and is very tired.",
            animal="dog")
        ans = data.get("answer", "")
        hits = data.get("hits", [])
        check("Full symptoms: HTTP 200",  code == 200)
        check("Full symptoms: hits > 0",  len(hits) > 0, f"hits={len(hits)}")
        check("Full symptoms: answer",    bool(ans.strip()), ans[:100])
        # يجب أن يذكر شيئًا عن طبيب أو emergency
        mentions_vet = any(w in ans.lower() for w in
            ["vet", "veterinar", "clinic", "طبيب", "عيادة", "emergency", "طارئ"])
        check("Mentions vet/emergency",   mentions_vet, ans[:150])

        # ── 6. Follow-up conversation ──────────────────────────────
        sep("6 — Follow-up بنفس conversation_id")
        conv = str(uuid.uuid4())

        code1, d1   = ask(c, "My dog is vomiting.", "dog", conv=conv)
        server_conv = d1.get("conversation_id", conv)
        check("Turn 1: HTTP 200",          code1 == 200)
        check("Turn 1: conv_id echoed",    bool(server_conv), server_conv)
        check("Turn 1: asks for more info", "?" in d1.get("answer", ""),
              d1.get("answer", "")[:120])

        code2, d2 = ask(c,
            "It started yesterday. There is diarrhea. He stopped eating and is very tired.",
            "dog", conv=server_conv)
        ans2 = d2.get("answer", "")
        check("Turn 2: HTTP 200",          code2 == 200)
        check("Turn 2: answer not empty",  bool(ans2.strip()))
        blood_or_diag = any(w in ans2.lower() for w in
            ["diarrhea", "vomit", "parvo", "disease", "إسهال", "تقيأ"])
        check("Turn 2: uses prior context", blood_or_diag, ans2[:150])

        # ── 7. Arabic ─────────────────────────────────────────────
        sep("7 — Arabic / English")

        code, data = ask(c, "My dog has been vomiting since yesterday with diarrhea.",
                         "dog", lang="en")
        check("English: HTTP 200",    code == 200)
        check("English: not empty",   bool(data.get("answer", "").strip()))

        code, data = ask(c, "كلبي يتقيأ منذ البارحة وعنده إسهال ولا يريد الأكل.",
                         "dog", lang="ar")
        ans = data.get("answer", "")
        check("Arabic: HTTP 200",     code == 200)
        check("Arabic: not empty",    bool(ans.strip()), ans[:80])
        has_arabic = any("؀" <= ch <= "ۿ" for ch in ans)
        check("Arabic: contains Arabic characters", has_arabic, ans[:80])

        code, data = ask(c, "كيف حالك؟", lang="ar")
        ans = data.get("answer", "")
        check("Arabic greeting: natural", NO_CTX not in ans.lower(), ans[:80])

        # ── 8. Animal normalization ────────────────────────────────
        sep("8 — Animal normalization")
        r = c.post("/ask", json={"question": "test", "animal": "Dog"}, timeout=TIMEOUT)
        check("'Dog' capital → 200 (validator normalizes)",
              r.status_code == 200, str(r.status_code))

        r = c.post("/ask", json={"question": "test", "animal": "DOG"}, timeout=TIMEOUT)
        check("'DOG' all caps → 200", r.status_code == 200, str(r.status_code))

        r = c.post("/ask", json={"question": "test", "animal": "dragon"}, timeout=10)
        check("'dragon' → 422",       r.status_code == 422, str(r.status_code))

        # ── 9. conversation_id behaviour ──────────────────────────
        sep("9 — conversation_id")

        code, data = ask(c, "Hello")
        check("Auto-generated conv_id",     bool(data.get("conversation_id")))

        my_conv = "my-fixed-conv-" + str(uuid.uuid4())[:8]
        code, data = ask(c, "Hello", conv=my_conv)
        check("Supplied conv_id preserved",
              data.get("conversation_id") == my_conv,
              f"expected={my_conv!r} got={data.get('conversation_id')!r}")

        # ── 10. Input validation ───────────────────────────────────
        sep("10 — Input validation")
        r = c.post("/ask", json={"question": ""},  timeout=10)
        check("Empty string → 400",    r.status_code == 400, str(r.status_code))

        r = c.post("/ask", json={"question": "   "}, timeout=10)
        check("Whitespace only → 400", r.status_code == 400, str(r.status_code))

        r = c.post("/ask", json={}, timeout=10)
        check("Missing question → 422", r.status_code == 422, str(r.status_code))

    # ── Summary ───────────────────────────────────────────────────
    passed = sum(1 for ok, *_ in results if ok)
    total  = len(results)
    failed = total - passed
    print(f"\n{'═'*60}")
    print(f"  {'✅' if failed == 0 else '❌'}  Passed: {passed}/{total}")
    if failed:
        print("\n  الاختبارات الفاشلة:")
        for ok, name, detail in results:
            if not ok:
                print(f"    ❌  {name}")
                if detail:
                    print(f"         → {detail[:120]}")
    print(f"{'═'*60}\n")
    return failed


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--url", default=BASE)
    args = p.parse_args()
    sys.exit(run(args.url))
