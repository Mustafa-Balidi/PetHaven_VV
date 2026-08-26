import { useTranslation } from "react-i18next";

/**
 * First tab stop of every page: lets keyboard and screen-reader users jump
 * past the header/navigation straight to the page's <main>.
 *
 * The target element must carry `id="main-content"` and `tabIndex={-1}` so the
 * browser actually moves focus there and not just the scroll position.
 */
export default function SkipLink({ targetId = "main-content" }) {
  const { t } = useTranslation();

  return (
    <a className="skip-link sr-only-focusable" href={`#${targetId}`}>
      {t("a11y.skipToContent")}
    </a>
  );
}
