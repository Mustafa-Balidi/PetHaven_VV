const RAG_BASE_URL =
  import.meta.env.VITE_RAG_BASE_URL ?? "http://127.0.0.1:8000";

export async function askHealthAssistant({
  question,
  animal = null,
  conversationId = null,
}) {
  const response = await fetch(`${RAG_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      animal,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    throw new Error("Health Assistant service is unavailable.");
  }

  return response.json();
}