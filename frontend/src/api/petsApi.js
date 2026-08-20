import { apiRequest } from "./apiClient";

export async function fetchAdoptedPets() {
  const data = await apiRequest("/AdopterDashboard/adopted-pets");

  const list = Array.isArray(data) ? data : [];

  return list.map((pet) => {
    const healthStatus = String(pet.healthStatus ?? "").toLowerCase();
    const isHealthy = ["healthy", "good", "excellent"].includes(healthStatus);

    return {
      id: pet.petId,
      name: pet.name,
      breed: pet.breed,
      species: pet.species,
      age: pet.age,
      gender: pet.gender,
      description: pet.description,
      image: pet.imageUrl,
      centerName: pet.centerName,
      status: isHealthy ? "healthy" : "warning",
      statusLabel: pet.healthStatus ?? null,
    };
  });
}
