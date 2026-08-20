import { apiRequest } from "./apiClient.js";

export function getCart() {
  return apiRequest("/Cart");
}

export function updateCartItemQty(cartItemId, quantity) {
  return apiRequest(`/Cart/UpdateItem/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(cartItemId) {
  return apiRequest(`/Cart/RemoveItem/${cartItemId}`, { method: "DELETE" });
}

export function clearCart() {
  return apiRequest("/Cart/Clear", { method: "DELETE" });
}

export function addToCart(productId, quantity = 1) {
  return apiRequest("/Cart/Add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}
