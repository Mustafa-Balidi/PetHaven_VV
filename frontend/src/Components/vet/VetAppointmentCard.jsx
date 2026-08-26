import { useEffect, useId, useRef, useState } from "react";
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

  const petHeadingId = useId();
  const rescheduleBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const confirmYesRef = useRef(null);
  const rescheduleDateRef = useRef(null);
  // Which action button the inline panel was opened from, so focus can go back
  // there when the panel closes.
  const returnToRef = useRef(null);

  const cls = statusClass(appointment.status);
  const isReadOnly = appointment.status === "Completed" || appointment.status === "Cancelled";
  const isDimmed = appointment.status === "Completed";
  const reasonCategory = classifyReason(appointment.reason);
  const [timeValue, timePeriod] = (appointment.timeDisplay || "").split(" ");

  // Opening a panel unmounts the action buttons and closing it unmounts the
  // panel; without this the keyboard user is dropped back onto <body>.
  useEffect(() => {
    if (mode === "cancelConfirm") {
      confirmYesRef.current?.focus();
      return;
    }
    if (mode === "reschedule") {
      rescheduleDateRef.current?.focus();
      return;
    }
    if (!returnToRef.current) return;

    const target = returnToRef.current === "reschedule" ? rescheduleBtnRef : cancelBtnRef;
    returnToRef.current = null;
    target.current?.focus();
  }, [mode]);

  function openMode(next) {
    returnToRef.current = next;
    setMode(next);
  }

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
    <article
      className={`vet-appointments-card vet-appointments-card--${cls}${isDimmed ? " vet-appointments-card--dimmed" : ""}`}
      aria-labelledby={petHeadingId}
      aria-busy={busy || undefined}
    >
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
          <h3 className="vet-appointments-card__pet" id={petHeadingId}>
            {appointment.petName}
            {appointment.breed && <span className="vet-appointments-card__breed"> ({appointment.breed})</span>}
          </h3>
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

        {/* The icon buttons repeat on every card, so the accessible name has to
            name the appointment they act on; `title` alone also never reaches
            a touch-screen user. */}
        {!isReadOnly && mode === "" && (
          <div className="vet-appointments-card__actions">
            {appointment.status === "Pending" && (
              <button
                type="button"
                className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--confirm"
                title={t("vetAppointments.actions.confirm")}
                aria-label={t("vetAppointments.actions.confirmFor", { name: appointment.petName })}
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
                aria-label={t("vetAppointments.actions.completeFor", { name: appointment.petName })}
                disabled={busy}
                onClick={onComplete}
              >
                <Icon name="done_all" />
              </button>
            )}
            <button
              type="button"
              ref={rescheduleBtnRef}
              className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--reschedule"
              title={t("vetAppointments.actions.reschedule")}
              aria-label={t("vetAppointments.actions.rescheduleFor", { name: appointment.petName })}
              disabled={busy}
              onClick={() => openMode("reschedule")}
            >
              <Icon name="schedule" />
            </button>
            <button
              type="button"
              ref={cancelBtnRef}
              className="vet-appointments-card__icon-btn vet-appointments-card__icon-btn--cancel"
              title={t("vetAppointments.actions.cancel")}
              aria-label={t("vetAppointments.actions.cancelFor", { name: appointment.petName })}
              disabled={busy}
              onClick={() => openMode("cancelConfirm")}
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
              ref={confirmYesRef}
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
              ref={rescheduleDateRef}
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
            <button
              type="submit"
              className="vet-appointments-card__btn vet-appointments-card__btn--primary"
              disabled={busy || !newTime}
              aria-busy={busy || undefined}
            >
              {busy ? t("vetAppointments.reschedule.saving") : t("vetAppointments.reschedule.save")}
            </button>
            <button type="button" className="vet-appointments-card__btn" onClick={closeForms} disabled={busy}>
              {t("vetAppointments.reschedule.cancel")}
            </button>
          </div>
          {formError && (
            <p className="vet-appointments-card__form-error" role="alert">
              {formError}
            </p>
          )}
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
