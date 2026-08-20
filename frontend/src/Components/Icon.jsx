export default function Icon({ name, className = "", filled = false }) {
  return (
    <span className={`material-symbols-outlined ${filled ? "filled-icon" : ""} ${className}`}>
      {name}
    </span>
  );
}