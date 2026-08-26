import { useTranslation } from "react-i18next";

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true });

  return (
    <section className="how-it-works" aria-labelledby="public-how-it-works-title">
      <h2 id="public-how-it-works-title" className="how-it-works__title">{t("howItWorks.title")}</h2>
      <div className="how-it-works__steps" role="list">
        <div className="how-it-works__line" aria-hidden="true" />
        {steps.map((step, i) => (
          <div key={step.title} className="how-it-works__step" role="listitem">
            <div className="how-it-works__step-number" aria-hidden="true">{i + 1}</div>
            <h3 className="how-it-works__step-title">{step.title}</h3>
            <p className="how-it-works__step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
