import { apiRequest } from "./apiClient.js";
import { mapAppointment } from "../utils/appointmentMapping.js";

export async function getVetDashboardStats() {
  const stats = await apiRequest("/VetDashboard/stats");
  return {
    totalPatients: Number(stats.totalPatients ?? stats.TotalPatients) || 0,
    appointmentsToday: Number(stats.appointmentsToday ?? stats.AppointmentsToday) || 0,
    remainingAppointmentsToday:
      Number(stats.remainingAppointmentsToday ?? stats.RemainingAppointmentsToday) || 0,
    reviews: Number(stats.reviews ?? stats.Reviews) || 0,
    revenueThisMonth: Number(stats.revenueThisMonth ?? stats.RevenueThisMonth) || 0,
  };
}

export async function getClinicActivity(period = "weekly") {
  const points = await apiRequest(`/VetDashboard/clinic-activity?period=${encodeURIComponent(period)}`);
  return points.map((point) => ({
    label: point.label ?? point.Label ?? "",
    count: Number(point.count ?? point.Count) || 0,
  }));
}

export async function getAppointmentBreakdown() {
  const items = await apiRequest("/VetDashboard/appointment-breakdown");
  return items.map((item) => ({
    category: item.category ?? item.Category ?? "",
    count: Number(item.count ?? item.Count) || 0,
    percentage: Number(item.percentage ?? item.Percentage) || 0,
  }));
}

export async function getTopBreeds(limit = 5) {
  const items = await apiRequest(`/VetDashboard/top-breeds?limit=${encodeURIComponent(limit)}`);
  return items.map((item) => ({
    breed: item.breed ?? item.Breed ?? "",
    count: Number(item.count ?? item.Count) || 0,
    percentage: Number(item.percentage ?? item.Percentage) || 0,
  }));
}

export async function getRecentPatients({ count = 10, search = "" } = {}) {
  const params = new URLSearchParams();
  params.set("count", String(count));
  if (search) params.set("search", search);
  const items = await apiRequest(`/VetDashboard/recent-patients?${params.toString()}`);
  return items.map(mapRecentPatient);
}

export async function getTodaySchedule() {
  const items = await apiRequest("/VetDashboard/today-schedule");
  return items.map(mapAppointment);
}

function mapRecentPatient(patient) {
  return {
    petId: patient.petId ?? patient.PetId,
    petName: patient.petName ?? patient.PetName ?? "",
    species: patient.species ?? patient.Species ?? "",
    breed: patient.breed ?? patient.Breed ?? "",
    imageUrl: patient.imageUrl ?? patient.ImageUrl ?? null,
    lastVisitDate: patient.lastVisitDate ?? patient.LastVisitDate ?? null,
    visitCount: Number(patient.visitCount ?? patient.VisitCount) || 0,
  };
}
