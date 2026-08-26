import Icon from "../Icon.jsx";

const ICONS = {
  success: "check_circle",
  error: "error",
  info: "info",
};

/**
 * Inline banner used to surface the real backend message (success or error).
 *
 * The wrapper element is rendered even when there is no message: a screen
 * reader only announces updates to a live region that already existed in the
 * DOM, so mounting the banner together with its text would stay silent.
 * `.admin-feedback:empty` keeps the placeholder out of the layout.
 *
 * Pass a `ref` when the control that triggered the message disappears with the
 * action (a deleted card, a closing dialog) — the page can then move focus
 * here so the keyboard user is not dropped back on <body>.
 */
export default function AdminFeedback({
  type = "info",
  message,
  onDismiss,
  dismissLabel,
  id,
  ref,
}) {
  const isError = type === "error";

  // The role stays "status" while `type` flips between success and error: a
  // live region is registered when it enters the DOM, so swapping the role on
  // an existing node can swallow the announcement. Urgency rides on aria-live.
  return (
    <div
      id={id}
      ref={ref}
      className={`admin-feedback admin-feedback--${type}`}
      role="status"
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
      tabIndex={message ? -1 : undefined}
    >
      {message ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}
