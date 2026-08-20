import { useEffect, useState } from 'react';
import '../Styling/OrderDetailsModal.css';
import { useTranslation } from 'react-i18next';

import ModalHeader from '../Components/OrderDetailsModal/ModalHeader';
import OrderMetaGrid from '../Components/OrderDetailsModal/OrderMetaGrid';
import ModalFooter from '../Components/OrderDetailsModal/ModalFooter';
import { getOrderConfirmation } from '../api/orderApi.js';
import OrderTotals from '../Components/OrderConfirmed/OrderTotals';
import OrderSummaryItem from '../Components/OrderConfirmed/OrderSummaryItem';

export default function OrderDetailsModal({ orderId, onClose }) {
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getOrderConfirmation(orderId)
      .then((data) => {
        if (!data) throw new Error(t('adopter.orders.loadError'));
        if (active) setOrder(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || t('adopter.orders.loadError'));
      });

    return () => { active = false; };
  }, [orderId, t]);

  return (
    <div className="odm-backdrop" onClick={onClose}>
      <div
        className="odm-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="odm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader title={t('adopter.orders.details')} onClose={onClose} />

        <div className="odm-content">
          {!order && <p role={error ? 'alert' : 'status'}>{error || t('adopter.orders.loading')}</p>}
          {order && <>
          <OrderMetaGrid id={order.id} date={order.date} status={order.status} />

          {/* القسم الناقص تبع عنوان العناصر وعددها */}
          <div className="odm-section">
            <h3 className="odm-section-title">
              {t('adopter.orders.itemsTitle')}
              <span className="odm-count-badge">
                {t('adopter.orders.itemCount', { count: order.items.length })}
              </span>
            </h3>
            
            <div className="odm-items">
              {order.items.map((singleItem, index) => (
                <OrderSummaryItem key={singleItem.id || index} item={singleItem} />
              ))}
            </div>
          </div>

          <OrderTotals
            subtotal={order.subtotal}
            shipping={order.shipping}
            taxes={order.taxes}
            total={order.total}
          />
          </>}
        </div>

        <ModalFooter />
      </div>
    </div>
  );
}
