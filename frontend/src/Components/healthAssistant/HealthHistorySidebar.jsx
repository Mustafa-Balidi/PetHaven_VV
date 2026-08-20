import { FaPlus, FaRegCommentDots } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "../../Styling/HealthAssistant.css";

const HealthHistorySidebar = ({
  sessions = [],
  activeSessionId,
  onSelectSession,
  onNewChat,
}) => {
  const { t } = useTranslation();

  return (
    <aside className="health-sidebar">
      <div className="health-sidebar__header">
        <h2 className="health-sidebar__title">{t("adopter.health.sessionsTitle")}</h2>
        <button type="button" onClick={onNewChat} className="health-sidebar__new-chat">
          <FaPlus aria-hidden="true" />
          {t("adopter.health.newChat")}
        </button>
      </div>

      <p className="health-sidebar__section-label">{t("adopter.health.recentChats")}</p>
      <div className="health-sidebar__list">
        {sessions.length === 0 ? (
          <p className="health-sidebar__empty">{t("adopter.health.noSessions")}</p>
        ) : (
          sessions.map((session) => (
            <button
              type="button"
              key={session.id}
              onClick={() => onSelectSession?.(session)}
              className={`health-sidebar__item ${
                session.id === activeSessionId ? "health-sidebar__item--active" : ""
              }`}
            >
              <FaRegCommentDots className="health-sidebar__item-icon" aria-hidden="true" />
              <div className="health-sidebar__text">
                <p className="health-sidebar__item-title">{session.title}</p>
                <p className="health-sidebar__item-meta">{session.date}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default HealthHistorySidebar;
