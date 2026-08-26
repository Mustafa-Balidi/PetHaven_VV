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
    <section id="adoption" className="categories" aria-labelledby="public-categories-title">
      <h2 id="public-categories-title" className="categories__title">{t("categories.title")}</h2>
      <div className="categories__grid">
        {CATEGORIES.map((category, i) => (
          <article
            key={category.title}
            className="categories__card"
          >
            <button
              type="button"
              className="categories__card-action"
              aria-labelledby={`public-category-title-${i}`}
              aria-describedby={`public-category-description-${i}`}
              onClick={() => handleCategoryClick(i)}
            />
            <div className={`categories__icon-wrap categories__icon-wrap--${category.accent}`}>
              <Icon name={category.icon} className={`categories__icon categories__icon--${category.accent}`} />
            </div>
            <h3 id={`public-category-title-${i}`} className="categories__card-title">{items[i].title}</h3>
            <p id={`public-category-description-${i}`} className="categories__card-desc">{items[i].description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
