import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { formatPetAge, translateDisplayValue } from "../../utils/localization.js";

/**
 * قسم "Recommended for You"
 * props:
 *  - pets: [{ id, name, breed, age, temperament, matchPercent, image }]
 *  - onViewProfile: function(petId)
 *  - onAdoptNow: function(petId)
 */
function RecommendedPets({ pets, onViewProfile, onAdoptNow }) {
  const { t } = useTranslation();
  return (
    <section className="recommended-pets">
      <h2 className="recommended-pets__title">
        {t("adopter.adoptionHub.recommended.title")}
      </h2>

      <div className="recommended-pets__grid">
        {pets.map((pet) => (
          <div key={pet.petId} className="recommended-card">
            <div className="recommended-card__image-wrap">
              <img
                className="recommended-card__image"
                src={pet.imageUrl}
                alt={pet.name}
              />
            </div>

            <div className="recommended-card__info">
              <div className="recommended-card__match-badge">
                <FaStar size={12} />
                <span>
                  {t("adopter.adoptionHub.recommended.match", {
                    percent: pet.matchPercent,
                  })}
                </span>
              </div>

              <h3 className="recommended-card__name">{pet.name}</h3>
              <p className="recommended-card__meta">
                {pet.breed || pet.species} • {pet.age != null ? formatPetAge(t, pet.age) : ""} •{" "}
                {translateDisplayValue(
                  t,
                  "adopter.common.petTraits",
                  pet.temperament
                )}
              </p>

              <div className="recommended-card__actions">
                <button
                  type="button"
                  className="recommended-card__btn recommended-card__btn--secondary"
                  onClick={() => onViewProfile && onViewProfile(pet.petId)}
                >
                  {t("adopter.adoptionHub.recommended.viewProfile")}
                </button>
                <button
                  type="button"
                  className="recommended-card__btn recommended-card__btn--primary"
                  onClick={() => onAdoptNow && onAdoptNow(pet.petId, pet.name)}
                >
                  {t("adopter.adoptionHub.recommended.adoptNow")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendedPets;
