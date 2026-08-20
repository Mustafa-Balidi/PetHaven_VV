import { apiRequest } from "./apiClient.js";

export async function getClientReviews({ search = "", filter = "all", page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (filter && filter !== "all") params.set("filter", filter);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const result = await apiRequest(`/Reviews?${params.toString()}`);
  return mapReviewsResult(result);
}

function mapReviewsResult(result) {
  const stats = result.stats ?? result.Stats ?? {};
  return {
    stats: {
      averageRating: Number(stats.averageRating ?? stats.AverageRating) || 0,
      totalCount: Number(stats.totalCount ?? stats.TotalCount) || 0,
      unansweredCount: Number(stats.unansweredCount ?? stats.UnansweredCount) || 0,
      starDistribution: normalizeStarMap(stats.starDistribution ?? stats.StarDistribution ?? {}),
      starPercentages: normalizeStarMap(stats.starPercentages ?? stats.StarPercentages ?? {}),
    },
    items: (result.items ?? result.Items ?? []).map(mapReview),
    page: Number(result.page ?? result.Page) || 1,
    pageSize: Number(result.pageSize ?? result.PageSize) || 10,
    totalItems: Number(result.totalItems ?? result.TotalItems) || 0,
    totalPages: Number(result.totalPages ?? result.TotalPages) || 0,
  };
}

function normalizeStarMap(map) {
  const normalized = {};
  for (let star = 1; star <= 5; star += 1) {
    normalized[star] = Number(map[star]) || 0;
  }
  return normalized;
}

function mapReview(review) {
  return {
    ratingId: review.ratingId ?? review.RatingId,
    reviewerName: review.reviewerName ?? review.ReviewerName ?? "",
    starsCount: Number(review.starsCount ?? review.StarsCount) || 0,
    reviewText: review.reviewText ?? review.ReviewText ?? "",
    createdAt: review.createdAt ?? review.CreatedAt ?? null,
  };
}
