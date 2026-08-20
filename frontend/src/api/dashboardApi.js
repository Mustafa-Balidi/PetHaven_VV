import { apiRequest } from "./apiClient";

export async function fetchAdopterDashboard() {
  const result = await apiRequest("/AdopterDashboard/adopter");

  return {
    pendingAdoptionsCount: Number(result.pendingAdoptionsCount) || 0,
    adoptedPetsCount: Number(result.adoptedPetsCount) || 0,
    recentOrdersCount: Number(result.recentOrdersCount) || 0,
    daysSinceLastAdoption:
      result.daysSinceLastAdoption == null
        ? null
        : Number(result.daysSinceLastAdoption),
    lastAdoptedPetName: result.lastAdoptedPetName ?? null,
  };
}
