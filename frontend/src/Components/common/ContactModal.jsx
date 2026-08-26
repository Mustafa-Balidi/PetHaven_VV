import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useModalA11y from "../../hooks/useModalA11y.js";

export default function ContactModal({ onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const successRef = useRef(null);
  const dialogRef = useModalA11y({ onClose });

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    setSent(true);
  };

  return (
    <div className="modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal__card modal__card--contact"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          type="button"
          aria-label={t("contactModal.close")}
          className="modal__close"
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h3 id={titleId} className="contact-modal__title">{t("contactModal.title")}</h3>

        {sent ? (
          <p ref={successRef} tabIndex={-1} className="contact-modal__success" role="status">{t("contactModal.successMessage")}</p>
        ) : (
          <form className="contact-modal__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor={nameId}>{t("contactModal.namePlaceholder")}</label>
            <input
              id={nameId}
              type="text"
              placeholder={t("contactModal.namePlaceholder")}
              autoComplete="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="auth-modal__input"
            />
            <label className="sr-only" htmlFor={emailId}>{t("contactModal.emailPlaceholder")}</label>
            <input
              id={emailId}
              type="email"
              placeholder={t("contactModal.emailPlaceholder")}
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="auth-modal__input"
            />
            <label className="sr-only" htmlFor={subjectId}>{t("contactModal.subjectPlaceholder")}</label>
            <input
              id={subjectId}
              type="text"
              placeholder={t("contactModal.subjectPlaceholder")}
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="auth-modal__input"
            />
            <label className="sr-only" htmlFor={messageId}>{t("contactModal.messagePlaceholder")}</label>
            <textarea
              id={messageId}
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
