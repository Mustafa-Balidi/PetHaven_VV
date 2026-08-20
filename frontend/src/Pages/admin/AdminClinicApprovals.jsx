import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminSidebar from "../../Components/admin/AdminSidebar.jsx";
import AdminNavbar from "../../Components/admin/AdminNavbar.jsx";
import Icon from "../../Components/Icon.jsx";
import { useAdminContext } from "../../context/adminContextBase";

export default function AdminClinicApprovals() {
  const { t: translate } = useTranslation();
  const adminText = { clinicApprovals: translate("admin.clinicApprovals", { returnObjects: true }) };
  const {
    clinicApprovals,
    approvalsLoading: loading,
    fetchApprovals,
  } = useAdminContext();

  const pendingRequests = clinicApprovals?.pendingRequests ?? [];
  const recentDecisions = clinicApprovals?.recentDecisions ?? [];

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminNavbar />
        <main className="admin-content">
          {loading ? (
            <div className="admin-loading">{adminText.clinicApprovals.loading}</div>
          ) : (
            <div className="admin-approvals-page">
              <section className="admin-approvals-header">
                <h1 className="admin-approvals-header__title">{adminText.clinicApprovals.title}</h1>
                <p className="admin-approvals-header__subtitle">
                  {adminText.clinicApprovals.subtitle}
                </p>
              </section>

              <section className="admin-approvals-section">
                <div className="admin-approvals-section__header">
                  <h2 className="admin-approvals-section__title">
                    <Icon name="pending_actions" className="admin-approvals-section__icon admin-approvals-section__icon--pending" />
                    {adminText.clinicApprovals.pendingRequests}
                    <span className="admin-approvals-badge">{pendingRequests.length}</span>
                  </h2>
                  <button type="button" className="admin-approvals-filter-btn">
                    {adminText.clinicApprovals.filter} <Icon name="filter_list" />
                  </button>
                </div>

                <div className="admin-card admin-approvals-table-card">
                  <div className="admin-approvals-table-card__scroll">
                    <table className="admin-approvals-table">
                      <thead>
                        <tr>
                          <th>{adminText.clinicApprovals.table.centerName}</th>
                          <th>{adminText.clinicApprovals.table.contactPerson}</th>
                          <th>{adminText.clinicApprovals.table.submissionDate}</th>
                          <th>{adminText.clinicApprovals.table.licenseVerification}</th>
                          <th className="admin-approvals-table__actions-head">{adminText.clinicApprovals.table.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map((req) => (
                          <tr key={req.id} className="admin-approvals-table__row">
                            <td>
                              <div className="admin-approvals-center">
                                <div className="admin-approvals-center__logo">
                                  {req.logoUrl ? (
                                    <img src={req.logoUrl} alt={translate("admin.clinicApprovals.centerLogoAlt", { name: req.name })} />
                                  ) : (
                                    <Icon name="local_hospital" className="admin-approvals-center__logo-fallback" />
                                  )}
                                </div>
                                <div>
                                  <p className="admin-approvals-center__name">{req.name}</p>
                                  <p className="admin-approvals-center__location">
                                    <Icon name="location_on" /> {req.location}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="admin-approvals-contact__name">{req.contactName}</p>
                              <p className="admin-approvals-contact__email">{req.contactEmail}</p>
                            </td>
                            <td className="admin-approvals-table__date">{req.submissionDate}</td>
                            <td>
                              <button type="button" className="admin-approvals-doc-btn">
                                <Icon name="description" />
                                {adminText.clinicApprovals.viewDocument}
                              </button>
                            </td>
                            <td className="admin-approvals-table__actions">
                              <button type="button" className="admin-approvals-reject-btn">{adminText.clinicApprovals.reject}</button>
                              <button type="button" className="admin-approvals-activate-btn">{adminText.clinicApprovals.activate}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="admin-approvals-section admin-approvals-audit">
                <h2 className="admin-approvals-section__title">
                  <Icon name="history" className="admin-approvals-section__icon" />
                  {adminText.clinicApprovals.recentDecisions}
                </h2>
                <div className="admin-approvals-audit__grid">
                  {recentDecisions.map((decision) => (
                    <div
                      key={decision.id}
                      className={`admin-card admin-approvals-audit-item${
                        decision.status === "rejected" ? " admin-approvals-audit-item--rejected" : ""
                      }`}
                    >
                      <div className="admin-approvals-audit-item__top">
                        <div>
                          <p className="admin-approvals-audit-item__name">{decision.name}</p>
                          <p className="admin-approvals-audit-item__processor">
                            {adminText.clinicApprovals.processedByPrefix} {decision.processedBy}
                          </p>
                        </div>
                        <span
                          className={`admin-approvals-status admin-approvals-status--${decision.status}`}
                        >
                          <Icon name={decision.status === "approved" ? "check_circle" : "cancel"} />
                          {decision.status === "approved" ? adminText.clinicApprovals.approved : adminText.clinicApprovals.rejected}
                        </span>
                      </div>
                      {decision.reason && (
                        <div className="admin-approvals-audit-item__reason">
                          <span className="admin-approvals-audit-item__reason-label">{adminText.clinicApprovals.reasonLabel}</span>{" "}
                          {decision.reason}
                        </div>
                      )}
                      <div className="admin-approvals-audit-item__timestamp">{decision.timestamp}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
