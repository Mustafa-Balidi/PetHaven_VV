import { useTranslation } from "react-i18next";

const STATUS_CLASS = {
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
};

function statusClass(status) {
  return STATUS_CLASS[status] ?? "default";
}

export default function VetCalendarEvent({ appointment, onClick }) {
  const { t } = useTranslation();
  const cls = statusClass(appointment.status);

  return (
    <button
      type="button"
      className={`vet-calendar-event vet-calendar-event--${cls}`}
      onClick={onClick}
      title={`${appointment.timeDisplay} — ${appointment.petName}`}
    >
      <span className="vet-calendar-event__time">{appointment.timeDisplay}</span>
      <span className="vet-calendar-event__name">{appointment.petName}</span>
      {/* The chip encodes its status as a colour and nothing else. */}
      <span className="sr-only">
        {t(`vetAppointments.status.${appointment.status}`, { defaultValue: appointment.status })}
      </span>
    </button>
  );
}
