import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon.jsx";
import { HERO_IMAGE_URL } from "../text/publicTexts.js";

export default function Hero({ requireAuth }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stats = t("hero.stats", { returnObjects: true });

  function handleAdopt() {
    if (!requireAuth()) return;
    navigate("/adopter/adoption-hub");
  }

  function handleShop() {
    if (!requireAuth()) return;
    navigate("/adopter/store");
  }

  return (
    <section id="home" className="hero">
      <div className="hero__card">
        <div className="hero__content">
          <div className="hero__badge">
            <Icon name="pets" className="hero__badge-icon" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="hero__title">
            {t("hero.titlePrefix")}
            <span className="hero__title-highlight">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="hero__description">{t("hero.description")}</p>
          <div className="hero__actions">
            <button onClick={handleAdopt} className="hero__btn hero__btn--adopt">
              <Icon name="favorite" />
              {t("hero.ctaAdopt")}
            </button>
            <button onClick={handleShop} className="hero__btn hero__btn--shop">
              <Icon name="shopping_bag" />
              {t("hero.ctaShop")}
            </button>
          </div>
          <div className="hero__stats">
            {stats.map((stat, i) => (
              <div key={stat.label} className="hero__stat-group">
                {i > 0 && <div className="hero__stat-divider" />}
                <div className="hero__stat">
                  <span className="hero__stat-value">{stat.value}</span>
                  <span className="hero__stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__media">
          <img alt={t("hero.imageAlt")} className="hero__image" src={HERO_IMAGE_URL} />
          <div className="hero__media-badge">
            <div className="hero__media-badge-icon-wrap">
              <Icon name="verified" className="hero__media-badge-icon" />
            </div>
            <div>
              <p className="hero__media-badge-title">{t("hero.badgeTitle")}</p>
              <p className="hero__media-badge-subtitle">{t("hero.badgeSubtitle")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
