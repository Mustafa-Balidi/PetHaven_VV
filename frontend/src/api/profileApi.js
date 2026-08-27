import { apiRequest } from "./apiClient";

export async function fetchMyProfile() {
  return apiRequest("/Profile/me");
}

export async function fetchAdopterBalance() {
  const profile = await fetchMyProfile();
  const balance = Number(profile.balance ?? 0);

  return Number.isFinite(balance) ? balance : 0;
}

export async function updateVetProfile({
  fullName,
  email,
  phoneNumber,
  clinicName,
  clinicAddress,
  specialization,
  experienceYears,
  licenseNumber,
  locationLat,
  locationLng,
  certificateFile,
}) {
  const formData = new FormData();
  const fields = {
    FullName: fullName,
    Email: email,
    PhoneNumber: phoneNumber,
    ClinicName: clinicName,
    ClinicAddress: clinicAddress,
    Specialization: specialization,
    ExperienceYears: experienceYears,
    LicenseNumber: licenseNumber,
    Location_Lat: locationLat,
    Location_Lng: locationLng,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value != null) formData.append(key, String(value));
  });
  if (certificateFile) formData.append("CertificateFile", certificateFile);

  return apiRequest("/Profile/update/vet", {
    method: "PUT",
    body: formData,
  });
}

export async function updateAdopterProfile({
  fullName,
  phoneNumber,
  address,
  housingType,
  experienceLevel,
  freeHoursPerDay,
}) {
  return apiRequest("/Profile/update/adopter", {
    method: "PUT",
    body: JSON.stringify({
      fullName,
      phoneNumber,
      address,
      housingType,
      experienceLevel,
      freeHoursPerDay,
    }),
  });
}
