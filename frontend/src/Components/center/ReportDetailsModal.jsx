import { useId } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import useModalA11y from "../../hooks/useModalA11y.js";

export default function ReportDetailsModal({ report, onClose }) {
  const { t: translate } = useTranslation();
  const titleId = useId();
  const dialogRef = useModalA11y({ onClose });
  const td = translate("center.reports.details", { returnObjects: true });
  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={td.close} className="center-modal-backdrop" onClick={onClose} />
      <div
        className="center-modal-panel center-modal-panel--xl"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="center-modal-header">
          <h2 id={titleId} className="center-modal-title">{td.title}</h2>
          <button type="button" aria-label={td.close} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <div className="center-report-details-summary">
            <img src={report.adopterImage} alt={report.adopterName} className="center-report-details-summary__avatar" />
            <div>
              <h3 className="center-report-details-summary__name">{report.adopterName}</h3>
              <p className="center-report-details-summary__sub">
                {td.adopterOfPrefix} '{report.petName}'
              </p>
              <div className="center-report-details-summary__date">
                <Icon name="calendar_today" />
                <span>
                  {td.submittedLabel} {report.submittedDate}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="center-modal-section-label">{td.healthAssessmentTitle}</h4>
            <div className="center-modal-review-box">
              <p>{report.healthCondition}</p>
            </div>
          </div>

          <div>
            <h4 className="center-modal-section-label center-modal-section-label--icon">
              <Icon name="photo_camera" />
              {td.milestoneTitle}
            </h4>
            <div className="center-report-details-quote">
              <Icon name="format_quote" className="center-report-details-quote__mark" />
              <p>"{report.quote}"</p>
            </div>
          </div>
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-outline" onClick={onClose}>
            {td.close}
          </button>
        </div>
      </div>
    </div>
  );
}
