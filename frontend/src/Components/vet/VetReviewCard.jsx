import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { formatLocalizedDate } from "../../utils/localization.js";

function initialsOf(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function VetReviewCard({ review }) {
  const { t, i18n } = useTranslation();

  return (
    <article className="vet-reviews-card-item">
      <div className="vet-reviews-card-item__head">
        <div className="vet-reviews-card-item__avatar">{initialsOf(review.reviewerName) || "?"}</div>
        <div>
          <h3 className="vet-reviews-card-item__name">
            {review.reviewerName || t("vetReviews.card.anonymous")}
          </h3>
          <p className="vet-reviews-card-item__date">
            {review.createdAt
              ? formatLocalizedDate(review.createdAt, i18n.language, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </p>
          <div
            className="vet-reviews-stars vet-reviews-stars--sm"
            role="img"
            aria-label={t("vetReviews.card.ratingLabel", { value: review.starsCount })}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="star"
                filled={i < review.starsCount}
                className={`vet-reviews-star ${i < review.starsCount ? "vet-reviews-star--filled" : "vet-reviews-star--empty"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {review.reviewText ? (
        <p className="vet-reviews-card-item__text">{review.reviewText}</p>
      ) : (
        <p className="vet-reviews-card-item__text vet-reviews-card-item__text--muted">
          {t("vetReviews.card.noComment")}
        </p>
      )}
    </article>
  );
}
