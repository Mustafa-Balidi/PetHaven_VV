import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../Icon.jsx";
import { logoutUser } from "../../../api/authApi.js";
import "../../../Styling/VetDashboard.css";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c";
/* Legacy placeholder avatar intentionally not used.
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVf5-FuadOrH8dn03uJxt8n3dpli9imW8s7QxXJ6Je0FQXbneDz868-6PJCOqEFD5mW9sptE5yulr3imwW4PIAimU-jiRb1YozdgIBRV6moBPZHCSPMglxo0mQzf2Mn8RjgZrbc87TnphWZTGdsnlUx_1QLsXmRDM0Lvs7qXcurQgEQGe9owNEamfugtaymWPS61LpwUdEN49IellG5MjDQv1ccPiVZJmntEb1rjNhwXFmIVg9BHQjE1pAlIUqfP8lbdVFfbJVup5l";

*/
const NAV_ITEMS = [
  { key: "dashboard", to: "/vet/dashboard" },
  { key: "patients", to: "/vet/patients" },
  { key: "appointments", to: "/vet/appointments" },
  { key: "reviews", to: "/vet/reviews" },
];

export default function VetHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  function handleLogout(e) {
    e.preventDefault();
    setDropdownOpen(false);
    logoutUser();
    navigate("/", { replace: true });
  }

  return (
    <header className="vet-dashboard-header">
      <div className="vet-dashboard-header__inner">
        <Link to="/vet/dashboard" className="vet-dashboard-header__logo-link">
          <img src={LOGO} alt={t("vetDashboard.header.logoAlt")} className="vet-dashboard-header__logo-img" />
        </Link>

        <nav className="vet-dashboard-header__nav">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  `vet-dashboard-header__nav-link${isActive ? " vet-dashboard-header__nav-link--active" : ""}`
                }
              >
                {t(`vetDashboard.header.nav.${item.key}`)}
              </NavLink>
            ) : (
              <span
                key={item.key}
                className="vet-dashboard-header__nav-link vet-dashboard-header__nav-link--disabled"
                title={t("vetDashboard.comingSoon")}
              >
                {t(`vetDashboard.header.nav.${item.key}`)}
              </span>
            )
          )}
        </nav>

        <div className="vet-dashboard-header__actions">
          <div style={{ position: "relative" }} ref={langRef}>
            <button
              aria-label={t("vetDashboard.header.language")}
              className="vet-dashboard-header__icon-btn"
              onClick={() => setLangOpen((o) => !o)}
            >
              <Icon name="language" />
            </button>

            {langOpen && (
              <div className="vet-dashboard-header__dropdown">
                <button className="vet-dashboard-header__dropdown-item" onClick={() => changeLanguage("en")}>
                  {i18n.language === "en" ? "✓ " : ""}English
                </button>
                <button className="vet-dashboard-header__dropdown-item" onClick={() => changeLanguage("ar")}>
                  {i18n.language === "ar" ? "✓ " : ""}العربية
                </button>
              </div>
            )}
          </div>

          <div className="vet-dashboard-header__avatar-wrap" ref={dropdownRef}>
            <button
              aria-label={t("vetDashboard.header.userMenu")}
              onClick={() => setDropdownOpen((o) => !o)}
              className="vet-dashboard-header__avatar-btn"
            >
              <Icon name="account_circle" className="vet-dashboard-header__avatar-icon" />
            </button>

            {dropdownOpen && (
              <div className="vet-dashboard-header__dropdown">
                <Link
                  to="/vet/profile"
                  className="vet-dashboard-header__dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Icon name="person" className="vet-dashboard-header__dropdown-icon" /> {t("vetDashboard.header.profile")}
                </Link>
                <Link to="/" className="vet-dashboard-header__dropdown-item" onClick={handleLogout}>
                  <Icon name="logout" className="vet-dashboard-header__dropdown-icon" /> {t("vetDashboard.header.logout")}
                </Link>
              </div>
            )}
          </div>

          <button
            className="vet-dashboard-header__hamburger"
            aria-label={mobileOpen ? t("vetDashboard.header.closeMenu") : t("vetDashboard.header.openMenu")}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="vet-dashboard-header__mobile-panel">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="vet-dashboard-header__mobile-link"
              >
                {t(`vetDashboard.header.nav.${item.key}`)}
              </NavLink>
            ) : (
              <span
                key={item.key}
                className="vet-dashboard-header__mobile-link vet-dashboard-header__mobile-link--disabled"
              >
                {t(`vetDashboard.header.nav.${item.key}`)}
              </span>
            )
          )}
        </div>
      )}
    </header>
  );
}
