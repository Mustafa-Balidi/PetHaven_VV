import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VetHeader from "../../Components/common/header/VetHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import useDocumentTitle from "../../hooks/useDocumentTitle.js";
import Icon from "../../Components/Icon.jsx";
import { logoutUser } from "../../api/authApi.js";
import "../../Styling/VetPendingApproval.css";

export default function VetPendingApproval() {
  const { t } = useTranslation();
  useDocumentTitle(t("vetPendingApproval.title"));
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/", { replace: true });
  }

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

          <h1 className="vet-pending-title">{t("vetPendingApproval.title")}</h1>

          <div className="vet-pending-body">
            <p className="vet-pending-message">{t("vetPendingApproval.message")}</p>
            <div className="vet-pending-note">
              <p>{t("vetPendingApproval.note")}</p>
            </div>
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
          </div>

          <p className="vet-pending-application-id">
            {t("vetPendingApproval.applicationIdLabel")}{" "}
            <span className="vet-pending-application-id__value">VET-7829-XJ</span>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
