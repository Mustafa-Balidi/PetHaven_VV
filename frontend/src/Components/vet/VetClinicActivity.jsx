import { useTranslation } from "react-i18next";

export default function VetClinicActivity({ data, period, onPeriodChange, loading, error }) {
  const { t } = useTranslation();
  const max = Math.max(1, ...data.map((point) => point.count));

  return (
    <section className="vet-dashboard-card vet-dashboard-card--activity">
      <div className="vet-dashboard-card__head">
        <h2 className="vet-dashboard-card__title">{t("vetDashboard.activity.title")}</h2>
        <select
          className="vet-dashboard-card__select"
          aria-label={t("vetDashboard.activity.periodLabel")}
          value={period}
          onChange={(event) => onPeriodChange(event.target.value)}
        >
          <option value="weekly">{t("vetDashboard.activity.weekly")}</option>
          <option value="monthly">{t("vetDashboard.activity.monthly")}</option>
        </select>
      </div>

      {loading ? (
        <p className="vet-dashboard-empty" role="status">
          {t("vetDashboard.activity.loading")}
        </p>
      ) : error ? (
        <div className="vet-dashboard-alert" role="alert">
          <span>{error}</span>
        </div>
      ) : data.length ? (
        <>
          {/* The bars keep their counts in `title`, which no screen reader
              announces, so the chart is hidden and the clipped list below is
              its text equivalent. */}
          <div className="vet-dashboard-chart-scroll" aria-hidden="true">
            <div className={period === "monthly" ? "vet-dashboard-chart-content--monthly" : ""}>
              <div className="vet-dashboard-bars">
                {data.map((point, index) => (
                  <div
                    key={`${point.label}-${index}`}
                    className="vet-dashboard-bar"
                    style={{ height: `${Math.round((point.count / max) * 100)}%` }}
                    title={`${point.label}: ${point.count}`}
                  />
                ))}
              </div>
              <div className="vet-dashboard-bars-labels">
                {data.map((point, index) => (
                  <span key={`${point.label}-${index}`}>{point.label}</span>
                ))}
              </div>
            </div>
          </div>
          <ul className="sr-only" aria-label={t("vetDashboard.activity.dataLabel")}>
            {data.map((point, index) => (
              <li key={`${point.label}-${index}`}>
                {point.label}: {point.count}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="vet-dashboard-empty">{t("vetDashboard.activity.empty")}</p>
      )}
    </section>
  );
}
