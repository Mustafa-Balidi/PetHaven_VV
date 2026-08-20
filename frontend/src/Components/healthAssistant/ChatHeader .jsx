import { FaPaw, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../Styling/HealthAssistant.css";

const ChatHeader = ({ onNewChat }) => {
  const { t } = useTranslation();

  return (
    <div className="chat-header">
      <div className="chat-header__info">
        <div className="chat-header__avatar">
          <FaPaw aria-hidden="true" />
        </div>
        <h1 className="chat-header__name">{t("adopter.health.assistant.name")}</h1>
      </div>
      <button
        type="button"
        className="chat-header__new-chat"
        onClick={onNewChat}
        aria-label={t("adopter.health.newChat")}
      >
        <FaPlus aria-hidden="true" />
      </button>
    </div>
  );
};

export default ChatHeader;
