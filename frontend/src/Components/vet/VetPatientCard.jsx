import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { speciesIcon } from "../../utils/petIcons.js";
import { formatLocalizedDate } from "../../utils/localization.js";

const STATUS_CLASS = {
  Healthy: "healthy",
  "Requires Follow-up": "followup",
  "Upcoming Vaccine": "vaccine",
};

function statusClass(status) {
  return STATUS_CLASS[status] ?? "default";
}

export default function VetPatientCard({ patient, onViewRecords }) {
  const { t, i18n } = useTranslation();
  const cls = statusClass(patient.status);

  return (
    <article className={`vet-patients-card vet-patients-card--${cls}`}>
      <div className="vet-patients-card__body">
        <div className="vet-patients-card__head">
          <div className="vet-patients-card__identity">
            <span className="vet-patients-card__avatar">
              {patient.imageUrl ? (
                <img src={patient.imageUrl} alt={patient.petName} />
              ) : (
                <Icon name={speciesIcon(patient.species)} />
              )}
            </span>
            <div>
              <h3 className="vet-patients-card__name">{patient.petName}</h3>
              <p className="vet-patients-card__meta">
                {[patient.breed, patient.species].filter(Boolean).join(" • ") || "—"}
              </p>
            </div>
          </div>
          <span className={`vet-patients-card__badge vet-patients-card__badge--${cls}`}>
            {t(`vetPatients.status.${cls}`, { defaultValue: patient.status })}
          </span>
        </div>

        <dl className="vet-patients-card__stats">
          <div className="vet-patients-card__stat">
            <dt>
              <Icon name="person" className="vet-patients-card__stat-icon" /> {t("vetPatients.card.owner")}
            </dt>
            <dd>{patient.ownerName || "—"}</dd>
          </div>
          <div className="vet-patients-card__stat">
            <dt>
              <Icon name="calendar_month" className="vet-patients-card__stat-icon" /> {t("vetPatients.card.lastVisit")}
            </dt>
            <dd>
              {patient.lastVisitDate
                ? formatLocalizedDate(patient.lastVisitDate, i18n.language, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </dd>
          </div>
          <div className="vet-patients-card__stat">
            <dt>
              <Icon name="event_repeat" className="vet-patients-card__stat-icon" /> {t("vetPatients.card.visitCount")}
            </dt>
            <dd>{patient.visitCount}</dd>
          </div>
        </dl>
      </div>

      <div className="vet-patients-card__actions">
        <button type="button" className="vet-patients-card__action" onClick={() => onViewRecords(patient)}>
          {t("vetPatients.card.viewRecords")}
        </button>
      </div>
    </article>
  );
}
