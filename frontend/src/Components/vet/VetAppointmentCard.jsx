import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { speciesIcon } from "../../utils/petIcons.js";
import { classifyReason } from "../../utils/appointmentReason.js";

const STATUS_CLASS = {
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
};

function statusClass(status) {
  return STATUS_CLASS[status] ?? "default";
}

function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function VetAppointmentCard({ appointment, busy, error, onConfirm, onComplete, onCancel, onReschedule }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("");
  const [newDate, setNewDate] = useState(todayInputValue());
  const [newTime, setNewTime] = useState("");
  const [formError, setFormError] = useState("");

  const cls = statusClass(appointment.status);
  const isReadOnly = appointment.status === "Completed" || appointment.status === "Cancelled";
  const isDimmed = appointment.status === "Completed";
  const reasonCategory = classifyReason(appointment.reason);
  const [timeValue, timePeriod] = (appointment.timeDisplay || "").split(" ");

  function closeForms() {
    setMode("");
    setFormError("");
  }

  async function submitReschedule(event) {
    event.preventDefault();
    if (!newDate || !newTime) return;

    const combined = new Date(`${newDate}T${newTime}:00`);
    if (combined.getTime() <= Date.now()) {
      setFormError(t("vetAppointments.reschedule.pastDate"));
      return;
    }

    setFormError("");
    try {
      await onReschedule(combined.toISOString());
      closeForms();
    } catch {
      // error surfaces via the `error` prop from the parent
    }
  }

  return (
    <article className={`vet-appointments-card vet-appointments-card--${cls}${isDimmed ? " vet-appointments-card--dimmed" : ""}`}>
      <div className="vet-appointments-card__time">
        <span className={`vet-appointments-card__time-value${isDimmed ? " vet-appointments-card__time-value--struck" : ""}`}>
          {timeValue}
        </span>
        {timePeriod && <span className="vet-appointments-card__time-period">{timePeriod}</span>}
      </div>

      <div className="vet-appointments-card__identity">
        <span className="vet-appointments-card__avatar">
          {appointment.petImageUrl ? (
            <img src={appointment.petImageUrl} alt={appointment.petName} />
          ) : (
            <Icon name={speciesIcon(appointment.species)} />
          )}
        </span>
        <div>
          <h4 className="vet-appointments-card__pet">
            {appointment.petName}
            {appointment.breed && <span className="vet-appointments-card__breed"> ({appointment.breed})</span>}
          </h4>
          <p className="vet-appointments-card__owner">{t("vetAppointments.card.owner", { name: appointment.ownerName })}</p>
        </div>
      </div>

      <div className="vet-appointments-card__reason">
        {appointment.reason ? (
          reasonCategory === "emergency" ? (
            <div className="vet-appointments-card__reason-emergency">
              <Icon name="emergency" className="vet-appointments-card__reason-icon" />
              {appointment.reason}
            </div>
          ) : (
            <div className="vet-appointments-card__reason-text">{appointment.reason}</div>
          )
        ) : (
          <div className="vet-appointments-card__reason-text vet-appointments-card__reason-text--muted">
            {t("vetAppointments.card.noReason")}
          </div>
        )}
      </div>

      <div className="vet-appointments-card__side">
        <span className={`vet-appointments-card__badge vet-appointments-card__badge--${cls}`}>
          {t(`vetAppointments.status.${appointment.status}`, { defaultValue: appointment.status })}
        </span>

        {!isReadOnly && mode === "" && (
          <div className="vet-appointments-card__actions">
            {appointment.status === "Pending" && (
              <button
                type="button"
                className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--confirm"
                title={t("vetAppointments.actions.confirm")}
                disabled={busy}
                onClick={onConfirm}
              >
                <Icon name="check" />
              </button>
            )}
            {appointment.status === "Confirmed" && (
              <button
                type="button"
                className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--confirm"
                title={t("vetAppointments.actions.complete")}
                disabled={busy}
                onClick={onComplete}
              >
                <Icon name="done_all" />
              </button>
            )}
            <button
              type="button"
              className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--reschedule"
              title={t("vetAppointments.actions.reschedule")}
              disabled={busy}
              onClick={() => setMode("reschedule")}
            >
              <Icon name="schedule" />
            </button>
            <button
              type="button"
              className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--cancel"
              title={t("vetAppointments.actions.cancel")}
              disabled={busy}
              onClick={() => setMode("cancelConfirm")}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
      </div>

      {mode === "cancelConfirm" && (
        <div className="vet-appointments-card__confirm-bar">
          <span>{t("vetAppointments.cancelConfirm.message")}</span>
          <div className="vet-appointments-card__confirm-actions">
            <button
              type="button"
              className="vet-appointments-card__btn vet-appointments-card__btn--danger"
              disabled={busy}
              onClick={async () => {
                await onCancel();
                closeForms();
              }}
            >
              {t("vetAppointments.cancelConfirm.yes")}
            </button>
            <button type="button" className="vet-appointments-card__btn" onClick={closeForms} disabled={busy}>
              {t("vetAppointments.cancelConfirm.no")}
            </button>
          </div>
        </div>
      )}

      {mode === "reschedule" && (
        <form className="vet-appointments-card__reschedule-bar" onSubmit={submitReschedule}>
          <label>
            <span>{t("vetAppointments.reschedule.dateLabel")}</span>
            <input
              type="date"
              min={todayInputValue()}
              value={newDate}
              onChange={(event) => setNewDate(event.target.value)}
              required
            />
          </label>
          <label>
            <span>{t("vetAppointments.reschedule.timeLabel")}</span>
            <input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} required />
          </label>
          <div className="vet-appointments-card__confirm-actions">
            <button type="submit" className="vet-appointments-card__btn vet-appointments-card__btn--primary" disabled={busy || !newTime}>
              {busy ? t("vetAppointments.reschedule.saving") : t("vetAppointments.reschedule.save")}
            </button>
            <button type="button" className="vet-appointments-card__btn" onClick={closeForms} disabled={busy}>
              {t("vetAppointments.reschedule.cancel")}
            </button>
          </div>
          {formError && <p className="vet-appointments-card__form-error">{formError}</p>}
        </form>
      )}

      {error && (
        <p className="vet-appointments-card__row-error" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
