import { notifySessionExpired } from "../utils/sessionEvents.js";
import { clearAuthStorage, getStoredToken } from "../utils/authStorage.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5248/api";

/**
 * أصل خادم الـ API بلا لاحقة `/api`.
 *
 * الملفات المرفوعة (شهادات الأطباء، الصور) تُخدَّم من `wwwroot` على جذر
 * الخادم — `/uploads/...` — لا من تحت `/api`، فبناء رابطها من API_BASE_URL
 * مباشرةً يُنتج `/api/uploads/...` وينتهي بـ 404.
 */
export const FILE_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "").replace(/\/+$/, "");

function getToken() {
  return getStoredToken();
}

export function hasAuthToken() {
  return Boolean(getToken());
}

/**
 * يحوّل مسار ملف قادماً من الـ backend إلى رابط صالح للفتح في المتصفح.
 *
 * يتعامل مع: الرابط المطلق (يُعاد كما هو)، المسار النسبي (`/uploads/…` أو
 * `uploads/…` فيُسبَق بأصل الخادم)، والقيم الفارغة/العدمية (تُرجع null).
 * `data:` و `blob:` مرفوضان: لا يُرجعهما هذا الـ backend، وقبولهما يفتح
 * باب حقن روابط من بيانات الخادم.
 */
export function resolveBackendAssetUrl(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // أي مخطط آخر (javascript:, data:, blob: …) ليس مساراً لملف على الخادم.
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;

  return `${FILE_ORIGIN}/${trimmed.replace(/^\/+/, "")}`;
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
      clearAuthStorage();
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
    // 403 ليس انتهاء جلسة: المستخدم مُصادَق عليه لكن دوره لا يملك الصلاحية،
    // فلا تُمسح جلسته. العَلَم يسمح للواجهة بالتفريق بينه وبين باقي الأخطاء.
    if (response.status === 403) error.forbidden = true;
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
  if (status === 405) return "هذه العملية غير مدعومة على هذا المسار.";
  if (status === 409) return "تعارض مع الحالة الحالية للمورد.";
  if (status === 500) return "حدث خطأ في الخادم، حاول لاحقاً.";
  return "فشل الطلب";
}
