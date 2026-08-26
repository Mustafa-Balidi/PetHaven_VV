import logging
from typing import Literal
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from recommendation import recommend_pet
API_VERSION = "1.0.0"
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# ── Allowed values per field ──────────────────────────────────────────────────
HousingType     = Literal["apartment", "house", "condo", "farm"]
OutdoorSpace    = Literal["none", "small", "medium", "large"]
FamilyType      = Literal["single", "couple", "family_with_children"]
Level3          = Literal["low", "medium", "high"]
ExperienceLevel = Literal["beginner", "intermediate", "expert"]
SizePreference  = Literal["small", "medium", "large"]
AffectionPref   = Literal["independent", "balanced", "very_affectionate"]
# ── Request schema ────────────────────────────────────────────────────────────
class UserAnswers(BaseModel):
    housing_type          : HousingType     = Field(..., examples=["house"])
    outdoor_space         : OutdoorSpace    = Field(..., examples=["large"])
    family_type           : FamilyType      = Field(..., examples=["family_with_children"])
    hours_available       : Level3          = Field(..., examples=["high"])
    weekend_time          : Level3          = Field(..., examples=["high"])
    experience_level      : ExperienceLevel = Field(..., examples=["intermediate"])
    training_ability      : Level3          = Field(..., examples=["high"])
    activity_level        : Level3          = Field(..., examples=["high"])
    noise_tolerance       : Level3          = Field(..., examples=["medium"])
    budget_level          : Level3          = Field(..., examples=["medium"])
    maintenance_tolerance : Level3          = Field(..., examples=["medium"])
    size_preference       : SizePreference  = Field(..., examples=["large"])
    grooming_tolerance    : Level3          = Field(..., examples=["medium"])
    energy_preference     : Level3          = Field(..., examples=["high"])
    affection_preference  : AffectionPref   = Field(..., examples=["balanced"])
    top_n                 : int             = Field(default=3, ge=1, le=10)
# ── Response schema ───────────────────────────────────────────────────────────
class BreedRecommendation(BaseModel):
    breed:      str
    confidence: float

class RecommendationResponse(BaseModel):
    animal_type:     str
    recommendations: list[BreedRecommendation]

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Pet Recommendation API",
    version=API_VERSION,
)
@app.get("/", include_in_schema=False)
def root():
    return {"message": f"Pet Recommendation API v{API_VERSION} — visit /docs"}

@app.get("/health")
def health():
    return {"status": "ok", "version": API_VERSION}

@app.post("/recommend", response_model=RecommendationResponse)
def recommend(answers: UserAnswers):
    
    try:
        user_dict = answers.model_dump(exclude={"top_n"})
        result    = recommend_pet(user_dict, top_n=answers.top_n)
        return RecommendationResponse(
            animal_type     = result["animal_type"],
            recommendations = [BreedRecommendation(**b) for b in result["breeds"]],
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error during recommendation: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error")