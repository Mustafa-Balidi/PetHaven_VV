import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

const AVATAR_CLASS = ["", "center-reviews-card__avatar--b", "center-reviews-card__avatar--c"];

function Stars({ rating }) {
  return (
    <div className="center-reviews-card__stars" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Icon
          key={value}
          name="star"
          filled
          className={`center-reviews-card__star ${value > rating ? "center-reviews-card__star--empty" : ""}`}
        />
      ))}
    </div>
  );
}

export default function ClientReview({ review, avatarIndex = 0 }) {
  const { t: translate, i18n } = useTranslation();
  const t = translate("center.reviews.card", { returnObjects: true });
  const date = review.createdAt
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" }).format(new Date(review.createdAt))
    : "—";

  return (
    <article className="center-reviews-card">
      <div className="center-reviews-card__head">
        <div className="center-reviews-card__author">
          <div className={`center-reviews-card__avatar ${AVATAR_CLASS[avatarIndex % AVATAR_CLASS.length]}`}>
            {review.initials}
          </div>
          <div>
            <h3 className="center-reviews-card__name">{review.name || "—"}</h3>
            <p className="center-reviews-card__meta">
              <span className="center-reviews-card__product">{review.productName}</span>
              <span aria-hidden="true"> · </span>
              <span>{date}</span>
            </p>
            <Stars rating={review.rating} />
          </div>
        </div>
      </div>

      <p className={`center-reviews-card__text ${!review.text ? "center-reviews-card__text--empty" : ""}`}>
        {review.text || t.ratingOnly}
      </p>
    </article>
  );
}
