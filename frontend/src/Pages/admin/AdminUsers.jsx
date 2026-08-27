import { useEffect, useRef, useState } from "react";
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
  // `field` marks a client-side validation failure, so the offending input can
  // be flagged with aria-invalid and described by the message below it.
  const [banFeedback, setBanFeedback] = useState(null); // { type, message, field? }
  const [unbanFeedback, setUnbanFeedback] = useState(null);
  const [confirm, setConfirm] = useState(null); // { mode: "ban" | "unban", userId }

  const banIdRef = useRef(null);
  const unbanIdRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const banBusy = actionLoading === "ban";
  const unbanBusy = actionLoading === "unban";

  const submitBan = (event) => {
    event.preventDefault();
    const userId = parseUserId(banForm.userId);

    if (!userId) {
      setBanFeedback({
        type: "error",
        message: t("admin.users.errors.invalidUserId"),
        field: "userId",
      });
      // Put the keyboard user back on the field they have to correct.
      banIdRef.current?.focus();
      return;
    }

    setBanFeedback(null);
    setConfirm({ mode: "ban", userId });
  };

  const submitUnban = (event) => {
    event.preventDefault();
    const userId = parseUserId(unbanUserId);

    if (!userId) {
      setUnbanFeedback({
        type: "error",
        message: t("admin.users.errors.invalidUserId"),
        field: "userId",
      });
      unbanIdRef.current?.focus();
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
  const banIdInvalid = banFeedback?.field === "userId";
  const unbanIdInvalid = unbanFeedback?.field === "userId";

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
          aria-busy={dashboardLoading || undefined}
        >
          <Icon name="refresh" />
          {dashboardLoading ? t("admin.common.refreshing") : t("admin.common.refresh")}
        </button>
      }
    >
      <div className="admin-notice" role="note" aria-labelledby="admin-users-notice-title">
        <Icon name="info" />
        <div>
          <p className="admin-notice__title" id="admin-users-notice-title">
            {t("admin.users.notice.title")}
          </p>
          <p className="admin-notice__text">{t("admin.users.notice.text")}</p>
          {/* UserId and VetId are separate key spaces. The approvals screen
              shows a Vet ID prominently, and pasting it here would ban an
              unrelated account, so the distinction is called out in the UI. */}
          <p className="admin-notice__text">{t("admin.users.notice.idWarning")}</p>
        </div>
      </div>

      <AdminFeedback type="error" message={dashboardError?.message} />

      {stats ? (
        <section className="admin-section" aria-label={t("admin.dashboard.statsSection")}>
          <ul className="admin-stat-grid admin-stat-grid--compact">
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
          </ul>
        </section>
      ) : null}

      <section className="admin-section admin-action-grid">
        <form
          className="admin-panel admin-panel--danger"
          onSubmit={submitBan}
          aria-labelledby="admin-ban-title"
          noValidate
        >
          <div className="admin-panel__header">
            <div className="admin-panel__heading">
              <h2 className="admin-panel__title" id="admin-ban-title">
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
              ref={banIdRef}
              className="admin-field__input"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              required
              aria-required="true"
              aria-invalid={banIdInvalid || undefined}
              aria-describedby={banIdInvalid ? "admin-ban-feedback" : undefined}
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
              aria-describedby="admin-ban-reason-hint"
              placeholder={t("admin.users.fields.reasonPlaceholder")}
              value={banForm.reason}
              onChange={(event) =>
                setBanForm((previous) => ({ ...previous, reason: event.target.value }))
              }
              disabled={banBusy}
            />
            <span className="admin-field__hint" id="admin-ban-reason-hint">
              {t("admin.users.fields.reasonHint")}
            </span>
          </div>

          <AdminFeedback
            id="admin-ban-feedback"
            type={banFeedback?.type ?? "info"}
            message={banFeedback?.message}
            onDismiss={banFeedback ? () => setBanFeedback(null) : undefined}
            dismissLabel={t("admin.common.dismiss")}
          />

          <div className="admin-panel__footer">
            <button
              type="submit"
              className="admin-btn admin-btn--danger"
              disabled={banBusy}
              aria-busy={banBusy || undefined}
            >
              <Icon name="block" />
              {banBusy ? t("admin.users.ban.submitting") : t("admin.users.ban.submit")}
            </button>
          </div>
        </form>

        <form
          className="admin-panel admin-panel--success"
          onSubmit={submitUnban}
          aria-labelledby="admin-unban-title"
          noValidate
        >
          <div className="admin-panel__header">
            <div className="admin-panel__heading">
              <h2 className="admin-panel__title" id="admin-unban-title">
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
              ref={unbanIdRef}
              className="admin-field__input"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              required
              aria-required="true"
              aria-invalid={unbanIdInvalid || undefined}
              aria-describedby={unbanIdInvalid ? "admin-unban-feedback" : undefined}
              placeholder={t("admin.users.fields.userIdPlaceholder")}
              value={unbanUserId}
              onChange={(event) => setUnbanUserId(event.target.value)}
              disabled={unbanBusy}
            />
          </div>

          <AdminFeedback
            id="admin-unban-feedback"
            type={unbanFeedback?.type ?? "info"}
            message={unbanFeedback?.message}
            onDismiss={unbanFeedback ? () => setUnbanFeedback(null) : undefined}
            dismissLabel={t("admin.common.dismiss")}
          />

          <div className="admin-panel__footer">
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={unbanBusy}
              aria-busy={unbanBusy || undefined}
            >
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
