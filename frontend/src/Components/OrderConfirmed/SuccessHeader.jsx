import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SuccessHeader({ orderNumber, customerName }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="oc-success-header">
      <div className="oc-check-icon">
        <span className="material-symbols-outlined oc-check-icon__symbol" aria-hidden="true">check_circle</span>
      </div>
      <h1 className="oc-success-title">{t("adopter.orders.confirmed")}</h1>
      <p className="oc-success-sub">
        {customerName
          ? t("adopter.orders.thankYou", { name: customerName })
          : t("adopter.orders.thankYouGeneric")}
      </p>
      <div className="oc-order-number">
        {t("adopter.orders.number", { number: orderNumber })}
        <button
          className="oc-copy-btn"
          onClick={handleCopy}
          title={t("adopter.orders.copyNumber")}
          aria-label={t("adopter.orders.copyNumber")}
        >
          <span className="material-symbols-outlined" aria-hidden="true">{copied ? "check" : "content_copy"}</span>
        </button>
      </div>
    </div>
  );
}
