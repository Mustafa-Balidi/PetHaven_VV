import Icon from "../Icon.jsx";
import { useTranslation } from "react-i18next";
export default function TrustSection({ items }) {
  const { t } = useTranslation();

  return (
    <section className="trust-section">
      {items.map((item) => (
        <div className="trust-card" key={item.id}>
          <div className="trust-icon-box">
            <Icon name={item.icon} />
          </div>
          <div>
            <h3 className="trust-title">
              {t(`adopter.store.trust.${item.id}.title`, { defaultValue: item.title })}
            </h3>
            <p className="trust-desc">
              {t(`adopter.store.trust.${item.id}.description`, { defaultValue: item.desc })}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
