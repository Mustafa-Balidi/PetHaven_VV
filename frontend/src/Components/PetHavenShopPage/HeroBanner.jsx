import Icon from "../Icon.jsx";
import { useTranslation } from "react-i18next";

export default function HeroBanner({ hero, onShopNowClick }) {
  const { t } = useTranslation();

  return (
    <section className="hero-banner">
      <div className="hero-bg-gradient"></div>
      <div className="hero-text-content">
        <span className="hero-tag">{t("adopter.store.hero.tag")}</span>
        <h1 className="hero-title">{t("adopter.store.hero.title")}</h1>
        <p className="hero-description">{t("adopter.store.hero.description")}</p>
        <div className="hero-action">
          <button className="btn-primary-hero" onClick={onShopNowClick}>
            {t("adopter.store.hero.cta")}
            <Icon name="arrow_forward" className="hero-btn-icon" />
          </button>
        </div>
      </div>
      <div className="hero-image-container">
        <img alt={t("adopter.store.hero.imageAlt")} className="hero-image" src={hero.image} />
      </div>
    </section>
  );
}
