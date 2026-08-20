import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function DeletePetModal({ pet, onConfirm, onClose }) {
  const { t: translate } = useTranslation();
  const t = translate("center.modals", { returnObjects: true });
  const td = t.deletePet;
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm(pet.petId);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={t.close} className="center-modal-backdrop" onClick={onClose} />
      <div className="center-modal-panel center-modal-panel--sm">
        <div className="center-modal-confirm">
          <div className="center-modal-confirm__icon">
            <Icon name="warning" />
          </div>
          <h2 className="center-modal-confirm__title">{td.title}</h2>
          <p className="center-modal-confirm__text">
            {td.confirmPrefix} <span className="center-modal-confirm__name">'{pet.name}'</span>?{" "}
            {td.confirmSuffix}
          </p>
        </div>
        <div className="center-modal-confirm__actions">
          <button type="button" className="center-modal-btn-cancel" onClick={onClose}>
            {t.cancel}
          </button>
          <button type="button" className="center-modal-btn-danger" disabled={deleting} onClick={handleConfirm}>
            <Icon name="delete" filled />
            {td.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
}
