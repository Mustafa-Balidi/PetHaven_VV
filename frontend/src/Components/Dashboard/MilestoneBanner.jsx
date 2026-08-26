import { useTranslation } from "react-i18next";

export default function MilestoneBanner({ title, text, onOpen, disabled, resolving, unavailableMessage, feedback }) {
  const { t } = useTranslation();
  return (
    <section className="milestone-banner">
      <div className="milestone-content">
        <div className="milestone-icon-wrap">
          <span className="material-symbols-outlined milestone-icon" aria-hidden="true">
            celebration
          </span>
        </div>
        <div>
          <h3 className="milestone-title">{title}</h3>
          <p className="milestone-text">{text}</p>
        </div>
      </div>
      <div className="milestone-actions">
        <button
          className="btn-primary"
          type="button"
          disabled={disabled || resolving}
          onClick={onOpen}
          title={disabled ? unavailableMessage : undefined}
        >
          <span className="material-symbols-outlined btn-icon" aria-hidden="true">
            add_a_photo
          </span>
          {resolving
            ? t("adopter.dashboard.milestone.resolvingRequest")
            : t("adopter.dashboard.milestone.uploadNow")}
        </button>
      </div>
      {(unavailableMessage || feedback) && (
        <p
          className={`milestone-feedback${feedback?.type === "success" ? " milestone-feedback--success" : ""}`}
          role={feedback?.type === "error" || unavailableMessage ? "alert" : "status"}
        >
          {feedback?.message || unavailableMessage}
        </p>
      )}
    </section>
  );
}
