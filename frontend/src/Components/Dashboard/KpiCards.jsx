import { Link } from "react-router-dom";

const iconWrapClass = {
  primary: "kpi-icon-wrap--tertiary",
  green: "kpi-icon-wrap--green",
  yellow: "kpi-icon-wrap--secondary",
};

const valueClass = {
  primary: "kpi-value--primary",
  green: "kpi-value--green",
  yellow: "kpi-value--yellow",
};

export default function KpiCards({ items }) {
  return (
    <section className="kpi-grid">
      {items.map((kpi) => {
        const content = (
          <>
            <div>
              <p className="kpi-label">{kpi.label}</p>
              <p className={`kpi-value ${valueClass[kpi.colorVariant]}`}>
                {kpi.value}
              </p>
            </div>
            <div className={`kpi-icon-wrap ${iconWrapClass[kpi.colorVariant]}`}>
              <span className="material-symbols-outlined">{kpi.icon}</span>
            </div>
          </>
        );

        return kpi.to ? (
          <Link className="kpi-card kpi-card--link" key={kpi.id} to={kpi.to}>
            {content}
          </Link>
        ) : (
          <div className="kpi-card" key={kpi.id}>
            {content}
          </div>
        );
      })}
    </section>
  );
}
