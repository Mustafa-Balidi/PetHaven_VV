import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatPetAge,
  translateDisplayValue,
} from "../../utils/localization.js";

export default function MyPets({ pets = [], loading = false, error = null, onRetry }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const viewPetProfile = (pet) => {
    navigate(`/adopter/pet-profile/${pet.id}`);
  };

  return (
    <section className="pets-section">
      <div className="section-header pets-section-header">
        <h2 className="section-title">{t("adopter.dashboard.pets.title")}</h2>
        {!loading && !error && pets.length > 0 && (
          <span className="pets-count">
            {t("adopter.dashboard.pets.count", { count: pets.length })}
          </span>
        )}
      </div>

      {loading ? (
        <div className="pets-state-card" aria-live="polite">
          <span className="material-symbols-outlined pets-state-icon" aria-hidden="true">progress_activity</span>
          <p>{t("adopter.dashboard.pets.loading")}</p>
        </div>
      ) : error ? (
        <div className="pets-state-card pets-state-card--error" role="alert">
          <span className="material-symbols-outlined pets-state-icon" aria-hidden="true">error</span>
          <p>{t("adopter.dashboard.pets.loadError", { message: error })}</p>
          <button type="button" className="dashboard-retry-button" onClick={onRetry}>{t("adopter.dashboard.retry")}</button>
        </div>
      ) : pets.length === 0 ? (
        <div className="pets-state-card">
          <span className="material-symbols-outlined pets-state-icon" aria-hidden="true">pets</span>
          <h3>{t("adopter.dashboard.pets.emptyTitle")}</h3>
          <p>{t("adopter.dashboard.pets.emptyText")}</p>
          <Link to="/adopter/adoption-hub" className="pets-browse-link">
            {t("adopter.dashboard.pets.browse")}
          </Link>
        </div>
      ) : (
        <div className="stacked-list">
          {pets.map((pet) => (
            <button
              type="button"
              className="pet-card"
              key={pet.id}
              aria-label={t("adopter.dashboard.pets.viewProfile", {
                name: pet.name,
              })}
              onClick={() => viewPetProfile(pet)}
            >
              <div className="pet-avatar">
                {pet.image ? (
                  <img alt={pet.name} src={pet.image} />
                ) : (
                  <span className="material-symbols-outlined pet-avatar-placeholder" aria-hidden="true">
                    pets
                  </span>
                )}
              </div>

              <div className="pet-info">
                <h3 className="pet-name">{pet.name}</h3>
                <div className="pet-meta">
                  <span>{pet.breed || pet.species || t("adopter.common.pet")}</span>
                  {pet.age !== undefined && pet.age !== null && (
                    <>
                      <span className="pet-meta-separator" aria-hidden="true">
                        •
                      </span>
                      <span>{formatPetAge(t, pet.age)}</span>
                    </>
                  )}
                </div>
                {pet.centerName && (
                  <p className="pet-center">
                    {t("adopter.dashboard.pets.adoptedFrom", {
                      center: pet.centerName,
                    })}
                  </p>
                )}
                {pet.statusLabel && <div className={`pet-status pet-status--${pet.status}`}>
                  <span
                    className="material-symbols-outlined pet-status-icon"
                    aria-hidden="true"
                  >
                    {pet.status === "healthy" ? "check_circle" : "warning"}
                  </span>
                  <span>
                    {translateDisplayValue(
                      t,
                      "adopter.common.healthStatuses",
                      pet.statusLabel
                    )}
                  </span>
                </div>}
              </div>

              <span className="pet-card-action" aria-hidden="true">
                <span className="pet-view-label">
                  {t("adopter.dashboard.pets.details")}
                </span>
                <span className="material-symbols-outlined pet-chevron" aria-hidden="true">
                  chevron_right
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
