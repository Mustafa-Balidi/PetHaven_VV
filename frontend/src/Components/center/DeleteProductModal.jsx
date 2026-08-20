import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function DeleteProductModal({ product, onConfirm, onClose }) {
  const { t: translate } = useTranslation();
  const t = translate("center.modals", { returnObjects: true });
  const td = t.deleteProduct;
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleConfirm() {
    setDeleteError("");
    setDeleting(true);
    try {
      await onConfirm(product.productId);
    } catch (error) {
      setDeleteError(error.message || td.deleteError);
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
            {td.confirmPrefix} <span className="center-modal-confirm__name">'{product.name}'</span>?{" "}
            {td.confirmSuffix}
          </p>
          {deleteError && <p className="center-modal-error" role="alert">{deleteError}</p>}
        </div>
        <div className="center-modal-confirm__actions">
          <button type="button" className="center-modal-btn-cancel" onClick={onClose}>
            {t.cancel}
          </button>
          <button type="button" className="center-modal-btn-danger" disabled={deleting} onClick={handleConfirm}>
            <Icon name="delete" filled />
            {deleting ? td.deleting : td.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
}
