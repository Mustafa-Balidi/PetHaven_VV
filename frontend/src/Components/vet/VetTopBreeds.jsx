import { useTranslation } from "react-i18next";

export default function VetTopBreeds({ data }) {
  const { t } = useTranslation();

  return (
    <section className="vet-dashboard-card">
      <h2 className="vet-dashboard-card__title vet-dashboard-card__title--sm">
        {t("vetDashboard.breeds.title")}
      </h2>

      {data.length ? (
        <ul className="vet-dashboard-breeds">
          {data.map((item, index) => (
            <li key={item.breed} className="vet-dashboard-breeds__row">
              <div className="vet-dashboard-breeds__identity">
                <span className="vet-dashboard-breeds__rank">{index + 1}</span>
                <span className="vet-dashboard-breeds__name">{item.breed}</span>
              </div>
              <span className="vet-dashboard-breeds__pct">{item.percentage}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vet-dashboard-empty">{t("vetDashboard.breeds.empty")}</p>
      )}
    </section>
  );
}
