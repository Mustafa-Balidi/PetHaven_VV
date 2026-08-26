import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../Styling/OrderConfirmed.css";
import Navbar from "../Components/TopNavBar.jsx";
import SuccessHeader from "../Components/OrderConfirmed/SuccessHeader.jsx";
import DeliveryInfoGrid from "../Components/OrderConfirmed/DeliveryInfoGrid.jsx";
import OrderSummaryCard from "../Components/OrderConfirmed/OrderSummaryCard.jsx";
import OrderActions from "../Components/OrderConfirmed/OrderActions.jsx";

import { getOrderConfirmation } from "../api/orderApi.js";

export default function OrderConfirmed({ orderNumber, onContinueShopping, onViewOrderHistory }) {
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getOrderConfirmation(orderNumber)
      .then((data) => {
        if (!data) throw new Error(t("adopter.orders.loadError"));
        if (isMounted) setOrder(data);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || t("adopter.orders.loadError"));
      });

    return () => {
      isMounted = false;
    };
  }, [orderNumber, t]);

  if (!order) {
    return (
      <div className="oc-page">
        <Navbar />
        <main id="main-content" tabIndex={-1} className="oc-main">
          <p role={error ? "alert" : "status"}>{error || t("adopter.orders.loading")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="oc-page">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="oc-main">
        <div className="oc-card">
          <SuccessHeader orderNumber={order.number} customerName={order.customerName} />

          <div className="oc-body">
            <DeliveryInfoGrid
              delivery={order.delivery}
              shippingType={order.shippingType}
              address={order.address}
            />

            <div>
              <h3 className="oc-section-title">{t("adopter.orders.summary")}</h3>
              <OrderSummaryCard
                items={order.items}
                subtotal={order.subtotal}
                shipping={order.shipping}
                taxes={order.taxes}
                total={order.total}
              />
            </div>

            <OrderActions
              onContinueShopping={onContinueShopping}
              onViewOrderHistory={onViewOrderHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
