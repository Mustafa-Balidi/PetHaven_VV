import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import VetCalendarEvent from "./VetCalendarEvent.jsx";
import { formatLocalizedDate } from "../../utils/localization.js";

const MAX_VISIBLE = 3;

export default function VetCalendarDay({
  date,
  dayNumber,
  inCurrentMonth,
  isToday,
  events,
  loading,
  error,
  onEventClick,
  onRetry,
}) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? events : events.slice(0, MAX_VISIBLE);
  const overflow = events.length - MAX_VISIBLE;
  const fullDate = formatLocalizedDate(date, i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`vet-calendar-day${inCurrentMonth ? "" : " vet-calendar-day--outside"}${
        isToday ? " vet-calendar-day--today" : ""
      }`}
    >
      <div className="vet-calendar-day__head">
        {/* Out of the grid's visual context a lone "14" says nothing, so the
            cell states its own date and how much is booked on it. */}
        <span className={`vet-calendar-day__number${isToday ? " vet-calendar-day__number--today" : ""}`}>
          <span aria-hidden="true">{dayNumber}</span>
          <span className="sr-only">
            {fullDate}
            {inCurrentMonth && events.length
              ? `, ${t("vetCalendar.grid.dayEvents", { count: events.length })}`
              : ""}
          </span>
        </span>
        {inCurrentMonth && loading && <span className="vet-calendar-day__spinner" aria-hidden="true" />}
        {inCurrentMonth && !loading && error && (
          <button
            type="button"
            className="vet-calendar-day__error"
            title={error || t("vetCalendar.grid.dayError")}
            onClick={onRetry}
            aria-label={t("vetCalendar.grid.retryDay", { date: fullDate })}
          >
            <Icon name="error" label={t("vetCalendar.grid.dayError")} />
          </button>
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
            <button
              type="button"
              className="vet-calendar-day__more"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? t("vetCalendar.grid.showLess") : t("vetCalendar.grid.moreEvents", { count: overflow })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
