import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

const CARDS = [
  { key: "total", icon: "event", accent: "primary" },
  { key: "confirmed", icon: "check_circle", accent: "green" },
  { key: "pending", icon: "pending_actions", accent: "yellow" },
  { key: "completed", icon: "done_all", accent: "primary" },
  { key: "cancelled", icon: "cancel", accent: "red" },
];

export default function VetAppointmentsSummary({ summary }) {
  const { t } = useTranslation();
  const s = summary ?? {};
  const values = {
    total: s.totalToday ?? 0,
    confirmed: s.confirmedCount ?? 0,
    pending: s.pendingCount ?? 0,
    completed: s.completedCount ?? 0,
    cancelled: s.cancelledCount ?? 0,
  };

  return (
    <div className="vet-appointments-summary">
      {CARDS.map((card) => (
        <article key={card.key} className={`vet-appointments-summary__card vet-appointments-summary__card--${card.accent}`}>
          <div className="vet-appointments-summary__head">
            <span className="vet-appointments-summary__label">{t(`vetAppointments.summary.${card.key}.label`)}</span>
            <Icon name={card.icon} className={`vet-appointments-summary__icon vet-appointments-summary__icon--${card.accent}`} />
          </div>
          <div className="vet-appointments-summary__value">{values[card.key]}</div>
          <div className="vet-appointments-summary__caption">{t(`vetAppointments.summary.${card.key}.caption`)}</div>
        </article>
      ))}
    </div>
  );
}
