import { useTranslation } from "react-i18next";

/**
 * Placeholder for a field the backend did not return.
 *
 * The em dash stays on screen; a screen reader reads it as punctuation or
 * skips it entirely, so the words go in a clipped span beside it.
 */
export default function NoValue() {
  const { t } = useTranslation();

  return (
    <>
      <span aria-hidden="true">—</span>
      <span className="sr-only">{t("a11y.noValue")}</span>
    </>
  );
}
