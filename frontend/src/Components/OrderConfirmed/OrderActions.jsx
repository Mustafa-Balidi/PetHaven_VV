import { useTranslation } from "react-i18next";

export default function OrderActions({ onContinueShopping, onViewOrderHistory }) {
  const { t } = useTranslation();

  return (
    <div className="oc-actions">
      <button type="button" className="oc-btn oc-btn--primary" onClick={onContinueShopping}>
        {t("adopter.orders.continueShopping")}
      </button>
      <button type="button" className="oc-btn oc-btn--outline" onClick={onViewOrderHistory}>
        {t("adopter.orders.viewHistory")}
      </button>
    </div>
  );
}
