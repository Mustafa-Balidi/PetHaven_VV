import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import useModalA11y from "../../hooks/useModalA11y.js";

const MAX_LENGTH = 500;

export default function RejectApplication({ request, onConfirm, onClose }) {
  const { t: translate } = useTranslation();
  const titleId = useId();
  const tr = translate("center.adoptionRequests.reject", { returnObjects: true });
  const modalClose = translate("center.modals.close");
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const dialogRef = useModalA11y({ onClose, closeOnEscape: !rejecting });

  function handleQuickInsert(text) {
    setReason((prev) => (prev ? `${prev} ${text}.` : `${text}.`));
  }

  async function handleConfirm() {
    setRejecting(true);
    try {
      await onConfirm(request.id, reason);
    } finally {
      setRejecting(false);
    }
  }

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={tr.cancel} className="center-modal-backdrop" onClick={onClose} />
      <div
        className="center-modal-panel center-modal-panel--sm"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="center-modal-header">
          <h2 id={titleId} className="center-modal-title">{tr.title}</h2>
          <button type="button" aria-label={modalClose} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <p className="center-modal-reject__description">{tr.description}</p>

          <div className="center-modal-field">
            <label htmlFor="reject-application-reason" className="center-modal-label">
              {tr.reasonLabel} <span className="center-modal-reject__required">*</span>
            </label>
            <textarea
              id="reject-application-reason"
              className="center-modal-textarea"
              placeholder={tr.reasonPlaceholder}
              rows={4}
              maxLength={MAX_LENGTH}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="center-modal-reject__char-count">
              {reason.length} / {MAX_LENGTH} {tr.charCountSuffix}
            </p>
          </div>

          <div>
            <span className="center-modal-reject__quick-label">{tr.quickInsertLabel}</span>
            <div className="center-modal-reject__quick-list">
              {tr.quickReasons.map((reasonText) => (
                <button
                  key={reasonText}
                  type="button"
                  className="center-modal-reject__quick-btn"
                  onClick={() => handleQuickInsert(reasonText)}
                >
                  {reasonText}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-outline" onClick={onClose}>
            {tr.cancel}
          </button>
          <button
            type="button"
            className="center-modal-btn-outline-danger"
            disabled={rejecting || !reason.trim()}
            onClick={handleConfirm}
          >
            <Icon name="cancel" />
            {tr.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
}
