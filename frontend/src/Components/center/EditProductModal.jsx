import { useId, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import useModalA11y from "../../hooks/useModalA11y.js";

export default function EditProductModal({ product, onSave, onClose }) {
  const { t: translate } = useTranslation();
  const titleId = useId();
  const t = translate("center.modals", { returnObjects: true });
  const te = t.editProduct;
  const { categories, fetchCategories } = useCenterContext();
  const [name, setName] = useState(product.name ?? "");
  const [categoryId, setCategoryId] = useState(String(product.categoryId ?? ""));
  const [stockQuantity, setStockQuantity] = useState(String(product.stockQuantity ?? 0));
  const [productPrice, setProductPrice] = useState(String(product.productPrice ?? 0));
  const [discountPercent, setDiscountPercent] = useState(String((product.discountRate ?? 0) * 100));
  const [description, setDescription] = useState(product.description ?? "");
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const dialogRef = useModalA11y({ onClose, closeOnEscape: !saving });
  const [saveError, setSaveError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories().catch(() => {});
  }, [fetchCategories]);

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      await onSave(product.productId, {
        categoryId: Number(categoryId),
        name: name.trim(),
        description: description.trim() || null,
        productPrice: Number(productPrice),
        discountRate: Math.min(100, Math.max(0, Number(discountPercent))) / 100,
        stockQuantity: Number(stockQuantity),
        imageUrl: imageUrl.trim() || null,
      });
    } catch (error) {
      setSaveError(error.message || te.saveError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={t.close} className="center-modal-backdrop" onClick={onClose} />
      <form
        className="center-modal-panel center-modal-panel--md" onSubmit={handleSubmit}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="center-modal-header">
          <h2 id={titleId} className="center-modal-title">{te.title}</h2>
          <button type="button" aria-label={t.close} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <div className="center-modal-photo">
            <div className="center-modal-photo__preview">
              <img src={imageUrl} alt={name} />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="center-modal-file-input"
            />
            <button type="button" className="center-modal-photo__change-btn" onClick={() => fileInputRef.current.click()}>
              <Icon name="photo_camera" />
              {te.changePhoto}
            </button>
          </div>

          <div className="center-modal-grid">
            <div className="center-modal-field center-modal-field--full">
              <label className="center-modal-label" htmlFor="edit-product-name">{te.nameLabel}</label>
              <input
                id="edit-product-name"
                type="text"
                required
                className="center-modal-input"
                placeholder={te.namePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="center-modal-field">
              <label className="center-modal-label" htmlFor="edit-product-category">{te.categoryLabel}</label>
              <div className="center-modal-select-wrap">
                <select
                  id="edit-product-category"
                  required
                  className="center-modal-select"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {translate(`center.productCategories.${category.name}`, { defaultValue: category.name })}
                    </option>
                  ))}
                </select>
                <Icon name="expand_more" className="center-modal-select__icon" />
              </div>
            </div>
            <div className="center-modal-field">
              <label className="center-modal-label" htmlFor="edit-product-stock">{te.stockLabel}</label>
              <input
                id="edit-product-stock"
                type="number"
                required
                min="0"
                className="center-modal-input"
                value={stockQuantity}
                onChange={(event) => setStockQuantity(event.target.value)}
              />
            </div>
          </div>

          <div className="center-modal-grid">
            <div className="center-modal-field">
              <label className="center-modal-label" htmlFor="edit-product-price">{te.priceLabel}</label>
              <input
                id="edit-product-price"
                type="number"
                required
                min="0"
                step="0.01"
                className="center-modal-input"
                value={productPrice}
                onChange={(event) => setProductPrice(event.target.value)}
              />
            </div>
            <div className="center-modal-field">
              <label className="center-modal-label" htmlFor="edit-product-discount">{te.discountLabel}</label>
              <input
                id="edit-product-discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                className="center-modal-input"
                value={discountPercent}
                onChange={(event) => setDiscountPercent(event.target.value)}
              />
            </div>
          </div>

          <div className="center-modal-field">
            <label className="center-modal-label" htmlFor="edit-product-description">{te.descriptionLabel}</label>
            <textarea
              id="edit-product-description"
              className="center-modal-textarea"
              placeholder={te.descriptionPlaceholder}
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {saveError && <p className="center-modal-error" role="alert">{saveError}</p>}
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-secondary" onClick={onClose}>{t.cancel}</button>
          <button type="submit" className="center-modal-btn-primary" disabled={saving || !name.trim() || !categoryId}>
            <Icon name="save" />
            {saving ? te.saving : te.saveButton}
          </button>
        </div>
      </form>
    </div>
  );
}
