import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import VetReviewCard from "./VetReviewCard.jsx";

function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  return Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
}

export default function VetReviewsList({
  items,
  loading,
  error,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  unansweredCount,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}) {
  const { t } = useTranslation();
  const pageNumbers = buildPageNumbers(page, totalPages);
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <section className="vet-reviews-list-section">
      <div className="vet-reviews-toolbar">
        <div className="vet-reviews-search">
          <Icon name="search" className="vet-reviews-search__icon" />
          <input
            type="text"
            className="vet-reviews-search__input"
            aria-label={t("vetReviews.toolbar.searchLabel")}
            placeholder={t("vetReviews.toolbar.searchPlaceholder")}
            value={search}
            onChange={onSearchChange}
          />
        </div>
        <div className="vet-reviews-filters">
          <button
            type="button"
            className={`vet-reviews-filter-btn${filter === "all" ? " vet-reviews-filter-btn--active" : ""}`}
            aria-pressed={filter === "all"}
            onClick={() => onFilterChange("all")}
          >
            {t("vetReviews.toolbar.all")}
          </button>
          <button
            type="button"
            className={`vet-reviews-filter-btn${filter === "unanswered" ? " vet-reviews-filter-btn--active" : ""}`}
            aria-pressed={filter === "unanswered"}
            onClick={() => onFilterChange("unanswered")}
          >
            {t("vetReviews.toolbar.ratingOnly", { count: unansweredCount })}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="vet-reviews-empty" role="status">{t("vetReviews.list.loading")}</p>
      ) : error ? (
        <div className="vet-reviews-alert" role="alert">
          <span>{error}</span>
        </div>
      ) : items.length ? (
        <>
          <div className="vet-reviews-list">
            {items.map((review) => (
              <VetReviewCard key={review.ratingId} review={review} />
            ))}
          </div>

          <div className="vet-reviews-pagination">
            {/* Searching and paging swap the list silently otherwise. */}
            <span className="vet-reviews-pagination__summary" aria-live="polite">
              {t("vetReviews.pagination.showing", { start: rangeStart, end: rangeEnd, total: totalItems })}
            </span>
            <div
              className="vet-reviews-pagination__controls"
              role="navigation"
              aria-label={t("vetReviews.pagination.label")}
            >
              <button
                type="button"
                className="vet-reviews-pagination__nav"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                aria-label={t("vetReviews.pagination.previous")}
              >
                <Icon name="chevron_left" />
              </button>
              {pageNumbers.map((number, index) => {
                const previous = pageNumbers[index - 1];
                const showGap = previous != null && number - previous > 1;
                return (
                  <span key={number} style={{ display: "contents" }}>
                    {showGap && (
                      <span className="vet-reviews-pagination__ellipsis" aria-hidden="true">
                        …
                      </span>
                    )}
                    <button
                      type="button"
                      className={`vet-reviews-pagination__page${number === page ? " vet-reviews-pagination__page--active" : ""}`}
                      aria-label={t("vetReviews.pagination.page", { number })}
                      aria-current={number === page ? "page" : undefined}
                      onClick={() => onPageChange(number)}
                    >
                      {number}
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                className="vet-reviews-pagination__nav"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                aria-label={t("vetReviews.pagination.next")}
              >
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="vet-reviews-empty">
          {search || filter !== "all" ? t("vetReviews.list.noMatches") : t("vetReviews.list.empty")}
        </p>
      )}
    </section>
  );
}
