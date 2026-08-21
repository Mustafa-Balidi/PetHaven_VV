import Icon from "../Icon.jsx";

/**
 * Plain counter card. It renders only what the backend returns — no trends,
 * no growth percentages, no derived projections.
 */
export default function AdminStatCard({ label, value, icon, tone = "primary", hint }) {
  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <article className={`admin-stat admin-stat--${tone}`}>
      <span className="admin-stat__icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
      <span className="admin-stat__body">
        <span className="admin-stat__label">{label}</span>
        <span className="admin-stat__value">{displayValue}</span>
        {hint ? <span className="admin-stat__hint">{hint}</span> : null}
      </span>
    </article>
  );
}
