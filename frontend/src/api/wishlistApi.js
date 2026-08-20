import { apiRequest } from "./apiClient";

export async function fetchWishlist() {
  const items = await apiRequest("/Wishlist");
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    id: item.wishlistItemId,
    productId: item.productId,
    name: item.productName,
    price: Number(item.currentPrice),
    image: item.imageUrl,
  }));
}

export function addWishlistItem(productId) {
  return apiRequest(`/Wishlist/${productId}`, { method: "POST" });
}

export function removeWishlistItem(productId) {
  return apiRequest(`/Wishlist/${productId}`, { method: "DELETE" });
}
