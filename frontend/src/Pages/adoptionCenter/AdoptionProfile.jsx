import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CenterHeader from "../../Components/common/header/CenterHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import Toast from "../../Components/Toast.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import "../../Styling/CenterProfile.css";

export default function AdoptionProfile() {
  const { t: translate } = useTranslation();
  const t = translate("center.profile", { returnObjects: true });
  const { profile: ctxProfile, profileLoading, profileError, fetchProfile, updateProfile } = useCenterContext();
  const [profile, setProfile] = useState(null);
  const [syncedProfile, setSyncedProfile] = useState(ctxProfile);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (ctxProfile !== syncedProfile) {
    setSyncedProfile(ctxProfile);
    if (ctxProfile) setProfile(ctxProfile);
  }

  const loading = profileLoading || !profile;

  function updateField(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setProfile(ctxProfile);
  }

  function handleUseGps() {
    if (!navigator.geolocation) {
      setToast({ message: t.basicInfo.gpsUnsupported, type: "error" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          if (!res.ok) throw new Error("reverse geocode failed");
          const data = await res.json();
          const a = data.address || {};
          const street = [a.house_number, a.road].filter(Boolean).join(" ");
          const city = a.city || a.town || a.village || a.county;
          const parts = [street, city, a.state, a.postcode].filter(Boolean);
          if (parts.length === 0) throw new Error("no address found");
          updateField("address", parts.join(", "));
        } catch {
          setToast({ message: t.basicInfo.gpsError, type: "error" });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setToast({ message: t.basicInfo.gpsError, type: "error" });
        setLocating(false);
      }
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await updateProfile(profile);
      setProfile(saved);
      setPassword("");
      setToast({ message: t.saveSuccess, type: "success" });
    } catch {
      setToast({ message: t.saveError, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="center-profile-page">
        <CenterHeader />
        <div className="center-profile-loading">{profileError || t.loading}</div>
      </div>
    );
  }

  return (
    <div className="center-profile-page">
      <CenterHeader />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="center-profile-main">
        <Link to="/center/dashboard" className="center-profile-back-link">
          <Icon name="arrow_back" />
          {t.backToDashboard}
        </Link>

        <div className="center-profile-heading">
          <h1 className="center-profile-title">{t.title}</h1>
          <p className="center-profile-subtitle">{t.subtitle}</p>
        </div>

        <form className="center-profile-form" onSubmit={handleSave}>
          {/* Basic Information */}
          <section className="center-profile-card">
            <div className="center-profile-card__header">
              <Icon name="domain" />
              <h2 className="center-profile-card__title">{t.basicInfo.title}</h2>
            </div>
            <div className="center-profile-grid">
              <div className="center-profile-field">
                <label className="center-profile-label" htmlFor="center-name">
                  {t.basicInfo.centerName}
                </label>
                <input
                  id="center-name"
                  type="text"
                  placeholder={t.basicInfo.centerNamePlaceholder}
                  className="center-profile-input"
                  value={profile.centerName ?? ""}
                  onChange={(e) => updateField("centerName", e.target.value)}
                />
              </div>
              <div className="center-profile-field">
                <label className="center-profile-label" htmlFor="license-number">
                  {t.basicInfo.licenseNumber}
                </label>
                <input
                  id="license-number"
                  type="text"
                  placeholder={t.basicInfo.licenseNumberPlaceholder}
                  className="center-profile-input"
                  value={profile.licenseNumber ?? ""}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                />
              </div>
              <div className="center-profile-field center-profile-field--full">
                <label className="center-profile-label" htmlFor="phone-number">
                  {t.basicInfo.phoneNumber}
                </label>
                <div className="center-profile-input-wrap">
                  <Icon name="call" className="center-profile-input-icon" />
                  <input
                    id="phone-number"
                    type="tel"
                    placeholder={t.basicInfo.phoneNumberPlaceholder}
                    className="center-profile-input center-profile-input--icon"
                    value={profile.phoneNumber ?? ""}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                  />
                </div>
              </div>
              <div className="center-profile-field center-profile-field--full">
                <label className="center-profile-label" htmlFor="physical-address">
                  {t.basicInfo.physicalAddress}
                </label>
                <div className="center-profile-address-row">
                  <div className="center-profile-input-wrap">
                    <Icon name="location_on" className="center-profile-input-icon" />
                    <input
                      id="physical-address"
                      type="text"
                      autoComplete="street-address"
                      placeholder={t.basicInfo.addressPlaceholder}
                      className="center-profile-input center-profile-input--icon"
                      value={profile.address ?? ""}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="center-profile-gps-btn"
                    onClick={handleUseGps}
                    disabled={locating}
                  >
                    <Icon name="location_on" />
                    {locating ? t.basicInfo.locating : t.basicInfo.useGps}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="center-profile-card">
            <div className="center-profile-card__header">
              <Icon name="security" />
              <h2 className="center-profile-card__title">{t.security.title}</h2>
            </div>
            <div className="center-profile-grid">
              <div className="center-profile-field center-profile-field--full">
                <label className="center-profile-label" htmlFor="password">
                  {t.security.password}
                </label>
                <div className="center-profile-input-wrap">
                  <Icon name="lock" className="center-profile-input-icon" />
                  <input
                    id="password"
                    type="password"
                    placeholder={t.security.passwordPlaceholder}
                    className="center-profile-input center-profile-input--icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p className="center-profile-hint">{t.security.passwordHint}</p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="center-profile-actions">
            <button type="button" className="center-profile-btn center-profile-btn-cancel" onClick={handleCancel}>
              {t.cancel}
            </button>
            <button type="submit" disabled={saving} className="center-profile-btn center-profile-btn-save">
              {saving ? "..." : t.saveChanges}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
