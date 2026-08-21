import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../Components/admin/AdminLayout.jsx";
import AdminFeedback from "../../Components/admin/AdminFeedback.jsx";
import AdminConfirmDialog from "../../Components/admin/AdminConfirmDialog.jsx";
import Icon from "../../Components/Icon.jsx";
import { formatAdminDate } from "../../Components/admin/adminFormat.js";
import { useAdminContext } from "../../context/adminContextBase";

function VetDetail({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="admin-vet-card__detail">
      <Icon name={icon} />
      <span className="admin-vet-card__detail-body">
        <span className="admin-vet-card__detail-label">{label}</span>
        <span className="admin-vet-card__detail-value">{value}</span>
      </span>
    </div>
  );
}

export default function AdminVetApprovals() {
  const { t, i18n } = useTranslation();
  const {
    pendingVets,
    pendingVetsLoading,
    pendingVetsError,
    actionLoading,
    fetchPendingVets,
    verifyVet,
    rejectVet,
  } = useAdminContext();

  const [feedback, setFeedback] = useState(null);
  const [vetToReject, setVetToReject] = useState(null);

  useEffect(() => {
    fetchPendingVets();
  }, [fetchPendingVets]);

  const handleVerify = async (vet) => {
    setFeedback(null);
    const result = await verifyVet(vet.vetId);
    setFeedback({
      type: result.success ? "success" : "error",
      message:
        result.message ||
        (result.success
          ? t("admin.vetApprovals.verifySuccess", { name: vet.fullName })
          : t("admin.common.actionFailed")),
    });
  };

  const handleRejectConfirmed = async () => {
    if (!vetToReject) return;

    setFeedback(null);
    const result = await rejectVet(vetToReject.vetId);
    setVetToReject(null);
    setFeedback({
      type: result.success ? "success" : "error",
      message:
        result.message ||
        (result.success
          ? t("admin.vetApprovals.rejectSuccess", { name: vetToReject.fullName })
          : t("admin.common.actionFailed")),
    });
  };

  const rejectBusy = vetToReject ? actionLoading === `reject-${vetToReject.vetId}` : false;
  const showEmpty = !pendingVetsLoading && !pendingVetsError && pendingVets.length === 0;

  return (
    <AdminLayout
      title={t("admin.vetApprovals.title")}
      subtitle={t("admin.vetApprovals.subtitle")}
      actions={
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={fetchPendingVets}
          disabled={pendingVetsLoading}
        >
          <Icon name="refresh" />
          {pendingVetsLoading ? t("admin.common.refreshing") : t("admin.common.refresh")}
        </button>
      }
    >
      {feedback ? (
        <AdminFeedback
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
          dismissLabel={t("admin.common.dismiss")}
        />
      ) : null}

      {pendingVetsError ? <AdminFeedback type="error" message={pendingVetsError} /> : null}

      {pendingVets.length ? (
        <div className="admin-toolbar">
          <span className="admin-badge admin-badge--warning">
            <Icon name="pending_actions" />
            {t("admin.vetApprovals.pendingCount", { total: pendingVets.length })}
          </span>
        </div>
      ) : null}

      {pendingVetsLoading && !pendingVets.length ? (
        <div className="admin-state admin-state--loading">
          <span className="admin-spinner" aria-hidden="true" />
          <p>{t("admin.common.loading")}</p>
        </div>
      ) : null}

      {pendingVetsError && !pendingVets.length ? (
        <div className="admin-state">
          <Icon name="cloud_off" />
          <p>{t("admin.vetApprovals.loadFailed")}</p>
          <button type="button" className="admin-btn admin-btn--primary" onClick={fetchPendingVets}>
            {t("admin.common.retry")}
          </button>
        </div>
      ) : null}

      {showEmpty ? (
        <div className="admin-state">
          <Icon name="task_alt" />
          <p>{t("admin.vetApprovals.empty")}</p>
          <span className="admin-state__hint">{t("admin.vetApprovals.emptyHint")}</span>
        </div>
      ) : null}

      {pendingVets.length ? (
        <div className="admin-vet-grid">
          {pendingVets.map((vet) => {
            const verifying = actionLoading === `verify-${vet.vetId}`;
            const rejecting = actionLoading === `reject-${vet.vetId}`;
            // Any in-flight admin action locks every card, so a second request
            // can never be fired before the first one resolves.
            const disabled = Boolean(actionLoading);

            return (
              <article className="admin-vet-card" key={vet.vetId}>
                <header className="admin-vet-card__header">
                  <div className="admin-vet-card__identity">
                    <span className="admin-vet-card__avatar" aria-hidden="true">
                      <Icon name="stethoscope" />
                    </span>
                    <div>
                      <h2 className="admin-vet-card__name">
                        {vet.fullName || t("admin.common.notProvided")}
                      </h2>
                      <p className="admin-vet-card__email">{vet.email}</p>
                    </div>
                  </div>
                  <span className="admin-badge admin-badge--muted">
                    {t("admin.vetApprovals.idLabel", { id: vet.vetId })}
                  </span>
                </header>

                <div className="admin-vet-card__details">
                  <VetDetail
                    icon="workspace_premium"
                    label={t("admin.vetApprovals.fields.specialization")}
                    value={vet.specialization}
                  />
                  <VetDetail
                    icon="local_hospital"
                    label={t("admin.vetApprovals.fields.clinicName")}
                    value={vet.clinicName}
                  />
                  <VetDetail
                    icon="location_on"
                    label={t("admin.vetApprovals.fields.clinicAddress")}
                    value={vet.clinicAddress}
                  />
                  <VetDetail
                    icon="badge"
                    label={t("admin.vetApprovals.fields.licenseNumber")}
                    value={vet.licenseNumber}
                  />
                  <VetDetail
                    icon="timeline"
                    label={t("admin.vetApprovals.fields.experienceYears")}
                    value={
                      vet.experienceYears === null
                        ? ""
                        : t("admin.vetApprovals.yearsValue", { years: vet.experienceYears })
                    }
                  />
                  <VetDetail
                    icon="event"
                    label={t("admin.vetApprovals.fields.createdAt")}
                    value={formatAdminDate(vet.createdAt, i18n.language)}
                  />
                </div>

                <footer className="admin-vet-card__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger-outline"
                    onClick={() => setVetToReject(vet)}
                    disabled={disabled}
                  >
                    <Icon name="delete_forever" />
                    {rejecting ? t("admin.vetApprovals.rejecting") : t("admin.vetApprovals.reject")}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    onClick={() => handleVerify(vet)}
                    disabled={disabled}
                  >
                    <Icon name="verified" />
                    {verifying ? t("admin.vetApprovals.verifying") : t("admin.vetApprovals.verify")}
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      ) : null}

      <AdminConfirmDialog
        open={Boolean(vetToReject)}
        danger
        busy={rejectBusy}
        title={t("admin.vetApprovals.rejectConfirm.title")}
        message={t("admin.vetApprovals.rejectConfirm.message", {
          name: vetToReject?.fullName || vetToReject?.email || "",
        })}
        details={
          <p className="admin-modal__warning">
            <Icon name="delete_forever" />
            {t("admin.vetApprovals.rejectConfirm.warning")}
          </p>
        }
        confirmLabel={
          rejectBusy
            ? t("admin.vetApprovals.rejecting")
            : t("admin.vetApprovals.rejectConfirm.confirm")
        }
        cancelLabel={t("admin.common.cancel")}
        onConfirm={handleRejectConfirmed}
        onCancel={() => setVetToReject(null)}
      />
    </AdminLayout>
  );
}
