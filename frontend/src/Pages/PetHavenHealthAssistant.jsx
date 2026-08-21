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
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `conversation-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};


const PetHavenHealthAssistant = () => {
  // =====================================================
  // Translation / Current Language
  // =====================================================

  const { t, i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage?.startsWith("ar") ? "ar" : "en";


  // =====================================================
  // Chat State
  // =====================================================

  const [sessions, setSessions] = useState([]);

  const [activeSessionId, setActiveSessionId] =
    useState(null);

  const [messagesBySession, setMessagesBySession] =
    useState({});


  // =====================================================
  // Current Messages
  // =====================================================

  const messages =
    activeSessionId == null
      ? []
      : messagesBySession[activeSessionId] ?? [];


  // =====================================================
  // Send Message
  // =====================================================

  const handleSendMessage = async (text) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    let targetSessionId = activeSessionId;


    // ===================================================
    // Create a new conversation if needed
    // ===================================================

    if (targetSessionId == null) {
      targetSessionId = createConversationId();

      setSessions((current) => [
        {
          id: targetSessionId,

          title:
            trimmedText.length > 42
              ? `${trimmedText.slice(0, 42)}…`
              : trimmedText,

          date: t("adopter.health.now"),

          isUserCreated: true,
        },

        ...current,
      ]);

      setActiveSessionId(targetSessionId);
    }


    // ===================================================
    // Add User Message
    // ===================================================

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      type: "text",
      text: trimmedText,
    };


    // ===================================================
    // Typing Indicator
    // ===================================================

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
      // =================================================
      // Call FastAPI / RAG
      // =================================================

      const result = await askHealthAssistant({
        question: trimmedText,

        animal: null,

        conversationId: targetSessionId,

        // IMPORTANT:
        // Send current platform language to FastAPI.
        language: currentLanguage,
      });


      // =================================================
      // AI Response
      // =================================================

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "ai",
        type: "text",

        text:
          result?.answer ||
          (currentLanguage === "ar"
            ? "لم يتم إرجاع إجابة."
            : "No answer was returned."),
      };


      // =================================================
      // Remove Typing + Add AI Answer
      // =================================================

      setMessagesBySession((current) => ({
        ...current,

        [targetSessionId]: [
          ...(current[targetSessionId] ?? []).filter(
            (message) =>
              message.id !== typingMessage.id
          ),

          assistantMessage,
        ],
      }));
    } catch (error) {
      console.error(
        "Health Assistant request failed:",
        error
      );


      // =================================================
      // Error Message
      // =================================================

      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        type: "text",

        text:
          error?.message ||
          (currentLanguage === "ar"
            ? "خدمة المساعد الصحي غير متاحة حالياً."
            : "Health Assistant service is currently unavailable."),
      };


      // =================================================
      // Remove Typing + Show Error
      // =================================================

      setMessagesBySession((current) => ({
        ...current,

        [targetSessionId]: [
          ...(current[targetSessionId] ?? []).filter(
            (message) =>
              message.id !== typingMessage.id
          ),

          errorMessage,
        ],
      }));
    }
  };


  // =====================================================
  // New Chat
  // =====================================================

  const handleNewChat = () => {
    setActiveSessionId(null);
  };


  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="pet-haven-health-assistant">
      <TopNavBar />

      <main className="pet-haven-health-assistant__main">

        <HealthHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(session) =>
            setActiveSessionId(session.id)
          }
          onNewChat={handleNewChat}
        />

        <section className="pet-haven-health-assistant__chat-panel">

          <ChatHeader
            onNewChat={handleNewChat}
          />

          <ChatMessages
            messages={messages}
          />

          <ChatInput
            onSend={handleSendMessage}
          />

        </section>

      </main>

      <Footer />
    </div>
  );
};


export default PetHavenHealthAssistant;