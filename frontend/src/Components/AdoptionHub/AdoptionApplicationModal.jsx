import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHome, FaTimes } from "react-icons/fa";
import "../../Styling/AdoptionHub.css";

const initialFormState = {
  housingType: "",
  hasPetBefore: false,
  experienceLevel: "",
  freeHoursPerDay: "",
};

function AdoptionApplicationModal({
  isOpen,
  petName,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData(initialFormState);
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const succeeded = await onSubmit?.({
      ...formData,
      freeHoursPerDay: Number(formData.freeHoursPerDay),
    });
    if (succeeded !== false) setFormData(initialFormState);
  };

  return (
    <div className="adoption-modal-overlay">
      <button
        type="button"
        className="adoption-modal-backdrop"
        onClick={handleClose}
        aria-label={t("adopter.adoptionHub.application.close")}
      />

      <form className="adoption-modal" onSubmit={handleSubmit}>
        <div className="adoption-modal__header">
          <div>
            <h2 className="adoption-modal__title">{t("adopter.adoptionHub.application.title")}</h2>
            <p className="adoption-modal__subtitle">
              {petName
                ? t("adopter.adoptionHub.application.subtitleWithPet", { petName })
                : t("adopter.adoptionHub.application.subtitle")}
            </p>
          </div>
          <button
            type="button"
            className="adoption-modal__close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label={t("adopter.adoptionHub.application.close")}
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="adoption-modal__body">
          <section className="adoption-modal__section">
            <h3 className="adoption-modal__section-title">
              <FaHome size={16} />
              <span>{t("adopter.adoptionHub.application.adopterProfile")}</span>
            </h3>

            <div className="adoption-modal__grid-2">
              <label className="adoption-modal__field">
                <span>{t("adopter.adoptionHub.application.housingType")}</span>
                <select required value={formData.housingType} onChange={handleChange("housingType")}>
                  <option value="">{t("adopter.adoptionHub.application.selectHousingType")}</option>
                  <option value="House">{t("adopter.adoptionHub.application.house")}</option>
                  <option value="Apartment">{t("adopter.adoptionHub.application.apartment")}</option>
                  <option value="Other">{t("adopter.adoptionHub.application.otherHousing")}</option>
                </select>
              </label>

              <label className="adoption-modal__field">
                <span>{t("adopter.adoptionHub.application.experienceLevel")}</span>
                <select required value={formData.experienceLevel} onChange={handleChange("experienceLevel")}>
                  <option value="">{t("adopter.adoptionHub.application.selectExperience")}</option>
                  <option value="Beginner">{t("adopter.adoptionHub.application.beginner")}</option>
                  <option value="Intermediate">{t("adopter.adoptionHub.application.intermediate")}</option>
                  <option value="Expert">{t("adopter.adoptionHub.application.expert")}</option>
                </select>
              </label>

              <label className="adoption-modal__field">
                <span>{t("adopter.adoptionHub.application.freeHours")}</span>
                <input
                  required
                  type="number"
                  min="0"
                  max="24"
                  value={formData.freeHoursPerDay}
                  onChange={handleChange("freeHoursPerDay")}
                />
              </label>

              <label className="adoption-modal__checkbox-row">
                <input
                  type="checkbox"
                  checked={formData.hasPetBefore}
                  onChange={handleChange("hasPetBefore")}
                />
                <span>{t("adopter.adoptionHub.application.hasPetBefore")}</span>
              </label>
            </div>
          </section>

          {error && <p className="adoption-modal__error" role="alert">{error}</p>}
        </div>

        <div className="adoption-modal__footer">
          <button type="button" className="adoption-modal__btn adoption-modal__btn--cancel" onClick={handleClose} disabled={isSubmitting}>
            {t("adopter.adoptionHub.application.cancel")}
          </button>
          <button type="submit" className="adoption-modal__btn adoption-modal__btn--submit" disabled={isSubmitting}>
            {isSubmitting ? t("adopter.adoptionHub.application.submitting") : t("adopter.adoptionHub.application.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdoptionApplicationModal;
