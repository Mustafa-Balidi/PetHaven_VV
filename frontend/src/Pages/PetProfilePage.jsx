import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TopNavBar from "../Components/TopNavBar";
import Footer from "../Components/Footer";
import PetHeroCard from "../Components/PetProfile/PetHeroCard";
import { getPetById } from "../api/petProfileApi.js";
import "../Styling/PetProfile.css";

function PetProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { petId: routePetId } = useParams();
  const petId = Number(routePetId ?? location.state?.petId);
  const hasValidPetId = Number.isInteger(petId) && petId > 0;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(hasValidPetId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!hasValidPetId) {
      return () => { active = false; };
    }

    getPetById(petId)
      .then((data) => {
        if (active) setPet(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || t("adopter.petProfile.loadError"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [hasValidPetId, petId, t]);

  const displayedError = hasValidPetId ? error : t("adopter.petProfile.missingId");

  return (
    <div className="pet-profile-page">
      <TopNavBar />

      <main className="pet-profile-page__main">
        <div className="pet-profile-page__left pet-profile-page__left--full">
          <button type="button" className="pet-profile-page__back-btn" onClick={() => navigate("/adopter/adoption-hub")}>
            <FaArrowLeft size={14} />
            <span>{t("adopter.petProfile.backToCatalog")}</span>
          </button>

          {loading ? (
            <section className="pet-profile-page__empty-state" aria-live="polite">
              <p>{t("adopter.petProfile.loading")}</p>
            </section>
          ) : displayedError ? (
            <section className="pet-profile-page__empty-state pet-profile-page__empty-state--error" role="alert">
              <p>{displayedError}</p>
              <button type="button" onClick={() => navigate("/adopter/adoption-hub")}>
                {t("adopter.petProfile.browsePets")}
              </button>
            </section>
          ) : pet ? (
            <PetHeroCard pet={pet} />
          ) : (
            <section className="pet-profile-page__empty-state"><p>{t("adopter.petProfile.notFound")}</p></section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PetProfilePage;
