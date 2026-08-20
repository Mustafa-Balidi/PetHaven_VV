import { useTranslation } from "react-i18next";

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export default function VetWelcomeSection({ fullName }) {
  const { t } = useTranslation();
  const doctorName = fullName
    ? t("vetDashboard.welcome.doctorPrefix", { name: fullName })
    : t("vetDashboard.welcome.defaultDoctor");

  return (
    <section className="vet-dashboard-welcome">
      <div>
        <h1 className="vet-dashboard-welcome__title">
          {t(`vetDashboard.welcome.${getGreetingKey()}`, { name: doctorName })}
        </h1>
        <p className="vet-dashboard-welcome__subtitle">{t("vetDashboard.welcome.subtitle")}</p>
      </div>
    </section>
  );
}
