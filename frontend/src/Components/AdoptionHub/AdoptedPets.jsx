import { FaNotesMedical, FaPaw } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { formatPetAge, translateDisplayValue } from "../../utils/localization.js";

function AdoptedPets({ pets, loading, error, onViewProfile }) {
  const { t } = useTranslation();

  return (
    <div className="adopted-pets">
      <h2 className="adopted-pets__title">{t("adopter.adoptionHub.adoptedPets.title")}</h2>

      {loading ? (
        <div className="pet-catalog__state" role="status" aria-live="polite"><p>{t("adopter.adoptionHub.adoptedPets.loading")}</p></div>
      ) : error ? (
        <div className="pet-catalog__state pet-catalog__state--error" role="alert"><p>{error}</p></div>
      ) : pets.length === 0 ? (
        <div className="pet-catalog__state"><p>{t("adopter.adoptionHub.adoptedPets.empty")}</p></div>
      ) : (
        <div className="adopted-pets__grid">
          {pets.map((pet) => (
            <article key={pet.petId} className="adopted-pets__card">
              <div className="adopted-pets__top">
                <div className="adopted-pets__avatar">
                  {pet.imageUrl ? <img src={pet.imageUrl} alt={pet.name} /> : <FaPaw size={24} />}
                </div>

                <div>
                  <h3 className="adopted-pets__name">{pet.name}</h3>
                  <span className="adopted-pets__badge">
                    {translateDisplayValue(t, "adopter.common.healthStatuses", pet.healthStatus)}
                  </span>
                  <p className="adopted-pets__desc">
                    {[pet.species, pet.breed, pet.age != null ? formatPetAge(t, pet.age) : null, pet.centerName]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="adopted-pets__records-btn"
                onClick={() => onViewProfile?.(pet.petId)}
              >
                <FaNotesMedical size={18} />
                <span>{t("adopter.adoptionHub.adoptedPets.viewDetails")}</span>
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdoptedPets;
