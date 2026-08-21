import { apiRequest } from "./apiClient";

/**
 * Admin API — bound 1:1 to the endpoints exposed by backend AdminController.
 * Available endpoints (READ ONLY contract, do not extend without backend support):
 *   GET    /api/Admin/stats
 *   GET    /api/Admin/vets/pending
 *   PUT    /api/Admin/vets/{id}/verify
 *   DELETE /api/Admin/vets/{id}/reject
 *   PUT    /api/Admin/users/{id}/ban      body: { reason }
 *   PUT    /api/Admin/users/{id}/unban
 */

function pick(source, ...keys) {
  if (!source) return undefined;
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

function toCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toText(value) {
  const text = typeof value === "string" ? value.trim() : value == null ? "" : String(value);
  return text;
}

function normalizeStats(raw) {
  return {
    totalUsers: toCount(pick(raw, "totalUsers", "TotalUsers")),
    adopters: toCount(pick(raw, "adopters", "Adopters")),
    centers: toCount(pick(raw, "centers", "Centers")),
    vets: toCount(pick(raw, "vets", "Vets")),
    admins: toCount(pick(raw, "admins", "Admins")),
    totalPets: toCount(pick(raw, "totalPets", "TotalPets")),
    bannedUsers: toCount(pick(raw, "bannedUsers", "BannedUsers")),
  };
}

function normalizePendingVet(raw) {
  const experienceYears = pick(raw, "experienceYears", "ExperienceYears");

  return {
    vetId: toCount(pick(raw, "vetId", "VetId")),
    fullName: toText(pick(raw, "fullName", "FullName")),
    email: toText(pick(raw, "email", "Email")),
    specialization: toText(pick(raw, "specialization", "Specialization")),
    clinicName: toText(pick(raw, "clinicName", "ClinicName")),
    clinicAddress: toText(pick(raw, "clinicAddress", "ClinicAddress")),
    licenseNumber: toText(pick(raw, "licenseNumber", "LicenseNumber")),
    experienceYears:
      experienceYears === undefined || experienceYears === null
        ? null
        : toCount(experienceYears),
    createdAt: pick(raw, "createdAt", "CreatedAt") ?? null,
  };
}

/** Backend action endpoints answer with { success, message } and no data envelope. */
export function extractMessage(result) {
  const message = pick(result, "message", "Message");
  return typeof message === "string" && message.trim() ? message.trim() : "";
}

// ── GET /api/Admin/stats ──────────────────────────────────────────────
export async function getAdminStats() {
  const data = await apiRequest("/Admin/stats");
  return normalizeStats(data);
}

// ── GET /api/Admin/vets/pending ───────────────────────────────────────
export async function getPendingVets() {
  const data = await apiRequest("/Admin/vets/pending");
  return Array.isArray(data) ? data.map(normalizePendingVet) : [];
}

// ── PUT /api/Admin/vets/{id}/verify ───────────────────────────────────
export async function verifyVet(vetId) {
  return apiRequest(`/Admin/vets/${vetId}/verify`, { method: "PUT" });
}

// ── DELETE /api/Admin/vets/{id}/reject (destructive: deletes account) ──
export async function rejectVet(vetId) {
  return apiRequest(`/Admin/vets/${vetId}/reject`, { method: "DELETE" });
}

// ── PUT /api/Admin/users/{id}/ban ─────────────────────────────────────
export async function banUser(userId, reason) {
  return apiRequest(`/Admin/users/${userId}/ban`, {
    method: "PUT",
    body: JSON.stringify({ reason: reason ?? "" }),
  });
}

// ── PUT /api/Admin/users/{id}/unban ───────────────────────────────────
export async function unbanUser(userId) {
  return apiRequest(`/Admin/users/${userId}/unban`, { method: "PUT" });
}
