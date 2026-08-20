import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import Toast from "../../Components/Toast.jsx";
import VetProfileDetails from "../../Components/vet/VetProfileDetails.jsx";
import VetProfileForm from "../../Components/vet/VetProfileForm.jsx";
import { fetchMyProfile, updateVetProfile } from "../../api/profileApi.js";
import "../../Styling/VetProfile.css";

const VET_CACHE_FIELDS = [
  "email",
  "clinicName",
  "clinicAddress",
  "specialization",
  "experienceYears",
  "licenseNumber",
  "location_Lat",
  "location_Lng",
];

function getVetProfileCache(userId) {
  if (!userId) return null;
  try {
    return JSON.parse(localStorage.getItem(`petHaven:vet-profile:${userId}`));
  } catch {
    return null;
  }
}

function mergeVetProfile(profile) {
  const cached = getVetProfileCache(profile.userId);
  if (!cached) return profile;

  const merged = { ...profile };
  VET_CACHE_FIELDS.forEach((field) => {
    if (field === "email" || merged[field] == null || merged[field] === "") {
      if (cached[field] != null) merged[field] = cached[field];
    }
  });
  return merged;
}

function cacheVetProfile(userId, values) {
  if (!userId) return;
  localStorage.setItem(
    `petHaven:vet-profile:${userId}`,
    JSON.stringify({
      email: values.email.trim(),
      clinicName: values.clinicName.trim(),
      clinicAddress: values.clinicAddress.trim(),
      specialization: values.specialization.trim(),
      experienceYears: values.experienceYears === "" ? null : Number(values.experienceYears),
      licenseNumber: values.licenseNumber.trim(),
      location_Lat: toNullableCoordinate(values.locationLat),
      location_Lng: toNullableCoordinate(values.locationLng),
    })
  );
}

function toFormValues(profile) {
  return {
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    clinicName: profile.clinicName ?? "",
    clinicAddress: profile.clinicAddress ?? "",
    specialization: profile.specialization ?? "",
    experienceYears: profile.experienceYears ?? profile.experienceLevel ?? "",
    licenseNumber: profile.licenseNumber ?? "",
    locationLat: profile.location_Lat ?? profile.Location_Lat ?? "",
    locationLng: profile.location_Lng ?? profile.Location_Lng ?? "",
  };
}

function toNullableCoordinate(value) {
  if (value === "" || value == null) return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
}

export default function VetProfile() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;
    fetchMyProfile()
      .then((data) => {
        if (!active) return;
        const mergedProfile = mergeVetProfile(data);
        setProfile(mergedProfile);
        setForm(toFormValues(mergedProfile));
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    if (profile) setForm(toFormValues(profile));
  }

  function handleUseGps() {
    if (!navigator.geolocation) {
      setToast({ message: t("vetProfile.basicInfo.gpsUnsupported"), type: "error" });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
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

          setForm((current) => ({
            ...current,
            clinicAddress: result.display_name,
            locationLat: coords.latitude,
            locationLng: coords.longitude,
          }));
          setToast({ message: t("vetProfile.basicInfo.gpsSuccess"), type: "success" });
        } catch {
          setToast({ message: t("vetProfile.basicInfo.gpsError"), type: "error" });
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
      });
      cacheVetProfile(profile.userId, form);
      const refreshed = mergeVetProfile(await fetchMyProfile());
      setProfile(refreshed);
      setForm(toFormValues(refreshed));
      setToast({ message: t("vetProfile.saveSuccess"), type: "success" });
    } catch (err) {
      setToast({ message: err.message || t("vetProfile.saveError"), type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile || !form) {
    return (
      <div className="vet-profile-page">
        <VetHeader />
        <div className="vet-profile-loading">{error || t("vetProfile.loading")}</div>
      </div>
    );
  }

  return (
    <div className="vet-profile-page">
      <VetHeader />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="vet-profile-main">
        <Link to="/vet/dashboard" className="vet-profile-back-link">
          <Icon name="arrow_back" />
          {t("vetProfile.backToDashboard")}
        </Link>

        <div className="vet-profile-heading">
          <h1 className="vet-profile-title">{t("vetProfile.title")}</h1>
          <p className="vet-profile-subtitle">{t("vetProfile.subtitle")}</p>
        </div>

        {error && (
          <div className="vet-profile-alert">
            {error}
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
