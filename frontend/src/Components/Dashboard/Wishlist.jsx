import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Wishlist({ items = [], loading = false, error = null, onRetry }) {
  const { t, i18n } = useTranslation();
  const currency = new Intl.NumberFormat(
    i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en",
    { style: "currency", currency: "USD" }
  );

  return (
    <section className="wishlist-section">
      <div className="section-header wishlist-section-header">
        <h2 className="section-title">{t("adopter.dashboard.wishlist.title")}</h2>
        {!loading && !error && items.length > 0 && (
          <span className="wishlist-count">
            {t("adopter.dashboard.wishlist.count", { count: items.length })}
          </span>
        )}
      </div>

      {loading ? (
        <div className="wishlist-state-card" aria-live="polite">
          <span className="material-symbols-outlined wishlist-state-icon" aria-hidden="true">
            progress_activity
          </span>
          <p>{t("adopter.dashboard.wishlist.loading")}</p>
        </div>
      ) : error ? (
        <div className="wishlist-state-card wishlist-state-card--error" role="alert">
          <span className="material-symbols-outlined wishlist-state-icon" aria-hidden="true">error</span>
          <p>{t("adopter.dashboard.wishlist.loadError", { message: error })}</p>
          <button type="button" className="dashboard-retry-button" onClick={onRetry}>{t("adopter.dashboard.retry")}</button>
        </div>
      ) : items.length === 0 ? (
        <div className="wishlist-state-card wishlist-state-card--empty">
          <div className="wishlist-state-icon-wrap" aria-hidden="true">
            <span className="material-symbols-outlined wishlist-state-icon" aria-hidden="true">
              bookmark_border
            </span>
          </div>
          <h3>{t("adopter.dashboard.wishlist.emptyTitle")}</h3>
          <p>{t("adopter.dashboard.wishlist.emptyText")}</p>
          <Link to="/adopter/store" className="wishlist-explore-link">
            <span className="material-symbols-outlined" aria-hidden="true">
              storefront
            </span>
            {t("adopter.dashboard.wishlist.explore")}
          </Link>
        </div>
      ) : (
        <>
          <div className="stacked-list">
            {items.map((item) => (
              <Link
                className="wishlist-item"
                key={item.id}
                to={`/adopter/product?id=${encodeURIComponent(item.productId)}`}
                aria-label={t("adopter.dashboard.wishlist.viewProduct", {
                  name: item.name,
                })}
              >
                <div className="wishlist-thumb">
                  {item.image ? (
                    <img alt={item.name} src={item.image} />
                  ) : (
                    <span className="material-symbols-outlined wishlist-icon" aria-hidden="true">
                      inventory_2
                    </span>
                  )}
                </div>
                <div className="wishlist-info">
                  <h3 className="wishlist-name">{item.name}</h3>
                  <p className="wishlist-detail">
                    {Number.isFinite(item.price)
                      ? currency.format(item.price)
                      : t("adopter.dashboard.wishlist.priceUnavailable")}
                  </p>
                </div>
                <span className="material-symbols-outlined wishlist-chevron" aria-hidden="true">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>

          <Link to="/adopter/store" className="wishlist-store-link">
            {t("adopter.dashboard.wishlist.browseStore")}
          </Link>
        </>
      )}
    </section>
  );
}
