import { useTranslation } from "react-i18next";

export default function WelcomeSection({ userName, loading, error }) {
  const { t } = useTranslation();
  return (
    <section className="welcome-section">
      <h1 className="welcome-title">
        {loading
          ? t("adopter.dashboard.profileLoading")
          : userName
            ? t("adopter.dashboard.welcome", { name: userName })
            : t("adopter.dashboard.welcomeGeneric")}
      </h1>
      {error && <p className="dashboard-inline-error">{t("adopter.dashboard.profileUnavailable")}</p>}
    </section>
  );
}
