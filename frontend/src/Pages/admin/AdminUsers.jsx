import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminSidebar from "../../Components/admin/AdminSidebar.jsx";
import AdminNavbar from "../../Components/admin/AdminNavbar.jsx";
import Icon from "../../Components/Icon.jsx";
import { useAdminContext } from "../../context/adminContextBase";

const ROLE_CLASS = {
  Doctor: "admin-users-role--doctor",
  Trainer: "admin-users-role--trainer",
  Center: "admin-users-role--center",
};

export default function AdminUsers() {
  const { t: translate } = useTranslation();
  const adminText = { users: translate("admin.users", { returnObjects: true }) };
  const STATUS_LABEL = adminText.users.statusLabel;
  const ENFORCEMENT_LABEL = adminText.users.auditLog.enforcementLabel;
  const {
    users: usersData,
    blocklist,
    usersLoading: loading,
    fetchUsers,
    fetchApprovals,
  } = useAdminContext();

  useEffect(() => {
    fetchUsers();
    fetchApprovals();
  }, [fetchUsers, fetchApprovals]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-layout__main">
        <AdminNavbar />
        <main className="admin-content">
          {loading || !usersData?.totalCount ? (
            <div className="admin-loading">{adminText.users.loading}</div>
          ) : (
            <div className="admin-users-page">
              <section className="admin-users-header">
                <h1 className="admin-users-header__title">{adminText.users.title}</h1>
                <p className="admin-users-header__subtitle">
                  {adminText.users.subtitle}
                </p>
              </section>

              <div className="admin-card admin-users-table-card">
                <div className="admin-users-table-card__header">
                  <h2 className="admin-users-table-card__title">{adminText.users.registeredUsers}</h2>
                  <span className="admin-users-total-badge">
                    {adminText.users.totalPrefix} {usersData.totalCount.toLocaleString()}
                  </span>
                </div>
                <div className="admin-users-table-card__scroll">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>{adminText.users.table.user}</th>
                        <th>{adminText.users.table.role}</th>
                        <th>{adminText.users.table.status}</th>
                        <th>{adminText.users.table.joinedDate}</th>
                        <th>{adminText.users.table.lastActive}</th>
                        <th className="admin-users-table__actions-head">{adminText.users.table.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.users.map((user) => (
                        <tr
                          key={user.id}
                          className={`admin-users-table__row${
                            user.status === "suspended" ? " admin-users-table__row--suspended" : ""
                          }${user.status === "banned" ? " admin-users-table__row--banned" : ""}`}
                        >
                          <td>
                            <div className="admin-users-user">
                              {user.avatarUrl ? (
                                <img
                                  className="admin-users-user__avatar"
                                  src={user.avatarUrl}
                                  alt={user.name}
                                />
                              ) : (
                                <div className="admin-users-user__avatar admin-users-user__avatar--initials">
                                  {user.initials}
                                </div>
                              )}
                              <div>
                                <p className="admin-users-user__name">{user.name}</p>
                                <p className="admin-users-user__id">{adminText.users.idPrefix} {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`admin-users-role ${ROLE_CLASS[user.role] || ""}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-users-status admin-users-status--${user.status}`}>
                              {user.status === "banned" ? (
                                <Icon name="block" />
                              ) : (
                                <span className="admin-users-status__dot" />
                              )}
                              {STATUS_LABEL[user.status]}
                            </span>
                          </td>
                          <td className="admin-users-table__muted">{user.joinedDate}</td>
                          <td className="admin-users-table__muted">{user.lastActive}</td>
                          <td className="admin-users-table__actions">
                            <button type="button" className="admin-users-more-btn" aria-label={adminText.users.moreActions}>
                              <Icon name="more_vert" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="admin-users-table-card__footer">
                  <span className="admin-users-table-card__count">
                    {adminText.users.footer.showingPrefix} {usersData.users.length} {adminText.users.footer.of} {usersData.totalCount.toLocaleString()} {adminText.users.footer.entries}
                  </span>
                  <div className="admin-users-pagination">
                    <button type="button" className="admin-users-pagination__btn" disabled>
                      {adminText.users.pagination.previous}
                    </button>
                    <button type="button" className="admin-users-pagination__btn admin-users-pagination__btn--active">
                      1
                    </button>
                    <button type="button" className="admin-users-pagination__btn">2</button>
                    <button type="button" className="admin-users-pagination__btn">3</button>
                    <button type="button" className="admin-users-pagination__btn">{adminText.users.pagination.next}</button>
                  </div>
                </div>
              </div>

              <div className="admin-users-bento">
                <div className="admin-card admin-users-audit-card">
                  <div className="admin-users-audit-card__header">
                    <div className="admin-users-audit-card__title-row">
                      <Icon name="gavel" className="admin-users-audit-card__icon" />
                      <h2 className="admin-users-audit-card__title">{adminText.users.auditLog.title}</h2>
                    </div>
                    <p className="admin-users-audit-card__subtitle">
                      {adminText.users.auditLog.subtitle}
                    </p>
                  </div>
                  <div className="admin-users-audit-card__scroll">
                    <table className="admin-users-audit-table">
                      <thead>
                        <tr>
                          <th>{adminText.users.auditLog.table.entityId}</th>
                          <th>{adminText.users.auditLog.table.reason}</th>
                          <th>{adminText.users.auditLog.table.blockedAt}</th>
                          <th className="admin-users-audit-table__enforcement-head">{adminText.users.auditLog.table.enforcement}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blocklist.map((entry) => (
                          <tr key={entry.id}>
                            <td className="admin-users-audit-table__entity">{entry.entityId}</td>
                            <td>
                              <p className="admin-users-audit-table__reason">{entry.reason}</p>
                              <p className="admin-users-audit-table__justification">{entry.justification}</p>
                            </td>
                            <td className="admin-users-table__muted">{entry.blockedAt}</td>
                            <td className="admin-users-audit-table__enforcement-cell">
                              <span
                                className={`admin-users-enforcement admin-users-enforcement--${entry.enforcement}`}
                              >
                                {ENFORCEMENT_LABEL[entry.enforcement]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="admin-card admin-users-security-card">
                  <div>
                    <h2 className="admin-users-security-card__title">{adminText.users.security.title}</h2>
                    <div className="admin-users-security-metrics">
                      <div className="admin-users-security-metric">
                        <div className="admin-users-security-metric__row">
                          <span>{adminText.users.security.activeUsers}</span>
                          <span className="admin-users-security-metric__value admin-users-security-metric__value--green">
                            {usersData.security.activeUsersPercent}%
                          </span>
                        </div>
                        <div className="admin-users-security-bar">
                          <div
                            className="admin-users-security-bar__fill admin-users-security-bar__fill--green"
                            style={{ width: `${usersData.security.activeUsersPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="admin-users-security-metric">
                        <div className="admin-users-security-metric__row">
                          <span>{adminText.users.security.suspendedAccounts}</span>
                          <span className="admin-users-security-metric__value admin-users-security-metric__value--yellow">
                            {usersData.security.suspendedAccountsPercent}%
                          </span>
                        </div>
                        <div className="admin-users-security-bar">
                          <div
                            className="admin-users-security-bar__fill admin-users-security-bar__fill--yellow"
                            style={{ width: `${usersData.security.suspendedAccountsPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="admin-users-security-metric">
                        <div className="admin-users-security-metric__row">
                          <span>{adminText.users.security.bannedEntities}</span>
                          <span className="admin-users-security-metric__value admin-users-security-metric__value--red">
                            {usersData.security.bannedEntitiesPercent}%
                          </span>
                        </div>
                        <div className="admin-users-security-bar">
                          <div
                            className="admin-users-security-bar__fill admin-users-security-bar__fill--red"
                            style={{ width: `${usersData.security.bannedEntitiesPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="admin-users-privacy-note">
                    <Icon name="info" className="admin-users-privacy-note__icon" />
                    <div>
                      <p className="admin-users-privacy-note__title">{adminText.users.privacyNote.title}</p>
                      <p className="admin-users-privacy-note__text">
                        {adminText.users.privacyNote.text}
                      </p>
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
