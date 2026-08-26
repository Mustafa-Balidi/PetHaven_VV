import { useTranslation } from 'react-i18next';

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  const { t } = useTranslation();

  return (
    <div className="sc-qty" role="group" aria-label={t('adopter.cart.quantity', { count: quantity })}>
      <button type="button" className="sc-qty__btn" onClick={onDecrease} aria-label={t('adopter.cart.decrease')}>
        <span className="material-symbols-outlined" aria-hidden="true">remove</span>
      </button>
      <span className="sc-qty__val" aria-live="polite">{quantity}</span>
      <button type="button" className="sc-qty__btn" onClick={onIncrease} aria-label={t('adopter.cart.increase')}>
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
      </button>
    </div>
  );
}
