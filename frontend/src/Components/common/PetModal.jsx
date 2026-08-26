import { useId } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import useModalA11y from "../../hooks/useModalA11y.js";

export default function PetModal({ pet, onClose, onRequireAuth }) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalA11y({ open: Boolean(pet), onClose });

  if (!pet) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="pet-modal"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <button type="button" aria-label={t("petModal.close")} className="modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <img alt={pet.alt} className="pet-modal__image" src={pet.image} />
        <div className="pet-modal__body">
          <h3 id={titleId} className="pet-modal__name">
            {pet.name} <span className="pet-modal__meta">· {pet.meta}</span>
          </h3>
          <p id={descriptionId} className="pet-modal__description">{t("petModal.description", { name: pet.name })}</p>
          <button type="button" className="pet-modal__cta" onClick={onRequireAuth}>
            {t("petModal.viewFullProfile")}
          </button>
        </div>
      </div>
    </div>
  );
}
