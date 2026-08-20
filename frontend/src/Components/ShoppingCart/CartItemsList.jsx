import CartItemCard from './CartItemCard';

export default function CartItemsList({ items, onUpdateQty, onRemove }) {
  return (
    <div className="sc-items">
      {items.map((item) => (
        <CartItemCard key={item.cartItemId} item={item} onUpdateQty={onUpdateQty} onRemove={onRemove} />
      ))}
    </div>
  );
}
