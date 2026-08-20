// Components/Toast.jsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../Styling/Toast.css";

export default function Toast({ message, type = "success", onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label={t("adopter.common.close")}
      >
        &times;
      </button>
    </div>
  );
}
