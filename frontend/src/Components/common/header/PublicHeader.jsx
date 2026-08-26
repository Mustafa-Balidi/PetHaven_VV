import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../Icon.jsx";
import SkipLink from "../SkipLink.jsx";
import ThemeToggle from "../../ThemeToggle.jsx";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c";
const NAV_IDS = ["home", "adoption", "shop", "vets", "ai-checker"];

export default function PublicHeader({ onSignIn, onSignUp }) {
  const { t, i18n } = useTranslation();
  const NAV_SECTIONS = [
    { id: "home", label: t("header.nav.home") },
    { id: "adoption", label: t("header.nav.adoption") },
    { id: "shop", label: t("header.nav.shop") },
    { id: "vets", label: t("header.nav.vets") },
    { id: "ai-checker", label: t("header.nav.aiChecker") },
  ];
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
    requestAnimationFrame(() => langRef.current?.querySelector("button")?.focus());
  };
  const [activeId, setActiveId] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const mobileButtonRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    NAV_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;
      const activeElement = document.activeElement;
      const focusTarget = langRef.current?.contains(activeElement)
        ? langRef.current.querySelector("button")
        : dropdownRef.current?.contains(activeElement)
          ? dropdownRef.current.querySelector("button")
          : document.getElementById("public-mobile-navigation")
            ? mobileButtonRef.current
            : null;
      setDropdownOpen(false);
      setLangOpen(false);
      setMobileOpen(false);
      focusTarget?.focus();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector("header")?.offsetHeight || 72;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - navH,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setActiveId(id);
    setMobileOpen(false);
  };

  const handleDropdownItemClick = (action) => {
    dropdownRef.current?.querySelector("button")?.focus();
    setDropdownOpen(false);
    action();
  };

  return (
    <header className="public-header">
      <SkipLink />
      <div className="public-header__inner">
        <button type="button" onClick={() => scrollTo("home")} className="public-header__logo-link">
          <img src={LOGO} alt={t("a11y.alt.logo")} className="public-header__logo-img" />
        </button>

        <nav className="public-header__nav" aria-label={t("header.navigation")}>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              aria-current={activeId === s.id ? "location" : undefined}
              className={`public-header__nav-link${
                activeId === s.id ? " public-header__nav-link--active" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="public-header__actions">
          <ThemeToggle />
          <div style={{ position: "relative" }} ref={langRef}>
            <button
              type="button"
              aria-label={t("header.switchLanguage")}
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-controls="public-language-options"
              className="public-header__lang-btn"
              onClick={() => setLangOpen((o) => !o)}
            >
              <Icon name="language" />
            </button>

            {langOpen && (
              <div id="public-language-options" className="public-header__dropdown">
                <button type="button" aria-pressed={i18n.language?.startsWith("en")} className="public-header__dropdown-item" onClick={() => changeLanguage("en")}>
                  {i18n.language === "en" ? "✓ " : ""}English
                </button>
                <button type="button" aria-pressed={i18n.language?.startsWith("ar")} className="public-header__dropdown-item" onClick={() => changeLanguage("ar")}>
                  {i18n.language === "ar" ? "✓ " : ""}العربية
                </button>
              </div>
            )}
          </div>

          <div className="public-header__avatar-wrap" ref={dropdownRef}>
            <button
              type="button"
              aria-label={t("header.userMenu")}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-controls="public-user-options"
              onClick={() => setDropdownOpen((o) => !o)}
              className="public-header__avatar-btn user-menu-button"
            >
              <Icon
                name="account_circle"
                className="public-header__avatar-icon user-menu-avatar user-menu-avatar--icon"
              />
            </button>

            {dropdownOpen && (
              <div id="public-user-options" className="public-header__dropdown">
                <button
                  type="button"
                  className="public-header__dropdown-item"
                  onClick={() => handleDropdownItemClick(onSignIn)}
                >
                  <Icon name="login" className="icon-18" /> {t("header.signIn")}
                </button>
                <button
                  type="button"
                  className="public-header__dropdown-item"
                  onClick={() => handleDropdownItemClick(onSignUp)}
                >
                  <Icon name="person_add" className="icon-18" /> {t("header.signUp")}
                </button>
              </div>
            )}
          </div>

          <button
            ref={mobileButtonRef}
            type="button"
            className="public-header__hamburger"
            aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="public-mobile-navigation" className="public-header__mobile-panel" aria-label={t("header.navigation")}>
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-current={activeId === s.id ? "location" : undefined}
              onClick={() => scrollTo(s.id)}
              className={`public-header__mobile-link${
                activeId === s.id ? " public-header__mobile-link--active" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
