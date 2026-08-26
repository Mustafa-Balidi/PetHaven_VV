import { useEffect, useId } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../Components/admin/AdminLayout.jsx";
import AdminStatCard from "../../Components/admin/AdminStatCard.jsx";
import AdminFeedback from "../../Components/admin/AdminFeedback.jsx";
import Icon from "../../Components/Icon.jsx";
import { useAdminContext } from "../../context/adminContextBase";
import { formatAdminDate } from "../../Components/admin/adminFormat.js";

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const pendingHeadingId = useId();
  const {
    stats,
    dashboardLoading,
    dashboardError,
    pendingVets,
    pendingVetsLoading,
    pendingVetsError,
    fetchStats,
    fetchPendingVets,
  } = useAdminContext();

  useEffect(() => {
    fetchStats();
    fetchPendingVets();
  }, [fetchStats, fetchPendingVets]);

  const refreshAll = () => {
    fetchStats();
    fetchPendingVets();
  };

  const busy = dashboardLoading || pendingVetsLoading;
  const statCards = stats
    ? [
        { key: "totalUsers", icon: "groups", tone: "primary", value: stats.totalUsers },
        { key: "adopters", icon: "person", tone: "primary", value: stats.adopters },
        { key: "centers", icon: "home_work", tone: "accent", value: stats.centers },
        { key: "vets", icon: "stethoscope", tone: "accent", value: stats.vets },
        { key: "admins", icon: "shield_person", tone: "neutral", value: stats.admins },
        { key: "totalPets", icon: "pets", tone: "neutral", value: stats.totalPets },
        { key: "bannedUsers", icon: "block", tone: "danger", value: stats.bannedUsers },
      ]
    : [];

  return (
    <AdminLayout
      title={t("admin.dashboard.title")}
      subtitle={t("admin.dashboard.subtitle")}
      actions={
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={refreshAll}
          disabled={busy}
          aria-busy={busy || undefined}
        >
          <Icon name="refresh" />
          {busy ? t("admin.common.refreshing") : t("admin.common.refresh")}
        </button>
      }
    >
      <AdminFeedback type="error" message={dashboardError} />

      {!stats && dashboardLoading ? (
        <div className="admin-state admin-state--loading" role="status">
          <span className="admin-spinner" aria-hidden="true" />
          <p>{t("admin.common.loading")}</p>
        </div>
      ) : null}

      {!stats && !dashboardLoading && dashboardError ? (
        <div className="admin-state">
          <Icon name="cloud_off" />
          <p>{t("admin.dashboard.statsUnavailable")}</p>
          <button type="button" className="admin-btn admin-btn--primary" onClick={fetchStats}>
            {t("admin.common.retry")}
          </button>
        </div>
      ) : null}

      {stats ? (
        <section className="admin-section" aria-label={t("admin.dashboard.statsSection")}>
          <ul className="admin-stat-grid">
            {statCards.map((card) => (
              <AdminStatCard
                key={card.key}
                label={t(`admin.dashboard.stats.${card.key}`)}
                value={card.value}
                icon={card.icon}
                tone={card.tone}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="admin-section" aria-labelledby={pendingHeadingId}>
        <div className="admin-panel admin-panel--pending">
          <div className="admin-panel__header">
            <div className="admin-panel__heading">
              <h2 className="admin-panel__title" id={pendingHeadingId}>
                <Icon name="pending_actions" />
                {t("admin.dashboard.pendingVets.title")}
              </h2>
              <p className="admin-panel__subtitle">
                {t("admin.dashboard.pendingVets.subtitle")}
              </p>
            </div>
            <Link className="admin-btn admin-btn--primary" to="/admin/vet-approvals">
              {t("admin.dashboard.pendingVets.manage")}
              <Icon name="arrow_forward" />
            </Link>
          </div>

          <AdminFeedback type="error" message={pendingVetsError} />

          {pendingVetsLoading && !pendingVets.length ? (
            <div className="admin-state admin-state--inline" role="status">
              <span className="admin-spinner" aria-hidden="true" />
              <p>{t("admin.common.loading")}</p>
            </div>
          ) : null}

          {!pendingVetsLoading && !pendingVetsError && !pendingVets.length ? (
            <div className="admin-state admin-state--inline">
              <Icon name="task_alt" />
              <p>{t("admin.vetApprovals.empty")}</p>
            </div>
          ) : null}

          {pendingVets.length ? (
            <>
              <p className="admin-panel__count">
                <span className="admin-panel__count-value">{pendingVets.length}</span>
                <span className="admin-panel__count-label">
                  {t("admin.dashboard.pendingVets.awaiting")}
                </span>
              </p>
              <ul
                className="admin-mini-list"
                aria-label={t("admin.dashboard.pendingVets.listLabel")}
              >
                {pendingVets.slice(0, 5).map((vet) => {
                  const submittedOn = formatAdminDate(vet.createdAt, i18n.language);

                  return (
                    <li className="admin-mini-list__item" key={vet.vetId}>
                      <span className="admin-mini-list__main">
                        <span className="admin-mini-list__name">
                          {vet.fullName || vet.email}
                        </span>
                        {vet.specialization ? (
                          <span className="admin-mini-list__meta">{vet.specialization}</span>
                        ) : null}
                      </span>
                      {submittedOn ? (
                        <span className="admin-mini-list__date">
                          {/* The bare date reads as a stray number without it. */}
                          <span className="sr-only">
                            {t("admin.vetApprovals.fields.createdAt")}{": "}
                          </span>
                          <time dateTime={vet.createdAt}>{submittedOn}</time>
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {pendingVets.length > 5 ? (
                <p className="admin-panel__more">
                  {t("admin.dashboard.pendingVets.more", { remaining: pendingVets.length - 5 })}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </AdminLayout>
  );
}
