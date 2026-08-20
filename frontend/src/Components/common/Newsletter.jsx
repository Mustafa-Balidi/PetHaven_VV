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
    <section className="newsletter">
      <div className="newsletter__card">
        <div className="newsletter__content">
          <h2 className="newsletter__title">{t("newsletter.title")}</h2>
          <p className="newsletter__description">{t("newsletter.description")}</p>
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              className="newsletter__input"
              placeholder={t("newsletter.placeholder")}
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
