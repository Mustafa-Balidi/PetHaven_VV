import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function PetModal({ pet, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!pet) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [pet, onClose]);

  if (!pet) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="pet-modal" onClick={(e) => e.stopPropagation()}>
        <button aria-label={t("petModal.close")} className="modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <img alt={pet.alt} className="pet-modal__image" src={pet.image} />
        <div className="pet-modal__body">
          <h3 className="pet-modal__name">
            {pet.name} <span className="pet-modal__meta">· {pet.meta}</span>
          </h3>
          <p className="pet-modal__description">{t("petModal.description", { name: pet.name })}</p>
          <button className="pet-modal__cta" onClick={onClose}>
            {t("petModal.viewFullProfile")}
          </button>
        </div>
      </div>
    </div>
  );
}
