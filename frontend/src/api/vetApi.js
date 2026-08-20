import { apiRequest } from "./apiClient.js";

export async function searchVets({
  specialization = "",
  sortBy = "rating",
  userLatitude,
  userLongitude,
  radius,
} = {}) {
  const params = new URLSearchParams();
  if (specialization) params.set("specialization", specialization);
  if (sortBy) params.set("sortBy", sortBy);
  if (Number.isFinite(userLatitude) && Number.isFinite(userLongitude)) {
    params.set("userLatitude", String(userLatitude));
    params.set("userLongitude", String(userLongitude));
  }
  if (Number.isFinite(radius) && radius > 0) params.set("radius", String(radius));

  const vets = await apiRequest(`/Vet/search?${params.toString()}`);
  return vets.map(mapVet);
}

export async function getVet(vetId) {
  const id = toPositiveInteger(vetId, "vetId");
  return mapVet(await apiRequest(`/Vet/${id}`));
}

export async function getPetsForBooking() {
  const pets = await apiRequest("/AdopterDashboard/adopted-pets");
  return pets.map((pet) => ({
    petId: pet.petId ?? pet.PetId,
    name: pet.name ?? pet.Name,
    breed: pet.breed ?? pet.Breed,
    age: pet.age ?? pet.Age,
    gender: pet.gender ?? pet.Gender,
  }));
}

export async function bookAppointment({ petId, vetId, appointmentDate, reason }) {
  const normalizedPetId = toPositiveInteger(petId, "petId");
  const normalizedVetId = toPositiveInteger(vetId, "vetId");

  return apiRequest("/Appointments/book", {
    method: "POST",
    body: JSON.stringify({
      petId: normalizedPetId,
      vetId: normalizedVetId,
      appointmentDate,
      reason,
    }),
  });
}

export async function cancelAppointment(appointmentId) {
  const id = toPositiveInteger(appointmentId, "appointmentId");
  return apiRequest(`/Appointments/cancel/${id}`, { method: "PUT" });
}

export async function getMyAppointments() {
  const appointments = await apiRequest("/Appointments/my-appointments");
  if (!Array.isArray(appointments)) {
    throw new Error("The appointments response was not a list.");
  }
  return appointments.map(mapAppointment);
}

export async function getVetAvailability(vetId, date) {
  const id = toPositiveInteger(vetId, "vetId");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Invalid availability date.");
  }

  const params = new URLSearchParams({ vetId: String(id), date });
  const result = await apiRequest(`/Appointments/availability?${params.toString()}`);
  const slots = result?.availableSlots ?? result?.AvailableSlots;

  return {
    vetId: result?.vetId ?? result?.VetId ?? id,
    date: result?.date ?? result?.Date ?? date,
    slotDurationMinutes: Number(result?.slotDurationMinutes ?? result?.SlotDurationMinutes) || 30,
    availableSlots: Array.isArray(slots) ? slots.map(String) : [],
  };
}

export async function getAppointment(appointmentId) {
  const id = toPositiveInteger(appointmentId, "appointmentId");
  return mapAppointment(await apiRequest(`/Appointments/${id}`));
}

export async function rescheduleAppointment(appointmentId, newDate) {
  const id = toPositiveInteger(appointmentId, "appointmentId");
  return apiRequest(`/Appointments/reschedule/${id}`, {
    method: "PUT",
    body: JSON.stringify({ newDate }),
  });
}

export async function rateVet({ vetId, rating, reviewText }) {
  const normalizedVetId = toPositiveInteger(vetId, "vetId");
  const normalizedRating = Number(rating);
  if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  return apiRequest("/VetRatings", {
    method: "POST",
    body: JSON.stringify({
      vetId: normalizedVetId,
      rating: normalizedRating,
      reviewText: reviewText?.trim() || null,
    }),
  });
}

function mapVet(vet) {
  const vetId = vet.vetId ?? vet.VetId;
  const fullName = vet.fullName ?? vet.FullName ?? "";
  return {
    vetId,
    fullName,
    initials: fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
    specialization: vet.specialization ?? vet.Specialization ?? null,
    clinicName: vet.clinicName ?? vet.ClinicName ?? null,
    address: vet.clinicAddress ?? vet.ClinicAddress ?? null,
    phone: vet.phoneNumber ?? vet.PhoneNumber ?? "",
    email: vet.email ?? vet.Email ?? "",
    experienceYears: vet.experienceYears ?? vet.ExperienceYears,
    licenseNumber: vet.licenseNumber ?? vet.LicenseNumber ?? null,
    latitude: vet.location_Lat ?? vet.Location_Lat ?? null,
    longitude: vet.location_Lng ?? vet.Location_Lng ?? null,
    isVerified: vet.isVerified ?? vet.IsVerified ?? false,
    rating: toNullableNumber(vet.averageRating ?? vet.AverageRating),
    totalRatings: vet.totalRatings ?? vet.TotalRatings ?? 0,
    distance: toNullableNumber(vet.distanceInKm ?? vet.DistanceInKm),
  };
}

function mapAppointment(appointment) {
  return {
    appointmentId: appointment.appointmentId ?? appointment.AppointmentId,
    petId: appointment.petId ?? appointment.PetId,
    petName: appointment.petName ?? appointment.PetName ?? "",
    vetId: appointment.vetId ?? appointment.VetId,
    vetName: appointment.vetName ?? appointment.VetName ?? "",
    appointmentDate: appointment.appointmentDate ?? appointment.AppointmentDate,
    reason: appointment.reason ?? appointment.Reason ?? null,
    status: appointment.status ?? appointment.Status ?? null,
  };
}

function toPositiveInteger(value, fieldName) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return number;
}

function toNullableNumber(value) {
  if (value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
