// src/utils/sessionEvents.js
// نظام عام لإطلاق حدث "انتهت الجلسة" من أي مكان بالتطبيق
// apiClient.js بيطلق الحدث، وأي مكوّن (زي App.jsx) فيه يسمعله ويعرض توستة + يفتح شاشة تسجيل الدخول

export const SESSION_EXPIRED_EVENT = "session-expired";

export function notifySessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}

export function onSessionExpired(callback) {
  window.addEventListener(SESSION_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, callback);
}