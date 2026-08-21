import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../Components/admin/AdminLayout.jsx";
import AdminStatCard from "../../Components/admin/AdminStatCard.jsx";
import AdminFeedback from "../../Components/admin/AdminFeedback.jsx";
import AdminConfirmDialog from "../../Components/admin/AdminConfirmDialog.jsx";
import Icon from "../../Components/Icon.jsx";
import { useAdminContext } from "../../context/adminContextBase";

const parseUserId = (raw) => {
  const trimmed = String(raw ?? "").trim();
  if (!/^\d+$/.test(trimmed)) return null;

  const parsed = Number(trimmed);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export default function AdminUsers() {
  const { t } = useTranslation();
  const {
    stats,
    dashboardLoading,
    dashboardError,
    actionLoading,
    fetchStats,
    banUser,
    unbanUser,
  } = useAdminContext();

  const [banForm, setBanForm] = useState({ userId: "", reason: "" });
  const [unbanUserId, setUnbanUserId] = useState("");
  const [banFeedback, setBanFeedback] = useState(null);
  const [unbanFeedback, setUnbanFeedback] = useState(null);
  const [confirm, setConfirm] = useState(null); // { mode: "ban" | "unban", userId }

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const banBusy = actionLoading === "ban";
  const unbanBusy = actionLoading === "unban";

  const submitBan = (event) => {
    event.preventDefault();
    const userId = parseUserId(banForm.userId);

    if (!userId) {
      setBanFeedback({ type: "error", message: t("admin.users.errors.invalidUserId") });
      return;
    }

    setBanFeedback(null);
    setConfirm({ mode: "ban", userId });
  };

  const submitUnban = (event) => {
    event.preventDefault();
    const userId = parseUserId(unbanUserId);

    if (!userId) {
      setUnbanFeedback({ type: "error", message: t("admin.users.errors.invalidUserId") });
      return;
    }

    setUnbanFeedback(null);
    setConfirm({ mode: "unban", userId });
  };

  const runConfirmedAction = async () => {
    if (!confirm) return;

    const { mode, userId } = confirm;
    const result =
      mode === "ban"
        ? await banUser(userId, banForm.reason.trim())
        : await unbanUser(userId);

    const feedback = {
      type: result.success ? "success" : "error",
      message:
        result.message ||
        (result.success
          ? t(mode === "ban" ? "admin.users.ban.success" : "admin.users.unban.success", { userId })
          : t("admin.common.actionFailed")),
    };

    if (mode === "ban") {
      setBanFeedback(feedback);
      if (result.success) setBanForm({ userId: "", reason: "" });
    } else {
      setUnbanFeedback(feedback);
      if (result.success) setUnbanUserId("");
    }

    setConfirm(null);
  };

  const confirmBusy = confirm?.mode === "ban" ? banBusy : unbanBusy;

  return (
    <AdminLayout
      title={t("admin.users.title")}
      subtitle={t("admin.users.subtitle")}
      actions={
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={fetchStats}
          disabled={dashboardLoading}
        >
          <Icon name="refresh" />
          {dashboardLoading ? t("admin.common.refreshing") : t("admin.common.refresh")}
        </button>
      }
    >
      <div className="admin-notice">
        <Icon name="info" />
        <div>
          <p className="admin-notice__title">{t("admin.users.notice.title")}</p>
          <p className="admin-notice__text">{t("admin.users.notice.text")}</p>
        </div>
      </div>

      {dashboardError ? <AdminFeedback type="error" message={dashboardError} /> : null}

      {stats ? (
        <section className="admin-section">
          <div className="admin-stat-grid admin-stat-grid--compact">
            <AdminStatCard
              label={t("admin.dashboard.stats.totalUsers")}
              value={stats.totalUsers}
              icon="groups"
              tone="primary"
            />
            <AdminStatCard
              label={t("admin.dashboard.stats.bannedUsers")}
              value={stats.bannedUsers}
              icon="block"
              tone="danger"
            />
          </div>
        </section>
      ) : null}

      <section className="admin-section admin-action-grid">
        <form className="admin-panel admin-panel--danger" onSubmit={submitBan} noValidate>
          <div className="admin-panel__header">
            <div className="admin-panel__heading">
              <h2 className="admin-panel__title">
                <Icon name="gavel" />
                {t("admin.users.ban.title")}
              </h2>
              <p className="admin-panel__subtitle">{t("admin.users.ban.subtitle")}</p>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-ban-user-id">
              {t("admin.users.fields.userId")}
            </label>
            <input
              id="admin-ban-user-id"
              className="admin-field__input"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder={t("admin.users.fields.userIdPlaceholder")}
              value={banForm.userId}
              onChange={(event) =>
                setBanForm((previous) => ({ ...previous, userId: event.target.value }))
              }
              disabled={banBusy}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-ban-reason">
              {t("admin.users.fields.reason")}
            </label>
            <textarea
              id="admin-ban-reason"
              className="admin-field__input admin-field__input--textarea"
              rows={3}
              placeholder={t("admin.users.fields.reasonPlaceholder")}
              value={banForm.reason}
              onChange={(event) =>
                setBanForm((previous) => ({ ...previous, reason: event.target.value }))
              }
              disabled={banBusy}
            />
            <span className="admin-field__hint">{t("admin.users.fields.reasonHint")}</span>
          </div>

          {banFeedback ? (
            <AdminFeedback
              type={banFeedback.type}
              message={banFeedback.message}
              onDismiss={() => setBanFeedback(null)}
              dismissLabel={t("admin.common.dismiss")}
            />
          ) : null}

          <div className="admin-panel__footer">
            <button type="submit" className="admin-btn admin-btn--danger" disabled={banBusy}>
              <Icon name="block" />
              {banBusy ? t("admin.users.ban.submitting") : t("admin.users.ban.submit")}
            </button>
          </div>
        </form>

        <form className="admin-panel admin-panel--success" onSubmit={submitUnban} noValidate>
          <div className="admin-panel__header">
            <div className="admin-panel__heading">
              <h2 className="admin-panel__title">
                <Icon name="lock_open" />
                {t("admin.users.unban.title")}
              </h2>
              <p className="admin-panel__subtitle">{t("admin.users.unban.subtitle")}</p>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="admin-unban-user-id">
              {t("admin.users.fields.userId")}
            </label>
            <input
              id="admin-unban-user-id"
              className="admin-field__input"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder={t("admin.users.fields.userIdPlaceholder")}
              value={unbanUserId}
              onChange={(event) => setUnbanUserId(event.target.value)}
              disabled={unbanBusy}
            />
          </div>

          {unbanFeedback ? (
            <AdminFeedback
              type={unbanFeedback.type}
              message={unbanFeedback.message}
              onDismiss={() => setUnbanFeedback(null)}
              dismissLabel={t("admin.common.dismiss")}
            />
          ) : null}

          <div className="admin-panel__footer">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={unbanBusy}>
              <Icon name="lock_open" />
              {unbanBusy ? t("admin.users.unban.submitting") : t("admin.users.unban.submit")}
            </button>
          </div>
        </form>
      </section>

      <AdminConfirmDialog
        open={Boolean(confirm)}
        danger={confirm?.mode === "ban"}
        busy={confirmBusy}
        title={t(confirm?.mode === "ban" ? "admin.users.ban.confirmTitle" : "admin.users.unban.confirmTitle")}
        message={t(
          confirm?.mode === "ban" ? "admin.users.ban.confirmMessage" : "admin.users.unban.confirmMessage",
          { userId: confirm?.userId ?? "" }
        )}
        confirmLabel={
          confirmBusy
            ? t("admin.common.processing")
            : t(confirm?.mode === "ban" ? "admin.users.ban.submit" : "admin.users.unban.submit")
        }
        cancelLabel={t("admin.common.cancel")}
        onConfirm={runConfirmedAction}
        onCancel={() => setConfirm(null)}
      />
    </AdminLayout>
  );
}
