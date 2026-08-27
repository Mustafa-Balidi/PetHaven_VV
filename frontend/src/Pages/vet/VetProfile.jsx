import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import Icon from "../../Components/Icon.jsx";
import Toast from "../../Components/Toast.jsx";
import VetProfileDetails from "../../Components/vet/VetProfileDetails.jsx";
import VetProfileForm from "../../Components/vet/VetProfileForm.jsx";
import { updateVetProfile } from "../../api/profileApi.js";
import { useVetContext } from "../../context/vetContextBase.js";
import "../../Styling/VetProfile.css";

/**
 * `/Profile/me` (UserProfileDto) carries no Location_Lat / Location_Lng, so the
 * coordinate fields are always empty when built from a fetched profile. They
 * are form-only values that the vet fills through GPS and that the multipart
 * update sends back — never something the profile read returns.
 */
function toFormValues(profile, coordinates) {
  return {
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    clinicName: profile.clinicName ?? "",
    clinicAddress: profile.clinicAddress ?? "",
    specialization: profile.specialization ?? "",
    experienceYears: profile.experienceYears ?? profile.experienceLevel ?? "",
    licenseNumber: profile.licenseNumber ?? "",
    locationLat: coordinates?.locationLat ?? "",
    locationLng: coordinates?.locationLng ?? "",
    certificateFile: null,
  };
}

function toNullableCoordinate(value) {
  if (value === "" || value == null) return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

export default function VetProfile() {
  const { t, i18n } = useTranslation();
  useDocumentTitle(t("vetProfile.title"));
  const { profile, profileLoading, profileError, ensureProfile, refreshProfile } = useVetContext();

  const [form, setForm] = useState(null);
  // The profile object the current `form` was built from, so a fresh one
  // (first load, or a refetch after save) rebuilds the editable copy.
  const [formSource, setFormSource] = useState(null);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    ensureProfile().catch(() => {
      /* surfaced through profileError below */
    });
  }, [ensureProfile]);

  // Derived during render, not in an effect: React re-renders immediately with
  // the new form and never commits the intermediate state, so the page has no
  // paint where `profile` and `form` disagree. Coordinates are carried over
  // from the values still in the form, because the backend read cannot
  // return them.
  if (profile && profile !== formSource) {
    setFormSource(profile);
    setForm((current) => toFormValues(profile, current));
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    if (profile) setForm((current) => toFormValues(profile, current));
  }

  function handleRetry() {
    refreshProfile().catch(() => {
      /* surfaced through profileError below */
    });
  }

  function handleUseGps() {
    if (!navigator.geolocation) {
      setToast({ message: t("vetProfile.basicInfo.gpsUnsupported"), type: "error" });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        // The coordinates are what Save Changes actually persists, so they are
        // stored the moment the browser hands them over. Reverse geocoding is
        // a convenience on top; its failure must never discard a good fix.
        setForm((current) => ({
          ...current,
          locationLat: coords.latitude,
          locationLng: coords.longitude,
        }));

        try {
          const params = new URLSearchParams({
            format: "jsonv2",
            lat: String(coords.latitude),
            lon: String(coords.longitude),
            "accept-language": i18n.language,
          });
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`);
          if (!response.ok) throw new Error("Reverse geocoding failed.");

          const result = await response.json();
          if (!result.display_name) throw new Error("No address was found.");

          setForm((current) => ({ ...current, clinicAddress: result.display_name }));
          setToast({ message: t("vetProfile.basicInfo.gpsSuccess"), type: "success" });
        } catch {
          // Coordinates are already in the form; only the address is missing.
          setToast({ message: t("vetProfile.basicInfo.gpsAddressFailed"), type: "warning" });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setToast({ message: t("vetProfile.basicInfo.gpsError"), type: "error" });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      if (form.certificateFile && !form.certificateFile.name.toLowerCase().endsWith(".pdf")) {
        throw new Error(t("vetProfile.certificate.pdfOnly"));
      }
      await updateVetProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim() || null,
        phoneNumber: form.phoneNumber.trim() || null,
        clinicName: form.clinicName.trim() || null,
        clinicAddress: form.clinicAddress.trim() || null,
        specialization: form.specialization.trim() || null,
        experienceYears: form.experienceYears === "" ? null : Number(form.experienceYears),
        licenseNumber: form.licenseNumber.trim() || null,
        locationLat: toNullableCoordinate(form.locationLat),
        locationLng: toNullableCoordinate(form.locationLng),
        certificateFile: form.certificateFile,
      });
      // Re-read from the backend rather than trusting the values just sent.
      await refreshProfile();
      setToast({ message: t("vetProfile.saveSuccess"), type: "success" });
    } catch (err) {
      setToast({ message: err.message || t("vetProfile.saveError"), type: "error" });
    } finally {
      setSaving(false);
    }
  }

  // A failed first read used to render the same "Loading…" box forever. Error
  // and loading are now separate states, and the error one offers a way out.
  if (!profile && profileError) {
    return (
      <div className="vet-profile-page">
        <VetHeader />
        <main id="main-content" tabIndex={-1} className="vet-profile-main">
          <div className="vet-profile-alert" role="alert">
            <p>{profileError}</p>
            <button
              type="button"
              className="vet-profile-btn vet-profile-btn--cancel"
              onClick={handleRetry}
              disabled={profileLoading}
              aria-busy={profileLoading || undefined}
            >
              {profileLoading ? t("vetProfile.loading") : t("vetPendingApproval.retry")}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <div className="vet-profile-page">
        <VetHeader />
        <div className="vet-profile-loading" role="status">{t("vetProfile.loading")}</div>
      </div>
    );
  }

  return (
    <div className="vet-profile-page">
      <VetHeader />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main id="main-content" tabIndex={-1} className="vet-profile-main">
        <Link to="/vet/dashboard" className="vet-profile-back-link">
          <Icon name="arrow_back" />
          {t("vetProfile.backToDashboard")}
        </Link>

        <div className="vet-profile-heading">
          <h1 className="vet-profile-title">{t("vetProfile.title")}</h1>
          <p className="vet-profile-subtitle">{t("vetProfile.subtitle")}</p>
        </div>

        {/* A refresh that fails after the profile is already on screen is a
            non-blocking warning: the rendered data is simply stale. */}
        {profileError && (
          <div className="vet-profile-alert" role="alert">
            {profileError}
          </div>
        )}

        <VetProfileDetails profile={profile} />

        <VetProfileForm
          values={form}
          onChange={updateField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onUseGps={handleUseGps}
          locating={locating}
          saving={saving}
        />
      </main>

      <Footer />
    </div>
  );
}
