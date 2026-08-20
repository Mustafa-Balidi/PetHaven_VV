import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import VetAppointmentsSummary from "../../Components/vet/VetAppointmentsSummary.jsx";
import VetAppointmentsList from "../../Components/vet/VetAppointmentsList.jsx";
import {
  getVetSchedule,
  getVetSummary,
  updateAppointmentStatus,
  rescheduleAppointment,
  toDateParam,
} from "../../api/vetAppointmentsApi.js";
import { formatLocalizedDate } from "../../utils/localization.js";
import "../../Styling/VetAppointments.css";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function VetAppointments() {
  const { t, i18n } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const [schedule, setSchedule] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [actionState, setActionState] = useState({});

  useEffect(() => {
    let active = true;

    Promise.all([getVetSummary(selectedDate), getVetSchedule(selectedDate)])
      .then(([summaryData, scheduleData]) => {
        if (!active) return;
        setSummary(summaryData);
        setSchedule(scheduleData);
        setSummaryError("");
        setListError("");
      })
      .catch((err) => {
        if (!active) return;
        setSummary(null);
        setSchedule([]);
        setSummaryError(err.message);
        setListError(err.message);
      })
      .finally(() => {
        if (!active) return;
        setSummaryLoading(false);
        setListLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDate, refreshKey]);

  function goToDate(next) {
    setSelectedDate(next);
    setSummaryLoading(true);
    setListLoading(true);
  }

  function goPrevDay() {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    goToDate(next);
  }

  function goNextDay() {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    goToDate(next);
  }

  function goToday() {
    goToDate(startOfDay(new Date()));
  }

  function handleDateInput(event) {
    const [year, month, day] = event.target.value.split("-").map(Number);
    if (!year || !month || !day) return;
    goToDate(new Date(year, month - 1, day));
  }

  function reloadQuietly() {
    setRefreshKey((value) => value + 1);
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

  async function handleStatusChange(appointmentId, status) {
    setRowBusy(appointmentId, true);
    try {
      await updateAppointmentStatus(appointmentId, status);
      setRowBusy(appointmentId, false);
      reloadQuietly();
    } catch (err) {
      setRowError(appointmentId, err.message);
    }
  }

  async function handleReschedule(appointmentId, newDateIso) {
    setRowBusy(appointmentId, true);
    try {
      await rescheduleAppointment(appointmentId, newDateIso);
      setRowBusy(appointmentId, false);
      reloadQuietly();
    } catch (err) {
      setRowError(appointmentId, err.message);
      throw err;
    }
  }

  const filteredSchedule = statusFilter ? schedule.filter((a) => a.status === statusFilter) : schedule;
  const dateLabel = formatLocalizedDate(selectedDate, i18n.language, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const isToday = toDateParam(selectedDate) === toDateParam(new Date());

  return (
    <div className="vet-appointments-page">
      <VetHeader />

      <main className="vet-appointments-main">
        <div className="vet-appointments-heading">
          <div>
            <h1 className="vet-appointments-title">{t("vetAppointments.title")}</h1>
            <p className="vet-appointments-subtitle">{t("vetAppointments.subtitle")}</p>
          </div>

          <div className="vet-appointments-view-toggle">
            <button type="button" className="vet-appointments-view-toggle__btn vet-appointments-view-toggle__btn--active">
              <Icon name="calendar_view_day" className="vet-appointments-view-toggle__icon" />
              {t("vetAppointments.viewToggle.list")}
            </button>
            <Link to="/vet/calendar" className="vet-appointments-view-toggle__btn">
              <Icon name="calendar_month" className="vet-appointments-view-toggle__icon" />
              {t("vetAppointments.viewToggle.calendar")}
            </Link>
          </div>
        </div>

        <div className="vet-appointments-date-nav">
          <button type="button" className="vet-appointments-date-nav__btn" onClick={goPrevDay} aria-label={t("vetAppointments.dateNav.previous")}>
            <Icon name="chevron_left" />
          </button>
          <button type="button" className="vet-appointments-date-nav__today" onClick={goToday} disabled={isToday}>
            {t("vetAppointments.dateNav.today")}
          </button>
          <span className="vet-appointments-date-nav__label">{dateLabel}</span>
          <input
            type="date"
            className="vet-appointments-date-nav__input"
            value={toDateParam(selectedDate)}
            onChange={handleDateInput}
            aria-label={t("vetAppointments.dateNav.pickDate")}
          />
          <button type="button" className="vet-appointments-date-nav__btn" onClick={goNextDay} aria-label={t("vetAppointments.dateNav.next")}>
            <Icon name="chevron_right" />
          </button>
        </div>

        {summaryError ? (
          <div className="vet-appointments-alert" role="alert">
            <span>{summaryError}</span>
          </div>
        ) : summaryLoading ? (
          <p className="vet-appointments-empty">{t("vetAppointments.summary.loading")}</p>
        ) : (
          <VetAppointmentsSummary summary={summary} />
        )}

        <VetAppointmentsList
          appointments={filteredSchedule}
          loading={listLoading}
          error={listError}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          actionState={actionState}
          onConfirm={(id) => handleStatusChange(id, "Confirmed")}
          onComplete={(id) => handleStatusChange(id, "Completed")}
          onCancel={(id) => handleStatusChange(id, "Cancelled")}
          onReschedule={handleReschedule}
        />
      </main>

      <Footer />
    </div>
  );
}
