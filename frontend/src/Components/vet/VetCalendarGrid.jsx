import { useTranslation } from "react-i18next";
import VetCalendarDay from "./VetCalendarDay.jsx";
import { formatLocalizedDate } from "../../utils/localization.js";
import { toDateParam } from "../../api/vetAppointmentsApi.js";

function buildWeekdayLabels(language) {
  // January 1, 2023 was a Sunday — used only as a stable Sun..Sat reference week.
  return Array.from({ length: 7 }, (_, i) => formatLocalizedDate(new Date(2023, 0, 1 + i), language, { weekday: "short" }));
}

function buildMonthCells(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstOfMonth.getDay();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - startOffset + 1;
    const date = new Date(year, month, dayNumber);
    return { date, inCurrentMonth: date.getMonth() === month };
  });
}

export default function VetCalendarGrid({ year, month, eventsByDate, dayState, todayKey, onEventClick }) {
  const { i18n } = useTranslation();
  const weekdayLabels = buildWeekdayLabels(i18n.language);
  const cells = buildMonthCells(year, month);

  return (
    <div className="vet-calendar-grid">
      <div className="vet-calendar-grid__weekdays">
        {weekdayLabels.map((label, index) => (
          <div key={`${label}-${index}`} className="vet-calendar-grid__weekday">
            {label}
          </div>
        ))}
      </div>
      <div className="vet-calendar-grid__cells">
        {cells.map(({ date, inCurrentMonth }) => {
          const key = toDateParam(date);
          const state = dayState[key] ?? {};
          return (
            <VetCalendarDay
              key={key}
              dayNumber={date.getDate()}
              inCurrentMonth={inCurrentMonth}
              isToday={key === todayKey}
              events={inCurrentMonth ? eventsByDate[key] ?? [] : []}
              loading={Boolean(state.loading)}
              error={state.error}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}
