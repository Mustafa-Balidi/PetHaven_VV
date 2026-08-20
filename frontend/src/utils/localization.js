function normalizeLanguage(language) {
  return language?.startsWith("ar") ? "ar" : "en";
}

function enumKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function translateDisplayValue(t, namespace, value) {
  if (value === undefined || value === null || value === "") return "";

  const key = enumKey(value);
  return key ? t(`${namespace}.${key}`, { defaultValue: String(value) }) : String(value);
}

export function formatPetAge(t, value) {
  const numericAge = Number.parseFloat(value);
  return Number.isFinite(numericAge)
    ? t("adopter.common.ageYears", { count: numericAge })
    : String(value ?? "");
}

export function formatLocalizedDate(value, language, options = {}) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat(normalizeLanguage(language), options).format(date);
}

export function formatLocalizedTime(value, language) {
  if (!value) return "";

  if (value instanceof Date) {
    return new Intl.DateTimeFormat(normalizeLanguage(language), {
      hour: "numeric",
      minute: "2-digit",
    }).format(value);
  }

  const match = String(value).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return String(value);

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const modifier = match[3].toUpperCase();

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date(2000, 0, 1, hours, minutes);
  return new Intl.DateTimeFormat(normalizeLanguage(language), {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
