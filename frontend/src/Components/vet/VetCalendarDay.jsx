import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import VetCalendarEvent from "./VetCalendarEvent.jsx";

const MAX_VISIBLE = 3;

export default function VetCalendarDay({
  dayNumber,
  inCurrentMonth,
  isToday,
  events,
  loading,
  error,
  onEventClick,
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? events : events.slice(0, MAX_VISIBLE);
  const overflow = events.length - MAX_VISIBLE;

  return (
    <div
      className={`vet-calendar-day${inCurrentMonth ? "" : " vet-calendar-day--outside"}${
        isToday ? " vet-calendar-day--today" : ""
      }`}
    >
      <div className="vet-calendar-day__head">
        <span className={`vet-calendar-day__number${isToday ? " vet-calendar-day__number--today" : ""}`}>
          {dayNumber}
        </span>
        {inCurrentMonth && loading && <span className="vet-calendar-day__spinner" aria-hidden="true" />}
        {inCurrentMonth && !loading && error && (
          <span
            className="vet-calendar-day__error"
            title={t("vetCalendar.grid.dayError")}
          >
            <Icon name="error" />
          </span>
        )}
      </div>

      {inCurrentMonth && !loading && !error && events.length > 0 && (
        <div className="vet-calendar-day__events">
          {visible.map((appointment) => (
            <VetCalendarEvent
              key={appointment.appointmentId}
              appointment={appointment}
              onClick={() => onEventClick(appointment)}
            />
          ))}
          {overflow > 0 && (
            <button type="button" className="vet-calendar-day__more" onClick={() => setExpanded((v) => !v)}>
              {expanded ? t("vetCalendar.grid.showLess") : t("vetCalendar.grid.moreEvents", { count: overflow })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
