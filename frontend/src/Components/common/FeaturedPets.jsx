import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FEATURED_PETS } from "../text/publicTexts.js";

export default function FeaturedPets({ onPetClick, requireAuth }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pets = t("featuredPets.pets", { returnObjects: true });

  function handleViewAll(e) {
    e.preventDefault();
    if (!requireAuth()) return;
    navigate("/adopter/adoption-hub");
  }

  return (
    <section className="featured-pets">
      <div className="featured-pets__header">
        <h2 className="featured-pets__title">{t("featuredPets.title")}</h2>
        <a className="featured-pets__view-all featured-pets__view-all--desktop" href="#" onClick={handleViewAll}>
          {t("featuredPets.viewAll")}
        </a>
      </div>
      <div className="featured-pets__grid">
        {FEATURED_PETS.map((pet, i) => (
          <div key={pet.name} className="featured-pets__card">
            <div className="featured-pets__image-wrap">
              <img alt={pets[i].alt} className="featured-pets__image" src={pet.image} />
            </div>
            <div className="featured-pets__body">
              <h3 className="featured-pets__name">{pets[i].name}</h3>
              <p className="featured-pets__meta">{pets[i].meta}</p>
              <button onClick={() => onPetClick({ ...pet, ...pets[i] })} className="featured-pets__cta">
                {t("featuredPets.cta")}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="featured-pets__view-all--mobile-wrap">
        <a className="featured-pets__view-all" href="#" onClick={handleViewAll}>
          {t("featuredPets.viewAll")}
        </a>
      </div>
    </section>
  );
}
