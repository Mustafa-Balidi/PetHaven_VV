import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function AdoptionApplicationReview({ request, onApprove, onReject, onClose }) {
  const { t: translate } = useTranslation();
  const tr = translate("center.adoptionRequests.review", { returnObjects: true });
  const modalClose = translate("center.modals.close");

  const STATUS_BADGE = {
    Pending: { className: "center-requests-status--pending", label: tr.pendingReviewBadge },
    Approved: { className: "center-requests-status--approved", label: tr.approvedBadge },
    Rejected: { className: "center-requests-status--rejected", label: tr.rejectedBadge },
  };

  const [approving, setApproving] = useState(false);
  const badge = STATUS_BADGE[request.status] || STATUS_BADGE.Pending;

  async function handleApprove() {
    setApproving(true);
    try {
      await onApprove(request.id);
    } finally {
      setApproving(false);
    }
  }

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={modalClose} className="center-modal-backdrop" onClick={onClose} />
      <div className="center-modal-panel center-modal-panel--xl">
        <div className="center-modal-header">
          <h2 className="center-modal-title">
            {tr.titlePrefix} {request.pet.name}
          </h2>
          <button type="button" aria-label={modalClose} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <div className="center-modal-review-banner">
            <div>
              <h3 className="center-modal-review-banner__name">{request.applicant.name}</h3>
              <div className="center-modal-review-banner__meta">
                <Icon name="calendar_today" />
                <span>{tr.appliedLabel} {request.appliedDate}</span>
                <span className={`center-requests-status ${badge.className}`}>{badge.label}</span>
              </div>
              <div className="center-modal-review-banner__meta">
                <Icon name="mail" />
                <span>
                  {request.applicant.email ?? "—"} | {request.applicant.phone ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="center-modal-review-pet">
            {request.pet.image ? (
              <img src={request.pet.image} alt={request.pet.name} className="center-modal-review-pet__thumb" />
            ) : (
              <div className="center-modal-review-pet__thumb center-modal-review-pet__thumb--placeholder">
                <Icon name="pets" />
              </div>
            )}
            <div>
              <h4 className="center-modal-review-pet__name">{request.pet.name}</h4>
              <p className="center-modal-review-pet__meta">
                {request.pet.breed ?? "—"} • {request.pet.age ?? "—"} • {request.pet.gender ?? "—"}
              </p>
              <Link to="/pet-profile" className="center-modal-review-pet__link">
                {tr.petProfileLink}
                <Icon name="open_in_new" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="center-modal-section-label">{tr.motivationTitle}</h4>
            <div className="center-modal-review-box">
              <p>{request.motivation ?? "—"}</p>
            </div>
          </div>

          <div>
            <h4 className="center-modal-section-label">{tr.detailsTitle}</h4>
            <div className="center-modal-detail-grid">
              <div className="center-modal-detail-card">
                <div className="center-modal-detail-card__head">
                  <Icon name="fingerprint" />
                  <span>{tr.proofOfIdentity}</span>
                </div>
                <p className="center-modal-detail-card__value">{request.proofOfIdentity?.status ?? "—"}</p>
                <p className="center-modal-detail-card__hint">{request.proofOfIdentity?.file ?? ""}</p>
              </div>

              <div className="center-modal-detail-card">
                <div className="center-modal-detail-card__head">
                  <Icon name="history" />
                  <span>{tr.adoptionExperience}</span>
                </div>
                <p className="center-modal-detail-card__value">{request.experience?.status ?? "—"}</p>
                <p className="center-modal-detail-card__hint">{request.experience?.detail ?? ""}</p>
              </div>

              <div className="center-modal-detail-card">
                <div className="center-modal-detail-card__head">
                  <Icon name="calendar_today" />
                  <span>{tr.dateOfBirth}</span>
                </div>
                <p className="center-modal-detail-card__value">{request.applicant.dob ?? "—"}</p>
                <p className="center-modal-detail-card__hint">
                  {tr.ageVerifiedPrefix} {request.applicant.age ?? "—"} {tr.yearsSuffix}
                </p>
              </div>

              <div className="center-modal-detail-card">
                <div className="center-modal-detail-card__head">
                  <Icon name="person" />
                  <span>{tr.reference1}</span>
                </div>
                <p className="center-modal-detail-card__value">{request.references?.[0]?.name ?? "—"}</p>
                <p className="center-modal-detail-card__hint">{request.references?.[0]?.phone ?? ""}</p>
              </div>

              <div className="center-modal-detail-card">
                <div className="center-modal-detail-card__head">
                  <Icon name="person" />
                  <span>{tr.reference2}</span>
                </div>
                <p className="center-modal-detail-card__value">{request.references?.[1]?.name ?? "—"}</p>
                <p className="center-modal-detail-card__hint">{request.references?.[1]?.phone ?? ""}</p>
              </div>

              <div className="center-modal-detail-card center-modal-detail-card--span">
                <div className="center-modal-detail-card__head">
                  <Icon name="verified_user" />
                  <span>{tr.consentsTitle}</span>
                </div>
                <div className="center-modal-consents">
                  <div className="center-modal-consent-item">
                    <Icon name="check_circle" filled />
                    <span>{tr.consentTerms}</span>
                  </div>
                  <div className="center-modal-consent-item">
                    <Icon name="check_circle" filled />
                    <span>{tr.consentCare}</span>
                  </div>
                  <div className="center-modal-consent-item">
                    <Icon name="check_circle" filled />
                    <span>{tr.consentHomeVisit}</span>
                  </div>
                  <div className="center-modal-consent-item">
                    <Icon name="check_circle" filled />
                    <span>{tr.consentFollowUp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-outline-danger" onClick={() => onReject(request)}>
            {tr.rejectButton}
          </button>
          <button type="button" className="center-modal-btn-outline" onClick={onClose}>
            {tr.requestMoreInfo}
          </button>
          <button type="button" className="center-modal-btn-primary" disabled={approving} onClick={handleApprove}>
            <Icon name="check_circle" filled />
            {tr.approveButton}
          </button>
        </div>
      </div>
    </div>
  );
}
