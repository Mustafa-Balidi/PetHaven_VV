import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon.jsx";
import { VET_IMAGE_URL } from "../text/publicTexts.js";

export default function VetExpertsSection({ requireAuth }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const features = t("vet.features", { returnObjects: true });

  function handleFindVet() {
    if (!requireAuth()) return;
    navigate("/adopter/vets");
  }

  return (
    <section id="vets" className="vet">
      <div className="vet__grid">
        <div className="vet__content">
          <div className="vet__badge">
            <Icon name="verified_user" className="vet__badge-icon" />
            <span>{t("vet.badge")}</span>
          </div>
          <h2 className="vet__title">
            {t("vet.titlePrefix")}
            <span className="vet__title-highlight">{t("vet.titleHighlight")}</span>
          </h2>
          <p className="vet__description">{t("vet.description")}</p>
          <ul className="vet__features">
            {features.map((feature) => (
              <li key={feature} className="vet__feature">
                <div className="vet__feature-icon-wrap">
                  <Icon name="check" className="vet__feature-icon" />
                </div>
                <span className="vet__feature-label">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="vet__actions">
            <button onClick={handleFindVet} className="vet__cta">
              {t("vet.cta")}
            </button>
          </div>
        </div>
        <div className="vet__media">
          <img src={VET_IMAGE_URL} alt={t("vet.imageAlt")} className="vet__image" />
        </div>
      </div>
    </section>
  );
}
