import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactModal({ onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    setSent(true);
  };

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal__card modal__card--contact" onClick={(e) => e.stopPropagation()}>
        <button aria-label={t("contactModal.close")} className="modal__close" onClick={onClose}>
          &times;
        </button>
        <h3 className="contact-modal__title">{t("contactModal.title")}</h3>

        {sent ? (
          <p className="contact-modal__success">{t("contactModal.successMessage")}</p>
        ) : (
          <form className="contact-modal__form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={t("contactModal.namePlaceholder")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="auth-modal__input"
            />
            <input
              type="email"
              placeholder={t("contactModal.emailPlaceholder")}
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="auth-modal__input"
            />
            <input
              type="text"
              placeholder={t("contactModal.subjectPlaceholder")}
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="auth-modal__input"
            />
            <textarea
              placeholder={t("contactModal.messagePlaceholder")}
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="auth-modal__input contact-modal__textarea"
            />
            <button type="submit" className="auth-modal__submit">
              {t("contactModal.send")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
