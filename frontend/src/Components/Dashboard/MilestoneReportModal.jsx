import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MilestoneReportModal({ petName, submitting, error, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [healthStatus, setHealthStatus] = useState("Healthy");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !healthStatus.trim() || !imageUrl.trim()) return;
    onSubmit({ healthStatus, notes, imageUrl });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="milestone-report-title" onClick={onClose}>
      <div className="modal-container" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          disabled={submitting}
          aria-label={t("adopter.dashboard.milestoneModal.close")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>

        <div className="modal-header">
          <div className="modal-icon-circle">
            <span className="material-symbols-outlined" aria-hidden="true">add_a_photo</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-intro">
            <h2 className="modal-title" id="milestone-report-title">
              {t("adopter.dashboard.milestoneModal.title")}
            </h2>
            <p className="modal-desc">
              {t("adopter.dashboard.milestoneModal.description", { petName })}
            </p>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="milestone-health-status">
                {t("adopter.dashboard.milestoneModal.healthStatus")}
              </label>
              <select
                id="milestone-health-status"
                className="select-input"
                value={healthStatus}
                onChange={(event) => setHealthStatus(event.target.value)}
                disabled={submitting}
                required
              >
                <option value="Healthy">{t("adopter.dashboard.milestoneModal.healthOptions.healthy")}</option>
                <option value="Good">{t("adopter.dashboard.milestoneModal.healthOptions.good")}</option>
                <option value="Needs Attention">{t("adopter.dashboard.milestoneModal.healthOptions.needsAttention")}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="milestone-image-url">
                {t("adopter.dashboard.milestoneModal.imageUrl")}
              </label>
              <input
                id="milestone-image-url"
                className="text-input"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder={t("adopter.dashboard.milestoneModal.imageUrlPlaceholder")}
                disabled={submitting}
                required
              />
              <p className="form-hint">{t("adopter.dashboard.milestoneModal.imageUrlHint")}</p>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="milestone-notes">
                  {t("adopter.dashboard.milestoneModal.note")}
                </label>
                <span className="form-optional">{t("adopter.dashboard.milestoneModal.optional")}</span>
              </div>
              <textarea
                id="milestone-notes"
                className="textarea-input"
                rows="4"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t("adopter.dashboard.milestoneModal.notePlaceholder")}
                disabled={submitting}
              />
            </div>

            {error && <p className="modal-form-message modal-form-message--error" role="alert">{error}</p>}

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
                {t("adopter.dashboard.milestoneModal.cancel")}
              </button>
              <button type="submit" className="btn-submit" disabled={submitting || !imageUrl.trim()}>
                {submitting
                  ? t("adopter.dashboard.milestoneModal.sending")
                  : t("adopter.dashboard.milestoneModal.send")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
