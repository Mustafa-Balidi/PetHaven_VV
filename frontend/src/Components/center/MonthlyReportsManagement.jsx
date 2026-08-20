import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import Toast from "../Toast.jsx";
import BlockAdopterModal from "./BlockAdopterModal.jsx";
import ReportDetailsModal from "./ReportDetailsModal.jsx";

const DUE_STATUS_CLASS = {
  Overdue: "center-reports-due-table__status--overdue",
};

export default function MonthlyReportsManagement({ reports, loading, error, onBlock }) {
  const { t: translate } = useTranslation();
  const t = translate("center.reports", { returnObjects: true });
  const submitted = reports?.submitted ?? [];
  const dueForReport = reports?.dueForReport ?? [];
  const [viewingReport, setViewingReport] = useState(null);
  const [blockingReport, setBlockingReport] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  async function handleBlock(payload) {
    await onBlock(payload);
    setBlockingReport(null);
    setToastMessage(t.block.success);
  }

  if (loading) {
    return <div className="center-vacc-page-loading">{error || translate("center.vaccinations.loading")}</div>;
  }

  return (
    <div className="center-reports-card">
      <section className="center-reports-section">
        <h2 className="center-reports-section-title">{t.submitted.title}</h2>
        {submitted.length === 0 ? (
          <p className="center-reports-empty">{t.submitted.empty}</p>
        ) : (
          <div className="center-reports-submitted-list">
            {submitted.map((report) => (
              <article key={report.id} className="center-reports-submitted-item">
                <img
                  src={report.adopterImage}
                  alt={report.adopterName}
                  className="center-reports-submitted-item__avatar"
                />
                <div className="center-reports-submitted-item__body">
                  <div className="center-reports-submitted-item__head">
                    <h3 className="center-reports-submitted-item__name">
                      {report.adopterName} ({t.submitted.adopterOf} '{report.petName}')
                    </h3>
                    <span className="center-reports-submitted-item__date">
                      {t.submitted.submittedLabel} {report.submittedDate}
                    </span>
                  </div>
                  <p className="center-reports-submitted-item__condition">
                    <span className="center-reports-submitted-item__condition-label">
                      {t.submitted.healthConditionLabel}
                    </span>{" "}
                    {report.healthCondition}
                  </p>
                  <p className="center-reports-submitted-item__quote">"{report.quote}"</p>
                </div>
                <div className="center-reports-submitted-item__actions">
                  <button
                    type="button"
                    aria-label={t.submitted.viewDetails}
                    title={t.submitted.viewDetails}
                    className="center-reports-btn-view"
                    onClick={() => setViewingReport(report)}
                  >
                    <Icon name="visibility" />
                  </button>
                  <button type="button" className="center-reports-btn-flag" onClick={() => setBlockingReport(report)}>
                    {t.submitted.reportToManagement}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="center-reports-section">
        <h2 className="center-reports-section-title">{t.dueForReport.title}</h2>
        <div className="center-reports-due-table-wrap">
          <table className="center-reports-due-table">
            <thead>
              <tr>
                <th>{t.dueForReport.columns.animalName}</th>
                <th>{t.dueForReport.columns.adopter}</th>
                <th>{t.dueForReport.columns.adoptionDate}</th>
                <th>{t.dueForReport.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {dueForReport.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.animalName} ({item.breed})
                  </td>
                  <td>{item.adopter}</td>
                  <td>{item.adoptionDate}</td>
                  <td>
                    <span
                      className={`center-reports-due-table__status ${
                        DUE_STATUS_CLASS[item.status] || "center-reports-due-table__status--due-soon"
                      }`}
                    >
                      {translate(`center.status.${item.status}`, { defaultValue: item.status })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {viewingReport && (
        <ReportDetailsModal report={viewingReport} onClose={() => setViewingReport(null)} />
      )}
      {blockingReport && (
        <BlockAdopterModal
          report={blockingReport}
          onClose={() => setBlockingReport(null)}
          onConfirm={handleBlock}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </div>
  );
}
