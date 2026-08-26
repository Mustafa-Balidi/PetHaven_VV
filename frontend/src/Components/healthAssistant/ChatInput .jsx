import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../Styling/HealthAssistant.css";

const ChatInput = ({ onSend, isSending = false, disabled = false }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const isBlocked = isSending || disabled;

  const handleSend = () => {
    if (isBlocked) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Shift+Enter still inserts a new line.
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <div className="chat-input__inner">
        <div className="chat-input__box">
          <textarea
            className="chat-input__textarea"
            placeholder={t("adopter.health.placeholder")}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isBlocked}
          />
          <button
            type="button"
            onClick={handleSend}
            className="chat-input__send"
            aria-label={t("adopter.health.send")}
            disabled={isBlocked || !value.trim()}
          >
            <FaArrowUp size={15} />
          </button>
        </div>
        <p className="chat-input__disclaimer">
          {t("adopter.health.disclaimer")}
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
