import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import VetAppointmentCard from "./VetAppointmentCard.jsx";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"];

export default function VetAppointmentsList({
  appointments,
  loading,
  error,
  statusFilter,
  onStatusFilterChange,
  actionState,
  onConfirm,
  onComplete,
  onCancel,
  onReschedule,
}) {
  const { t } = useTranslation();
  const hasFilter = Boolean(statusFilter);

  return (
    <section className="vet-appointments-list-section">
      <div className="vet-appointments-list__header">
        <h2 className="vet-appointments-list__title">
          <Icon name="today" className="vet-appointments-list__title-icon" />
          {t("vetAppointments.list.title")}
        </h2>
        <div className="vet-appointments-list__filter">
          {/* The visible caption sits next to the control but was never tied
              to it, so the select had no accessible name. */}
          <span id="vet-appointments-filter-label">{t("vetAppointments.toolbar.filterLabel")}</span>
          <select
            aria-labelledby="vet-appointments-filter-label"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            <option value="">{t("vetAppointments.toolbar.allStatuses")}</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(`vetAppointments.status.${option}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="vet-appointments-empty" role="status">{t("vetAppointments.list.loading")}</p>
      ) : error ? (
        <div className="vet-appointments-alert" role="alert">
          <span>{error}</span>
        </div>
      ) : appointments.length ? (
        <div className="vet-appointments-list">
          {appointments.map((appointment) => {
            const rowState = actionState[appointment.appointmentId] ?? {};
            return (
              <VetAppointmentCard
                key={appointment.appointmentId}
                appointment={appointment}
                busy={Boolean(rowState.busy)}
                error={rowState.error}
                onConfirm={() => onConfirm(appointment.appointmentId)}
                onComplete={() => onComplete(appointment.appointmentId)}
                onCancel={() => onCancel(appointment.appointmentId)}
                onReschedule={(newDate) => onReschedule(appointment.appointmentId, newDate)}
              />
            );
          })}
        </div>
      ) : (
        <p className="vet-appointments-empty">
          {hasFilter ? t("vetAppointments.list.noMatches") : t("vetAppointments.list.empty")}
        </p>
      )}
    </section>
  );
}
