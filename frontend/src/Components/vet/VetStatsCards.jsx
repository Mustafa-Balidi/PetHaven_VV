import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function VetStatsCards({ stats }) {
  const { t } = useTranslation();
  const s = stats ?? {};

  const cards = [
    {
      key: "totalPatients",
      icon: "pets",
      accent: "primary",
      value: s.totalPatients ?? 0,
      hint: t("vetDashboard.stats.totalPatients.hint"),
    },
    {
      key: "appointmentsToday",
      icon: "calendar_today",
      accent: "secondary",
      value: s.appointmentsToday ?? 0,
      hint: t("vetDashboard.stats.appointmentsToday.hint", {
        count: s.remainingAppointmentsToday ?? 0,
      }),
    },
    {
      key: "reviews",
      icon: "star_rate",
      accent: "yellow",
      value: s.reviews ?? 0,
      hint: t("vetDashboard.stats.reviews.hint"),
    },
  ];

  return (
    <div className="vet-dashboard-kpi-grid">
      {cards.map((card) => (
        <article key={card.key} className="vet-dashboard-kpi">
          <div className={`vet-dashboard-kpi__blob vet-dashboard-kpi__blob--${card.accent}`} />
          <div className="vet-dashboard-kpi__head">
            <span className="vet-dashboard-kpi__label">{t(`vetDashboard.stats.${card.key}.label`)}</span>
            <span className={`vet-dashboard-kpi__icon vet-dashboard-kpi__icon--${card.accent}`}>
              <Icon name={card.icon} />
            </span>
          </div>
          <div className="vet-dashboard-kpi__value">{card.value}</div>
          <div className="vet-dashboard-kpi__hint">{card.hint}</div>
        </article>
      ))}
    </div>
  );
}
