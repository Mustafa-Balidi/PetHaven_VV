import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function AdminNavbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar");
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar__spacer" />
      <div className="admin-navbar__actions">
        <button
          className="admin-navbar__icon-btn"
          type="button"
          aria-label={t("admin.navbar.switchLanguage")}
          onClick={toggleLanguage}
        >
          {i18n.language === "ar" ? "EN" : "عربي"}
        </button>
        <button className="admin-navbar__icon-btn" type="button" aria-label={t("admin.navbar.help")}>
          <Icon name="help" />
        </button>
        <button className="admin-navbar__icon-btn admin-navbar__icon-btn--bell" type="button" aria-label={t("admin.navbar.notifications")}>
          <Icon name="notifications" />
          <span className="admin-navbar__badge" />
        </button>
        <img
          className="admin-navbar__avatar"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8mpNg8_UsLTwot_g_I4U_dyv7rr6xhl4OaVPKc4hO_yT4r60ZqPv99x9V791K1LlGvBNH4sM6Td25y1S0uKeNLh0vz3pNjKOJw7I_vyWVpFoaUPYFaTiPebHVCd4lcZx15JSOe1rLS66jHMz-6mupDRA8uXMl94f0WGde9LVqaJ1cayW_nNxDQ_JjODgPBVq4lEV6pKQLxIOF82B44uoUHZ8QhkGlKO08XPzFs0KkwOx5DOnWWRZbdpUPSFYL6KN63PfseesVWUAe"
          alt={t("admin.navbar.avatarAlt")}
        />
      </div>
    </header>
  );
}
