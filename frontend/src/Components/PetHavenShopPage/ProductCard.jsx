import Icon from "../Icon.jsx";
import StarRating from "../StarRating.jsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BADGE_CLASS_MAP = {
  secondary: "badge-secondary",
  green: "badge-green",
  red: "badge-red",
};

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { brand, title, image, badge, rating, reviewCount, price, oldPrice } = product;

  const hasRating = rating !== null && rating !== undefined;
  const viewProduct = () => {
    navigate(`/adopter/product?id=${encodeURIComponent(product.id)}`);
  };

  const getBadgeLabel = () => {
    if (!badge) return "";
    if (badge.variant === "red") {
      const percent = badge.label.match(/\d+/)?.[0];
      if (percent) return t("adopter.store.productCard.save", { percent });
    }
    if (badge.variant === "orange") return t("adopter.store.productCard.lowStock");
    return badge.label;
  };

  return (
    <article className="product-card">
        {badge && (
          <div className="badge-container">
            <span className={`badge ${BADGE_CLASS_MAP[badge.variant] ?? "badge-secondary"}`}>
              {getBadgeLabel()}
            </span>
          </div>
        )}

        <button
          type="button"
          aria-label={t("adopter.store.productCard.wishlist")}
          className={`wishlist-btn${isWishlisted ? " active" : ""}`}
          aria-pressed={isWishlisted}
          onClick={() => onToggleWishlist?.(product.id)}
        >
          <Icon name="favorite" className="icon-md" filled={isWishlisted} />
        </button>

        <button
          type="button"
          className="product-img-box product-card__view-button"
          onClick={viewProduct}
          aria-label={t("adopter.store.productCard.viewProduct", { name: title })}
        >
          {image ? (
            <img alt={title} src={image} />
          ) : (
            <div className="product-card-image-placeholder">
              <Icon name="inventory_2" />
              <span>{t("adopter.store.productCard.imageUnavailable")}</span>
            </div>
          )}
        </button>

        <div className="product-info">
          <span className="product-brand">{brand}</span>
          <h3 className="product-title">
            <button type="button" className="product-card__title-button" onClick={viewProduct}>
              {title}
            </button>
          </h3>

          {hasRating && (
            <div className="rating-box">
              <StarRating
                count={rating}
                ariaLabel={t("adopter.product.review.starLabel", { count: rating })}
              />
              <span className="rating-count">({reviewCount ?? 0})</span>
            </div>
          )}

          <div className="product-footer">
            {oldPrice ? (
              <div className="price-wrapper-sale">
                <span className="product-price">${price.toFixed(2)}</span>
                <span className="old-price">${oldPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="product-price">${price.toFixed(2)}</span>
            )}
            <button
              type="button"
              aria-label={t("adopter.store.productCard.addToCart")}
              className="add-cart-btn"
              onClick={() => onAddToCart?.(product.id)}
            >
              <Icon name="add_shopping_cart" className="icon-md" />
            </button>
          </div>
        </div>
    </article>
  );
}
