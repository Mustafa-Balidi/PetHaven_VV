import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMyProfile } from "../../api/profileApi";

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

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
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
        <button
          className="admin-navbar__lang-btn"
          type="button"
          aria-label={t("admin.navbar.switchLanguage")}
          onClick={toggleLanguage}
        >
          {i18n.language === "ar" ? "EN" : "عربي"}
        </button>

        {profileError ? (
          <span className="admin-navbar__profile-error" title={profileError}>
            {t("admin.navbar.profileError")}
          </span>
        ) : null}

        {profile ? (
          <div className="admin-navbar__profile">
            {imageUrl ? (
              <img
                className="admin-navbar__avatar"
                src={imageUrl}
                alt={displayName || t("admin.navbar.profileTitle")}
              />
            ) : (
              <span className="admin-navbar__avatar admin-navbar__avatar--initials" aria-hidden="true">
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
