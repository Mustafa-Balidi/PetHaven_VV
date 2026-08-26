import { useEffect, useRef } from "react";

// Elements that can receive keyboard focus inside a dialog.
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex^='-'])",
].join(",");

function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("inert") &&
      element.getAttribute("aria-hidden") !== "true" &&
      // offsetParent is null for display:none subtrees; position:fixed panels
      // report null too, so fall back to measuring the client rects.
      (element.offsetParent !== null || element.getClientRects().length > 0)
  );
}

/**
 * Wires the accessibility behaviour every dialog needs:
 *   - focus moves into the dialog on open (initialFocusRef, else first focusable, else panel)
 *   - Tab / Shift+Tab cycle inside the dialog instead of escaping to the page
 *   - Escape closes (unless disabled, e.g. while a request is in flight)
 *   - focus returns to the element that opened the dialog on close
 *   - background page stops scrolling and is hidden from assistive tech
 *
 * Returns a ref to attach to the dialog panel element.
 */
export default function useModalA11y({
  open = true,
  onClose,
  closeOnEscape = true,
  initialFocusRef,
} = {}) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const closeOnEscapeRef = useRef(closeOnEscape);

  // Keep the latest callbacks without re-running the trap effect (and so
  // without stealing focus back) every time the parent re-renders.
  useEffect(() => {
    onCloseRef.current = onClose;
    closeOnEscapeRef.current = closeOnEscape;
  });

  useEffect(() => {
    if (!open) return undefined;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    const root = document.getElementById("root");
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const hiddenSiblings = new Map();

    body.style.overflow = "hidden";
    // aria-modal communicates the relationship, while hiding sibling branches
    // prevents older assistive technology from wandering behind the dialog.
    if (root && panel && root.contains(panel)) {
      let branch = panel;
      while (branch.parentElement && branch !== root) {
        const parent = branch.parentElement;
        Array.from(parent.children).forEach((sibling) => {
          if (sibling === branch || hiddenSiblings.has(sibling)) return;
          hiddenSiblings.set(sibling, sibling.getAttribute("aria-hidden"));
          sibling.setAttribute("aria-hidden", "true");
        });
        branch = parent;
      }
    }

    const focusFirst = () => {
      const target =
        initialFocusRef?.current || getFocusable(panel)[0] || panel;
      target?.focus?.({ preventScroll: true });
    };
    // Wait a frame so children rendered in the same commit are measurable.
    const frame = requestAnimationFrame(focusFirst);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (!closeOnEscapeRef.current) return;
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = getFocusable(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus?.({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown, true);
      body.style.overflow = previousOverflow;
      hiddenSiblings.forEach((previousValue, sibling) => {
        if (previousValue === null) sibling.removeAttribute("aria-hidden");
        else sibling.setAttribute("aria-hidden", previousValue);
      });
      // Restore focus to the trigger so keyboard users keep their place.
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
    // initialFocusRef is a stable ref object; open drives the whole lifecycle.
  }, [open, initialFocusRef]);

  return panelRef;
}
