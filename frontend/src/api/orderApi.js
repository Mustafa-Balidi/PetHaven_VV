import { apiRequest } from "./apiClient.js";

export async function checkoutOrder() {
  return apiRequest("/Orders/checkout", {
    method: "POST",
  });
}

export async function processPayment({ orderId, paymentMethod, transactionId = null }) {
  return apiRequest("/Payments/checkout", {
    method: "POST",
    body: JSON.stringify({
      orderId: Number(orderId),
      paymentMethod,
      transactionId,
    }),
  });
}

export async function getMyOrders() {
  const orders = await apiRequest("/Orders/my-orders", {
    method: "GET",
  });

  return Array.isArray(orders) ? orders : [];
}

export async function getOrderById(orderId) {
  const orders = await getMyOrders();

  if (orderId === undefined || orderId === null || orderId === "") {
    return null;
  }

  const numericId = Number(orderId);
  return orders.find((order) => Number(order.orderId) === numericId) ?? null;
}

export function mapOrderToViewModel(order) {
  if (!order) return null;

  const items = (order.items ?? []).map((item) => ({
    id: item.productId,
    name: item.productName,
    qty: Number(item.quantity ?? 0),
    price: Number(item.unitPrice ?? 0),
    image: null,
  }));

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const total = Number(order.totalAmount ?? itemsSubtotal);

  return {
    id: String(order.orderId),
    number: String(order.orderId),
    date: order.orderDate,
    status: order.status ?? "Pending",
    items,
    subtotal: itemsSubtotal,
    shipping: 0,
    taxes: 0,
    total,
  };
}

export async function getOrderConfirmation(orderId) {
  const order = await getOrderById(orderId);
  return mapOrderToViewModel(order);
}
