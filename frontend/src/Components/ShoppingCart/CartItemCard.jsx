import QuantitySelector from './QuantitySelector';
import { useTranslation } from 'react-i18next';

export default function CartItemCard({ item, onUpdateQty, onRemove }) {
  const { t } = useTranslation();

  return (
    <article className="sc-card">
      <div className="sc-card__img-wrap">
        <img
          src={item.productImage || '/placeholder-product.png'}
          alt={item.productName}
          className="sc-card__img"
        />
      </div>
      <div className="sc-card__body">
        <div className="sc-card__top">
          <div>
            <h3 className="sc-card__name">{item.productName}</h3>
          </div>
          <span className="sc-card__price">
            ${item.totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="sc-card__bottom">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => onUpdateQty(item.cartItemId, 1)}
            onDecrease={() => onUpdateQty(item.cartItemId, -1)}
          />
          <button type="button" className="sc-remove-btn" onClick={() => onRemove(item.cartItemId)}>
            <span className="material-symbols-outlined" aria-hidden="true">delete</span>
            {t('adopter.cart.remove')}
          </button>
        </div>
      </div>
    </article>
  );
}
