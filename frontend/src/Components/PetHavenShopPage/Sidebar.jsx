import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import FilterGroup from "./FilterGroup.jsx";
import OrderItem from "./OrderItem.jsx";
import { getRecentOrders } from "../../api/order.js";

export default function Sidebar({
  categories,
  selectedCategoryId,
  selectedBrands,
  availableBrands,
  priceRange,
  onSelectCategory,
  onToggleBrand,
  onPriceChange,
  onClearAll,
}) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getRecentOrders()
      .then((ordersData) => {
        if (isMounted) setOrders(ordersData);
      })
      .catch((error) => {
        console.error("Error fetching recent orders:", error);
        if (isMounted) setOrders([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    label: category.label,
    checked: selectedCategoryId === category.id,
  }));
  const brandOptions = availableBrands.map((brand) => ({
    id: brand,
    label: brand,
    checked: selectedBrands.includes(brand),
  }));

  return (
    <aside className="sidebar">
      <div className="sidebar-mobile-header">
        <span className="sidebar-title">{t("adopter.store.sidebar.filters")}</span>
        <button
          type="button"
          className="icon-btn-primary"
          aria-expanded={isMobileOpen}
          aria-controls="store-filter-panel"
          aria-label={t(
            isMobileOpen
              ? "adopter.store.sidebar.closeFilters"
              : "adopter.store.sidebar.openFilters"
          )}
          onClick={() => setIsMobileOpen((current) => !current)}
        >
          <Icon name={isMobileOpen ? "close" : "filter_list"} />
        </button>
      </div>

      <div
        id="store-filter-panel"
        className={`sidebar-card filter-box${isMobileOpen ? " sidebar-card--open" : ""}`}
      >
        <div className="filter-header">
          <h3 className="sidebar-heading">{t("adopter.store.sidebar.filters")}</h3>
          <button type="button" className="clear-btn" onClick={onClearAll}>
            {t("adopter.store.sidebar.clearAll")}
          </button>
        </div>

        <FilterGroup
          title={t("adopter.store.sidebar.categories")}
          options={categoryOptions}
          onToggle={onSelectCategory}
        />

        <div className="filter-group border-top">
          <h4 className="filter-title">{t("adopter.store.sidebar.priceRange")}</h4>
          <div className="price-inputs">
            <input
              className="price-input"
              aria-label={t("adopter.store.sidebar.minPrice")}
              placeholder={t("adopter.store.sidebar.min")}
              type="number"
              min="0"
              inputMode="decimal"
              value={priceRange.min}
              onChange={(event) => onPriceChange("min", event.target.value)}
            />
            <span className="text-muted" aria-hidden="true">–</span>
            <input
              className="price-input"
              aria-label={t("adopter.store.sidebar.maxPrice")}
              placeholder={t("adopter.store.sidebar.max")}
              type="number"
              min="0"
              inputMode="decimal"
              value={priceRange.max}
              onChange={(event) => onPriceChange("max", event.target.value)}
            />
          </div>
        </div>

        <FilterGroup
          title={t("adopter.store.sidebar.brands")}
          options={brandOptions}
          onToggle={onToggleBrand}
          bordered
          scrollable
        />
      </div>

      {orders.length > 0 && (
        <div className="sidebar-card orders-box">
          <div className="filter-header">
            <h3 className="sidebar-heading">{t("adopter.store.sidebar.orders")}</h3>
          </div>
          <div className="orders-list">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
