import { useTranslation } from "react-i18next";

const COLORS = {
  "Check-ups": "#00685f",
  Vaccinations: "#855300",
  Surgeries: "#ef4444",
  Other: "#bcc9c6",
};

const LABEL_KEYS = {
  "Check-ups": "checkups",
  Vaccinations: "vaccinations",
  Surgeries: "surgeries",
  Other: "other",
};

export default function VetAppointmentBreakdown({ data }) {
  const { t } = useTranslation();
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const segments = data
    .filter((item) => item.percentage > 0)
    .reduce((acc, item) => {
      const cumulative = acc.length ? acc[acc.length - 1].cumulative + acc[acc.length - 1].percentage : 0;
      return [...acc, { ...item, offset: -cumulative, cumulative }];
    }, []);

  return (
    <section className="vet-dashboard-card">
      <h2 className="vet-dashboard-card__title vet-dashboard-card__title--sm">
        {t("vetDashboard.breakdown.title")}
      </h2>

      {total ? (
        <div className="vet-dashboard-donut">
          <div className="vet-dashboard-donut__chart">
            {/* Decorative: the legend beside it already states every
                category and its share. */}
            <svg viewBox="0 0 36 36" className="vet-dashboard-donut__svg" aria-hidden="true">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
              {segments.map((segment) => (
                <circle
                  key={segment.category}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={COLORS[segment.category] ?? "#bcc9c6"}
                  strokeWidth="4"
                  strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                  strokeDashoffset={segment.offset}
                />
              ))}
            </svg>
            <div className="vet-dashboard-donut__center">
              <span>{total}</span>
            </div>
          </div>
          <div className="vet-dashboard-donut__legend">
            {data
              .filter((item) => item.count > 0)
              .map((item) => (
                <div key={item.category} className="vet-dashboard-donut__legend-row">
                  <span
                    className="vet-dashboard-donut__dot"
                    style={{ backgroundColor: COLORS[item.category] ?? "#bcc9c6" }}
                  />
                  <span>
                    {t(`vetDashboard.breakdown.categories.${LABEL_KEYS[item.category] ?? "other"}`)} (
                    {item.percentage}%)
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <p className="vet-dashboard-empty">{t("vetDashboard.breakdown.empty")}</p>
      )}
    </section>
  );
}
