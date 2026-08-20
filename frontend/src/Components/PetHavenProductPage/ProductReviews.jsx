import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import StarRating from "../StarRating.jsx";
import { getProductReviews, submitProductReview } from "../../api/productApi.js";
import { formatLocalizedDate } from "../../utils/localization.js";

const MAX_COMMENT_LENGTH = 1000;

function summarizeReviews(reviews) {
  const average = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;

  return { average, count: reviews.length };
}

export default function ProductReviews({ productId, onSummaryChange }) {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setLoadError(false);
      onSummaryChange?.(null);

      try {
        const data = await getProductReviews(productId);
        if (active) {
          setReviews(data);
          onSummaryChange?.(summarizeReviews(data));
        }
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, [productId, onSummaryChange]);

  const averageRating = summarizeReviews(reviews).average;
  const displayedRating = hoveredRating || rating;

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);

    if (rating < 1) {
      setFeedback({ type: "error", message: t("adopter.product.review.ratingRequired") });
      return;
    }

    try {
      setSubmitting(true);
      const createdReview = await submitProductReview({
        productId,
        rating,
        comment: comment.trim(),
      });

      const updatedReviews = [createdReview, ...reviews];
      setReviews(updatedReviews);
      onSummaryChange?.(summarizeReviews(updatedReviews));
      setRating(0);
      setHoveredRating(0);
      setComment("");
      setFeedback({ type: "success", message: t("adopter.product.review.success") });
    } catch (error) {
      const errorKey = error.code === "AUTH_REQUIRED"
        ? "loginRequired"
        : error.code === "ALREADY_RATED"
          ? "alreadyRated"
          : "submitError";
      setFeedback({ type: "error", message: t(`adopter.product.review.${errorKey}`) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="product-reviews" aria-labelledby="product-reviews-title">
      <div className="product-reviews__header">
        <div>
          <h2 id="product-reviews-title" className="section-heading">
            {t("adopter.product.review.title")}
          </h2>
          <p className="product-reviews__subtitle">
            {t("adopter.product.review.subtitle")}
          </p>
        </div>

        <div className="product-reviews__summary" aria-live="polite">
          <strong>{averageRating.toFixed(1)}</strong>
          <StarRating count={averageRating} size="22px" />
          <span>
            {t("adopter.product.review.reviewCount", { count: reviews.length })}
          </span>
        </div>
      </div>

      <form className="product-review-form" onSubmit={handleSubmit}>
        <h3>{t("adopter.product.review.formTitle")}</h3>

        <fieldset className="product-review-form__fieldset">
          <legend>{t("adopter.product.review.selectRating")}</legend>
          <div
            className="product-review-form__stars"
            onPointerLeave={() => setHoveredRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="product-review-form__star"
                aria-label={t("adopter.product.review.starLabel", { count: star })}
                aria-pressed={rating === star}
                onPointerEnter={() => setHoveredRating(star)}
                onFocus={() => setHoveredRating(star)}
                onBlur={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Icon
                  name={star <= displayedRating ? "star" : "star_border"}
                  filled={star <= displayedRating}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="product-review-form__field">
          <div className="product-review-form__label-row">
            <label htmlFor="product-review-comment">
              {t("adopter.product.review.commentLabel")}
            </label>
            <span>{t("adopter.product.review.optional")}</span>
          </div>
          <textarea
            id="product-review-comment"
            rows="5"
            maxLength={MAX_COMMENT_LENGTH}
            value={comment}
            placeholder={t("adopter.product.review.commentPlaceholder")}
            onChange={(event) => setComment(event.target.value)}
          />
          <span className="product-review-form__counter">
            {t("adopter.product.review.characterCount", {
              count: comment.length,
              max: MAX_COMMENT_LENGTH,
            })}
          </span>
        </div>

        {feedback && (
          <p
            className={`product-review-form__feedback product-review-form__feedback--${feedback.type}`}
            role={feedback.type === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          className="product-review-form__submit"
          disabled={submitting}
        >
          <Icon name="rate_review" className="icon-20" />
          {submitting
            ? t("adopter.product.review.submitting")
            : t("adopter.product.review.submit")}
        </button>
      </form>

      <div className="product-review-list">
        {loading ? (
          <p className="product-review-list__state">
            {t("adopter.product.review.loading")}
          </p>
        ) : loadError ? (
          <p className="product-review-list__state product-review-list__state--error" role="alert">
            {t("adopter.product.review.loadError")}
          </p>
        ) : reviews.length === 0 ? (
          <p className="product-review-list__state">
            {t("adopter.product.review.empty")}
          </p>
        ) : (
          reviews.map((review) => (
            <article className="product-review-card" key={review.id}>
              <div className="product-review-card__avatar" aria-hidden="true">
                {(review.adopterName || t("adopter.product.review.anonymous")).charAt(0)}
              </div>
              <div className="product-review-card__body">
                <div className="product-review-card__header">
                  <div>
                    <h3>{review.adopterName || t("adopter.product.review.anonymous")}</h3>
                    <StarRating count={review.rating} size="18px" />
                  </div>
                  <time dateTime={review.createdAt}>
                    {formatLocalizedDate(review.createdAt, i18n.resolvedLanguage, {
                      dateStyle: "medium",
                    })}
                  </time>
                </div>
                {review.comment && <p>{review.comment}</p>}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
