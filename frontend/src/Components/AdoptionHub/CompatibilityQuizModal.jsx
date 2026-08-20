import { useState } from "react";
import { FaTimes, FaPaw, FaCheckCircle, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../Styling/AdoptionHub.css";

const DEFAULT_ANSWERS = {
  housing_type: "apartment",
  outdoor_space: "none",
  family_type: "single",
  hours_available: "medium",
  weekend_time: "medium",
  experience_level: "beginner",
  training_ability: "medium",
  activity_level: "medium",
  noise_tolerance: "medium",
  budget_level: "medium",
  maintenance_tolerance: "medium",
  size_preference: "medium",
  grooming_tolerance: "medium",
  energy_preference: "medium",
  affection_preference: "balanced",
  top_n: 3,
};

const STEPS = [
  {
    id: "home",
    questions: [
      { key: "housing_type", options: ["apartment", "house", "condo", "farm"] },
      { key: "outdoor_space", options: ["none", "small", "medium", "large"] },
      { key: "family_type", options: ["single", "couple", "family_with_children"] },
      { key: "hours_available", options: ["low", "medium", "high"] },
      { key: "weekend_time", options: ["low", "medium", "high"] },
    ],
  },
  {
    id: "lifestyle",
    questions: [
      { key: "experience_level", options: ["beginner", "intermediate", "expert"] },
      { key: "training_ability", options: ["low", "medium", "high"] },
      { key: "activity_level", options: ["low", "medium", "high"] },
      { key: "noise_tolerance", options: ["low", "medium", "high"] },
      { key: "budget_level", options: ["low", "medium", "high"] },
    ],
  },
  {
    id: "preferences",
    questions: [
      { key: "maintenance_tolerance", options: ["low", "medium", "high"] },
      { key: "size_preference", options: ["small", "medium", "large"] },
      { key: "grooming_tolerance", options: ["low", "medium", "high"] },
      { key: "energy_preference", options: ["low", "medium", "high"] },
      { key: "affection_preference", options: ["independent", "balanced", "very_affectionate"] },
    ],
  },
];

function toPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.round(number <= 1 ? number * 100 : number);
}

export default function CompatibilityQuizModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
  result = null,
}) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const isLastStep = step === STEPS.length - 1;

  const handleChange = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const handleNext = (event) => {
    event.preventDefault();
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isSubmitting) onSubmit?.(answers);
  };

  const handleClose = () => {
    if (!isSubmitting) onClose?.();
  };

  return (
    <div className="compat-quiz-overlay" role="presentation">
      <button
        type="button"
        className="compat-quiz-backdrop"
        onClick={handleClose}
        aria-label={t("adopter.adoptionHub.quiz.closeQuiz")}
      />

      <section className="compat-quiz-modal" role="dialog" aria-modal="true">
        <header className="compat-quiz-header">
          <div>
            <span className="compat-quiz-kicker">
              {t("adopter.adoptionHub.quiz.kicker")}
            </span>
            <h2>{t("adopter.adoptionHub.quiz.title")}</h2>
            <p>{t("adopter.adoptionHub.quiz.description")}</p>
          </div>
          <button
            type="button"
            className="compat-quiz-close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label={t("adopter.adoptionHub.quiz.close")}
          >
            <FaTimes />
          </button>
        </header>

        {!result && (
          <ol className="compat-quiz-progress">
            {STEPS.map((s, index) => (
              <li
                key={s.id}
                className={`compat-quiz-progress__step${
                  index === step ? " compat-quiz-progress__step--active" : ""
                }${index < step ? " compat-quiz-progress__step--done" : ""}`}
              >
                <span className="compat-quiz-progress__dot">
                  {index < step ? <FaCheck /> : index + 1}
                </span>
                <span className="compat-quiz-progress__label">
                  {t(`adopter.adoptionHub.quiz.stepTitles.${s.id}`)}
                </span>
              </li>
            ))}
          </ol>
        )}

        {result ? (
          <div className="compat-quiz-results">
            <div className="compat-quiz-result-icon"><FaCheckCircle /></div>
            <h3>
              {t("adopter.adoptionHub.quiz.recommendedType", {
                animalType: result.animalType || t("adopter.adoptionHub.quiz.pet"),
              })}
            </h3>
            <p>{t("adopter.adoptionHub.quiz.resultSource")}</p>

            <div className="compat-quiz-result-list">
              {(result.recommendations || []).map((item, index) => (
                <div className="compat-quiz-result-row" key={`${item.breed}-${index}`}>
                  <div>
                    <FaPaw />
                    <strong>{item.breed}</strong>
                  </div>
                  <span>
                    {t("adopter.adoptionHub.quiz.match", {
                      percent: toPercent(item.confidence),
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="compat-quiz-actions">
              <button type="button" className="compat-quiz-primary" onClick={handleClose}>
                {t("adopter.adoptionHub.quiz.viewMatches")}
              </button>
            </div>
          </div>
        ) : (
          <form className="compat-quiz-form" onSubmit={isLastStep ? handleSubmit : handleNext}>
            <h3 className="compat-quiz-step-title">
              <span className="compat-quiz-step-count">
                {t("adopter.adoptionHub.quiz.stepOf", { current: step + 1, total: STEPS.length })}
              </span>
              {t(`adopter.adoptionHub.quiz.stepTitles.${STEPS[step].id}`)}
            </h3>

            <div className="compat-quiz-grid">
              {STEPS[step].questions.map((question) => (
                <label className="compat-quiz-field" key={question.key}>
                  <span>{t(`adopter.adoptionHub.quiz.questions.${question.key}`)}</span>
                  <select
                    value={answers[question.key]}
                    onChange={(event) => handleChange(question.key, event.target.value)}
                  >
                    {question.options.map((value) => (
                      <option value={value} key={value}>
                        {t(`adopter.adoptionHub.quiz.options.${value}`)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {error && <p className="compat-quiz-error">{error}</p>}

            <div className="compat-quiz-actions">
              {step === 0 ? (
                <button type="button" className="compat-quiz-secondary" onClick={handleClose} disabled={isSubmitting}>
                  {t("adopter.adoptionHub.quiz.cancel")}
                </button>
              ) : (
                <button type="button" className="compat-quiz-secondary" onClick={handleBack} disabled={isSubmitting}>
                  <FaArrowLeft className="compat-quiz-icon" /> {t("adopter.adoptionHub.quiz.back")}
                </button>
              )}

              {isLastStep ? (
                <button type="submit" className="compat-quiz-primary" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("adopter.adoptionHub.quiz.finding")
                    : t("adopter.adoptionHub.quiz.getMatches")}
                </button>
              ) : (
                <button type="submit" className="compat-quiz-primary">
                  {t("adopter.adoptionHub.quiz.next")} <FaArrowRight className="compat-quiz-icon" />
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
