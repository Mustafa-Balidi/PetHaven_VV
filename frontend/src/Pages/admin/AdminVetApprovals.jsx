import { useEffect, useRef, useState } from "react";
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
  // A verified or rejected card unmounts together with the button that was
  // focused, which would drop focus on <body>; park it on the result banner.
  const feedbackRef = useRef(null);
  const focusFeedbackRef = useRef(false);

  useEffect(() => {
    fetchPendingVets();
  }, [fetchPendingVets]);

  useEffect(() => {
    if (!focusFeedbackRef.current) return;

    focusFeedbackRef.current = false;
    // Runs after the dialog's own cleanup, which skips the unmounted trigger.
    feedbackRef.current?.focus();
  }, [feedback]);

  const handleVerify = async (vet) => {
    setFeedback(null);
    const result = await verifyVet(vet.vetId);
    focusFeedbackRef.current = result.success;
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
    focusFeedbackRef.current = result.success;
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
          aria-busy={pendingVetsLoading || undefined}
        >
          <Icon name="refresh" />
          {pendingVetsLoading ? t("admin.common.refreshing") : t("admin.common.refresh")}
        </button>
      }
    >
      <AdminFeedback
        ref={feedbackRef}
        type={feedback?.type ?? "info"}
        message={feedback?.message}
        onDismiss={feedback ? () => setFeedback(null) : undefined}
        dismissLabel={t("admin.common.dismiss")}
      />

      <AdminFeedback type="error" message={pendingVetsError} />

      {pendingVets.length ? (
        <div className="admin-toolbar">
          <span className="admin-badge admin-badge--warning">
            <Icon name="pending_actions" />
            {t("admin.vetApprovals.pendingCount", { total: pendingVets.length })}
          </span>
        </div>
      ) : null}

      {pendingVetsLoading && !pendingVets.length ? (
        <div className="admin-state admin-state--loading" role="status">
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
        <ul className="admin-vet-grid" aria-label={t("admin.vetApprovals.listLabel")}>
          {pendingVets.map((vet) => {
            const verifying = actionLoading === `verify-${vet.vetId}`;
            const rejecting = actionLoading === `reject-${vet.vetId}`;
            // Any in-flight admin action locks every card, so a second request
            // can never be fired before the first one resolves.
            const disabled = Boolean(actionLoading);
            const name = vet.fullName || vet.email || t("admin.common.notProvided");
            const submittedOn = formatAdminDate(vet.createdAt, i18n.language);

            return (
              <li className="admin-vet-card" key={vet.vetId}>
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
                    value={
                      submittedOn ? <time dateTime={vet.createdAt}>{submittedOn}</time> : ""
                    }
                  />
                </div>

                {/* Every card repeats the same two verbs, so the accessible
                    name has to carry the vet it acts on. */}
                <footer className="admin-vet-card__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger-outline"
                    onClick={() => setVetToReject(vet)}
                    disabled={disabled}
                    aria-busy={rejecting || undefined}
                    aria-label={t("admin.vetApprovals.rejectFor", { name })}
                  >
                    <Icon name="delete_forever" />
                    {rejecting ? t("admin.vetApprovals.rejecting") : t("admin.vetApprovals.reject")}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    onClick={() => handleVerify(vet)}
                    disabled={disabled}
                    aria-busy={verifying || undefined}
                    aria-label={t("admin.vetApprovals.verifyFor", { name })}
                  >
                    <Icon name="verified" />
                    {verifying ? t("admin.vetApprovals.verifying") : t("admin.vetApprovals.verify")}
                  </button>
                </footer>
              </li>
            );
          })}
        </ul>
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
