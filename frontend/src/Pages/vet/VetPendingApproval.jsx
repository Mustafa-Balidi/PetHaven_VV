import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import Icon from "../../Components/Icon.jsx";
import { logoutUser } from "../../api/authApi.js";
import { VET_VERIFICATION_STATE } from "../../utils/vetVerification.js";
import { useVetContext } from "../../context/vetContextBase.js";
import "../../Styling/VetPendingApproval.css";

export default function VetPendingApproval() {
  const { t } = useTranslation();
  useDocumentTitle(t("vetPendingApproval.title"));
  const navigate = useNavigate();
  // The route guard has already resolved the status into the shared context,
  // so this page reads it instead of issuing a second identical request.
  const {
    verification,
    verificationLoading: loading,
    verificationError: error,
    verificationState: state,
    refreshVerification,
  } = useVetContext();

  const loadStatus = useCallback(() => {
    refreshVerification().catch(() => {
      /* surfaced through `error` below */
    });
  }, [refreshVerification]);

  // An admin decision lands while this tab sits open, so returning to it
  // re-checks. The guard reacts to the refreshed context on the next render;
  // these navigations only cover the states the guard also allows here.
  useEffect(() => {
    const handleFocus = () => loadStatus();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadStatus]);

  useEffect(() => {
    if (state === VET_VERIFICATION_STATE.APPROVED) {
      navigate("/vet/dashboard", { replace: true });
    } else if (state === VET_VERIFICATION_STATE.NOT_SUBMITTED) {
      navigate("/vet/professional-verification", { replace: true });
    }
  }, [state, navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/", { replace: true });
  }

  const rejected = state === VET_VERIFICATION_STATE.REJECTED;

  return (
    <div className="vet-pending-page">
      <VetHeader />

      <div className="vet-pending-page__glow" aria-hidden="true">
        <div className="vet-pending-page__glow-blob vet-pending-page__glow-blob--top" />
        <div className="vet-pending-page__glow-blob vet-pending-page__glow-blob--bottom" />
      </div>

      <main id="main-content" tabIndex={-1} className="vet-pending-main">
        <div className="vet-pending-card">
          <div className="vet-pending-icon">
            <div className="vet-pending-icon__circle">
              <Icon name="hourglass_empty" />
              <div className="vet-pending-icon__badge">
                <Icon name="schedule" filled />
              </div>
            </div>
          </div>

          <h1 className="vet-pending-title">
            {rejected ? t("vetPendingApproval.rejectedTitle") : t("vetPendingApproval.title")}
          </h1>

          <div className="vet-pending-body">
            {loading ? (
              <p className="vet-pending-message" role="status">{t("vetPendingApproval.checkingStatus")}</p>
            ) : error ? (
              <div role="alert" className="vet-pending-note">
                <p>{error}</p>
                <button type="button" className="vet-pending-btn vet-pending-btn--secondary" onClick={loadStatus}>
                  {t("vetPendingApproval.retry")}
                </button>
              </div>
            ) : rejected ? (
              <div className="vet-pending-note">
                <p>{t("vetPendingApproval.rejectedMessage")}</p>
                {verification?.rejectionReason && <p>{verification.rejectionReason}</p>}
              </div>
            ) : (
              <>
                <p className="vet-pending-message">{t("vetPendingApproval.message")}</p>
                <div className="vet-pending-note"><p>{t("vetPendingApproval.note")}</p></div>
              </>
            )}
          </div>

          <div className="vet-pending-actions">
            <button
              type="button"
              className="vet-pending-btn vet-pending-btn--secondary"
              onClick={handleLogout}
            >
              <Icon name="logout" />
              {t("vetPendingApproval.logOut")}
            </button>
            <a href="mailto:support@pethaven.app" className="vet-pending-btn vet-pending-btn--primary">
              {t("vetPendingApproval.contactSupport")}
            </a>
            {rejected && (
              <button
                type="button"
                className="vet-pending-btn vet-pending-btn--primary"
                onClick={() => navigate("/vet/professional-verification")}
              >
                {t("vetPendingApproval.resubmit")}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
