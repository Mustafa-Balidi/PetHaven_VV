import { useEffect } from "react";
import Icon from "../Icon.jsx";

export default function AdminConfirmDialog({
  open,
  title,
  message,
  details,
  confirmLabel,
  cancelLabel,
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !busy) onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="admin-modal__backdrop"
        aria-label={cancelLabel}
        onClick={busy ? undefined : onCancel}
      />
      <div className={`admin-modal__panel${danger ? " admin-modal__panel--danger" : ""}`}>
        <div className="admin-modal__icon" aria-hidden="true">
          <Icon name={danger ? "warning" : "help"} />
        </div>
        <h2 className="admin-modal__title">{title}</h2>
        <p className="admin-modal__message">{message}</p>
        {details ? <div className="admin-modal__details">{details}</div> : null}
        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`admin-btn ${danger ? "admin-btn--danger" : "admin-btn--primary"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
