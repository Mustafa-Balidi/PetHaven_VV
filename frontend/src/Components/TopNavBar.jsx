import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "./Icon.jsx";
import { getCurrentUser, isAuthenticated, logoutUser } from "../api/authApi.js";
import SkipLink from "./common/SkipLink.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import "../Styling/TopNavBar.css";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c";
const NAV_ITEMS = [
  {
    key: "dashboard",
    to: "/adopter/dashboard",
    activePaths: ["/adopter/dashboard"],
  },
  {
    key: "store",
    to: "/adopter/store",
    activePaths: [
      "/adopter/store",
      "/adopter/product",
      "/adopter/cart",
      "/adopter/checkout",
      "/adopter/order-confirmed",
      "/adopter/order-details",
    ],
  },
  {
    key: "adoption",
    to: "/adopter/adoption-hub",
    activePaths: [
      "/adopter/adoption-hub",
      "/adopter/pet-profile",
      "/adopter/application-details",
    ],
  },
  {
    key: "health",
    to: "/adopter/health",
    activePaths: ["/adopter/health"],
  },
  {
    key: "vets",
    to: "/adopter/vets",
    activePaths: ["/adopter/vets"],
  },
];

export default function TopNavBar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const loggedIn = isAuthenticated();
  const user = getCurrentUser();
  const isAdopter = loggedIn && user?.role === "Adopter";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        const activeElement = document.activeElement;
        const focusTarget = langRef.current?.contains(activeElement)
          ? langRef.current.querySelector("button")
          : dropdownRef.current?.contains(activeElement)
            ? dropdownRef.current.querySelector("button")
            : mobileButtonRef.current;
        setDropdownOpen(false);
        setLangOpen(false);
        setMobileOpen(false);
        focusTarget?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const isLinkActive = (item) =>
    item.activePaths.some((path) => location.pathname.startsWith(path));

  const toggleLanguageMenu = () => {
    setLangOpen((open) => !open);
    setDropdownOpen(false);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setLangOpen(false);
  };

  const toggleUserMenu = () => {
    if (!loggedIn || !isAdopter) {
      navigate("/", { replace: true });
      return;
    }
    setDropdownOpen((open) => !open);
    setLangOpen(false);
  };

  const openProfile = () => {
    setDropdownOpen(false);
    navigate("/adopter/profile");
  };

  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="adopter-header">
      <SkipLink />
        <div className="adopter-header__inner">
          <Link
            to="/adopter/dashboard"
            className="adopter-header__logo-link"
            aria-label={t("adopter.header.logoAlt")}
          >
            <img
              src={LOGO}
              alt={t("adopter.header.logoAlt")}
              className="adopter-header__logo-img"
            />
          </Link>

          <nav className="adopter-header__nav" aria-label={t("adopter.header.navigation")}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={`adopter-header__nav-link${
                  isLinkActive(item) ? " adopter-header__nav-link--active" : ""
                }`}
                aria-current={isLinkActive(item) ? "page" : undefined}
              >
                {t(`adopter.header.nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="adopter-header__actions">
            <ThemeToggle />
            <button
              type="button"
              aria-label={t("adopter.header.cart")}
              className="adopter-header__icon-btn"
              onClick={() => navigate("/adopter/cart")}
            >
              <Icon name="shopping_cart" />
            </button>

            <div className="adopter-header__menu-wrap" ref={langRef}>
              <button
                type="button"
                aria-label={t("adopter.header.language")}
                aria-haspopup="true"
                aria-expanded={langOpen}
                aria-controls="adopter-language-options"
                className="adopter-header__lang-btn"
                onClick={toggleLanguageMenu}
              >
                <Icon name="language" />
              </button>

              {langOpen && (
                <div id="adopter-language-options" className="adopter-header__dropdown">
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={() => changeLanguage("en")}
                  >
                    {i18n.language?.startsWith("en") ? "✓ " : ""}
                    English
                  </button>
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={() => changeLanguage("ar")}
                  >
                    {i18n.language?.startsWith("ar") ? "✓ " : ""}
                    العربية
                  </button>
                </div>
              )}
            </div>

            <div className="adopter-header__avatar-wrap" ref={dropdownRef}>
              <button
                type="button"
                aria-label={t("adopter.header.userMenu")}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-controls="adopter-user-options"
                className="adopter-header__avatar-btn user-menu-button"
                onClick={toggleUserMenu}
              >
                <Icon
                  name="account_circle"
                  className="adopter-header__avatar-icon user-menu-avatar user-menu-avatar--icon"
                />
              </button>

              {dropdownOpen && (
                <div id="adopter-user-options" className="adopter-header__dropdown">
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={openProfile}
                  >
                    <Icon name="person" className="adopter-header__dropdown-icon" />
                    {t("adopter.header.profile")}
                  </button>
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={handleLogout}
                  >
                    <Icon name="logout" className="adopter-header__dropdown-icon" />
                    {t("adopter.header.logout")}
                  </button>
                </div>
              )}
            </div>

            <button
              ref={mobileButtonRef}
              type="button"
              className="adopter-header__hamburger"
              aria-label={
                mobileOpen ? t("adopter.header.closeMenu") : t("adopter.header.openMenu")
              }
              aria-expanded={mobileOpen}
              aria-controls="adopter-mobile-navigation"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav id="adopter-mobile-navigation" className="adopter-header__mobile-panel" aria-label={t("adopter.header.navigation")}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`adopter-header__mobile-link${
                  isLinkActive(item) ? " adopter-header__mobile-link--active" : ""
                }`}
                aria-current={isLinkActive(item) ? "page" : undefined}
              >
                {t(`adopter.header.nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>
        )}
    </header>
  );
}
