import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import StarRating from "../StarRating.jsx";
import { addToCart } from "../../api/cartData.js";

export default function ProductDetails({ product, loading, error, reviewSummary }) {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addFeedback, setAddFeedback] = useState(null);

  async function handleAddToCart() {
    if (!product) return;

    if (!localStorage.getItem("token")) {
      setAddFeedback({ type: "error", message: t("adopter.product.loginRequired") });
      return;
    }

    setIsAdding(true);
    setAddFeedback(null);
    try {
      await addToCart(product.id, qty);
      setAddFeedback({ type: "success", message: t("adopter.product.addSuccess") });
    } catch {
      setAddFeedback({ type: "error", message: t("adopter.product.addError") });
    } finally {
      setIsAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="product-details product-details-loading">
        {t("adopter.product.loading")}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details product-details-error" role="alert">
        {t("adopter.product.loadError")}
      </div>
    );
  }

  const hasDiscount = product.discountRate > 0 && product.originalPrice > product.price;
  const currentReviewSummary = reviewSummary ?? {
    average: product.averageRating,
    count: product.totalReviews,
  };

  return (
    <div className="product-details">
      <div className="product-title-block">
        <p className="product-source">
          {product.categoryName}
          {product.centerName && ` • ${product.centerName}`}
        </p>
        <h1 className="product-title">{product.title}</h1>
        <div className="rating-row">
          <StarRating count={currentReviewSummary.average} />
          <span className="rating-text">
            {t("adopter.product.reviews", {
              rating: currentReviewSummary.average.toFixed(1),
              count: currentReviewSummary.count,
            })}
          </span>
        </div>
      </div>

      <div className="purchase-box">
        <div className="purchase-box-inner">
          <div className="product-price-row">
            <span className="price">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="product-original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className={`product-stock${product.stockQuantity > 0 ? "" : " product-stock--out"}`}>
            {product.stockQuantity > 0
              ? t("adopter.product.inStock", { count: product.stockQuantity })
              : t("adopter.product.outOfStock")}
          </p>

          <div className="purchase-row">
            <div className="qty-control">
              <button
                type="button"
                aria-label={t("adopter.product.decreaseQuantity")}
                onClick={() => setQty((current) => Math.max(1, current - 1))}
                className="qty-btn"
                disabled={product.stockQuantity <= 0 || qty <= 1}
              >
                <Icon name="remove" className="icon-20" />
              </button>
              <span className="qty-value">{qty}</span>
              <button
                type="button"
                aria-label={t("adopter.product.increaseQuantity")}
                onClick={() => setQty((current) => Math.min(product.stockQuantity, current + 1))}
                className="qty-btn"
                disabled={product.stockQuantity <= 0 || qty >= product.stockQuantity}
              >
                <Icon name="add" className="icon-20" />
              </button>
            </div>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isAdding || product.stockQuantity <= 0}
            >
              <Icon name="shopping_cart" className="icon-20" />
              {isAdding ? t("adopter.product.adding") : t("adopter.product.addToCart")}
            </button>
          </div>

          {addFeedback && (
            <p
              className={`add-to-cart-feedback add-to-cart-feedback--${addFeedback.type}`}
              role={addFeedback.type === "error" ? "alert" : "status"}
            >
              {addFeedback.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
