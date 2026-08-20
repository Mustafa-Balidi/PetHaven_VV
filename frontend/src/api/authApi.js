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
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}