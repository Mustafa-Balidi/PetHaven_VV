import { FaPaw, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TypingIndicator from "./TypingIndicator";
import "../../Styling/HealthAssistant.css";

const ChatMessages = ({ messages = [] }) => {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return (
      <div className="chat-messages chat-messages--empty">
        <div className="chat-empty-state">
          <div className="chat-empty-state__icon">
            <FaPaw aria-hidden="true" />
          </div>
          <h2>{t("adopter.health.emptyTitle")}</h2>
          <p>{t("adopter.health.emptyDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      {messages.map((message) => {
        if (message.type === "typing") {
          return <TypingIndicator key={message.id} />;
        }

        const isUser = message.sender === "user";

        return (
          <div
            key={message.id}
            className={`chat-messages__row chat-messages__row--${isUser ? "user" : "assistant"}`}
          >
            <div className="chat-messages__content">
              <div className={`chat-messages__avatar chat-messages__avatar--${isUser ? "user" : "assistant"}`}>
                {isUser ? <FaUser aria-hidden="true" /> : <FaPaw aria-hidden="true" />}
              </div>
              <p className="chat-messages__text">{message.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
