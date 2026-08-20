import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { translateDisplayValue } from "../../utils/localization.js";

export default function DeliveryInfoGrid({ delivery, shippingType, address }) {
  const { t } = useTranslation();
  const addressLines = typeof address === "string"
    ? [address]
    : [address?.name, address?.street, address?.district].filter(Boolean);

  return (
    <div className="oc-info-grid">
      <div className="oc-info-card">
        <span className="material-symbols-outlined oc-info-card__icon">local_shipping</span>
        <div>
          <h3 className="oc-info-card__title">{t("adopter.orders.estimatedDelivery")}</h3>
          <p className="oc-info-card__text">
            {delivery || t("adopter.orders.deliveryPending")}
          </p>
          {shippingType && (
            <span className="oc-shipping-badge">
              {translateDisplayValue(
                t,
                "adopter.orders.shippingTypes",
                shippingType
              )}
            </span>
          )}
        </div>
      </div>

      <div className="oc-info-card">
        <span className="material-symbols-outlined oc-info-card__icon">home_pin</span>
        <div>
          <h3 className="oc-info-card__title">{t("adopter.orders.shippingAddress")}</h3>
          <p className="oc-info-card__text">
            {addressLines.length > 0
              ? addressLines.map((line, index) => (
                  <Fragment key={`${line}-${index}`}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))
              : t("adopter.orders.addressUnavailable")}
          </p>
        </div>
      </div>
    </div>
  );
}
