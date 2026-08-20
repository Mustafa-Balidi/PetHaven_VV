import OrderSummaryItem from "./OrderSummaryItem.jsx";
import OrderTotals from "./OrderTotals.jsx";

export default function OrderSummaryCard({ items, subtotal, shipping, taxes, total }) {
  return (
    <div className="oc-summary-card">
      <div className="oc-items">
        {items.map((item) => (
          <OrderSummaryItem key={item.id} item={item} />
        ))}
      </div>

      <OrderTotals subtotal={subtotal} shipping={shipping} taxes={taxes} total={total} />
    </div>
  );
}