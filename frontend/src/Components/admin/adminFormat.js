/**
 * الحد الأدنى المعقول لأي تاريخ في هذا التطبيق.
 *
 * `Vet.CreatedAt` لا يُملأ عند التسجيل، فتحفظه قاعدة البيانات كقيمة
 * `DateTime` الافتراضية `0001-01-01`. هذه القيمة تمر من `new Date()` كتاريخ
 * صالح تماماً، فتُعرض "١ يناير ١" كأنها تاريخ تسجيل حقيقي. أي سنة قبل هذا
 * الحد هي قيمة نظام افتراضية لا بيانات، فلا تُعرض.
 */
const MIN_REASONABLE_YEAR = 2000;

/**
 * Formats a backend ISO date for admin screens; returns "" when absent,
 * unparsable, or a system-default placeholder.
 *
 * لا يُستبدل التاريخ غير الصالح بتاريخ آخر — لا اليوم ولا `SubmittedAt` —
 * لأن ذلك اختلاق لبيانات لم يُرجعها الخادم. المستدعي يُخفي الحقل عند "".
 */
export function formatAdminDate(value, language = "en") {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (date.getFullYear() < MIN_REASONABLE_YEAR) return "";

  try {
    return new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
