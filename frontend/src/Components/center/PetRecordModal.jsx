import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import CenterImage from "./CenterImage.jsx";

export default function PetRecordModal({ pet, onClose }) {
  const { t: translate } = useTranslation();
  const t = translate("center.modals", { returnObjects: true });
  const tv = t.viewPetRecord;
  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={t.close} className="center-modal-backdrop" onClick={onClose} />
      <div className="center-modal-panel center-modal-panel--lg">
        <div className="center-modal-header">
          <h2 className="center-modal-title">{pet.name}</h2>
          <button type="button" aria-label={t.close} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <section className="center-modal-section">
            <div className="center-modal-photo">
              <div className="center-modal-photo__preview center-modal-photo__preview--lg">
                <CenterImage src={pet.image} alt={pet.name} fallback={<Icon name="pets" />} />
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <h3 className="center-modal-section__title">{tv.basicInfo}</h3>
            <div className="center-modal-grid">
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.nameLabel}</span>
                <p className="center-modal-value">{pet.name}</p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.speciesLabel}</span>
                <p className="center-modal-value">{pet.species || "—"}</p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.breedLabel}</span>
                <p className="center-modal-value">{pet.breed}</p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.ageLabel}</span>
                <p className="center-modal-value">{pet.age}</p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.genderLabel}</span>
                <p className="center-modal-value">{pet.gender || "—"}</p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.sizeLabel}</span>
                <p className="center-modal-value">{pet.size || "—"}</p>
              </div>
              <div className="center-modal-field center-modal-field--full">
                <span className="center-modal-label">{tv.colorLabel}</span>
                <p className="center-modal-value">{pet.color || "—"}</p>
              </div>
            </div>
          </section>

          <hr className="center-modal-divider" />

          <div className="center-modal-grid">
            <section className="center-modal-section">
              <h3 className="center-modal-section__title">{tv.medical}</h3>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.healthStatusLabel}</span>
                <p className="center-modal-value">{pet.healthStatus || "—"}</p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.vaccinationsLabel}</span>
                {pet.vaccinations && pet.vaccinations.length > 0 ? (
                  <div className="center-modal-tag-list">
                    {pet.vaccinations.map((v) => (
                      <span key={v} className="center-modal-tag">
                        {v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="center-modal-value">{tv.noneRecorded}</p>
                )}
              </div>
            </section>

            <section className="center-modal-section">
              <h3 className="center-modal-section__title">{tv.adoptionDetails}</h3>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.statusLabel}</span>
                <p className="center-modal-value">
                  {translate(`center.status.${pet.status}`, { defaultValue: pet.status })}
                </p>
              </div>
              <div className="center-modal-field">
                <span className="center-modal-label">{tv.arrivalDateLabel}</span>
                <p className="center-modal-value">{pet.arrivalDate}</p>
              </div>
            </section>
          </div>

          <hr className="center-modal-divider" />

          <section className="center-modal-section">
            <h3 className="center-modal-section__title">{tv.character}</h3>
            <div className="center-modal-field">
              <span className="center-modal-label">{tv.characterLabel}</span>
              <p className="center-modal-value">{pet.description || "—"}</p>
            </div>
          </section>
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-primary" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
