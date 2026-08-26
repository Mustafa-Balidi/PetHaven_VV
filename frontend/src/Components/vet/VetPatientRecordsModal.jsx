import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import NoValue from "../common/NoValue.jsx";
import { speciesIcon } from "../../utils/petIcons.js";
import { formatLocalizedDate } from "../../utils/localization.js";
import useModalA11y from "../../hooks/useModalA11y.js";

export default function VetPatientRecordsModal({
  detail,
  loading,
  error,
  onClose,
}) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const dialogRef = useModalA11y({ onClose });
  const tabRefs = useRef({});

  // A tablist is expected to behave like one: Left/Right (and Home/End)
  // move between tabs, and only the selected tab is a tab stop.
  function selectTab(tab) {
    setActiveTab(tab);
    tabRefs.current[tab]?.focus();
  }

  function handleTabKeyDown(event) {
    const order = ["overview", "medicalHistory"];
    const index = order.indexOf(activeTab);

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab(order[(index + 1) % order.length]);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab(order[(index - 1 + order.length) % order.length]);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(order[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(order[order.length - 1]);
    }
  }

  return (
    <div className="vet-patients-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="vet-patients-modal"
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("vetPatients.modal.title")}
        tabIndex={-1}
      >
        <button
          type="button"
          className="vet-patients-modal__close"
          onClick={onClose}
          aria-label={t("vetPatients.modal.close")}
        >
          <Icon name="close" />
        </button>

        {loading ? (
          <p className="vet-patients-empty" role="status">{t("vetPatients.modal.loading")}</p>
        ) : error ? (
          <div className="vet-patients-alert" role="alert">
            <span>{error}</span>
          </div>
        ) : detail ? (
          <>
            <div
              className="vet-patients-modal__tabs"
              role="tablist"
              aria-label={t("vetPatients.modal.recordSections")}
              onKeyDown={handleTabKeyDown}
            >
              <button
                type="button"
                id="vet-patient-overview-tab"
                ref={(node) => {
                  tabRefs.current.overview = node;
                }}
                className={`vet-patients-modal__tab${activeTab === "overview" ? " vet-patients-modal__tab--active" : ""}`}
                role="tab"
                aria-selected={activeTab === "overview"}
                aria-controls="vet-patient-overview-panel"
                tabIndex={activeTab === "overview" ? 0 : -1}
                onClick={() => setActiveTab("overview")}
              >
                {t("vetPatients.modal.overview")}
              </button>
              <button
                type="button"
                id="vet-patient-medical-history-tab"
                ref={(node) => {
                  tabRefs.current.medicalHistory = node;
                }}
                className={`vet-patients-modal__tab${activeTab === "medicalHistory" ? " vet-patients-modal__tab--active" : ""}`}
                role="tab"
                aria-selected={activeTab === "medicalHistory"}
                aria-controls="vet-patient-medical-history-panel"
                tabIndex={activeTab === "medicalHistory" ? 0 : -1}
                onClick={() => setActiveTab("medicalHistory")}
              >
                {t("vetPatients.modal.medicalHistory")}
              </button>
            </div>

            {activeTab === "overview" && (
              <div
                id="vet-patient-overview-panel"
                role="tabpanel"
                aria-labelledby="vet-patient-overview-tab"
                tabIndex={0}
              >
                <div className="vet-patients-modal__head">
                  <span className="vet-patients-modal__avatar">
                    {detail.imageUrl ? (
                      <img src={detail.imageUrl} alt={detail.petName} />
                    ) : (
                      <Icon name={speciesIcon(detail.species)} />
                    )}
                  </span>
                  <div>
                    <h2 className="vet-patients-modal__name">{detail.petName}</h2>
                    <p className="vet-patients-modal__meta">
                      {[detail.breed, detail.species].filter(Boolean).join(" • ")}
                      {detail.patientIdDisplay ? ` — ${detail.patientIdDisplay}` : ""}
                    </p>
                  </div>
                </div>

                <dl className="vet-patients-modal__grid">
                  <div>
                    <dt>{t("vetPatients.card.owner")}</dt>
                    <dd>{detail.ownerName || <NoValue />}</dd>
                  </div>
                  <div>
                    <dt>{t("vetPatients.modal.age")}</dt>
                    <dd>{detail.age ?? <NoValue />}</dd>
                  </div>
                  <div>
                    <dt>{t("vetPatients.modal.gender")}</dt>
                    <dd>{detail.gender || <NoValue />}</dd>
                  </div>
                  <div>
                    <dt>{t("vetPatients.card.lastVisit")}</dt>
                    <dd>
                      {detail.lastVisitDate
                        ? formatLocalizedDate(detail.lastVisitDate, i18n.language, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : <NoValue />}
                    </dd>
                  </div>
                  <div>
                    <dt>{t("vetPatients.card.visitCount")}</dt>
                    <dd>{detail.visitCount}</dd>
                  </div>
                </dl>
              </div>
            )}

            {activeTab === "medicalHistory" && (
              <section
                id="vet-patient-medical-history-panel"
                className="vet-patients-modal__section"
                role="tabpanel"
                aria-labelledby="vet-patient-medical-history-tab"
                tabIndex={0}
              >
                <h3>{t("vetPatients.modal.medicalHistory")}</h3>
                {detail.medicalHistory.length ? (
                  <ul className="vet-patients-modal__timeline">
                    {detail.medicalHistory.map((entry) => (
                      <li key={entry.id}>
                        <span className="vet-patients-modal__timeline-date">
                          {formatLocalizedDate(entry.date, i18n.language, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div>
                          <p className="vet-patients-modal__timeline-title">{entry.title}</p>
                          {entry.description && (
                            <p className="vet-patients-modal__timeline-desc">{entry.description}</p>
                          )}
                          {entry.doctorName && (
                            <p className="vet-patients-modal__timeline-doctor">{entry.doctorName}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="vet-patients-empty">{t("vetPatients.modal.noMedicalHistory")}</p>
                )}
              </section>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
