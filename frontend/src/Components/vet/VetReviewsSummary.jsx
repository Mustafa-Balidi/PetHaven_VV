import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

const BAR_COLOR = {
  5: "#008378",
  4: "#008378",
  3: "#f59e0b",
  2: "#fea619",
  1: "#ba1a1a",
};

function RatingStars({ value }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="vet-reviews-stars">
      {Array.from({ length: full }).map((_, i) => (
        <Icon key={`full-${i}`} name="star" filled className="vet-reviews-star vet-reviews-star--filled" />
      ))}
      {hasHalf && <Icon name="star_half" filled className="vet-reviews-star vet-reviews-star--filled" />}
      {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
        <Icon key={`empty-${i}`} name="star" className="vet-reviews-star vet-reviews-star--empty" />
      ))}
    </div>
  );
}

export default function VetReviewsSummary({ stats }) {
  const { t } = useTranslation();

  return (
    <section className="vet-reviews-card vet-reviews-summary">
      <h2 className="vet-reviews-card__title">{t("vetReviews.summary.title")}</h2>

      {stats.totalCount === 0 ? (
        <p className="vet-reviews-empty">{t("vetReviews.summary.empty")}</p>
      ) : (
        <div className="vet-reviews-summary__body">
          <div className="vet-reviews-summary__score">
            <span className="vet-reviews-summary__score-value">{stats.averageRating.toFixed(1)}</span>
            <RatingStars value={stats.averageRating} />
            <span className="vet-reviews-summary__score-count">
              {t("vetReviews.summary.basedOn", { count: stats.totalCount })}
            </span>
          </div>

          <div className="vet-reviews-summary__distribution">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="vet-reviews-summary__bar-row">
                <span className="vet-reviews-summary__bar-star">{star}</span>
                <Icon name="star" filled className="vet-reviews-summary__bar-star-icon" />
                <div className="vet-reviews-summary__bar-track">
                  <div
                    className="vet-reviews-summary__bar-fill"
                    style={{
                      width: `${stats.starPercentages[star]}%`,
                      backgroundColor: BAR_COLOR[star],
                    }}
                  />
                </div>
                <span className="vet-reviews-summary__bar-pct">{stats.starPercentages[star]}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
