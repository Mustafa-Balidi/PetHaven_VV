import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopNavBar from "../Components/TopNavBar";
import Footer from "../Components/Footer";
import Toast from "../Components/Toast";
import AdoptionTabs from "../Components/AdoptionHub/AdoptionTabs";
import CompatibilityQuizBanner from "../Components/AdoptionHub/CompatibilityQuizBanner";
import CompatibilityQuizModal from "../Components/AdoptionHub/CompatibilityQuizModal";
import RecommendedPets from "../Components/AdoptionHub/RecommendedPets";
import PetCatalogGrid from "../Components/AdoptionHub/PetCatalogGrid";
import AdoptionRequests from "../Components/AdoptionHub/AdoptionRequests";
import AdoptedPets from "../Components/AdoptionHub/AdoptedPets";
import AdoptionApplicationModal from "../Components/AdoptionHub/AdoptionApplicationModal";

import {
  getAvailablePets,
  getAdoptedPets,
  getMyAdoptionRequests,
  submitAdoptionRequest,
  getCompatibilityRecommendations,
} from "../api/adoptionHubApi";

import "../Styling/AdoptionHub.css";

function AdoptionHubPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabs = [
    { id: "catalog", label: t("adopter.adoptionHub.tabs.catalog") },
    { id: "requests", label: t("adopter.adoptionHub.tabs.requests") },
  ];

  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    requestedTab === "requests" ? "requests" : "catalog"
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === "requests" ? { tab: "requests" } : {});
  };

  const [pets, setPets] = useState([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState(null);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [isLoadingAdoptedPets, setIsLoadingAdoptedPets] = useState(true);
  const [adoptedPetsError, setAdoptedPetsError] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isQuizSubmitting, setIsQuizSubmitting] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizRecommendedPets, setQuizRecommendedPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchPets = useCallback(async () => {
    try {
      setIsLoadingPets(true);
      setPetsError(null);
      setPets(await getAvailablePets());
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      setPetsError(err.message || t("adopter.adoptionHub.petsError"));
    } finally {
      setIsLoadingPets(false);
    }
  }, [t]);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoadingRequests(true);
      setRequestsError(null);
      setAdoptionRequests(await getMyAdoptionRequests());
    } catch (err) {
      setRequestsError(err.message || t("adopter.adoptionHub.requests.loadError"));
    } finally {
      setIsLoadingRequests(false);
    }
  }, [t]);

  useEffect(() => {
    getAvailablePets()
      .then((data) => setPets(data))
      .catch((err) => setPetsError(err.message || t("adopter.adoptionHub.petsError")))
      .finally(() => setIsLoadingPets(false));
  }, [t]);

  useEffect(() => {
    getAdoptedPets()
      .then((data) => setAdoptedPets(data))
      .catch((err) => setAdoptedPetsError(err.message || t("adopter.adoptionHub.adoptedPets.loadError")))
      .finally(() => setIsLoadingAdoptedPets(false));
  }, [t]);

  useEffect(() => {
    let active = true;
    getMyAdoptionRequests()
      .then((requests) => {
        if (active) setAdoptionRequests(requests);
      })
      .catch((err) => {
        if (active) {
          setRequestsError(
            err.message || t("adopter.adoptionHub.requests.loadError")
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingRequests(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  const handleStartQuiz = () => {
    setQuizError(null);
    setQuizResult(null);
    setIsQuizModalOpen(true);
  };

  const handleQuizSubmit = async (answers) => {
    try {
      setIsQuizSubmitting(true);
      setQuizError(null);

      const result = await getCompatibilityRecommendations(answers);
      setQuizResult(result);

      const normalize = (value) =>
        String(value || "")
          .trim()
          .toLowerCase()
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ");
      const recommendations = result.recommendations || [];
      const matches = [];

      recommendations.forEach((recommendation) => {
        const targetBreed = normalize(recommendation.breed);
        const matchingPets = pets.filter((pet) => {
          const petBreed = normalize(pet.breed);
          return petBreed === targetBreed || petBreed.includes(targetBreed) || targetBreed.includes(petBreed);
        });

        matchingPets.forEach((pet) => {
          if (matches.some((item) => item.petId === pet.petId)) return;

          const rawConfidence = Number(recommendation.confidence);
          const matchPercent = Number.isFinite(rawConfidence)
            ? Math.round(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)
            : 0;

          matches.push({
            ...pet,
            matchPercent,
            temperament:
              pet.healthStatus || pet.species || t("adopter.adoptionHub.available"),
          });
        });
      });

      setQuizRecommendedPets(matches.slice(0, 6));

      if (matches.length === 0) {
        showToast(t("adopter.adoptionHub.noQuizMatches"), "success");
      }
    } catch (err) {
      console.error("Compatibility quiz failed:", err);
      setQuizError(err.message || t("adopter.adoptionHub.quizError"));
    } finally {
      setIsQuizSubmitting(false);
    }
  };

  const handleViewProfile = (petId) => {
    navigate(`/adopter/pet-profile/${petId}`);
  };

  const handleAdoptNow = (petId, petName) => {
    setSelectedPetId(petId);
    setSelectedPetName(petName || null);
    setSubmitError(null);
    setIsAdoptionModalOpen(true);
  };

  const handleAdoptionSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const result = await submitAdoptionRequest({ petId: selectedPetId, ...formData });

      setIsAdoptionModalOpen(false);
      fetchRequests();
      showToast(result.message || t("adopter.adoptionHub.applicationSuccess"), "success");
      return true;
    } catch (err) {
      console.error("Adoption submit failed:", err);
      setSubmitError(err.message);
      showToast(err.message || t("adopter.adoptionHub.applicationError"), "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="adoption-hub-page">
      <TopNavBar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="adoption-hub-main">
        <header className="adoption-hub-header">
          <div>
            <h1 className="adoption-hub-header__title">
              {t("adopter.adoptionHub.title")}
            </h1>
            <p className="adoption-hub-header__subtitle">
              {t("adopter.adoptionHub.subtitle")}
            </p>
          </div>
        </header>

        <AdoptionTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === "catalog" && (
          <section className="adoption-hub-section">
            <CompatibilityQuizBanner onStartQuiz={handleStartQuiz} />

            {quizRecommendedPets.length > 0 && (
              <RecommendedPets
                pets={quizRecommendedPets}
                onViewProfile={handleViewProfile}
                onAdoptNow={handleAdoptNow}
              />
            )}

            {isLoadingPets ? (
              <div className="pet-catalog__state" aria-live="polite">
                <span className="material-symbols-outlined">progress_activity</span>
                <p>{t("adopter.adoptionHub.loadingPets")}</p>
              </div>
            ) : petsError ? (
              <div className="pet-catalog__state pet-catalog__state--error" role="alert">
                <p>{petsError}</p>
                <button type="button" onClick={fetchPets}>{t("adopter.adoptionHub.retry")}</button>
              </div>
            ) : (
              <PetCatalogGrid
                pets={pets}
                onViewProfile={handleViewProfile}
                onAdoptNow={handleAdoptNow}
              />
            )}
          </section>
        )}

        {activeTab === "requests" && (
          <section className="adoption-hub-section">
            <AdoptionRequests
              requests={adoptionRequests}
              loading={isLoadingRequests}
              error={requestsError}
              onRetry={fetchRequests}
              onViewDetails={(requestId) =>
                navigate(`/adopter/application-details/${requestId}`)
              }
            />
            <AdoptedPets
              pets={adoptedPets}
              loading={isLoadingAdoptedPets}
              error={adoptedPetsError}
              onViewProfile={handleViewProfile}
            />
          </section>
        )}
      </main>

      {isQuizModalOpen && (
        <CompatibilityQuizModal
          isOpen
          onClose={() => {
            if (!isQuizSubmitting) {
              setIsQuizModalOpen(false);
              setQuizError(null);
            }
          }}
          onSubmit={handleQuizSubmit}
          isSubmitting={isQuizSubmitting}
          error={quizError}
          result={quizResult}
        />
      )}

      <AdoptionApplicationModal
        isOpen={isAdoptionModalOpen}
        petName={selectedPetName}
        onClose={() => setIsAdoptionModalOpen(false)}
        onSubmit={handleAdoptionSubmit}
        isSubmitting={isSubmitting}
        error={submitError}
      />

      <Footer />
    </div>
  );
}

export default AdoptionHubPage;
