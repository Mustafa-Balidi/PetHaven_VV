import { useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import SkipLink from "../common/SkipLink.jsx";

export default function AdminLayout({ title, subtitle, actions, children }) {
  const { t } = useTranslation();
  const headingId = useId();

  // WCAG 2.4.2: the admin routes are a client-side SPA, so the document title
  // has to follow the rendered page or every screen announces the same name.
  useEffect(() => {
    if (!title) return undefined;

    const previousTitle = document.title;
    document.title = t("admin.common.pageTitle", { page: title });

    return () => {
      document.title = previousTitle;
    };
  }, [title, t]);

  return (
    <div className="admin-layout">
      <SkipLink />
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminNavbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="admin-content"
          aria-labelledby={headingId}
        >
          <div className="admin-page">
            <header className="admin-page__header">
              <div className="admin-page__heading">
                <h1 className="admin-page__title" id={headingId}>
                  {title}
                </h1>
                {subtitle ? <p className="admin-page__subtitle">{subtitle}</p> : null}
              </div>
              {actions ? <div className="admin-page__actions">{actions}</div> : null}
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
