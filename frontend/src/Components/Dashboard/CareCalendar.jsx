import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatLocalizedDate } from "../../utils/localization.js";

export default function CareCalendar({ title, appointments = [], loading = false, error = null }) {
  const { t, i18n } = useTranslation();

  return (
    <section className="calendar-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link to="/adopter/vets" className="calendar-book-link">
          {t("adopter.dashboard.calendar.bookVisit")}
        </Link>
      </div>

      {loading ? (
        <div className="dashboard-unavailable-card" aria-live="polite">
          <span className="material-symbols-outlined" aria-hidden="true">progress_activity</span>
          <p>{t("adopter.dashboard.calendar.loading")}</p>
        </div>
      ) : error ? (
        <div className="dashboard-unavailable-card dashboard-unavailable-card--error" role="alert">
          <span className="material-symbols-outlined" aria-hidden="true">error</span>
          <p>{t("adopter.dashboard.calendar.loadError", { message: error })}</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="dashboard-unavailable-card">
          <span className="material-symbols-outlined" aria-hidden="true">event_available</span>
          <h3>{t("adopter.dashboard.calendar.emptyTitle")}</h3>
          <p>{t("adopter.dashboard.calendar.emptyText")}</p>
          <Link to="/adopter/vets" className="dashboard-state-link">
            {t("adopter.dashboard.calendar.bookVisit")}
          </Link>
        </div>
      ) : (
        <div className="care-calendar-list">
          {appointments.map((appointment) => (
            <article className="care-calendar-item" key={appointment.appointmentId}>
              <div className="care-calendar-item__date">
                <span className="material-symbols-outlined" aria-hidden="true">event</span>
                <time dateTime={appointment.appointmentDate}>
                  {formatLocalizedDate(appointment.appointmentDate, i18n.language, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <div className="care-calendar-item__body">
                <h3>{appointment.petName || t("adopter.common.pet")}</h3>
                <p className="care-calendar-item__vet">
                  <span className="material-symbols-outlined" aria-hidden="true">stethoscope</span>
                  {appointment.vetName || t("adopter.dashboard.calendar.unknownVet")}
                </p>
                <p>{appointment.reason || t("adopter.dashboard.calendar.noReason")}</p>
              </div>
              <span className="care-calendar-item__status">
                {appointment.status || t("adopter.dashboard.calendar.unknownStatus")}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
