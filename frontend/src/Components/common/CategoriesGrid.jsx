import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon.jsx";
import { CATEGORIES } from "../text/publicTexts.js";

const CATEGORY_ROUTES = ["/adopter/adoption-hub", "/adopter/store", "/adopter/vets", "/adopter/health"];

export default function CategoriesGrid({ requireAuth }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = t("categories.items", { returnObjects: true });

  function handleCategoryClick(i) {
    if (!requireAuth()) return;
    navigate(CATEGORY_ROUTES[i]);
  }

  return (
    <section id="adoption" className="categories">
      <h2 className="categories__title">{t("categories.title")}</h2>
      <div className="categories__grid">
        {CATEGORIES.map((category, i) => (
          <div
            key={category.title}
            onClick={() => handleCategoryClick(i)}
            className="categories__card"
          >
            <div className={`categories__icon-wrap categories__icon-wrap--${category.accent}`}>
              <Icon name={category.icon} className={`categories__icon categories__icon--${category.accent}`} />
            </div>
            <h3 className="categories__card-title">{items[i].title}</h3>
            <p className="categories__card-desc">{items[i].description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
