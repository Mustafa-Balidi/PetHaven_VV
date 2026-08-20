import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import DeleteProductModal from "./DeleteProductModal.jsx";
import EditProductModal from "./EditProductModal.jsx";
import AddProductModal from "./AddProductModal.jsx";
import AllProductSalesModal from "./AllProductSalesModal.jsx";

const PAGE_SIZE = 5;

const ProductInventory = forwardRef(function ProductInventory(
  {
    productInventory,
    recentSales: recentSalesProp,
    loading,
    error,
    onAdded,
    onSaved,
    onDeleted,
    allProductSales,
    allProductSalesLoading,
    onOpenAllProductSales,
  },
  ref
) {
  const { t: translate } = useTranslation();
  const t = translate("center.inventory", { returnObjects: true });
  const tp = t.product;

  const recentSales = recentSalesProp ?? [];
  const products = useMemo(
    () => (Array.isArray(productInventory) ? productInventory : []),
    [productInventory]
  );

  const categories = useMemo(() => {
    const counts = new Map();
    for (const p of products) {
      if (!p.categoryName) continue;
      counts.set(p.categoryName, (counts.get(p.categoryName) ?? 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [products]);

  const lowStockCount = products.filter((p) => p.stockQuantity <= 5 && p.stockQuantity > 0).length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + ((p.priceAfterDiscount ?? p.productPrice ?? 0) * (p.stockQuantity ?? 0)),
    0
  );

  const quickStats = {
    lowStockCount,
    totalStockValue,
    lowStockItems: lowStockCount,
    totalSalesToday: 0,
  };

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);

  useImperativeHandle(ref, () => ({
    openAdd: () => setAddingProduct(true),
  }));

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "All" && p.categoryName !== categoryFilter) return false;
      if (!q) return true;
      return (p.name ?? "").toLowerCase().includes(q);
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filteredProducts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredProducts.length);

  async function handleDeleted(id) {
    await onDeleted(id);
    setDeletingProduct(null);
  }

  async function handleSaved(id, patch) {
    await onSaved(id, patch);
    setEditingProduct(null);
  }

  async function handleAdded(productData) {
    await onAdded(productData);
    setAddingProduct(false);
  }

  function openSalesModal() {
    setShowSalesModal(true);
    onOpenAllProductSales();
  }

  if (loading) return <div className="center-inv-loading">{t.loading}</div>;
  if (error) return <div className="center-inv-loading center-inv-error" role="alert">{error}</div>;

  return (
    <div className="center-inv-product-layout">
      <aside className="center-inv-product-sidebar">
        <div className="center-inv-card">
          <h3 className="center-inv-card__title">{tp.quickStats.title}</h3>
          <div className="center-inv-product-stat">
            <div className="center-inv-product-stat__icon center-inv-product-stat__icon--primary">
              <Icon name="payments" />
            </div>
            <div>
              <p className="center-inv-product-stat__label">{tp.quickStats.totalStockValue}</p>
              <p className="center-inv-product-stat__value">${quickStats.totalStockValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="center-inv-product-stat">
            <div className="center-inv-product-stat__icon center-inv-product-stat__icon--error">
              <Icon name="warning" />
            </div>
            <div>
              <p className="center-inv-product-stat__label">{tp.quickStats.lowStockItems}</p>
              <p className="center-inv-product-stat__value">{quickStats.lowStockItems}</p>
            </div>
          </div>
          <div className="center-inv-product-stat">
            <div className="center-inv-product-stat__icon center-inv-product-stat__icon--green">
              <Icon name="trending_up" />
            </div>
            <div>
              <p className="center-inv-product-stat__label">{tp.quickStats.totalSalesToday}</p>
              <p className="center-inv-product-stat__value">${quickStats.totalSalesToday.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="center-inv-card">
          <h3 className="center-inv-card__title">{tp.categories.title}</h3>
          <ul className="center-inv-product-categories">
            {categories.map((c) => (
              <li key={c.name} className="center-inv-product-categories__item">
                <span>{translate(`center.productCategories.${c.name}`, { defaultValue: c.name })}</span>
                <span>{c.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="center-inv-card">
          <h3 className="center-inv-card__title">{tp.recentSales.title}</h3>
          <div className="center-inv-product-sales">
            {recentSales.map((s) => (
              <div
                key={s.id}
                className="center-inv-product-sales__item"
                onClick={openSalesModal}
              >
                <div className="center-inv-product-sales__thumb">
                  <img src={s.image} alt={s.name} />
                </div>
                <div className="center-inv-product-sales__info">
                  <p className="center-inv-product-sales__name">{s.name}</p>
                  <p className="center-inv-product-sales__time">{s.when}</p>
                </div>
                <p className="center-inv-product-sales__price">${(s.price ?? 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <button type="button" className="center-inv-product-view-all" onClick={openSalesModal}>
            {tp.recentSales.viewAll}
          </button>
        </div>
      </aside>

      <section className="center-inv-product-main">
        <div className="center-inv-product-table-card">
          <div className="center-inv-product-table-controls">
            <div className="center-inv-product-search">
              <Icon name="search" className="center-inv-product-search__icon" />
              <input
                type="text"
                className="center-inv-product-search__input"
                placeholder={tp.toolbar.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="center-inv-product-select-wrap">
              <select
                className="center-inv-product-select"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">{tp.toolbar.categoryAll}</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {translate(`center.productCategories.${c.name}`, { defaultValue: c.name })}
                  </option>
                ))}
              </select>
              <Icon name="expand_more" className="center-inv-product-select__icon" />
            </div>
          </div>

          <div className="center-inv-product-table-wrap">
            <table className="center-inv-product-table">
              <thead>
                <tr>
                  <th>{tp.columns.name}</th>
                  <th>{tp.columns.category}</th>
                  <th>{tp.columns.inStock}</th>
                  <th>{tp.columns.price}</th>
                  <th>{tp.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map((product) => (
                  <tr key={product.productId}>
                    <td>
                      <div className="center-inv-product-table__name-cell">
                        <div className="center-inv-product-table__thumb">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} />
                          ) : (
                            <Icon name="inventory_2" />
                          )}
                        </div>
                        <span className="center-inv-product-table__name">{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="center-inv-product-table__category-chip">
                        {translate(`center.productCategories.${product.categoryName}`, { defaultValue: product.categoryName })}
                      </span>
                    </td>
                    <td>
                      {product.stockQuantity ?? 0}
                      {(product.stockQuantity ?? 0) <= 15 && <span className="center-inv-product-table__low">{tp.low}</span>}
                    </td>
                    <td>${(product.productPrice ?? 0).toFixed(2)}</td>
                    <td>
                      <div className="center-inv-product-table__actions">
                        <button
                          type="button"
                          aria-label={t.edit}
                          className="center-inv-product-icon-btn"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Icon name="edit" />
                        </button>
                        <button
                          type="button"
                          aria-label={t.delete}
                          className="center-inv-product-icon-btn center-inv-product-icon-btn--danger"
                          onClick={() => setDeletingProduct(product)}
                        >
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagedProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="center-inv-product-table__empty">{tp.empty}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="center-inv-product-pagination">
            <span className="center-inv-product-pagination__info">
              {t.pagination.showing} {rangeStart} {t.pagination.to} {rangeEnd} {t.pagination.of}{" "}
              {filteredProducts.length} {t.pagination.entries}
            </span>
            <div className="center-inv-product-pagination__controls">
              <button
                type="button"
                className="center-inv-product-pagination__btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t.pagination.prev}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`center-inv-product-pagination__btn ${n === page ? "center-inv-product-pagination__btn--active" : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="center-inv-product-pagination__btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t.pagination.next}
              </button>
            </div>
          </div>
        </div>
      </section>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaved}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onConfirm={handleDeleted}
          onClose={() => setDeletingProduct(null)}
        />
      )}

      {addingProduct && <AddProductModal onSave={handleAdded} onClose={() => setAddingProduct(false)} />}

      {showSalesModal && (
        <AllProductSalesModal
          sales={allProductSales}
          loading={allProductSalesLoading}
          onClose={() => setShowSalesModal(false)}
        />
      )}
    </div>
  );
});

export default ProductInventory;
