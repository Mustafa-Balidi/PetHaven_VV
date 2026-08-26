import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../Icon.jsx";
import { logoutUser } from "../../../api/authApi.js";
import SkipLink from "../SkipLink.jsx";
import ThemeToggle from "../../ThemeToggle.jsx";
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
  const langButtonRef = useRef(null);
  const avatarButtonRef = useRef(null);

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

  // Clicking outside was the only way to dismiss the pop-ups; a keyboard user
  // who opened one had no way back. Escape closes and returns focus to the
  // control that opened it.
  useEffect(() => {
    if (!langOpen && !dropdownOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (langOpen) {
        setLangOpen(false);
        langButtonRef.current?.focus();
      }
      if (dropdownOpen) {
        setDropdownOpen(false);
        avatarButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [langOpen, dropdownOpen]);

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
      <SkipLink />
      <div className="vet-dashboard-header__inner">
        <Link to="/vet/dashboard" className="vet-dashboard-header__logo-link">
          <img src={LOGO} alt={t("vetDashboard.header.logoAlt")} className="vet-dashboard-header__logo-img" />
        </Link>

        <nav className="vet-dashboard-header__nav" aria-label={t("vetDashboard.header.navigation")}>
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
          <ThemeToggle />
          <div style={{ position: "relative" }} ref={langRef}>
            <button
              type="button"
              ref={langButtonRef}
              aria-label={t("vetDashboard.header.language")}
              aria-expanded={langOpen}
              aria-controls="vet-header-language-menu"
              className="vet-dashboard-header__icon-btn"
              onClick={() => setLangOpen((o) => !o)}
            >
              <Icon name="language" />
            </button>

            {langOpen && (
              <div className="vet-dashboard-header__dropdown" id="vet-header-language-menu">
                {/* aria-current marks the active language: the leading tick is
                    the only visual cue and it is not spoken. */}
                <button
                  type="button"
                  className="vet-dashboard-header__dropdown-item"
                  lang="en"
                  aria-current={i18n.language === "en" ? "true" : undefined}
                  onClick={() => changeLanguage("en")}
                >
                  {i18n.language === "en" ? "✓ " : ""}English
                </button>
                <button
                  type="button"
                  className="vet-dashboard-header__dropdown-item"
                  lang="ar"
                  aria-current={i18n.language === "ar" ? "true" : undefined}
                  onClick={() => changeLanguage("ar")}
                >
                  {i18n.language === "ar" ? "✓ " : ""}العربية
                </button>
              </div>
            )}
          </div>

          <div className="vet-dashboard-header__avatar-wrap" ref={dropdownRef}>
            <button
              type="button"
              ref={avatarButtonRef}
              aria-label={t("vetDashboard.header.userMenu")}
              aria-expanded={dropdownOpen}
              aria-controls="vet-header-user-menu"
              onClick={() => setDropdownOpen((o) => !o)}
              className="vet-dashboard-header__avatar-btn user-menu-button"
            >
              <Icon name="account_circle" className="vet-dashboard-header__avatar-icon user-menu-avatar user-menu-avatar--icon" />
            </button>

            {dropdownOpen && (
              <div className="vet-dashboard-header__dropdown" id="vet-header-user-menu">
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
            type="button"
            className="vet-dashboard-header__hamburger"
            aria-label={mobileOpen ? t("vetDashboard.header.closeMenu") : t("vetDashboard.header.openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="vet-header-mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="vet-header-mobile-nav"
          className="vet-dashboard-header__mobile-panel"
          aria-label={t("vetDashboard.header.navigation")}
        >
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
        </nav>
      )}
    </header>
  );
}
