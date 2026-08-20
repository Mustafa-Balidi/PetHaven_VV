import { notifySessionExpired } from "../utils/sessionEvents.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5248/api";

function getToken() {
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("accessToken")
  );
}

export function hasAuthToken() {
  return Boolean(getToken());
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = parseJson(text);

  if (response.status === 401) {
    if (token) {
      // تنظيف التوكنات
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // إشعار المستخدم عبر التوست بدلاً من التوجيه القسري
      notifySessionExpired();
    }
    const message =
      payload?.message ||
      payload?.Message ||
      "انتهت جلستك، الرجاء تسجيل الدخول مرة أخرى.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.Message ||
      text ||
      getDefaultErrorMessage(response.status);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload?.data ?? payload?.Data ?? payload;
}

function parseJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function getDefaultErrorMessage(status) {
  if (status === 401) return "الرجاء تسجيل الدخول أولاً.";
  if (status === 403) return "ليس لديك صلاحية للقيام بهذا الإجراء.";
  if (status === 404) return "المورد المطلوب غير موجود.";
  if (status === 500) return "حدث خطأ في الخادم، حاول لاحقاً.";
  return "فشل الطلب";
}
