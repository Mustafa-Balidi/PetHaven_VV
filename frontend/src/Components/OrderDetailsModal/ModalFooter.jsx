import { useTranslation } from 'react-i18next';

export default function ModalFooter() {
  const { t } = useTranslation();

  return (
    <div className="odm-footer">
      <button className="odm-btn odm-btn--outline" disabled>{t('adopter.orders.downloadInvoice')}</button>
      <button className="odm-btn odm-btn--primary" disabled>
        <span className="material-symbols-outlined">shopping_cart_checkout</span>
        {t('adopter.orders.buyAgain')}
      </button>
    </div>
  );
}
