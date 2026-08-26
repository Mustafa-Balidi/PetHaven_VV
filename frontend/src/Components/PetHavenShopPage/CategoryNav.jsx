import Icon from "../Icon.jsx";
import { useTranslation } from "react-i18next";

export default function CategoryNav({ categories, selectedCategoryId, onSelectCategory, onClearCategory }) {
  const { t } = useTranslation();

  return (
    <section className="categories-section">
      <div className="categories-heading-row">
        <h2 className="section-heading">{t("adopter.store.categories.title")}</h2>
        {selectedCategoryId != null && (
          <button type="button" className="category-clear-btn" onClick={onClearCategory}>
            <Icon name="close" className="icon-sm" /> {t("adopter.store.categories.clear")}
          </button>
        )}
      </div>
      <div className="categories-list">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={selectedCategoryId === cat.id}
            className={`category-pill${selectedCategoryId === cat.id ? " active" : ""}`}
            onClick={() => onSelectCategory?.(cat.id)}
          >
            <Icon name={cat.icon} className="icon-sm" /> {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}
