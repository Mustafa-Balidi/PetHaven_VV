const STATUS_DOT_CLASS_MAP = {
  green: "dot-green",
  orange: "dot-orange",
  red: "dot-red",
};

import { useTranslation } from "react-i18next";
import { formatLocalizedDate } from "../../utils/localization.js";

export default function OrderItem({ order }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="order-item">
      <div className="order-img-box">
          {order.image
            ? <img alt={t("adopter.store.order.imageAlt")} src={order.image} />
            : <span className="material-symbols-outlined" aria-hidden="true">receipt_long</span>}
      </div>
      <div className="order-details">
        <span className="order-id">#{order.id}</span>
        <div className="status-wrapper">
          <span className={`status-dot ${STATUS_DOT_CLASS_MAP[order.statusColor] ?? "dot-green"}`}></span>
          <span className="status-text">
            {t(`adopter.store.order.statuses.${order.status}`, { defaultValue: order.status })}
          </span>
        </div>
        <span className="order-date">
          {formatLocalizedDate(order.date, i18n.language, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
