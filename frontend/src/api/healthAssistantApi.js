const RAG_BASE_URL =
  import.meta.env.VITE_RAG_BASE_URL ?? "http://127.0.0.1:8000";

// Animals supported by the RAG knowledge base.
const SUPPORTED_ANIMALS = [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "hamster",
  "fish",
  "turtle",
];

export function normalizeAnimal(species) {
  if (typeof species !== "string") {
    return null;
  }

  const value = species.trim().toLowerCase();

  if (!value) {
    return null;
  }

  if (SUPPORTED_ANIMALS.includes(value)) {
    return value;
  }

  // Tolerate plurals and common variants ("Dogs", "Cats", "Bunny", ...).
  const variants = {
    dogs: "dog",
    puppy: "dog",
    canine: "dog",
    cats: "cat",
    kitten: "cat",
    feline: "cat",
    birds: "bird",
    parrot: "bird",
    rabbits: "rabbit",
    bunny: "rabbit",
    hamsters: "hamster",
    fishes: "fish",
    turtles: "turtle",
    tortoise: "turtle",
  };

  return variants[value] ?? null;
}

export async function askHealthAssistant({
  question,
  animal = null,
  conversationId = null,
  language = "en",
}) {
  const unavailable =
    language === "ar"
      ? "خدمة المساعد الصحي غير متاحة حالياً."
      : "Health Assistant service is currently unavailable.";

  let response;

  try {
    response = await fetch(`${RAG_BASE_URL}/ask`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
        animal,
        conversation_id: conversationId,
        language,
      }),
    });
  } catch (networkError) {
    // Network failure / CORS / server down. Never surface internals.
    console.error("Health Assistant network error:", networkError);
    throw new Error(unavailable, { cause: networkError });
  }

  if (!response.ok) {
    // Server-side detail may contain Python paths, provider errors or keys,
    // so it is logged but never shown to the user.
    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        console.error("Health Assistant API error:", errorData.detail);
      }
    } catch {
      // Ignore unparsable error bodies.
    }

    throw new Error(unavailable);
  }

  try {
    return await response.json();
  } catch (parseError) {
    console.error("Health Assistant response parse error:", parseError);
    throw new Error(unavailable, { cause: parseError });
  }
}
