import { FaStethoscope } from "react-icons/fa";
import { useTranslation } from "react-i18next";

/**
 * تايم لاين التاريخ الطبي
 * props:
 *  - items: [{ id, title, date, description, vet, severity }]
 */
function MedicalTimeline({ items }) {
  const { t } = useTranslation();
  return (
    <section className="medical-timeline">
      <h2 className="medical-timeline__title">
        {t("adopter.petProfile.medicalTimeline")}
      </h2>

      <div className="medical-timeline__list">
        {items.map((item) => (
          <div key={item.id} className="medical-timeline__item">
            <div
              className={
                "medical-timeline__dot" +
                (item.severity === "warning"
                  ? " medical-timeline__dot--warning"
                  : "")
              }
            />

            <div
              className={
                "medical-timeline__card" +
                (item.severity === "warning"
                  ? " medical-timeline__card--warning"
                  : "")
              }
            >
              <div className="medical-timeline__card-header">
                <h3 className="medical-timeline__card-title">
                  {item.title}
                </h3>
                <span className="medical-timeline__card-date">
                  {item.date}
                </span>
              </div>

              <p className="medical-timeline__card-desc">
                {item.description}
              </p>

              {item.vet && (
                <div className="medical-timeline__vet">
                  <FaStethoscope size={14} />
                  <span>{item.vet}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MedicalTimeline;
