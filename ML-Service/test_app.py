"""
test_app.py
-----------
اختبارات شاملة لـ recommendation.py و app.py

تشغيل:
    pip install pytest httpx
    pytest test_app.py -v
"""

import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# ── بيانات اختبار صحيحة ───────────────────────────────────────────────────────
VALID_ANSWERS = {
    "housing_type"         : "house",
    "outdoor_space"        : "large",
    "family_type"          : "family_with_children",
    "hours_available"      : "high",
    "weekend_time"         : "high",
    "experience_level"     : "intermediate",
    "training_ability"     : "high",
    "activity_level"       : "high",
    "noise_tolerance"      : "medium",
    "budget_level"         : "medium",
    "maintenance_tolerance": "medium",
    "size_preference"      : "large",
    "grooming_tolerance"   : "medium",
    "energy_preference"    : "high",
    "affection_preference" : "balanced",
}


# ════════════════════════════════════════════════════════════════════════════
# 1. Health endpoint
# ════════════════════════════════════════════════════════════════════════════

def test_health_returns_ok():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_health_returns_version():
    r = client.get("/health")
    assert "version" in r.json()


# ════════════════════════════════════════════════════════════════════════════
# 2. /recommend — Happy path
# ════════════════════════════════════════════════════════════════════════════

def test_recommend_returns_200():
    r = client.post("/recommend", json=VALID_ANSWERS)
    assert r.status_code == 200


def test_recommend_response_has_animal_type():
    r = client.post("/recommend", json=VALID_ANSWERS)
    body = r.json()
    assert "animal_type" in body
    assert isinstance(body["animal_type"], str)
    assert len(body["animal_type"]) > 0


def test_recommend_response_has_recommendations():
    r = client.post("/recommend", json=VALID_ANSWERS)
    body = r.json()
    assert "recommendations" in body
    assert isinstance(body["recommendations"], list)


def test_recommend_default_top3():
    r = client.post("/recommend", json=VALID_ANSWERS)
    recs = r.json()["recommendations"]
    assert len(recs) == 3


def test_recommend_top_n_respected():
    payload = {**VALID_ANSWERS, "top_n": 5}
    r = client.post("/recommend", json=payload)
    assert len(r.json()["recommendations"]) == 5


def test_recommend_top1():
    payload = {**VALID_ANSWERS, "top_n": 1}
    r = client.post("/recommend", json=payload)
    assert len(r.json()["recommendations"]) == 1


def test_recommend_breed_fields():
    r = client.post("/recommend", json=VALID_ANSWERS)
    for item in r.json()["recommendations"]:
        assert "breed"      in item
        assert "confidence" in item
        assert isinstance(item["breed"],      str)
        assert isinstance(item["confidence"], float)


def test_recommend_confidence_between_0_and_1():
    r = client.post("/recommend", json=VALID_ANSWERS)
    for item in r.json()["recommendations"]:
        assert 0.0 <= item["confidence"] <= 1.0


def test_recommend_confidence_descending():
    """أعلى توصية يجب أن تكون ذات ثقة أعلى من الثانية وهكذا."""
    r = client.post("/recommend", json=VALID_ANSWERS)
    confs = [b["confidence"] for b in r.json()["recommendations"]]
    assert confs == sorted(confs, reverse=True)


# ════════════════════════════════════════════════════════════════════════════
# 3. /recommend — Validation errors (422)
# ════════════════════════════════════════════════════════════════════════════

def test_missing_field_returns_422():
    payload = {k: v for k, v in VALID_ANSWERS.items() if k != "housing_type"}
    r = client.post("/recommend", json=payload)
    assert r.status_code == 422


def test_invalid_housing_type_returns_422():
    payload = {**VALID_ANSWERS, "housing_type": "castle"}
    r = client.post("/recommend", json=payload)
    assert r.status_code == 422


def test_invalid_level_returns_422():
    payload = {**VALID_ANSWERS, "budget_level": "very_high"}
    r = client.post("/recommend", json=payload)
    assert r.status_code == 422


def test_top_n_zero_returns_422():
    payload = {**VALID_ANSWERS, "top_n": 0}
    r = client.post("/recommend", json=payload)
    assert r.status_code == 422


def test_top_n_above_10_returns_422():
    payload = {**VALID_ANSWERS, "top_n": 11}
    r = client.post("/recommend", json=payload)
    assert r.status_code == 422


def test_empty_body_returns_422():
    r = client.post("/recommend", json={})
    assert r.status_code == 422


# ════════════════════════════════════════════════════════════════════════════
# 4. اختبارات recommendation.py مباشرةً
# ════════════════════════════════════════════════════════════════════════════

def test_recommend_pet_direct():
    from recommendation import recommend_pet
    result = recommend_pet(VALID_ANSWERS, top_n=3)
    assert "animal_type"    in result
    assert "breeds"         in result
    assert len(result["breeds"]) == 3


def test_recommend_pet_missing_key_raises():
    from recommendation import recommend_pet
    bad = {k: v for k, v in VALID_ANSWERS.items() if k != "budget_level"}
    with pytest.raises(ValueError, match="Missing keys"):
        recommend_pet(bad)


def test_recommend_pet_top_n_variable():
    from recommendation import recommend_pet
    for n in [1, 3, 5]:
        result = recommend_pet(VALID_ANSWERS, top_n=n)
        assert len(result["breeds"]) == n


def test_all_profiles():
    """تأكد أن الـ API تعمل مع مجموعة متنوعة من الإجابات."""
    from recommendation import recommend_pet

    profiles = [
        # شخص يسكن شقة صغيرة بدون حديقة
        {**VALID_ANSWERS, "housing_type": "apartment",
         "outdoor_space": "none", "activity_level": "low",
         "size_preference": "small"},
        # مزرعة، خبرة عالية
        {**VALID_ANSWERS, "housing_type": "farm",
         "outdoor_space": "large", "experience_level": "expert"},
        # مبتدئ، ميزانية منخفضة
        {**VALID_ANSWERS, "experience_level": "beginner",
         "budget_level": "low", "maintenance_tolerance": "low"},
    ]

    for p in profiles:
        result = recommend_pet(p, top_n=3)
        assert result["animal_type"]
        assert len(result["breeds"]) == 3