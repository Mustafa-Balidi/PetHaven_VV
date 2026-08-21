import AdminSidebar from "./AdminSidebar.jsx";
import AdminNavbar from "./AdminNavbar.jsx";

export default function AdminLayout({ title, subtitle, actions, children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminNavbar />
        <main className="admin-content">
          <div className="admin-page">
            <header className="admin-page__header">
              <div className="admin-page__heading">
                <h1 className="admin-page__title">{title}</h1>
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
