import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  isSessionExpired,
} from "../utils/authStorage.js";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5248/api";

async function handleAuthResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('الرد من السيرفر مش بصيغة صحيحة');
  }

  // دعم الحالتين: response.ok أو data.success
  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || 'صار في خطأ، حاول مرة ثانية');
  }

  // مرونة: بعض الـ backends ترجع { data: {...} } والبعض ترجع مباشرة
  const payload = data?.data ?? data;
  const { token, refreshToken, expiresAt, user } = payload;

  if (!token) {
    throw new Error('لم يتم استلام التوكن من السيرفر');
  }
  if (!user || typeof user !== "object" || typeof user.role !== "string") {
    clearAuthSession();
    throw new Error("بيانات المستخدم المستلمة من الخادم غير مكتملة");
  }

  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('expiresAt', expiresAt);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
}

export async function registerUser({ fullName, userName, phoneNumber, email, password, role }) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, userName, phoneNumber, email, password, role }),
    });
  } catch {
    throw new Error('ما قدرنا نوصل للسيرفر');
  }
  return handleAuthResponse(response);
}

export async function loginUser({ email, password }) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('ما قدرنا نوصل للسيرفر');
  }
  return handleAuthResponse(response);
}

export function logoutUser() {
  clearAuthSession();
}

/**
 * يمسح الجلسة كاملة. القائمة نفسها يستخدمها apiClient عند 401، فلا يبقى
 * توكن يقرأه أحدهما بعد أن يمسحه الآخر. تفضيلات الثيم (`pethaven-theme`)
 * واللغة (`i18nextLng`) خارج القائمة فتبقى بعد الخروج.
 */
export function clearAuthSession() {
  clearAuthStorage();
}

export function getCurrentUser() {
  return getStoredUser();
}

export function isAuthenticated() {
  if (!getStoredToken()) return false;

  // جلسة منتهية: هذا التوكن لن يجلب سوى 401 عند أول نداء، فيُمسح هنا قبل
  // تصيير أي صفحة محمية — بدل وميض واجهة صالحة يعقبه خطأ.
  if (isSessionExpired()) {
    clearAuthSession();
    return false;
  }

  return true;
}
