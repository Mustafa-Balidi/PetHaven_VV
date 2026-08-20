import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../Icon.jsx";

const LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB1isoZOydVyD5MYhvYGwVYTsmYtteNtWg89-SIig8AWCVHdHN8IzU34EjCDa4DWDt6VFxBbsg41KE1FOmvamfFJZNDGHkosK022Eh8K4IZVAFAjfdMDk08k-sUbVWYl7PrXFQuhaSeFL-8et9k6894ikaSaU_t9x2LnJ1mlreuwtp4zJa7rHufl79MX9kc62yp2E4CC8SNyC-XVLBx-WNbmQOA1JP5WO96WUk4Ll4RocbyTPOHoek4a1HSSL9fhptbUmLWo7C3zn9c";
const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVf5-FuadOrH8dn03uJxt8n3dpli9imW8s7QxXJ6Je0FQXbneDz868-6PJCOqEFD5mW9sptE5yulr3imwW4PIAimU-jiRb1YozdgIBRV6moBPZHCSPMglxo0mQzf2Mn8RjgZrbc87TnphWZTGdsnlUx_1QLsXmRDM0Lvs7qXcurQgEQGe9owNEamfugtaymWPS61LpwUdEN49IellG5MjDQv1ccPiVZJmntEb1rjNhwXFmIVg9BHQjE1pAlIUqfP8lbdVFfbJVup5l";

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
  };
  const [activeId, setActiveId] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector("header")?.offsetHeight || 72;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - navH,
      behavior: "smooth",
    });
    setActiveId(id);
    setMobileOpen(false);
  };

  const handleDropdownItemClick = (action) => {
    setDropdownOpen(false);
    action();
  };

  return (
    <header className="public-header">
      <div className="public-header__inner">
        <button onClick={() => scrollTo("home")} className="public-header__logo-link">
          <img src={LOGO} alt="Pet Haven" className="public-header__logo-img" />
        </button>

        <div className="public-header__nav">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`public-header__nav-link${
                activeId === s.id ? " public-header__nav-link--active" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="public-header__actions">
          <div style={{ position: "relative" }} ref={langRef}>
            <button
              aria-label={t("header.switchLanguage")}
              className="public-header__lang-btn"
              onClick={() => setLangOpen((o) => !o)}
            >
              <Icon name="language" />
            </button>

            {langOpen && (
              <div className="public-header__dropdown">
                <button className="public-header__dropdown-item" onClick={() => changeLanguage("en")}>
                  {i18n.language === "en" ? "✓ " : ""}English
                </button>
                <button className="public-header__dropdown-item" onClick={() => changeLanguage("ar")}>
                  {i18n.language === "ar" ? "✓ " : ""}العربية
                </button>
              </div>
            )}
          </div>

          <div className="public-header__avatar-wrap" ref={dropdownRef}>
            <button
              aria-label={t("header.userMenu")}
              onClick={() => setDropdownOpen((o) => !o)}
              className="public-header__avatar-btn"
            >
              <img src={AVATAR} alt="User" className="public-header__avatar-img" />
            </button>

            {dropdownOpen && (
              <div className="public-header__dropdown">
                <button
                  className="public-header__dropdown-item"
                  onClick={() => handleDropdownItemClick(onSignIn)}
                >
                  <Icon name="login" className="icon-18" /> {t("header.signIn")}
                </button>
                <button
                  className="public-header__dropdown-item"
                  onClick={() => handleDropdownItemClick(onSignUp)}
                >
                  <Icon name="person_add" className="icon-18" /> {t("header.signUp")}
                </button>
              </div>
            )}
          </div>

          <button
            className="public-header__hamburger"
            aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="public-header__mobile-panel">
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`public-header__mobile-link${
                activeId === s.id ? " public-header__mobile-link--active" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}