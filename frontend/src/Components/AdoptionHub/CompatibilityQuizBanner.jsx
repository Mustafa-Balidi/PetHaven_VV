import { FaPaw, FaArrowRight } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { useTranslation } from "react-i18next";

/**
 * بانر "Find Your Perfect Match" مع زر بدء الكويز
 * props:
 *  - onStartQuiz: function
 */
function CompatibilityQuizBanner({ onStartQuiz }) {
  const { t } = useTranslation();
  return (
    <div className="quiz-banner">
      <div className="quiz-banner__content">
        <div className="quiz-banner__badge">
          <HiOutlineSparkles size={16} />
          <span>{t("adopter.adoptionHub.banner.badge")}</span>
        </div>

        <h2 className="quiz-banner__title">{t("adopter.adoptionHub.banner.title")}</h2>

        <p className="quiz-banner__text">
          {t("adopter.adoptionHub.banner.text")}
        </p>

        <button
          type="button"
          className="quiz-banner__btn"
          onClick={onStartQuiz}
        >
          <span>{t("adopter.adoptionHub.banner.start")}</span>
          <FaArrowRight size={16} />
        </button>
      </div>

      <div className="quiz-banner__visual">
        <div className="quiz-banner__glow" />
        <FaPaw className="quiz-banner__paw-icon" />
      </div>
    </div>
  );
}

export default CompatibilityQuizBanner;
