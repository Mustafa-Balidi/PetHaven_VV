const iconWrapClass = {
  primary: "quick-action-icon-wrap--primary",
  tertiary: "quick-action-icon-wrap--tertiary",
  secondary: "quick-action-icon-wrap--secondary",
};

export default function QuickActions({ items, onActionClick }) {
  return (
    <section className="quick-actions-grid">
      {items.map((action) => (
        <button
          className="quick-action-card"
          type="button"
          key={action.id}
          onClick={() => onActionClick && onActionClick(action.id)}
        >
          <div
            className={`quick-action-icon-wrap ${
              iconWrapClass[action.colorVariant]
            }`}
          >
            <span className="material-symbols-outlined">{action.icon}</span>
          </div>
          <div>
            <h3 className="quick-action-title">{action.title}</h3>
            <p className="quick-action-desc">{action.desc}</p>
          </div>
        </button>
      ))}
    </section>
  );
}
