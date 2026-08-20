import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { REASON_CATEGORY_STYLES, classifyReason } from "../../utils/appointmentReason.js";

export default function VetSchedule({ appointments }) {
  const { t } = useTranslation();

  return (
    <section className="vet-dashboard-card vet-dashboard-schedule">
      <div className="vet-dashboard-schedule__header">
        <h2 className="vet-dashboard-card__title">{t("vetDashboard.schedule.title")}</h2>
        <Link to="/vet/calendar" className="vet-dashboard-schedule__view-btn">
          {t("vetDashboard.schedule.viewCalendar")}
        </Link>
      </div>

      {appointments.length ? (
        <div className="vet-dashboard-schedule__list">
          {appointments.map((appointment) => {
            const category = classifyReason(appointment.reason);
            const style = REASON_CATEGORY_STYLES[category];
            const isDone = ["Completed", "Cancelled"].includes(appointment.status);
            const isEmergency = category === "emergency" && !isDone;
            const [timeValue, timePeriod] = (appointment.timeDisplay || "").split(" ");

            return (
              <article
                key={appointment.appointmentId}
                className={`vet-dashboard-appointment${isDone ? " vet-dashboard-appointment--muted" : ""}`}
              >
                <div className="vet-dashboard-appointment__time">
                  <span
                    className={`vet-dashboard-appointment__time-value${
                      isDone ? " vet-dashboard-appointment__time-value--struck" : ""
                    }`}
                  >
                    {timeValue}
                  </span>
                  {timePeriod && <span className="vet-dashboard-appointment__time-period">{timePeriod}</span>}
                </div>
                <div
                  className="vet-dashboard-appointment__body"
                  style={{ borderInlineStartColor: isDone ? "#bcc9c6" : style.color }}
                >
                  {isEmergency && <span className="vet-dashboard-appointment__pulse" />}
                  <div className="vet-dashboard-appointment__pet">{appointment.petName}</div>
                  <div className="vet-dashboard-appointment__owner">
                    {isDone
                      ? t(`vetDashboard.schedule.status.${appointment.status}`, {
                          defaultValue: appointment.status,
                        })
                      : t("vetDashboard.schedule.owner", { name: appointment.ownerName })}
                  </div>
                  {!isDone && appointment.reason && (
                    <span
                      className="vet-dashboard-appointment__tag"
                      style={{ backgroundColor: `${style.color}1a`, color: style.color }}
                    >
                      <Icon name={style.icon} className="vet-dashboard-icon-sm" /> {appointment.reason}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="vet-dashboard-empty">{t("vetDashboard.schedule.empty")}</p>
      )}
    </section>
  );
}
