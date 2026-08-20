import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"];

export default function VetCalendarToolbar({
  monthLabel,
  isCurrentMonth,
  onToday,
  onPrev,
  onNext,
  statusFilter,
  onStatusFilterChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="vet-calendar-toolbar">
      <div className="vet-calendar-toolbar__nav">
        <button type="button" className="vet-calendar-toolbar__today" onClick={onToday} disabled={isCurrentMonth}>
          {t("vetAppointments.dateNav.today")}
        </button>
        <div className="vet-calendar-toolbar__arrows">
          <button type="button" onClick={onPrev} aria-label={t("vetCalendar.toolbar.previousMonth")}>
            <Icon name="chevron_left" />
          </button>
          <button type="button" onClick={onNext} aria-label={t("vetCalendar.toolbar.nextMonth")}>
            <Icon name="chevron_right" />
          </button>
        </div>
        <h2 className="vet-calendar-toolbar__title">{monthLabel}</h2>
      </div>

      <div className="vet-calendar-toolbar__filter">
        <span>{t("vetAppointments.toolbar.filterLabel")}</span>
        <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
          <option value="">{t("vetAppointments.toolbar.allStatuses")}</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`vetAppointments.status.${option}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
