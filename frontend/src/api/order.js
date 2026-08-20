import { apiRequest, hasAuthToken } from './apiClient.js';

const STATUS_COLOR_MAP = {
  Pending: 'orange',
  Processing: 'orange',
  Shipped: 'green',
  Delivered: 'green',
  Cancelled: 'red',
};

function mapOrderForDisplay(order) {
  return {
    id: order.orderId,
    status: order.status,
    statusColor: STATUS_COLOR_MAP[order.status] ?? 'green',
    date: order.orderDate,
    image: null,
  };
}

export async function getRecentOrders() {
  if (!hasAuthToken()) {
    return []; 
  }

  const orders = await apiRequest('/Orders/my-orders');
  return (Array.isArray(orders) ? orders : []).slice(0, 2).map(mapOrderForDisplay);
}


