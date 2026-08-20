import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

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

export default function ProductModal({ product, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!product) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button aria-label={t("productModal.close")} className="modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <img alt={product.alt} className="product-modal__image" src={product.image} />
        <div className="product-modal__body">
          <h3 className="product-modal__name">{product.name}</h3>
          <div className="product-modal__price-row">
            <span className="product-modal__price">{product.price}</span>
            <span className="product-modal__rating">
              <StarRating rating={product.rating} />
            </span>
          </div>
          <p className="product-modal__description">
            {t("productModal.description", { reviews: product.reviews })}
          </p>
          <button className="product-modal__cta" onClick={onClose}>
            {t("productModal.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
