import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import Icon from "../../Components/Icon.jsx";
import VetCalendarToolbar from "../../Components/vet/VetCalendarToolbar.jsx";
import VetCalendarGrid from "../../Components/vet/VetCalendarGrid.jsx";
import VetAppointmentCard from "../../Components/vet/VetAppointmentCard.jsx";
import {
  getVetSchedule,
  updateAppointmentStatus,
  rescheduleAppointment,
  toDateParam,
} from "../../api/vetAppointmentsApi.js";
import { formatLocalizedDate } from "../../utils/localization.js";
import useModalA11y from "../../hooks/useModalA11y.js";
import "../../Styling/VetCalendar.css";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function VetCalendar() {
  const { t, i18n } = useTranslation();
  useDocumentTitle(t("vetCalendar.title"));
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewMonth, setViewMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [monthLoading, setMonthLoading] = useState(true);
  const [eventsByDate, setEventsByDate] = useState({});
  const [dayState, setDayState] = useState({});
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const appointmentDialogRef = useModalA11y({
    open: Boolean(selectedAppointment),
    onClose: () => setSelectedAppointment(null),
  });
  const [actionState, setActionState] = useState({});

  const cacheRef = useRef(new Map());
  const inFlightRef = useRef(new Set());
  const currentViewRef = useRef(viewMonth);

  function isViewingMonth(year, month) {
    return currentViewRef.current.year === year && currentViewRef.current.month === month;
  }

  function commitDayResult(key, result) {
    inFlightRef.current.delete(key);
    if (result.status === "fulfilled") {
      cacheRef.current.set(key, result.value);
      setEventsByDate((prev) => ({ ...prev, [key]: result.value }));
      setDayState((prev) => ({ ...prev, [key]: { loading: false, error: "" } }));
    } else {
      setDayState((prev) => ({ ...prev, [key]: { loading: false, error: result.reason?.message || "" } }));
    }
  }

  async function loadMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    const seedEvents = {};
    const seedState = {};
    const toFetch = [];

    // Dates already cached or already being fetched (e.g. React StrictMode's
    // double-invoked mount effect) are skipped so we never issue duplicate
    // requests for the same date.
    dates.forEach((date) => {
      const key = toDateParam(date);
      if (cacheRef.current.has(key)) {
        seedEvents[key] = cacheRef.current.get(key);
        seedState[key] = { loading: false, error: "" };
      } else if (!inFlightRef.current.has(key)) {
        inFlightRef.current.add(key);
        seedState[key] = { loading: true, error: "" };
        toFetch.push({ key, date });
      }
    });

    setEventsByDate((prev) => ({ ...prev, ...seedEvents }));
    setDayState((prev) => ({ ...prev, ...seedState }));

    if (toFetch.length === 0) {
      if (isViewingMonth(year, month)) setMonthLoading(false);
      return;
    }

    if (isViewingMonth(year, month)) setMonthLoading(true);

    const results = await Promise.allSettled(toFetch.map(({ date }) => getVetSchedule(date)));
    results.forEach((result, index) => commitDayResult(toFetch[index].key, result));
    if (isViewingMonth(year, month)) setMonthLoading(false);
  }

  async function loadDay(date) {
    const key = toDateParam(date);
    if (inFlightRef.current.has(key)) return;
    inFlightRef.current.add(key);
    setDayState((prev) => ({ ...prev, [key]: { ...prev[key], loading: true, error: "" } }));
    const [result] = await Promise.allSettled([getVetSchedule(date)]);
    commitDayResult(key, result);
    return result;
  }

  useEffect(() => {
    loadMonth(viewMonth.year, viewMonth.month);
    // Initial mount only — subsequent loads are triggered explicitly by navigation handlers below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToMonth(year, month) {
    currentViewRef.current = { year, month };
    setViewMonth({ year, month });
    loadMonth(year, month);
  }

  function goPrevMonth() {
    const next = new Date(viewMonth.year, viewMonth.month - 1, 1);
    goToMonth(next.getFullYear(), next.getMonth());
  }

  function goNextMonth() {
    const next = new Date(viewMonth.year, viewMonth.month + 1, 1);
    goToMonth(next.getFullYear(), next.getMonth());
  }

  function goToday() {
    goToMonth(today.getFullYear(), today.getMonth());
  }

  function setRowBusy(appointmentId, busy) {
    setActionState((prev) => ({
      ...prev,
      [appointmentId]: { ...prev[appointmentId], busy, error: busy ? "" : prev[appointmentId]?.error },
    }));
  }

  function setRowError(appointmentId, error) {
    setActionState((prev) => ({ ...prev, [appointmentId]: { busy: false, error } }));
  }

  async function refreshSelectedFrom(key, appointmentId) {
    const fresh = (cacheRef.current.get(key) || []).find((a) => a.appointmentId === appointmentId);
    setSelectedAppointment(fresh || null);
  }

  async function handleStatusChange(appointment, status) {
    setRowBusy(appointment.appointmentId, true);
    try {
      await updateAppointmentStatus(appointment.appointmentId, status);
      setRowBusy(appointment.appointmentId, false);
      const key = toDateParam(new Date(appointment.appointmentDate));
      await loadDay(new Date(appointment.appointmentDate));
      await refreshSelectedFrom(key, appointment.appointmentId);
    } catch (err) {
      setRowError(appointment.appointmentId, err.message);
    }
  }

  async function handleReschedule(appointment, newDateIso) {
    setRowBusy(appointment.appointmentId, true);
    try {
      await rescheduleAppointment(appointment.appointmentId, newDateIso);
      setRowBusy(appointment.appointmentId, false);
      const oldDate = new Date(appointment.appointmentDate);
      const newDate = new Date(newDateIso);
      await Promise.all([loadDay(oldDate), loadDay(newDate)]);
      setSelectedAppointment(null);
    } catch (err) {
      setRowError(appointment.appointmentId, err.message);
      throw err;
    }
  }

  const filteredEventsByDate = useMemo(() => {
    if (!statusFilter) return eventsByDate;
    const next = {};
    Object.entries(eventsByDate).forEach(([key, items]) => {
      next[key] = items.filter((item) => item.status === statusFilter);
    });
    return next;
  }, [eventsByDate, statusFilter]);

  const monthLabel = formatLocalizedDate(new Date(viewMonth.year, viewMonth.month, 1), i18n.language, {
    month: "long",
    year: "numeric",
  });
  const isCurrentMonth = viewMonth.year === today.getFullYear() && viewMonth.month === today.getMonth();
  const todayKey = toDateParam(today);
  const selectedRowState = selectedAppointment ? actionState[selectedAppointment.appointmentId] ?? {} : {};

  return (
    <div className="vet-calendar-page">
      <VetHeader />

      <main id="main-content" tabIndex={-1} className="vet-calendar-main">
        <div className="vet-calendar-heading">
          <div>
            <h1 className="vet-calendar-title">{t("vetCalendar.title")}</h1>
            <p className="vet-calendar-subtitle">{t("vetCalendar.subtitle")}</p>
          </div>

          <div className="vet-calendar-view-toggle">
            <Link to="/vet/appointments" className="vet-calendar-view-toggle__btn">
              <Icon name="calendar_view_day" className="vet-calendar-view-toggle__icon" />
              {t("vetAppointments.viewToggle.list")}
            </Link>
            <span className="vet-calendar-view-toggle__btn vet-calendar-view-toggle__btn--active" aria-current="page">
              <Icon name="calendar_month" className="vet-calendar-view-toggle__icon" />
              {t("vetAppointments.viewToggle.calendar")}
            </span>
          </div>
        </div>

        <div className="vet-calendar-panel">
          <VetCalendarToolbar
            monthLabel={monthLabel}
            isCurrentMonth={isCurrentMonth}
            onToday={goToday}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {monthLoading ? (
            <p className="vet-calendar-empty" role="status">{t("vetCalendar.grid.loading")}</p>
          ) : (
            <VetCalendarGrid
              year={viewMonth.year}
              month={viewMonth.month}
              eventsByDate={filteredEventsByDate}
              dayState={dayState}
              todayKey={todayKey}
              onEventClick={setSelectedAppointment}
              onRetryDay={loadDay}
            />
          )}
        </div>
      </main>

      <Footer />

      {selectedAppointment && (
        <div
          className="vet-calendar-event-modal-overlay"
          role="presentation"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="vet-calendar-event-modal"
            onClick={(event) => event.stopPropagation()}
            ref={appointmentDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("vetCalendar.modal.title")}
            tabIndex={-1}
          >
            <button
              type="button"
              className="vet-calendar-event-modal__close"
              onClick={() => setSelectedAppointment(null)}
              aria-label={t("vetCalendar.modal.close")}
            >
              <Icon name="close" />
            </button>
            <VetAppointmentCard
              appointment={selectedAppointment}
              busy={Boolean(selectedRowState.busy)}
              error={selectedRowState.error}
              onConfirm={() => handleStatusChange(selectedAppointment, "Confirmed")}
              onComplete={() => handleStatusChange(selectedAppointment, "Completed")}
              onCancel={() => handleStatusChange(selectedAppointment, "Cancelled")}
              onReschedule={(newDate) => handleReschedule(selectedAppointment, newDate)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
