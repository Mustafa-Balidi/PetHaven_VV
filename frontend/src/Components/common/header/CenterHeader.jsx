import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../../Icon.jsx";
import { useCenterContext } from "../../../context/centerContextBase.js";
import { logoutUser } from "../../../api/authApi.js";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c";

export default function CenterHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { fetchProfile } = useCenterContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const NAV_ITEMS = [
    { label: t("center.header.nav.dashboard"), to: "/center/dashboard" },
    { label: t("center.header.nav.adoptions"), to: "/center/adoptions" },
    { label: t("center.header.nav.inventory"), to: "/center/inventory" },
    { label: t("center.header.nav.vaccinations"), to: "/center/vaccinations" },
    { label: t("center.header.nav.reviews"), to: "/center/reviews" },
  ];

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

  const handleDropdownItemClick = () => {
    setDropdownOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setDropdownOpen(false);
    logoutUser();
    navigate("/", { replace: true });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  return (
    <header className="center-header">
      <div className="center-header__inner">
        <Link to="/center/profile" className="center-header__logo-link">
          <img src={LOGO} alt={t("center.header.logoAlt")} className="center-header__logo-img" />
        </Link>

        <div className="center-header__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `center-header__nav-link${isActive ? " center-header__nav-link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="center-header__actions">
          <div style={{ position: "relative" }} ref={langRef}>
            <button
              aria-label={t("center.header.language")}
              className="center-header__lang-btn"
              onClick={() => setLangOpen((o) => !o)}
            >
              <Icon name="language" />
            </button>

            {langOpen && (
              <div className="center-header__dropdown">
                <button className="center-header__dropdown-item" onClick={() => changeLanguage("en")}>
                  {i18n.language === "en" ? "✓ " : ""}English
                </button>
                <button className="center-header__dropdown-item" onClick={() => changeLanguage("ar")}>
                  {i18n.language === "ar" ? "✓ " : ""}العربية
                </button>
              </div>
            )}
          </div>

          <div className="center-header__avatar-wrap" ref={dropdownRef}>
            <button
              aria-label={t("center.header.userMenu")}
              onClick={() => setDropdownOpen((o) => !o)}
              className="center-header__avatar-btn"
            >
              <Icon name="account_circle" className="center-header__avatar-icon" />
            </button>

            {dropdownOpen && (
              <div className="center-header__dropdown">
                <Link
                  to="/center/profile"
                  className="center-header__dropdown-item"
                  onClick={handleDropdownItemClick}
                >
                  <Icon name="person" className="text-[18px]" /> {t("center.header.profileLink")}
                </Link>
                <Link
                  to="/"
                  className="center-header__dropdown-item"
                  onClick={handleLogout}
                >
                  <Icon name="logout" className="text-[18px]" /> {t("center.header.logout")}
                </Link>
              </div>
            )}
          </div>

          <button
            className="center-header__hamburger"
            aria-label={mobileOpen ? t("center.header.closeMenu") : t("center.header.openMenu")}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="center-header__mobile-panel">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setMobileOpen(false)}
              className="center-header__mobile-link"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
