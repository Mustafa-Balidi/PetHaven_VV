import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon.jsx";
import { TRENDING_PRODUCTS } from "../text/publicTexts.js";

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon = "star";
    let empty = false;
    if (rating >= i) icon = "star";
    else if (rating >= i - 0.5) icon = "star_half";
    else empty = true;
    stars.push(
      <Icon key={i} name={icon} className={`trending-products__star${empty ? " trending-products__star--empty" : ""}`} />
    );
  }
  return <>{stars}</>;
}

export default function TrendingProducts({ onProductClick, requireAuth }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const products = t("trendingProducts.products", { returnObjects: true });

  function handleViewAll(e) {
    e.preventDefault();
    if (!requireAuth()) return;
    navigate("/adopter/store");
  }

  return (
    <section id="shop" className="trending-products">
      <div className="trending-products__header">
        <h2 className="trending-products__title">{t("trendingProducts.title")}</h2>
        <a className="trending-products__view-all trending-products__view-all--desktop" href="#" onClick={handleViewAll}>
          {t("trendingProducts.viewAll")}
        </a>
      </div>
      <div className="trending-products__grid">
        {TRENDING_PRODUCTS.map((product, i) => (
          <div key={product.name} className="trending-products__card">
            {product.sale && <div className="trending-products__badge">{t("trendingProducts.sale")}</div>}
            <div className="trending-products__image-wrap">
              <img alt={products[i].alt} className="trending-products__image" src={product.image} />
            </div>
            <h3 className="trending-products__name">{products[i].name}</h3>
            <div className="trending-products__rating">
              <StarRating rating={product.rating} />
              <span className="trending-products__reviews">({product.reviews})</span>
            </div>
            <div className="trending-products__footer">
              <span className="trending-products__price">{product.price}</span>
              <button
                aria-label={t("trendingProducts.addToCart")}
                onClick={() => onProductClick({ ...product, ...products[i] })}
                className="trending-products__cart-btn"
              >
                <Icon name="add_shopping_cart" className="trending-products__cart-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="trending-products__view-all--mobile-wrap">
        <a className="trending-products__view-all" href="#" onClick={handleViewAll}>
          {t("trendingProducts.viewAll")}
        </a>
      </div>
    </section>
  );
}
