import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CenterHeader from "../../Components/common/header/CenterHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import ClientReview from "../../Components/common/ClientReview.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import "../../Styling/CenterPages.css";

const PAGE_SIZE = 3;

export default function CenterReviews() {
  const { t: translate } = useTranslation();
  const t = translate("center.reviews", { returnObjects: true });
  const {
    reviews,
    reviewStats: stats,
    reviewsLoading,
    reviewsError,
    fetchReviews,
  } = useCenterContext();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReviews().catch(() => {});
  }, [fetchReviews]);

  const loading = reviewsLoading || !stats;

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((r) => {
      if (filter !== "all" && r.rating !== Number(filter)) return false;
      if (!q) return true;
      return (
        r.name?.toLowerCase().includes(q) ||
        r.productName?.toLowerCase().includes(q) ||
        r.text?.toLowerCase().includes(q)
      );
    });
  }, [reviews, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const pagedReviews = filteredReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filteredReviews.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredReviews.length);

  function handleFilterChange(value) {
    setFilter(value);
    setPage(1);
  }

  if (loading) {
    return (
      <div className="center-reviews-page">
        <CenterHeader />
        {/* The header's skip link needs a target on every branch, and the
            loading / error text has to be announced when it swaps in. */}
        <main id="main-content" tabIndex={-1} className="center-reviews-loading">
          <span role={reviewsError ? "alert" : "status"}>{reviewsError || t.loading}</span>
        </main>
      </div>
    );
  }

  return (
    <div className="center-reviews-page">
      <CenterHeader />

      <main id="main-content" tabIndex={-1} className="center-reviews-body">
        <header className="center-reviews-header">
          <div>
            <h1 className="center-reviews-header__title">{t.header.title}</h1>
            <p className="center-reviews-header__subtitle">{t.header.subtitle}</p>
          </div>
        </header>

        <section className="center-reviews-rating-card">
          <h2 className="center-reviews-rating-card__title">{t.overallRating.title}</h2>
          <div className="center-reviews-rating">
            <div className="center-reviews-rating__score-box">
              <span className="center-reviews-rating__score" aria-hidden="true">
                {stats.average.toFixed(1)}
              </span>
              <span className="sr-only">
                {translate("center.reviews.overallRating.ratingLabel", {
                  rating: stats.average.toFixed(1),
                })}
              </span>
              <div className="center-reviews-rating__stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Icon
                    key={n}
                    name={n - stats.average < 1 && n - stats.average > 0 ? "star_half" : "star"}
                    filled
                    className={n > Math.ceil(stats.average) ? "center-reviews-rating__star--empty" : ""}
                  />
                ))}
              </div>
              <span className="center-reviews-rating__based-on">
                {translate("center.reviews.overallRating.basedOn", { count: stats.total })}
              </span>
            </div>
            <div className="center-reviews-rating__bars">
              {stats.breakdown.map((row) => (
                <div key={row.stars} className="center-reviews-rating__bar-row">
                  <span className="sr-only">
                    {translate("center.reviews.overallRating.barLabel", {
                      stars: row.stars,
                      percent: row.percent,
                    })}
                  </span>
                  <span className="center-reviews-rating__bar-label" aria-hidden="true">{row.stars}</span>
                  <Icon name="star" filled className="center-reviews-rating__bar-star" />
                  <div className="center-reviews-rating__bar-track">
                    <div
                      className={`center-reviews-rating__bar-fill center-reviews-rating__bar-fill--${row.stars <= 3 ? row.stars : ""}`}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="center-reviews-rating__bar-percent" aria-hidden="true">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="center-reviews-filters">
          <div className="center-reviews-filters__search">
            <Icon name="search" className="center-reviews-filters__search-icon" />
            <input
              type="text"
              className="center-reviews-filters__search-input"
              aria-label={t.filters.searchLabel}
              placeholder={t.filters.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="center-reviews-filters__tabs" role="group" aria-label={t.filters.groupLabel}>
            <button
              type="button"
              className={`center-reviews-filters__tab ${filter === "all" ? "center-reviews-filters__tab--active" : ""}`}
              aria-pressed={filter === "all"}
              onClick={() => handleFilterChange("all")}
            >
              {t.filters.allReviews}
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                type="button"
                className={`center-reviews-filters__tab ${filter === String(stars) ? "center-reviews-filters__tab--active" : ""}`}
                aria-pressed={filter === String(stars)}
                onClick={() => handleFilterChange(String(stars))}
              >
                {translate("center.reviews.filters.stars", { count: stars })}
              </button>
            ))}
          </div>
        </div>

        <div className="center-reviews-list">
          {pagedReviews.length === 0 ? (
            <p className="center-reviews-empty" role="status">{t.empty}</p>
          ) : (
            pagedReviews.map((review, i) => (
              <ClientReview key={review.id} review={review} avatarIndex={i} />
            ))
          )}
        </div>

        <div className="center-reviews-pagination">
          <span className="center-reviews-pagination__info" role="status" aria-live="polite">
            {t.pagination.showing} {rangeStart} {t.pagination.to} {rangeEnd} {t.pagination.of}{" "}
            {filteredReviews.length} {t.pagination.reviewsWord}
          </span>
          <div
            className="center-reviews-pagination__controls"
            role="navigation"
            aria-label={t.pagination.label}
          >
            <button
              type="button"
              className="center-reviews-pagination__btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label={t.pagination.previous}
            >
              <Icon name="chevron_left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`center-reviews-pagination__btn ${n === page ? "center-reviews-pagination__btn--active" : ""}`}
                aria-label={translate("center.reviews.pagination.page", { number: n })}
                aria-current={n === page ? "page" : undefined}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className="center-reviews-pagination__btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label={t.pagination.next}
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
