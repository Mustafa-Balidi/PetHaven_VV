import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import TopNavBar from "../Components/TopNavBar";
import Footer from "../Components/Footer";

import HealthHistorySidebar from "../Components/healthAssistant/HealthHistorySidebar";
import ChatHeader from "../Components/healthAssistant/ChatHeader ";
import ChatMessages from "../Components/healthAssistant/ChatMessages ";
import ChatInput from "../Components/healthAssistant/ChatInput ";
import PetSelector from "../Components/healthAssistant/PetSelector";

import {
  askHealthAssistant,
  normalizeAnimal,
} from "../api/healthAssistantApi";
import { fetchAdoptedPets } from "../api/petsApi";

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
  // Adopted Pets State
  // =====================================================

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);


  // =====================================================
  // Chat State
  // =====================================================

  const [sessions, setSessions] = useState([]);

  const [activeSessionId, setActiveSessionId] =
    useState(null);

  const [messagesBySession, setMessagesBySession] =
    useState({});

  const [isSending, setIsSending] = useState(false);


  // =====================================================
  // Load the adopter real adopted pets
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadPets = async () => {
      setPetsLoading(true);
      setPetsError(null);

      try {
        const adoptedPets = await fetchAdoptedPets();

        if (!isMounted) {
          return;
        }

        setPets(adoptedPets);

        // Default to the first pet when at least one exists.
        setSelectedPetId(adoptedPets[0]?.id ?? null);
      } catch (error) {
        console.error("Failed to load adopted pets:", error);

        if (!isMounted) {
          return;
        }

        setPets([]);
        setSelectedPetId(null);
        setPetsError(t("adopter.health.petsError"));
      } finally {
        if (isMounted) {
          setPetsLoading(false);
        }
      }
    };

    loadPets();

    return () => {
      isMounted = false;
    };
  }, [t]);


  // =====================================================
  // Selected Pet (derived, never duplicated in state)
  // =====================================================

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  const selectedAnimal = normalizeAnimal(selectedPet?.species);


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
    if (isSending) {
      return;
    }

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

    setIsSending(true);


    try {
      // =================================================
      // Call FastAPI / RAG
      // =================================================

      const result = await askHealthAssistant({
        question: trimmedText,

        // Real species of the selected pet, normalized to a value the RAG
        // knowledge base supports. null when there is no pet, or when the
        // species is missing / unsupported.
        animal: selectedAnimal,

        conversationId: targetSessionId,

        // IMPORTANT:
        // Send current platform language to FastAPI.
        language: currentLanguage,
      });


      // =================================================
      // AI Response
      // =================================================

      const answer =
        typeof result?.answer === "string" ? result.answer.trim() : "";

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "ai",
        type: "text",

        text:
          answer ||
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
      // Error Message (user-safe text only)
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
    } finally {
      setIsSending(false);
    }
  };


  // =====================================================
  // New Chat
  // =====================================================

  const handleNewChat = () => {
    setActiveSessionId(null);
  };


  // =====================================================
  // Select Pet
  //
  // Switching pet starts a fresh conversation so a dog chat context is
  // never mixed with a cat chat. Existing sidebar sessions are kept.
  // =====================================================

  const handleSelectPet = (petId) => {
    if (petId === selectedPetId) {
      return;
    }

    setSelectedPetId(petId);
    setActiveSessionId(null);
  };


  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="pet-haven-health-assistant">
      <TopNavBar />

      <main id="main-content" tabIndex={-1} className="pet-haven-health-assistant__main">

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

          <div className="pet-context">
            {petsLoading ? (
              <p className="pet-context__note">
                {t("adopter.health.petsLoading")}
              </p>
            ) : petsError ? (
              <p className="pet-context__note pet-context__note--error">
                {petsError}
              </p>
            ) : pets.length === 0 ? (
              <p className="pet-context__note">
                {t("adopter.health.noPets")}
              </p>
            ) : (
              <>
                <PetSelector
                  pets={pets}
                  activePetId={selectedPetId}
                  onSelectPet={handleSelectPet}
                />

                {selectedPet ? (
                  <p className="pet-context__current">
                    <span className="pet-context__label">
                      {t("adopter.health.chattingAbout")}
                    </span>

                    <span className="pet-context__name">
                      {selectedPet.name}
                    </span>

                    {selectedPet.breed || selectedPet.species ? (
                      <span className="pet-context__meta">
                        {[selectedPet.breed, selectedPet.species]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </>
            )}
          </div>

          <ChatMessages
            messages={messages}
          />

          <ChatInput
            onSend={handleSendMessage}
            isSending={isSending}
          />

        </section>

      </main>

      <Footer />
    </div>
  );
};


export default PetHavenHealthAssistant;
