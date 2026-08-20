import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminSidebar from "../../Components/admin/AdminSidebar.jsx";
import AdminNavbar from "../../Components/admin/AdminNavbar.jsx";
import Icon from "../../Components/Icon.jsx";
import { useAdminContext } from "../../context/adminContextBase";

export default function AdminDashboard() {
  const { t: translate } = useTranslation();
  const adminText = { dashboard: translate("admin.dashboard", { returnObjects: true }) };
  const {
    kpis,
    platformHealth: health,
    clinicPerformance: clinics,
    systemAlerts: alerts,
    dashboardLoading: loading,
    fetchDashboard,
  } = useAdminContext();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminNavbar />
        <main className="admin-content">
          {loading || !kpis ? (
            <div className="admin-loading">{adminText.dashboard.loading}</div>
          ) : (
            <div className="admin-dashboard">
              <div className="admin-dashboard__grid">
                <div className="admin-dashboard__primary">
                  <div className="admin-kpis">
                    <div className="admin-card admin-kpi">
                      <div className="admin-kpi__top">
                        <div className="admin-kpi__icon admin-kpi__icon--primary">
                          <Icon name="groups" />
                        </div>
                        <div className="admin-kpi__trend-wrap">
                          <span className="admin-kpi__label">{adminText.dashboard.activeUsers}</span>
                          <span className="admin-kpi__trend admin-kpi__trend--up">
                            <Icon name="trending_up" />
                            {kpis.activeUsers.changePercent}%
                          </span>
                        </div>
                      </div>
                      <div className="admin-kpi__value-wrap">
                        <p className="admin-kpi__value">{kpis.activeUsers.value.toLocaleString()}</p>
                        <p className="admin-kpi__subtext">{kpis.activeUsers.changeLabel}</p>
                      </div>
                      <div className="admin-kpi__breakdown">
                        {kpis.activeUsers.breakdown.map((row) => (
                          <div className="admin-kpi__breakdown-row" key={row.label}>
                            <span>{row.label}</span>
                            <span>
                              {row.value}{" "}
                              <span className={`admin-kpi__mini-trend admin-kpi__mini-trend--${row.trend}`}>
                                {row.trend === "up" ? "↑" : "→"}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="admin-card admin-kpi">
                      <div className="admin-kpi__top">
                        <div className="admin-kpi__icon admin-kpi__icon--secondary">
                          <Icon name="payments" />
                        </div>
                        <div className="admin-kpi__trend-wrap">
                          <span className="admin-kpi__label">{adminText.dashboard.totalRevenue}</span>
                          <span className="admin-kpi__trend admin-kpi__trend--up">
                            <Icon name="trending_up" />
                            {kpis.totalRevenue.changePercent}%
                          </span>
                        </div>
                      </div>
                      <div className="admin-kpi__value-wrap">
                        <p className="admin-kpi__value">${kpis.totalRevenue.value.toLocaleString()}</p>
                      </div>
                      <div className="admin-kpi__breakdown">
                        {kpis.totalRevenue.breakdown.map((row) => (
                          <div className="admin-kpi__breakdown-row" key={row.label}>
                            <span>{row.label}</span>
                            <span>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="admin-card admin-kpi">
                      <div className="admin-kpi__top">
                        <div className="admin-kpi__icon admin-kpi__icon--warning">
                          <Icon name="pending_actions" />
                        </div>
                        <span className="admin-kpi__priority">{kpis.pendingApprovals.priority}</span>
                      </div>
                      <div className="admin-kpi__value-wrap">
                        <p className="admin-kpi__value">{kpis.pendingApprovals.value}</p>
                        <span className="admin-kpi__label">{kpis.pendingApprovals.subtitle}</span>
                        <p className="admin-kpi__subtext">{kpis.pendingApprovals.note}</p>
                      </div>
                      <div className="admin-kpi__footer">
                        <a href="#" className="admin-kpi__link">
                          {adminText.dashboard.reviewNow} <Icon name="arrow_forward" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card admin-table-card">
                    <div className="admin-table-card__header">
                      <h2>{adminText.dashboard.clinicPerformanceOverview}</h2>
                      <button type="button" className="admin-link-btn">{adminText.dashboard.viewFullReport}</button>
                    </div>
                    <div className="admin-table-card__scroll">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>{adminText.dashboard.table.clinicName}</th>
                            <th>{adminText.dashboard.table.location}</th>
                            <th className="admin-table__center">{adminText.dashboard.table.orders}</th>
                            <th className="admin-table__center">{adminText.dashboard.table.growth}</th>
                            <th>{adminText.dashboard.table.lastActive}</th>
                            <th>{adminText.dashboard.table.status}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clinics.map((clinic) => (
                            <tr key={clinic.id}>
                              <td>{clinic.name}</td>
                              <td>{clinic.location}</td>
                              <td className="admin-table__center">{clinic.orders}</td>
                              <td className="admin-table__center">
                                <span
                                  className={`admin-growth admin-growth--${
                                    clinic.growthPercent > 0 ? "up" : clinic.growthPercent < 0 ? "down" : "flat"
                                  }`}
                                >
                                  {clinic.growthPercent > 0 ? "+" : ""}
                                  {clinic.growthPercent}%
                                </span>
                              </td>
                              <td className="admin-table__muted">{clinic.lastActive}</td>
                              <td>
                                <span className={`admin-status admin-status--${clinic.status.toLowerCase()}`}>
                                  {translate(`admin.status.${clinic.status}`, { defaultValue: clinic.status })}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="admin-dashboard__side">
                  <div className="admin-card admin-health">
                    <div className="admin-health__header">
                      <h3>{adminText.dashboard.platformHealth}</h3>
                      <span className="admin-health__status">
                        <span className="admin-health__dot" /> {health.status}
                      </span>
                    </div>
                    <div className="admin-health__metric">
                      <div className="admin-health__metric-row">
                        <span>{adminText.dashboard.apiResponseTime}</span>
                        <span>{health.apiResponseTime.value}</span>
                      </div>
                      <div className="admin-health__bar">
                        <div className="admin-health__bar-fill" style={{ width: `${health.apiResponseTime.percent}%` }} />
                      </div>
                    </div>
                    <div className="admin-health__metric">
                      <div className="admin-health__metric-row">
                        <span>{adminText.dashboard.serverLoad}</span>
                        <span>{health.serverLoad.value}</span>
                      </div>
                      <div className="admin-health__bar">
                        <div className="admin-health__bar-fill" style={{ width: `${health.serverLoad.percent}%` }} />
                      </div>
                    </div>
                    <div className="admin-health__history">
                      <div className="admin-health__bars">
                        {health.loadHistory.map((v, i) => (
                          <div
                            key={i}
                            className={`admin-health__history-bar${
                              i === health.loadHistory.length - 2 ? " admin-health__history-bar--peak" : ""
                            }`}
                            style={{ height: `${v * 4}px` }}
                          />
                        ))}
                      </div>
                      <p className="admin-health__uptime">{adminText.dashboard.uptimeLabel} {health.uptimeLast24h}</p>
                    </div>
                  </div>

                  <div className="admin-card admin-alerts">
                    <h3>{adminText.dashboard.systemAlerts}</h3>
                    <div className="admin-alerts__list">
                      {alerts.map((alert) => (
                        <div className={`admin-alert admin-alert--${alert.severity}`} key={alert.id}>
                          <Icon name={alert.severity === "error" ? "error" : "warning"} />
                          <div>
                            <p className="admin-alert__title">{alert.title}</p>
                            <p className="admin-alert__detail">{alert.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
