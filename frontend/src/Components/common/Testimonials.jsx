import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";
import { TESTIMONIAL_AVATAR_URL } from "../text/publicTexts.js";

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <section className="testimonials" aria-label={t("testimonials.regionLabel")}>
      <div className="testimonials__card">
        <Icon name="format_quote" className="testimonials__quote-icon" />
        <p className="testimonials__quote">{t("testimonials.quote")}</p>
        <div className="testimonials__author-row">
          <img alt={t("testimonials.author")} className="testimonials__avatar" src={TESTIMONIAL_AVATAR_URL} />
          <div className="testimonials__author-info">
            <p className="testimonials__author-name">{t("testimonials.author")}</p>
            <p className="testimonials__author-role">{t("testimonials.role")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
