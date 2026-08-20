import { useTranslation } from "react-i18next";

export default function OrderTotals({ subtotal, shipping, taxes, total }) {
  const { t } = useTranslation();

  return (
    <div className="oc-totals">
      <div className="oc-totals__line">
        <span>{t("adopter.orders.subtotal")}</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="oc-totals__line">
        <span>{t("adopter.orders.shipping")}</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="oc-totals__line">
        <span>{t("adopter.orders.taxes")}</span>
        <span>${taxes.toFixed(2)}</span>
      </div>
      <div className="oc-totals__total">
        <span>{t("adopter.orders.total")}</span>
        <span className="oc-totals__total-val">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
