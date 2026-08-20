import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopNavBar from "../Components/TopNavBar.jsx";
import Footer from "../Components/Footer.jsx";
import Icon from "../Components/Icon.jsx";
import Toast from "../Components/Toast.jsx";
import { fetchMyProfile, updateAdopterProfile } from "../api/profileApi.js";
import "../Styling/AdopterProfile.css";

const HOUSING_OPTIONS = ["Apartment", "Department", "House", "Villa"];
const EXPERIENCE_OPTIONS = ["Beginner", "Intermediate", "Expert"];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
  housingType: "",
  experienceLevel: "",
  freeHoursPerDay: "",
};

export default function AdopterProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const applyProfile = useCallback((profile) => {
    setForm({
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      address: profile.address ?? "",
      housingType: profile.housingType ?? "",
      experienceLevel: profile.experienceLevel ?? "",
      freeHoursPerDay: profile.freeHoursPerDay ?? "",
    });
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);

    try {
      applyProfile(await fetchMyProfile());
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [applyProfile]);

  useEffect(() => {
    let active = true;

    fetchMyProfile()
      .then((profile) => {
        if (active) applyProfile(profile);
      })
      .catch(() => {
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applyProfile]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      await updateAdopterProfile({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        housingType: form.housingType,
        experienceLevel: form.experienceLevel,
        freeHoursPerDay:
          form.freeHoursPerDay === "" ? null : Number(form.freeHoursPerDay),
      });
      setToast({ type: "success", message: t("adopter.profile.saveSuccess") });
    } catch {
      setToast({ type: "error", message: t("adopter.profile.saveError") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adopter-profile-page">
      <TopNavBar />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="adopter-profile-main">
        <Link to="/adopter/dashboard" className="adopter-profile-back-link">
          <Icon name="arrow_back" />
          {t("adopter.profile.backToDashboard")}
        </Link>

        <div className="adopter-profile-heading">
          <h1 className="adopter-profile-title">{t("adopter.profile.title")}</h1>
          <p className="adopter-profile-subtitle">{t("adopter.profile.subtitle")}</p>
        </div>

        {loading ? (
          <div className="adopter-profile-state">{t("adopter.profile.loading")}</div>
        ) : loadFailed ? (
          <div className="adopter-profile-state adopter-profile-state--error">
            <p>{t("adopter.profile.loadError")}</p>
            <button
              type="button"
              className="adopter-profile-btn adopter-profile-btn--retry"
              onClick={loadProfile}
            >
              {t("adopter.profile.retry")}
            </button>
          </div>
        ) : (
          <form className="adopter-profile-form" onSubmit={handleSave}>
            <section className="adopter-profile-card">
              <div className="adopter-profile-card__header">
                <Icon name="person" />
                <h2 className="adopter-profile-card__title">
                  {t("adopter.profile.personal.title")}
                </h2>
              </div>

              <div className="adopter-profile-grid">
                <div className="adopter-profile-field">
                  <label className="adopter-profile-label" htmlFor="adopter-full-name">
                    {t("adopter.profile.personal.fullName")}
                  </label>
                  <input
                    id="adopter-full-name"
                    type="text"
                    required
                    className="adopter-profile-input"
                    placeholder={t("adopter.profile.personal.fullNamePlaceholder")}
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                  />
                </div>

                <div className="adopter-profile-field">
                  <label className="adopter-profile-label" htmlFor="adopter-email">
                    {t("adopter.profile.personal.email")}
                  </label>
                  <input
                    id="adopter-email"
                    type="email"
                    readOnly
                    className="adopter-profile-input adopter-profile-input--readonly"
                    value={form.email}
                  />
                  <p className="adopter-profile-hint">
                    {t("adopter.profile.personal.emailHint")}
                  </p>
                </div>

                <div className="adopter-profile-field">
                  <label className="adopter-profile-label" htmlFor="adopter-phone">
                    {t("adopter.profile.personal.phone")}
                  </label>
                  <div className="adopter-profile-input-wrap">
                    <Icon name="call" className="adopter-profile-input-icon" />
                    <input
                      id="adopter-phone"
                      type="tel"
                      className="adopter-profile-input adopter-profile-input--icon"
                      placeholder={t("adopter.profile.personal.phonePlaceholder")}
                      value={form.phoneNumber}
                      onChange={(event) => updateField("phoneNumber", event.target.value)}
                    />
                  </div>
                </div>

                <div className="adopter-profile-field adopter-profile-field--full">
                  <label className="adopter-profile-label" htmlFor="adopter-address">
                    {t("adopter.profile.personal.address")}
                  </label>
                  <div className="adopter-profile-input-wrap">
                    <Icon name="location_on" className="adopter-profile-input-icon" />
                    <input
                      id="adopter-address"
                      type="text"
                      className="adopter-profile-input adopter-profile-input--icon"
                      placeholder={t("adopter.profile.personal.addressPlaceholder")}
                      value={form.address}
                      onChange={(event) => updateField("address", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="adopter-profile-card">
              <div className="adopter-profile-card__header">
                <Icon name="pets" />
                <h2 className="adopter-profile-card__title">
                  {t("adopter.profile.preferences.title")}
                </h2>
              </div>

              <div className="adopter-profile-grid">
                <div className="adopter-profile-field">
                  <label className="adopter-profile-label" htmlFor="adopter-housing">
                    {t("adopter.profile.preferences.housingType")}
                  </label>
                  <select
                    id="adopter-housing"
                    className="adopter-profile-input"
                    value={form.housingType}
                    onChange={(event) => updateField("housingType", event.target.value)}
                  >
                    <option value="">{t("adopter.profile.preferences.selectHousing")}</option>
                    {HOUSING_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(`adopter.profile.preferences.housingOptions.${option}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adopter-profile-field">
                  <label className="adopter-profile-label" htmlFor="adopter-experience">
                    {t("adopter.profile.preferences.experienceLevel")}
                  </label>
                  <select
                    id="adopter-experience"
                    className="adopter-profile-input"
                    value={form.experienceLevel}
                    onChange={(event) => updateField("experienceLevel", event.target.value)}
                  >
                    <option value="">
                      {t("adopter.profile.preferences.selectExperience")}
                    </option>
                    {EXPERIENCE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(`adopter.profile.preferences.experienceOptions.${option}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="adopter-profile-field adopter-profile-field--full">
                  <label className="adopter-profile-label" htmlFor="adopter-free-hours">
                    {t("adopter.profile.preferences.freeHours")}
                  </label>
                  <input
                    id="adopter-free-hours"
                    type="number"
                    min="0"
                    max="24"
                    className="adopter-profile-input"
                    value={form.freeHoursPerDay}
                    onChange={(event) => updateField("freeHoursPerDay", event.target.value)}
                  />
                  <p className="adopter-profile-hint">
                    {t("adopter.profile.preferences.freeHoursHint")}
                  </p>
                </div>
              </div>
            </section>

            <div className="adopter-profile-actions">
              <button
                type="button"
                className="adopter-profile-btn adopter-profile-btn--cancel"
                onClick={() => navigate("/adopter/dashboard")}
              >
                {t("adopter.profile.cancel")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="adopter-profile-btn adopter-profile-btn--save"
              >
                {saving ? t("adopter.profile.saving") : t("adopter.profile.save")}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
