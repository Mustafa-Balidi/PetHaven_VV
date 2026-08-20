import { useTranslation } from "react-i18next";

const STATUS_CONFIG = {
  pending: { icon: "pending_actions", modifier: "under-review" },
  approved: { icon: "check_circle", modifier: "approved" },
  rejected: { icon: "cancel", modifier: "rejected" },
};

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const normalizedStatus = String(status || "Pending").toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.pending;

  return (
    <div className={`status-badge status-badge--${config.modifier}`}>
      <span className="material-symbols-outlined status-badge__icon">{config.icon}</span>
      <span>
        {t(`adopter.applicationDetails.statuses.${normalizedStatus}`, { defaultValue: status })}
      </span>
    </div>
  );
}
