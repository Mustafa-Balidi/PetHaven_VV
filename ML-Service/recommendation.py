from pathlib import Path
import numpy as np
import pandas as pd
import joblib

MODELS_DIR = Path(__file__).parent / "models"

def _load(filename: str):
    path = MODELS_DIR / filename
    try:
        with open(path, "rb") as f:
            return joblib.load(f)
    except FileNotFoundError:
        raise RuntimeError(
            f"Model file not found: {path}\n"
        )
    except Exception as e:
        raise RuntimeError(
            f"Failed to load '{filename}': {e}\n"
        ) from e
_model1             = _load("model1_animal_type.pkl")
_model2             = _load("model2_breed.pkl")
_feature_encoder    = _load("feature_encoder.pkl")
_feature_encoder_m2 = _load("feature_encoder_model2.pkl")
_animal_encoder     = _load("animal_label_encoder.pkl")
_breed_encoder      = _load("breed_label_encoder.pkl")

FEATURE_COLS = [
    "housing_type", "outdoor_space", "family_type",
    "hours_available", "weekend_time", "experience_level",
    "training_ability", "activity_level", "noise_tolerance",
    "budget_level", "maintenance_tolerance", "size_preference",
    "grooming_tolerance", "energy_preference", "affection_preference",
]

def recommend_pet(user_answers: dict, top_n: int = 3) -> dict:
    missing = [c for c in FEATURE_COLS if c not in user_answers]
    if missing:
        raise ValueError(f"Missing keys in user_answers: {missing}")
    df1 = pd.DataFrame([user_answers])[FEATURE_COLS]
    # Stage 1 — animal type
    X1          = _feature_encoder.transform(df1)
    animal_enc  = _model1.predict(X1)[0]
    animal_type = _animal_encoder.inverse_transform([animal_enc])[0]
    # Stage 2 — breed
    df2                = df1.copy()
    df2["animal_type"] = animal_type
    X2                 = _feature_encoder_m2.transform(df2)
    proba              = _model2.predict_proba(X2)[0]
    top_idx = np.argsort(proba)[-top_n:][::-1]
    breeds  = [
        {"breed": _breed_encoder.classes_[i], "confidence": round(float(proba[i])*100, 4)}
        for i in top_idx
    ]
    return {"animal_type": animal_type, "breeds": breeds}