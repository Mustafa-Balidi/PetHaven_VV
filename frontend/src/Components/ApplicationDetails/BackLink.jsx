import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BackLink({ href = "/adopter/adoption-hub", label }) {
  const { t } = useTranslation();
  return (
    <div>
      <Link className="back-link" to={href}>
        <span className="material-symbols-outlined back-link__icon" aria-hidden="true">arrow_back</span>
        {label || t("adopter.applicationDetails.back")}
      </Link>
    </div>
  );
}
