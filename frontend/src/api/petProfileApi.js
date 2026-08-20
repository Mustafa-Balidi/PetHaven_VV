import { apiRequest } from "./apiClient.js";

export async function getPetById(petId) {
  const pet = await apiRequest(`/Pets/${petId}`);
  if (!pet || typeof pet !== "object") {
    throw new Error("The pet details response was empty.");
  }
  return pet;
}
