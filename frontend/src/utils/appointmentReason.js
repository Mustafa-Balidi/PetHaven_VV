export const REASON_CATEGORY_STYLES = {
  vaccination: { color: "#22c55e", icon: "vaccines" },
  checkup: { color: "#855300", icon: "stethoscope" },
  surgery: { color: "#4648d4", icon: "medical_services" },
  emergency: { color: "#ef4444", icon: "local_hospital" },
  other: { color: "#6d7a77", icon: "event_note" },
};

export function classifyReason(reason = "") {
  const value = reason.toLowerCase();
  if (value.includes("emergency") || reason.includes("طارئ")) return "emergency";
  if (value.includes("vaccin") || reason.includes("تطعيم")) return "vaccination";
  if (value.includes("surger") || reason.includes("جراح")) return "surgery";
  if (value.includes("check") || reason.includes("فحص")) return "checkup";
  return "other";
}
