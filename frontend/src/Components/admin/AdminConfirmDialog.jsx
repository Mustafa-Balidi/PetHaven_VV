import { useId, useRef } from "react";
import Icon from "../Icon.jsx";
import useModalA11y from "../../hooks/useModalA11y.js";

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
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const messageId = `${baseId}-message`;
  const detailsId = `${baseId}-details`;
  // Destructive dialogs open on the safe choice, so Enter never confirms by
  // accident and Escape and the focused button do the same thing.
  const cancelRef = useRef(null);

  const dialogRef = useModalA11y({
    open,
    onClose: onCancel,
    closeOnEscape: !busy,
    initialFocusRef: cancelRef,
  });

  if (!open) return null;

  return (
    <div className="admin-modal" role="presentation">
      {/* Decorative click-to-dismiss surface: Escape and the Cancel button
          already expose closing to the keyboard, so it stays out of the tab
          order and out of the accessibility tree. */}
      <div
        className="admin-modal__backdrop"
        aria-hidden="true"
        onClick={busy ? undefined : onCancel}
      />
      <div
        className={`admin-modal__panel${danger ? " admin-modal__panel--danger" : ""}`}
        ref={dialogRef}
        role={danger ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={details ? `${messageId} ${detailsId}` : messageId}
        aria-busy={busy || undefined}
        tabIndex={-1}
      >
        <div className="admin-modal__icon" aria-hidden="true">
          <Icon name={danger ? "warning" : "help"} />
        </div>
        <h2 className="admin-modal__title" id={titleId}>
          {title}
        </h2>
        <p className="admin-modal__message" id={messageId}>
          {message}
        </p>
        {details ? (
          <div className="admin-modal__details" id={detailsId}>
            {details}
          </div>
        ) : null}
        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            ref={cancelRef}
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
