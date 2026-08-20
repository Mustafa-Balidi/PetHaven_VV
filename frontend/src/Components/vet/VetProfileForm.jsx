import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function VetProfileForm({ values, onChange, onSubmit, onCancel, onUseGps, locating, saving }) {
  const { t } = useTranslation();

  return (
    <form className="vet-profile-form" onSubmit={onSubmit}>
      <section className="vet-profile-card">
        <div className="vet-profile-card__header">
          <Icon name="domain" />
          <h2 className="vet-profile-card__title">{t("vetProfile.basicInfo.title")}</h2>
        </div>

        <div className="vet-profile-grid">
          <div className="vet-profile-field">
            <label className="vet-profile-label" htmlFor="vet-full-name">
              {t("vetProfile.basicInfo.fullName")}
            </label>
            <input
              id="vet-full-name"
              className="vet-profile-input"
              type="text"
              required
              value={values.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
            />
          </div>

          <div className="vet-profile-field">
            <label className="vet-profile-label" htmlFor="vet-email">
              {t("vetProfile.basicInfo.email")}
            </label>
            <input
              id="vet-email"
              className="vet-profile-input"
              type="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
            />
          </div>

          <div className="vet-profile-field vet-profile-field--full">
            <label className="vet-profile-label" htmlFor="vet-phone-number">
              {t("vetProfile.basicInfo.phoneNumber")}
            </label>
            <div className="vet-profile-input-wrap">
              <Icon name="call" className="vet-profile-input-icon" />
              <input
                id="vet-phone-number"
                className="vet-profile-input vet-profile-input--icon"
                type="tel"
                value={values.phoneNumber}
                onChange={(event) => onChange("phoneNumber", event.target.value)}
              />
            </div>
          </div>

          <div className="vet-profile-field">
            <label className="vet-profile-label" htmlFor="vet-experience-years">
              {t("vetProfile.basicInfo.experienceYears")}
            </label>
            <input
              id="vet-experience-years"
              className="vet-profile-input"
              type="number"
              min="0"
              step="1"
              value={values.experienceYears}
              onChange={(event) => onChange("experienceYears", event.target.value)}
            />
          </div>

          <div className="vet-profile-field">
            <label className="vet-profile-label" htmlFor="vet-specialization">
              {t("vetProfile.basicInfo.specialization")}
            </label>
            <input
              id="vet-specialization"
              className="vet-profile-input"
              type="text"
              value={values.specialization}
              onChange={(event) => onChange("specialization", event.target.value)}
            />
          </div>

          <div className="vet-profile-field vet-profile-field--full">
            <label className="vet-profile-label" htmlFor="vet-license-number">
              {t("vetProfile.basicInfo.licenseNumber")}
            </label>
            <div className="vet-profile-input-wrap">
              <Icon name="badge" className="vet-profile-input-icon" />
              <input
                id="vet-license-number"
                className="vet-profile-input vet-profile-input--icon"
                type="text"
                value={values.licenseNumber}
                onChange={(event) => onChange("licenseNumber", event.target.value)}
              />
            </div>
          </div>

          <div className="vet-profile-field vet-profile-field--full">
            <label className="vet-profile-label" htmlFor="vet-clinic-name">
              {t("vetProfile.basicInfo.clinicName")}
            </label>
            <div className="vet-profile-input-wrap">
              <Icon name="domain" className="vet-profile-input-icon" />
              <input
                id="vet-clinic-name"
                className="vet-profile-input vet-profile-input--icon"
                type="text"
                value={values.clinicName}
                onChange={(event) => onChange("clinicName", event.target.value)}
              />
            </div>
          </div>

          <div className="vet-profile-field vet-profile-field--full">
            <label className="vet-profile-label" htmlFor="vet-address">
              {t("vetProfile.basicInfo.address")}
            </label>
            <div className="vet-profile-address-row">
              <div className="vet-profile-input-wrap">
                <Icon name="location_on" className="vet-profile-input-icon" />
                <input
                  id="vet-address"
                  className="vet-profile-input vet-profile-input--icon"
                  type="text"
                  autoComplete="street-address"
                  placeholder={t("vetProfile.basicInfo.addressPlaceholder")}
                  value={values.clinicAddress}
                  onChange={(event) => {
                    onChange("clinicAddress", event.target.value);
                    onChange("locationLat", "");
                    onChange("locationLng", "");
                  }}
                />
              </div>
              <button
                type="button"
                className="vet-profile-gps-btn"
                onClick={onUseGps}
                disabled={locating || saving}
              >
                <Icon name="my_location" />
                {locating ? t("vetProfile.basicInfo.locating") : t("vetProfile.basicInfo.useGps")}
              </button>
            </div>
            <p className="vet-profile-location-hint">{t("vetProfile.basicInfo.gpsHint")}</p>
          </div>
        </div>
      </section>

      <div className="vet-profile-actions">
        <button type="button" className="vet-profile-btn vet-profile-btn--cancel" onClick={onCancel} disabled={saving || locating}>
          {t("vetProfile.cancel")}
        </button>
        <button type="submit" className="vet-profile-btn vet-profile-btn--save" disabled={saving || locating}>
          {saving ? t("vetProfile.saving") : t("vetProfile.saveChanges")}
        </button>
      </div>
    </form>
  );
}
