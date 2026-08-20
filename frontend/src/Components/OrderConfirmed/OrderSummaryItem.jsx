import { useTranslation } from 'react-i18next';

export default function OrderSummaryItem({ item }) {
  const { t } = useTranslation();
  const variantMatch = item.variant?.match(/^(Size|Color):\s*(.+)$/i);
  const displayedVariant = variantMatch
    ? t(
        variantMatch[1].toLowerCase() === 'size'
          ? 'adopter.orders.size'
          : 'adopter.orders.color',
        { value: variantMatch[2] }
      )
    : item.variant;

  return (
    <div className="odm-item">
      <img src={item.image} alt={item.name} className="odm-item__img" />
      <div className="odm-item__info">
        <h4 className="odm-item__name">{item.name}</h4>
        {displayedVariant && <p className="odm-item__variant">{displayedVariant}</p>}
        {!item.variant && (item.size || item.color) && (
          <p className="odm-item__variant">
            {item.size
              ? t('adopter.orders.size', { value: item.size })
              : t('adopter.orders.color', { value: item.color })}
          </p>
        )}
      </div>
      <div className="odm-item__price">
        <div className="odm-item__amount">${item.price.toFixed(2)}</div>
        <div className="odm-item__qty">{t('adopter.orders.quantity', { count: item.qty })}</div>
      </div>
    </div>
  );
}
