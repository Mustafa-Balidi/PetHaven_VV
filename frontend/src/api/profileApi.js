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
}) {
  return apiRequest("/Profile/update/vet", {
    method: "PUT",
    body: JSON.stringify({
      fullName,
      email,
      phoneNumber,
      clinicName,
      clinicAddress,
      specialization,
      experienceYears,
      licenseNumber,
      location_Lat: locationLat,
      location_Lng: locationLng,
    }),
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
