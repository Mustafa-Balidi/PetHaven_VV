import { apiRequest } from "./apiClient";

export const getAvailablePets = async () => {
  const pets = await apiRequest("/Pets/AllPets");
  if (!Array.isArray(pets)) {
    throw new Error("The available pets response was not a list.");
  }
  return pets;
};

export const submitAdoptionRequest = async (payload) => {
  return apiRequest("/Adoption/SubmitRequest", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getMyAdoptionRequests = async () => {
  const requests = await apiRequest("/Adoption/MyRequests");
  if (!Array.isArray(requests)) {
    throw new Error("The adoption requests response was not a list.");
  }
  return requests;
};

export const getMyAdoptionRequest = async (requestId) => {
  const numericRequestId = Number(requestId);
  if (!Number.isInteger(numericRequestId) || numericRequestId <= 0) {
    throw new Error("Invalid adoption request ID.");
  }
  return apiRequest(`/Adoption/MyRequests/${numericRequestId}`);
};

export const getAdoptedPets = async () => {
  const pets = await apiRequest("/AdopterDashboard/adopted-pets");
  if (!Array.isArray(pets)) {
    throw new Error("The adopted pets response was not a list.");
  }
  return pets;
};

export const getCompatibilityRecommendations = async (answers) => {
  const result = await apiRequest("/Recommendations/services", {
    method: "POST",
    body: JSON.stringify(answers),
  });

  return {
    animalType: result?.animal_type ?? result?.animalType ?? "",
    recommendations: Array.isArray(result?.recommendations)
      ? result.recommendations.map((item) => ({
          breed: item.breed,
          confidence: item.confidence,
        }))
      : [],
  };
};
