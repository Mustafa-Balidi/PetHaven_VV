import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

const CARDS = [
  { key: "totalPatients", icon: "pets", accent: "primary" },
  { key: "activeCases", icon: "healing", accent: "yellow" },
  { key: "recentlyAdded", icon: "person_add", accent: "tertiary" },
];

export default function VetPatientsSummary({ stats }) {
  const { t } = useTranslation();
  const s = stats ?? {};
  const values = {
    totalPatients: s.totalPatients ?? 0,
    activeCases: s.activeCases ?? 0,
    recentlyAdded: s.recentlyAdded30d ?? 0,
  };

  return (
    <div className="vet-patients-summary">
      {CARDS.map((card) => (
        <article key={card.key} className="vet-patients-summary__card">
          <span className={`vet-patients-summary__icon vet-patients-summary__icon--${card.accent}`}>
            <Icon name={card.icon} />
          </span>
          <div>
            <p className="vet-patients-summary__label">{t(`vetPatients.summary.${card.key}`)}</p>
            <p className="vet-patients-summary__value">{values[card.key]}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
