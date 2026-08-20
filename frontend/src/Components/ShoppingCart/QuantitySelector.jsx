import { useTranslation } from 'react-i18next';

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  const { t } = useTranslation();

  return (
    <div className="sc-qty">
      <button className="sc-qty__btn" onClick={onDecrease} aria-label={t('adopter.cart.decrease')}>
        <span className="material-symbols-outlined">remove</span>
      </button>
      <span className="sc-qty__val">{quantity}</span>
      <button className="sc-qty__btn" onClick={onIncrease} aria-label={t('adopter.cart.increase')}>
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
