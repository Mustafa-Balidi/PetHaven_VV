import { apiRequest, hasAuthToken } from "./apiClient.js";

function requireProductId(productId) {
  const numericProductId = Number(productId);
  if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
    throw new Error("Invalid product ID");
  }
  return numericProductId;
}

export async function getProductDetails(productId) {
  const numericProductId = requireProductId(productId);
  const product = await apiRequest(`/StoreCatalog/Products/${numericProductId}`);

  return {
    id: product.productId,
    title: product.name,
    description: product.description,
    image: product.imageUrl,
    stockQuantity: Number(product.stockQuantity ?? 0),
    originalPrice: Number(product.originalPrice ?? 0),
    discountRate: Number(product.discountRate ?? 0),
    price: Number(product.finalPrice ?? product.originalPrice ?? 0),
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    centerId: product.centerId,
    centerName: product.centerName,
    averageRating: Number(product.averageRating ?? 0),
    totalReviews: Number(product.totalReviews ?? 0),
  };
}

export async function getProductReviews(productId) {
  const numericProductId = requireProductId(productId);
  const reviews = await apiRequest(`/ProductRatings/${numericProductId}`);

  return (Array.isArray(reviews) ? reviews : []).map((review) => ({
    id: review.ratingId,
    productId: review.productId,
    adopterId: review.adopterId,
    adopterName: review.adopterName,
    rating: Number(review.rating ?? 0),
    comment: review.comment,
    createdAt: review.createdAt,
  }));
}

export async function submitProductReview({ productId, rating, comment }) {
  if (!hasAuthToken()) {
    const error = new Error("Authentication required");
    error.code = "AUTH_REQUIRED";
    throw error;
  }

  try {
    const review = await apiRequest("/ProductRatings", {
      method: "POST",
      body: JSON.stringify({
        productId: requireProductId(productId),
        rating: Number(rating),
        comment: comment || null,
      }),
    });
    return {
      id: review.ratingId,
      productId: review.productId,
      adopterId: review.adopterId,
      adopterName: review.adopterName,
      rating: Number(review.rating ?? rating),
      comment: review.comment,
      createdAt: review.createdAt,
    };
  } catch (error) {
    if (error.message.toLowerCase().includes("already rated")) {
      error.code = "ALREADY_RATED";
    }
    throw error;
  }
}
