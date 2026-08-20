import { FaPaw } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { formatPetAge } from "../../utils/localization.js";

function PetCard({ pet, onViewProfile, onAdoptNow }) {
  const { t } = useTranslation();
  const fallback = t("adopter.adoptionHub.catalog.notProvided");

  return (
    <article className="pet-catalog-card">
      <div className="pet-catalog-card__image-wrap">
        {pet.imageUrl ? (
          <img className="pet-catalog-card__image" src={pet.imageUrl} alt={pet.name || fallback} />
        ) : (
          <div className="pet-catalog-card__image-placeholder"><FaPaw size={32} /></div>
        )}
      </div>

      <div className="pet-catalog-card__body">
        <div className="pet-catalog-card__header">
          <h3 className="pet-catalog-card__name">{pet.name || fallback}</h3>
        </div>

        <p className="pet-catalog-card__meta">
          {[pet.breed, pet.age != null ? formatPetAge(t, pet.age) : null].filter(Boolean).join(" • ") || fallback}
        </p>
        <dl className="pet-catalog-card__details">
          <div>
            <dt>{t("adopter.adoptionHub.catalog.center")}</dt>
            <dd>{pet.centerName || fallback}</dd>
          </div>
        </dl>

        <div className="pet-catalog-card__actions">
          <button type="button" className="pet-catalog-card__profile-btn" onClick={() => onViewProfile?.(pet.petId)}>
            {t("adopter.adoptionHub.catalog.viewProfile")}
          </button>
          <button type="button" className="pet-catalog-card__adopt-btn" onClick={() => onAdoptNow?.(pet.petId, pet.name)}>
            {t("adopter.adoptionHub.catalog.adoptNow")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default PetCard;
