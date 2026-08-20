import { useTranslation } from "react-i18next";

export default function ImpactStats() {
  const { t } = useTranslation();
  const stats = t("impactStats.items", { returnObjects: true });

  return (
    <section className="impact-stats">
      <div className="impact-stats__inner">
        <div className="impact-stats__grid">
          {stats.map((stat) => (
            <div key={stat.label} className="impact-stats__item">
              <span className="impact-stats__value">{stat.value}</span>
              <p className="impact-stats__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
