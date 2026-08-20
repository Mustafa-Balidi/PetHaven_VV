import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function AllProductSalesModal({ sales, loading, onClose }) {
  const { t: translate } = useTranslation();
  const t = translate("center.modals", { returnObjects: true });
  const tv = t.viewSales;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(
      (s) => s.name.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q)
    );
  }, [sales, search]);

  return (
    <div className="center-modal-overlay">
      <button type="button" aria-label={t.close} className="center-modal-backdrop" onClick={onClose} />
      <div className="center-modal-panel center-modal-panel--md">
        <div className="center-modal-header">
          <h2 className="center-modal-title">{tv.title}</h2>
          <button type="button" aria-label={t.close} className="center-modal-close-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="center-modal-body">
          <div className="center-modal-search">
            <Icon name="search" className="center-modal-search__icon" />
            <input
              type="text"
              className="center-modal-input center-modal-input--search"
              placeholder={tv.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="center-modal-table-wrap">
            <table className="center-modal-table">
              <thead>
                <tr>
                  <th>{tv.columns.product}</th>
                  <th>{tv.columns.customer}</th>
                  <th>{tv.columns.date}</th>
                  <th>{tv.columns.price}</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filtered.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <div className="center-modal-table__product-cell">
                          <img src={sale.image} alt={sale.name} className="center-modal-table__thumb" />
                          <span>{sale.name}</span>
                        </div>
                      </td>
                      <td>{sale.customer}</td>
                      <td>{sale.when}</td>
                      <td>${sale.price.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!loading && filtered.length === 0 && <p className="center-modal-empty">{tv.empty}</p>}
          </div>
        </div>

        <div className="center-modal-footer">
          <button type="button" className="center-modal-btn-primary" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
