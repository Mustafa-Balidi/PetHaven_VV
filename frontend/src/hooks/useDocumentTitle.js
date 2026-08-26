import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Names the page in the document title.
 *
 * WCAG 2.4.2: a client-side route change does not touch <title> on its own, so
 * without this every screen in the app announces the same name and a user with
 * several tabs open cannot tell them apart. The previous title is restored on
 * unmount so a page that does not set one is never left with a stale name.
 */
export default function useDocumentTitle(page) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!page) return undefined;

    const previousTitle = document.title;
    document.title = t("a11y.pageTitle", { page });

    return () => {
      document.title = previousTitle;
    };
  }, [page, t]);
}
