import ICON_CODEPOINTS from "./iconCodepoints.js";

/**
 * Material Symbols icon.
 *
 * The glyph is selected by its codepoint rather than by the ligature name, so
 * the icon's name never lands in the DOM as text. With a ligature the word
 * ("close", "shopping_cart", …) is real text on the page: assistive tech and
 * accessibility checkers count it as the control's visible label — an icon
 * button next to "Adopt a Friend" reads as "favorite Adopt a Friend", which
 * fails WCAG 2.5.3 (Label in Name) — and the raw word flashes on screen
 * whenever the icon font is slow or blocked. Names missing from the codepoint
 * table fall back to the ligature.
 *
 * Icons are hidden from assistive tech by default. Pass `label` for a
 * standalone icon that carries meaning on its own (an icon that is not next to
 * visible text and whose parent has no aria-label); it is exposed as an image
 * with that accessible name instead.
 */
export default function Icon({ name, className = "", filled = false, label }) {
  const classes = [
    "material-symbols-outlined",
    filled ? "filled-icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // hasOwn, not a plain lookup: an icon called "constructor" would otherwise
  // pick up Object.prototype.
  const codepoint = name && Object.hasOwn(ICON_CODEPOINTS, name) ? ICON_CODEPOINTS[name] : null;
  const glyph = codepoint ? String.fromCodePoint(parseInt(codepoint, 16)) : name;

  if (label) {
    return (
      <span className={classes} role="img" aria-label={label}>
        {glyph}
      </span>
    );
  }

  return (
    <span className={classes} aria-hidden="true">
      {glyph}
    </span>
  );
}
