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
    <div
      className="product-card"
      role="link"
      tabIndex={0}
      onClick={viewProduct}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          viewProduct();
        }
      }}
    >
        {badge && (
          <div className="badge-container">
            <span className={`badge ${BADGE_CLASS_MAP[badge.variant] ?? "badge-secondary"}`}>
              {getBadgeLabel()}
            </span>
          </div>
        )}

        <button
          aria-label={t("adopter.store.productCard.wishlist")}
          className={`wishlist-btn${isWishlisted ? " active" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist?.(product.id);
          }}
        >
          <Icon name="favorite" className="icon-md" filled={isWishlisted} />
        </button>

        <div className="product-img-box">
          {image ? (
            <img alt={title} src={image} />
          ) : (
            <div className="product-card-image-placeholder">
              <Icon name="inventory_2" />
              <span>{t("adopter.store.productCard.imageUnavailable")}</span>
            </div>
          )}
        </div>

        <div className="product-info">
          <span className="product-brand">{brand}</span>
          <h3 className="product-title">{title}</h3>

          {hasRating && (
            <div className="rating-box">
              <StarRating count={rating} />
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
              aria-label={t("adopter.store.productCard.addToCart")}
              className="add-cart-btn"
              onClick={(event) => {
                event.stopPropagation();
                onAddToCart?.(product.id);
              }}
            >
              <Icon name="add_shopping_cart" className="icon-md" />
            </button>
          </div>
        </div>
    </div>
  );
}
