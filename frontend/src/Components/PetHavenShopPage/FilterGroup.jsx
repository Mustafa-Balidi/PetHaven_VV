export default function FilterGroup({ title, options, onToggle, scrollable = false, bordered = false }) {
  return (
    <div className={`filter-group ${bordered ? "border-top" : ""}`}>
      <h4 className="filter-title">{title}</h4>
      <div className={`checkbox-list ${scrollable ? "scrollable" : ""}`}>
        {options.map((option) => (
          <label key={option.id} className="checkbox-label">
            <input
              className="custom-checkbox"
              type="checkbox"
              checked={option.checked}
              onChange={() => onToggle?.(option.id)}
            />
            <span className="checkbox-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}