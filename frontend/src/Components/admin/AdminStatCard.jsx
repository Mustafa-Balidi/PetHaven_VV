import Icon from "../Icon.jsx";

/**
 * Plain counter card. It renders only what the backend returns — no trends,
 * no growth percentages, no derived projections.
 *
 * Rendered as a list item: the cards always sit in an `.admin-stat-grid`
 * list, which lets a screen reader announce how many counters there are and
 * lets the user step through them with list navigation.
 */
export default function AdminStatCard({ label, value, icon, tone = "primary", hint }) {
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <li className={`admin-stat admin-stat--${tone}`}>
      <span className="admin-stat__icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
      <span className="admin-stat__body">
        <span className="admin-stat__label">{label}</span>
        <span className="admin-stat__value">{displayValue}</span>
        {hint ? <span className="admin-stat__hint">{hint}</span> : null}
      </span>
    </li>
  );
}
