import { apiRequest } from "./apiClient.js";

export async function submitPetReport({ adoptionRequestId, imageUrl, healthStatus, notes }) {
  const normalizedRequestId = Number(adoptionRequestId);
  if (!Number.isInteger(normalizedRequestId) || normalizedRequestId <= 0) {
    throw new Error("Invalid adoption request ID.");
  }

  return apiRequest("/PetReports/SubmitReport", {
    method: "POST",
    body: JSON.stringify({
      adoptionRequestId: normalizedRequestId,
      imageUrl: imageUrl.trim(),
      healthStatus: healthStatus.trim(),
      notes: notes.trim(),
    }),
  });
}
