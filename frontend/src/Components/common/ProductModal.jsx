import { useId } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import useModalA11y from "../../hooks/useModalA11y.js";

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon = "star";
    let empty = false;
    if (rating >= i) icon = "star";
    else if (rating >= i - 0.5) icon = "star_half";
    else empty = true;
    stars.push(
      <Icon key={i} name={icon} className={`product-modal__star${empty ? " product-modal__star--empty" : ""}`} />
    );
  }
  return <>{stars}</>;
}

export default function ProductModal({ product, onClose, onRequireAuth }) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalA11y({ open: Boolean(product), onClose });

  if (!product) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <button type="button" aria-label={t("productModal.close")} className="modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <img alt={product.alt} className="product-modal__image" src={product.image} />
        <div className="product-modal__body">
          <h3 id={titleId} className="product-modal__name">{product.name}</h3>
          <div className="product-modal__price-row">
            <span className="product-modal__price">{product.price}</span>
            <span
              className="product-modal__rating"
              role="img"
              aria-label={t("productModal.ratingLabel", { rating: product.rating })}
            >
              <StarRating rating={product.rating} />
            </span>
          </div>
          <p id={descriptionId} className="product-modal__description">
            {t("productModal.description", { reviews: product.reviews })}
          </p>
          <button type="button" className="product-modal__cta" onClick={onRequireAuth}>
            {t("productModal.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
