const RAG_BASE_URL =
  import.meta.env.VITE_RAG_BASE_URL ?? "http://127.0.0.1:8000";
export async function askHealthAssistant({
  question,
  animal = null,
  conversationId = null,
  language = "en",
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
      language,
    }),
  });

  if (!response.ok) {
    let message = "Health Assistant service is unavailable.";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  return response.json();
}