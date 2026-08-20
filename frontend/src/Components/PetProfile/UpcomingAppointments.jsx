import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

/**
 * ويدجت المواعيد القادمة في السايدبار
 * props:
 *  - appointments: [{ id, title, month, day, time, location, vetName, vetAvatar }]
 *  - onAddClick: function
 */
function UpcomingAppointments({ appointments, onAddClick }) {
  const { t } = useTranslation();
  return (
    <div className="upcoming-appointments">
      <div className="upcoming-appointments__header">
        <h2 className="upcoming-appointments__title">
          {t("adopter.petProfile.upcoming")}
        </h2>
        <button
          type="button"
          className="upcoming-appointments__add-btn"
          onClick={onAddClick}
          aria-label={t("adopter.petProfile.addAppointment")}
        >
          <FaPlus size={16} />
        </button>
      </div>

      {appointments.map((appt) => (
        <div key={appt.id} className="upcoming-appointments__card">
          <div className="upcoming-appointments__date-box">
            <span className="upcoming-appointments__date-month">
              {appt.month}
            </span>
            <span className="upcoming-appointments__date-day">
              {appt.day}
            </span>
          </div>

          <div className="upcoming-appointments__details">
            <h3 className="upcoming-appointments__appt-title">
              {appt.title}
            </h3>
            <p className="upcoming-appointments__appt-meta">
              {appt.time} • {appt.location}
            </p>
            <div className="upcoming-appointments__vet">
              <img
                className="upcoming-appointments__vet-avatar"
                src={appt.vetAvatar}
                alt={appt.vetName}
              />
              <span>{appt.vetName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UpcomingAppointments;
