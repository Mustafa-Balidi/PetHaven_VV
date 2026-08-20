import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { formatPetAge, translateDisplayValue } from "../../utils/localization.js";

function PetHeroCard({ pet }) {
  const { t } = useTranslation();
  const fallback = t("adopter.petProfile.notProvided");

  return (
    <section className="pet-hero-card">
      <div className="pet-hero-card__glow" />

      <div className="pet-hero-card__image-wrap">
        <img
          className="pet-hero-card__image"
          src={pet.imageUrl}
          alt={t("adopter.petProfile.imageAlt", {
            name: pet.name || fallback,
            breed: pet.breed || pet.species || fallback,
          })}
        />
      </div>

      <div className="pet-hero-card__info">
        <div className="pet-hero-card__top-row">
          <div>
            <h1 className="pet-hero-card__name">{pet.name || fallback}</h1>
            <p className="pet-hero-card__breed">
              {[pet.species, pet.breed].filter(Boolean).join(" • ") || fallback}
            </p>
          </div>
        </div>

        <div className="pet-hero-card__stats-grid">
          <div className="pet-hero-card__stat">
            <p className="pet-hero-card__stat-label">{t("adopter.petProfile.age")}</p>
            <p className="pet-hero-card__stat-value">
              {pet.age != null ? formatPetAge(t, pet.age) : fallback}
            </p>
          </div>

          <div className="pet-hero-card__stat">
            <p className="pet-hero-card__stat-label">{t("adopter.petProfile.sex")}</p>
            <p className="pet-hero-card__stat-value">
              {translateDisplayValue(t, "adopter.common.genders", pet.gender) || fallback}
            </p>
          </div>

          <div className="pet-hero-card__stat">
            <p className="pet-hero-card__stat-label">{t("adopter.petProfile.center")}</p>
            <p className="pet-hero-card__stat-value">{pet.centerName || fallback}</p>
          </div>

          <div className="pet-hero-card__stat pet-hero-card__stat--health">
            <div className="pet-hero-card__health-pill">
              <FaCheckCircle size={16} />
              <span>
                {translateDisplayValue(t, "adopter.common.healthStatuses", pet.healthStatus) || fallback}
              </span>
            </div>
          </div>
        </div>

        <div className="pet-hero-card__description">
          <h2>{t("adopter.petProfile.description")}</h2>
          <p>{pet.description || fallback}</p>
        </div>
      </div>
    </section>
  );
}

export default PetHeroCard;
