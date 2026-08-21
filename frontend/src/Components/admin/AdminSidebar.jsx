import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function AdminSidebar() {
  const { t } = useTranslation();

  // Only features backed by a real AdminController endpoint are listed here.
  const NAV_ITEMS = [
    { to: "/admin", label: t("admin.sidebar.dashboard"), icon: "dashboard", end: true },
    {
      to: "/admin/vet-approvals",
      label: t("admin.sidebar.vetApprovals"),
      icon: "medical_information",
    },
    { to: "/admin/users", label: t("admin.sidebar.userManagement"), icon: "group" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBXDtsQLom3t7hNvPlq89h_VatD8qWwqMzLuIVlWxpmW0U3UvNTQcLUhgfkYmLuA7PAcaEinn8S1CeVxb4WcbPY0w27oZPg-6DsuVsmnCsV99vFwHwMkuqxNiAJ0J5MP4ccsGLvgy6Z221XTvmMUQ3yiArdLSXEaG4KW3o0qLEBhkL9UyJmK8ceuaKHHMSYq-irlLDz1Xt1nFb3Ag_uAwAblY3fwAyIUsZqNPSuauDHTz1kOqolieE3Y8h31JkjYkOAMOr55EQTCuU"
          alt={t("admin.sidebar.logoAlt")}
        />
      </div>
      <nav className="admin-sidebar__nav" aria-label={t("admin.sidebar.navLabel")}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={item.label}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? " admin-sidebar__link--active" : ""}`
            }
          >
            <Icon name={item.icon} />
            <span className="admin-sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
