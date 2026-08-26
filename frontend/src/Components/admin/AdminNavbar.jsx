import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMyProfile } from "../../api/profileApi";
import ThemeToggle from "../ThemeToggle.jsx";

function getInitials(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AdminNavbar() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchMyProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setProfileError(null);
      })
      .catch((error) => {
        if (!active) return;
        setProfile(null);
        setProfileError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const nextLanguage = i18n.language === "ar" ? "en" : "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(nextLanguage);
  };

  const displayName = profile?.fullName || profile?.userName || profile?.username || "";
  const email = profile?.email || "";
  const imageUrl = profile?.profileImageUrl || "";
  const initials = getInitials(displayName || email);

  return (
    <header className="admin-navbar">
      <div className="admin-navbar__brand">
        <span className="admin-navbar__brand-title">{t("admin.navbar.workspace")}</span>
      </div>

      <div className="admin-navbar__actions">
        <ThemeToggle />
        {/* The button label is written in the language it switches to, so it
            carries its own `lang` for the speech synthesiser. */}
        <button
          className="admin-navbar__lang-btn"
          type="button"
          lang={nextLanguage}
          aria-label={t(
            nextLanguage === "en"
              ? "admin.navbar.switchToEnglish"
              : "admin.navbar.switchToArabic"
          )}
          onClick={toggleLanguage}
        >
          {nextLanguage === "en" ? "EN" : "عربي"}
        </button>

        {profileError ? (
          <span className="admin-navbar__profile-error" role="status">
            {t("admin.navbar.profileError")}
            {/* The raw backend reason was reachable by hover only. */}
            <span className="sr-only">{profileError}</span>
          </span>
        ) : null}

        {profile ? (
          <div className="admin-navbar__profile" role="group" aria-label={t("admin.navbar.profileTitle")}>
            {imageUrl ? (
              <img
                className="admin-navbar__avatar user-menu-avatar user-menu-avatar--image"
                src={imageUrl}
                alt={
                  displayName
                    ? t("a11y.alt.userAvatar", { name: displayName })
                    : t("a11y.alt.avatar")
                }
              />
            ) : (
              <span className="admin-navbar__avatar admin-navbar__avatar--initials user-menu-avatar" aria-hidden="true">
                {initials || "A"}
              </span>
            )}
            <span className="admin-navbar__profile-text">
              {displayName ? (
                <span className="admin-navbar__profile-name">{displayName}</span>
              ) : null}
              {email ? <span className="admin-navbar__profile-email">{email}</span> : null}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
