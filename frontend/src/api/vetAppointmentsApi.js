import { apiRequest } from "./apiClient.js";
import { mapAppointment } from "../utils/appointmentMapping.js";

export function toDateParam(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getVetSchedule(date) {
  const query = date ? `?date=${encodeURIComponent(toDateParam(date))}` : "";
  const items = await apiRequest(`/Appointments/schedule${query}`);
  return items.map(mapAppointment);
}

export async function getVetSummary(date) {
  const query = date ? `?date=${encodeURIComponent(toDateParam(date))}` : "";
  const summary = await apiRequest(`/Appointments/summary${query}`);
  return {
    totalToday: Number(summary.totalToday ?? summary.TotalToday) || 0,
    confirmedCount: Number(summary.confirmedCount ?? summary.ConfirmedCount) || 0,
    pendingCount: Number(summary.pendingCount ?? summary.PendingCount) || 0,
    cancelledCount: Number(summary.cancelledCount ?? summary.CancelledCount) || 0,
    completedCount: Number(summary.completedCount ?? summary.CompletedCount) || 0,
  };
}

export async function updateAppointmentStatus(appointmentId, status) {
  return apiRequest(`/Appointments/update-status/${appointmentId}?status=${encodeURIComponent(status)}`, {
    method: "PUT",
  });
}

export async function rescheduleAppointment(appointmentId, newDate) {
  return apiRequest(`/Appointments/reschedule/${appointmentId}`, {
    method: "PUT",
    body: JSON.stringify({ newDate }),
  });
}
