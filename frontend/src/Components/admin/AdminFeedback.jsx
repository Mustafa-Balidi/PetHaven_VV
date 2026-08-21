import Icon from "../Icon.jsx";

const ICONS = {
  success: "check_circle",
  error: "error",
  info: "info",
};

/** Inline banner used to surface the real backend message (success or error). */
export default function AdminFeedback({ type = "info", message, onDismiss, dismissLabel }) {
  if (!message) return null;

  return (
    <div className={`admin-feedback admin-feedback--${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon name={ICONS[type] ?? ICONS.info} />
      <p className="admin-feedback__text">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          className="admin-feedback__close"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
