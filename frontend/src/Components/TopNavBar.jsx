import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "./Icon.jsx";
import { getCurrentUser, isAuthenticated, logoutUser } from "../api/authApi.js";
import "../Styling/TopNavBar.css";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c";
const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVf5-FuadOrH8dn03uJxt8n3dpli9imW8s7QxXJ6Je0FQXbneDz868-6PJCOqEFD5mW9sptE5yulr3imwW4PIAimU-jiRb1YozdgIBRV6moBPZHCSPMglxo0mQzf2Mn8RjgZrbc87TnphWZTGdsnlUx_1QLsXmRDM0Lvs7qXcurQgEQGe9owNEamfugtaymWPS61LpwUdEN49IellG5MjDQv1ccPiVZJmntEb1rjNhwXFmIVg9BHQjE1pAlIUqfP8lbdVFfbJVup5l";
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
        setDropdownOpen(false);
        setLangOpen(false);
        setMobileOpen(false);
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
              >
                {t(`adopter.header.nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="adopter-header__actions">
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
                aria-haspopup="menu"
                aria-expanded={langOpen}
                className="adopter-header__lang-btn"
                onClick={toggleLanguageMenu}
              >
                <Icon name="language" />
              </button>

              {langOpen && (
                <div className="adopter-header__dropdown" role="menu">
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={() => changeLanguage("en")}
                    role="menuitem"
                  >
                    {i18n.language?.startsWith("en") ? "✓ " : ""}
                    English
                  </button>
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={() => changeLanguage("ar")}
                    role="menuitem"
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
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="adopter-header__avatar-btn"
                onClick={toggleUserMenu}
              >
                <img
                  src={AVATAR}
                  alt={t("adopter.header.avatarAlt", {
                    name:
                      user?.fullName ||
                      user?.userName ||
                      t("adopter.header.defaultUser"),
                  })}
                  className="adopter-header__avatar-img"
                />
              </button>

              {dropdownOpen && (
                <div className="adopter-header__dropdown" role="menu">
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={openProfile}
                    role="menuitem"
                  >
                    <Icon name="person" className="adopter-header__dropdown-icon" />
                    {t("adopter.header.profile")}
                  </button>
                  <button
                    type="button"
                    className="adopter-header__dropdown-item"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <Icon name="logout" className="adopter-header__dropdown-icon" />
                    {t("adopter.header.logout")}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="adopter-header__hamburger"
              aria-label={
                mobileOpen ? t("adopter.header.closeMenu") : t("adopter.header.openMenu")
              }
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="adopter-header__mobile-panel" aria-label={t("adopter.header.navigation")}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`adopter-header__mobile-link${
                  isLinkActive(item) ? " adopter-header__mobile-link--active" : ""
                }`}
              >
                {t(`adopter.header.nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>
        )}
    </header>
  );
}
