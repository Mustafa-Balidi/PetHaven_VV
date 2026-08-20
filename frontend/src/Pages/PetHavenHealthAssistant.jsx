import { useState } from "react";
import { useTranslation } from "react-i18next";
import TopNavBar from "../Components/TopNavBar";
import Footer from "../Components/Footer";
import HealthHistorySidebar from "../Components/healthAssistant/HealthHistorySidebar";
import ChatHeader from "../Components/healthAssistant/ChatHeader ";
import ChatMessages from "../Components/healthAssistant/ChatMessages ";
import ChatInput from "../Components/healthAssistant/ChatInput ";
import { askHealthAssistant } from "../api/healthAssistantApi";
import "../Styling/HealthAssistant.css";

const createConversationId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `conversation-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const PetHavenHealthAssistant = () => {
  const { t } = useTranslation();

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messagesBySession, setMessagesBySession] = useState({});

  const messages =
    activeSessionId == null
      ? []
      : messagesBySession[activeSessionId] ?? [];

  const handleSendMessage = async (text) => {
    let targetSessionId = activeSessionId;

    // إنشاء محادثة جديدة عند أول رسالة
    if (targetSessionId == null) {
      targetSessionId = createConversationId();

      setSessions((current) => [
        {
          id: targetSessionId,
          title: text.length > 42 ? `${text.slice(0, 42)}…` : text,
          date: t("adopter.health.now"),
          isUserCreated: true,
        },
        ...current,
      ]);

      setActiveSessionId(targetSessionId);
    }

    // رسالة المستخدم
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      type: "text",
      text,
    };

    // إظهار Typing أثناء انتظار الـRAG
    const typingMessage = {
      id: `typing-${Date.now()}`,
      sender: "ai",
      type: "typing",
      text: "",
    };

    setMessagesBySession((current) => ({
      ...current,
      [targetSessionId]: [
        ...(current[targetSessionId] ?? []),
        userMessage,
        typingMessage,
      ],
    }));

    try {
      // إرسال السؤال الحقيقي إلى الـRAG
      const result = await askHealthAssistant({
        question: text,
        animal: null,
        conversationId: targetSessionId,
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "ai",
        type: "text",
        text: result?.answer || "No answer was returned.",
      };

      // حذف Typing وإضافة جواب الـAI
      setMessagesBySession((current) => ({
        ...current,
        [targetSessionId]: [
          ...(current[targetSessionId] ?? []).filter(
            (message) => message.id !== typingMessage.id
          ),
          assistantMessage,
        ],
      }));
    } catch (error) {
      console.error("Health Assistant request failed:", error);

      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        type: "text",
        text:
          error?.message ||
          "Health Assistant service is currently unavailable.",
      };

      // حذف Typing وعرض الخطأ
      setMessagesBySession((current) => ({
        ...current,
        [targetSessionId]: [
          ...(current[targetSessionId] ?? []).filter(
            (message) => message.id !== typingMessage.id
          ),
          errorMessage,
        ],
      }));
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  return (
    <div className="pet-haven-health-assistant">
      <TopNavBar />

      <main className="pet-haven-health-assistant__main">
        <HealthHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(session) => setActiveSessionId(session.id)}
          onNewChat={handleNewChat}
        />

        <section className="pet-haven-health-assistant__chat-panel">
          <ChatHeader onNewChat={handleNewChat} />
          <ChatMessages messages={messages} />
          <ChatInput onSend={handleSendMessage} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PetHavenHealthAssistant;