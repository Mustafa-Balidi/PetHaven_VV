import { apiRequest, resolveBackendAssetUrl } from "./apiClient";

/**
 * Admin API — bound 1:1 to the endpoints exposed by backend AdminController.
 * Available endpoints (READ ONLY contract, do not extend without backend support):
 *   GET    /api/Admin/stats
 *   GET    /api/Admin/vets/pending
 *   PUT    /api/Admin/vets/{id}/verify
 *   PUT    /api/Admin/vets/{id}/reject   body: { reason }
 *   PUT    /api/Admin/users/{id}/ban     body: { reason }
 *   PUT    /api/Admin/users/{id}/unban
 *
 * AdminController exposes no user-listing endpoint, so there is deliberately no
 * getUsers() here: ban/unban target a numeric UserId typed by the admin.
 *
 * VetPendingDto carries no CertificateUrl, so the certificate is read through
 * the public GET /api/Vet/{vetId} endpoint instead — see getVetCertificate().
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

/** Every counter AdminStatsDto is contracted to return. */
const STATS_FIELDS = [
  ["totalUsers", "TotalUsers"],
  ["adopters", "Adopters"],
  ["centers", "Centers"],
  ["vets", "Vets"],
  ["admins", "Admins"],
  ["totalPets", "TotalPets"],
  ["bannedUsers", "BannedUsers"],
];

/**
 * Reads one counter, refusing to invent a number.
 *
 * `toCount` turns anything unparsable into 0, which is indistinguishable from
 * a genuine zero — a platform with a broken stats contract would render as a
 * platform with no users at all. A real 0 stays valid; only missing, non-finite
 * or non-integer values are rejected.
 */
function toRequiredCount(raw, camelKey, pascalKey) {
  const value = pick(raw, camelKey, pascalKey);
  if (value === undefined) {
    throw new Error(`تعذر قراءة إحصاءات المدير: الحقل "${camelKey}" غير موجود في رد الخادم.`);
  }

  const parsed = Number(value);
  if (typeof value === "boolean" || !Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    throw new Error(`تعذر قراءة إحصاءات المدير: الحقل "${camelKey}" ليس عدداً صحيحاً.`);
  }

  return parsed;
}

function toText(value) {
  const text = typeof value === "string" ? value.trim() : value == null ? "" : String(value);
  return text;
}

function normalizeStats(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("تعذر قراءة إحصاءات المدير: صيغة الرد من الخادم غير متوقعة.");
  }

  return Object.fromEntries(
    STATS_FIELDS.map(([camelKey, pascalKey]) => [
      camelKey,
      toRequiredCount(raw, camelKey, pascalKey),
    ])
  );
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

  // A shape that is not an array is a broken contract, not an empty queue.
  // Coercing it to [] would render "no pending vets" over a real failure.
  if (!Array.isArray(data)) {
    throw new Error("تعذر قراءة قائمة الأطباء: صيغة الرد من الخادم غير متوقعة.");
  }

  return data.map(normalizePendingVet);
}

// ── PUT /api/Admin/vets/{id}/verify ───────────────────────────────────
// `vetId` is Vet.VetId (the Vet primary key), not User.UserId:
// AdminService.VerifyVetAsync resolves it with _context.Vets.FindAsync(vetId).
export async function verifyVet(vetId) {
  return apiRequest(`/Admin/vets/${vetId}/verify`, { method: "PUT" });
}

// ── PUT /api/Admin/vets/{id}/reject ───────────────────────────────────
// Marks the verification request as rejected (VerificationStatus = "Rejected");
// it does NOT delete the vet or the user account.
//
// The body is mandatory even when the reason is blank: RejectVetDto is a
// non-nullable reference parameter behind [ApiController], so a PUT with no
// body is rejected with 400 before the controller runs. The backend supplies
// its own default text when `reason` is empty.
export async function rejectVet(vetId, reason) {
  return apiRequest(`/Admin/vets/${vetId}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason: typeof reason === "string" ? reason.trim() : "" }),
  });
}

// ── PUT /api/Admin/users/{id}/ban ─────────────────────────────────────
// `userId` is User.UserId — a different key space from VetId above.
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

// ── GET /api/Vet/{vetId} ──────────────────────────────────────────────
/**
 * Reads one vet's public record to recover the certificate the approvals queue
 * cannot show: VetPendingDto has no CertificateUrl, while VetResponseDto does.
 *
 * Returns `{ url }` where `url` is an openable absolute URL, or null when the
 * vet uploaded no certificate. Uploaded files are served from the server root
 * (`/uploads/...`), not from under `/api`, so the path is resolved against the
 * API origin rather than against API_BASE_URL.
 */
export async function getVetCertificate(vetId) {
  const data = await apiRequest(`/Vet/${vetId}`);

  if (!data || typeof data !== "object") {
    throw new Error("تعذر قراءة بيانات الطبيب: صيغة الرد من الخادم غير متوقعة.");
  }

  return { url: resolveBackendAssetUrl(pick(data, "certificateUrl", "CertificateUrl")) };
}
