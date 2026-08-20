import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function BlockAdopterModal({ report, onClose, onConfirm }) {
  const { t: translate } = useTranslation();
  const t = translate("center.reports.block", { returnObjects: true });
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedReason = reason.trim();
    if (!normalizedReason) return;
    if (!Number.isInteger(Number(report.adopterId)) || Number(report.adopterId) <= 0) {
      setError(t.invalidAdopter);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onConfirm({ adopterId: report.adopterId, reason: normalizedReason });
    } catch (requestError) {
      setError(requestError.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={t.cancel} className="center-modal-backdrop" onClick={onClose} disabled={submitting} />
      <form className="center-modal-panel center-modal-panel--sm center-block-modal" onSubmit={handleSubmit}>
        <div className="center-modal-header">
          <h2 className="center-modal-title">{t.title}</h2>
          <button type="button" aria-label={t.cancel} className="center-modal-close-btn" onClick={onClose} disabled={submitting}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <p className="center-block-modal__message">
            {t.confirmation} <strong>{report.adopterName}</strong>
          </p>
          <label className="center-block-modal__field">
            <span>{t.reasonLabel}</span>
            <textarea
              rows="4"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t.reasonPlaceholder}
              disabled={submitting}
              required
              autoFocus
            />
          </label>
          {error && <p className="center-block-modal__error" role="alert">{error}</p>}
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-cancel" onClick={onClose} disabled={submitting}>
            {t.cancel}
          </button>
          <button type="submit" className="center-modal-btn-danger" disabled={submitting || !reason.trim()}>
            {submitting ? t.blocking : t.confirm}
          </button>
        </div>
      </form>
    </div>
  );
}
