import { apiRequest } from "./apiClient.js";

export async function getPatientsStats() {
  const stats = await apiRequest("/VetPatients/stats");
  return {
    totalPatients: Number(stats.totalPatients ?? stats.TotalPatients) || 0,
    activeCases: Number(stats.activeCases ?? stats.ActiveCases) || 0,
    recentlyAdded30d: Number(stats.recentlyAdded30d ?? stats.RecentlyAdded30d) || 0,
  };
}

export async function getPatients({ search = "", species = "", status = "", page = 1, pageSize = 12 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (species) params.set("species", species);
  if (status) params.set("status", status);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const result = await apiRequest(`/VetPatients?${params.toString()}`);
  return {
    totalCount: Number(result.totalCount ?? result.TotalCount) || 0,
    page: Number(result.page ?? result.Page) || page,
    pageSize: Number(result.pageSize ?? result.PageSize) || pageSize,
    items: (result.items ?? result.Items ?? []).map(mapPatient),
  };
}

export async function getPatientDetail(petId) {
  const detail = await apiRequest(`/VetPatients/${petId}`);
  return mapPatientDetail(detail);
}

function mapPatient(patient) {
  return {
    petId: patient.petId ?? patient.PetId,
    petName: patient.petName ?? patient.PetName ?? "",
    species: patient.species ?? patient.Species ?? "",
    breed: patient.breed ?? patient.Breed ?? "",
    age: patient.age ?? patient.Age ?? null,
    gender: patient.gender ?? patient.Gender ?? "",
    imageUrl: patient.imageUrl ?? patient.ImageUrl ?? null,
    healthStatus: patient.healthStatus ?? patient.HealthStatus ?? "",
    status: patient.status ?? patient.Status ?? "Healthy",
    ownerName: patient.ownerName ?? patient.OwnerName ?? "",
    patientIdDisplay: patient.patientIdDisplay ?? patient.PatientIdDisplay ?? null,
    lastVisitDate: patient.lastVisitDate ?? patient.LastVisitDate ?? null,
    visitCount: Number(patient.visitCount ?? patient.VisitCount) || 0,
  };
}

function mapPatientDetail(detail) {
  return {
    ...mapPatient(detail),
    medicalHistory: (detail.medicalHistory ?? detail.MedicalHistory ?? []).map(mapMedicalEntry),
  };
}

function mapMedicalEntry(entry) {
  return {
    id: entry.id ?? entry.Id,
    date: entry.date ?? entry.Date ?? null,
    type: entry.type ?? entry.Type ?? "",
    title: entry.title ?? entry.Title ?? "",
    description: entry.description ?? entry.Description ?? "",
    doctorName: entry.doctorName ?? entry.DoctorName ?? "",
  };
}
