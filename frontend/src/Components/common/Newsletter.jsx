import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function Newsletter({ requireAuth }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!requireAuth()) return;
  }

  return (
    <section className="newsletter" aria-labelledby="public-newsletter-title">
      <div className="newsletter__card">
        <div className="newsletter__content">
          <h2 id="public-newsletter-title" className="newsletter__title">{t("newsletter.title")}</h2>
          <p className="newsletter__description">{t("newsletter.description")}</p>
          <form className="newsletter__form" aria-labelledby="public-newsletter-title" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="public-newsletter-email">
              {t("newsletter.placeholder")}
            </label>
            <input
              id="public-newsletter-email"
              className="newsletter__input"
              placeholder={t("newsletter.placeholder")}
              autoComplete="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="newsletter__submit" type="submit">
              {t("newsletter.cta")}
            </button>
          </form>
          <p className="newsletter__privacy">{t("newsletter.privacy")}</p>
        </div>
        <div className="newsletter__art">
          <Icon name="mark_email_read" className="newsletter__art-icon" />
        </div>
      </div>
    </section>
  );
}
