import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopNavBar from "../Components/TopNavBar";
import Footer from "../Components/Footer";
import WelcomeSection from "../Components/Dashboard/WelcomeSection";
import MilestoneBanner from "../Components/Dashboard/MilestoneBanner";
import MilestoneReportModal from "../Components/Dashboard/MilestoneReportModal";
import KpiCards from "../Components/Dashboard/KpiCards";
import WalletCard from "../Components/Dashboard/WalletCard";
import QuickActions from "../Components/Dashboard/QuickActions";
import CareCalendar from "../Components/Dashboard/CareCalendar";
import MyPets from "../Components/Dashboard/MyPets";
import Wishlist from "../Components/Dashboard/Wishlist";
import { fetchAdopterDashboard } from "../api/dashboardApi";
import { fetchMyProfile } from "../api/profileApi";
import { fetchAdoptedPets } from "../api/petsApi";
import { fetchWishlist } from "../api/wishlistApi";
import { getMyAppointments } from "../api/vetApi";
import { getMyAdoptionRequests } from "../api/adoptionHubApi";
import { submitPetReport } from "../api/petReportsApi";
import "../Styling/PetHavenDashboardPage.css";

function normalizeName(value) {
  return String(value ?? "").trim().toLocaleLowerCase();
}

function requestIdOf(request) {
  const value = request.adoptionRequestId ?? request.AdoptionRequestId ?? request.requestId ?? request.RequestId;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function requestPetIdOf(request) {
  const value = request.petId ?? request.PetId ?? request.pet?.petId ?? request.Pet?.PetId;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function requestPetNameOf(request) {
  return request.petName ?? request.PetName ?? request.pet?.name ?? request.Pet?.Name ?? "";
}

function findMilestoneRequest(requests, pets, petName) {
  const approved = requests.filter(
    (request) => String(request.status ?? request.Status ?? "").trim().toLowerCase() === "approved"
  );
  const normalizedPetName = normalizeName(petName);
  const matchingPets = pets.filter((pet) => normalizeName(pet.name) === normalizedPetName);

  if (matchingPets.length > 1) return null;

  const petId = matchingPets.length === 1 ? Number(matchingPets[0].id) : null;
  if (Number.isInteger(petId) && petId > 0) {
    const idMatches = approved.filter((request) => requestPetIdOf(request) === petId);
    if (idMatches.length === 1) return requestIdOf(idMatches[0]);
    if (idMatches.length > 1) return null;
    if (approved.some((request) => requestPetIdOf(request) !== null)) return null;
  }

  const nameMatches = approved.filter(
    (request) => normalizeName(requestPetNameOf(request)) === normalizedPetName
  );
  return nameMatches.length === 1 ? requestIdOf(nameMatches[0]) : null;
}

export default function PetHavenDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(null);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [milestoneRequest, setMilestoneRequest] = useState({ loading: true, requestId: null, error: null });
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportFeedback, setReportFeedback] = useState(null);
  const quickActions = [
    {
      id: "browse-animals",
      title: t("adopter.dashboard.quickActions.browseAnimals.title"),
      desc: t("adopter.dashboard.quickActions.browseAnimals.description"),
      icon: "search",
      colorVariant: "primary",
    },
    {
      id: "ai-diagnosis",
      title: t("adopter.dashboard.quickActions.aiDiagnosis.title"),
      desc: t("adopter.dashboard.quickActions.aiDiagnosis.description"),
      icon: "health_and_safety",
      colorVariant: "tertiary",
    },
    {
      id: "book-vet",
      title: t("adopter.dashboard.quickActions.bookVet.title"),
      desc: t("adopter.dashboard.quickActions.bookVet.description"),
      icon: "calendar_month",
      colorVariant: "secondary",
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAdopterDashboard();
        if (isMounted) {
          setDashboardData(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    async function loadPets() {
      try {
        setPetsLoading(true);
        setPetsError(null);
        const data = await fetchAdoptedPets();
        if (isMounted) {
          setPets(data);
          setPetsError(null);
        }
      } catch (err) {
        if (isMounted) setPetsError(err.message);
      } finally {
        if (isMounted) setPetsLoading(false);
      }
    }

    async function loadProfile() {
      try {
        setProfileLoading(true);
        setProfileError(null);
        setProfile(null);
        const data = await fetchMyProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) setProfileError(err.message);
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    }

    async function loadWishlist() {
      try {
        setWishlistLoading(true);
        setWishlistError(null);
        const data = await fetchWishlist();
        if (isMounted) {
          setWishlistItems(data);
          setWishlistError(null);
        }
      } catch (err) {
        if (isMounted) setWishlistError(err.message);
      } finally {
        if (isMounted) setWishlistLoading(false);
      }
    }

    async function loadAppointments() {
      try {
        setAppointmentsLoading(true);
        setAppointmentsError(null);
        const data = await getMyAppointments();
        if (isMounted) setAppointments(data);
      } catch (err) {
        if (isMounted) {
          setAppointments([]);
          setAppointmentsError(err.message);
        }
      } finally {
        if (isMounted) setAppointmentsLoading(false);
      }
    }

    loadDashboard();
    loadProfile();
    loadPets();
    loadWishlist();
    loadAppointments();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const shouldShowMilestone =
    dashboardData?.daysSinceLastAdoption !== null &&
    dashboardData?.daysSinceLastAdoption >= 180 &&
    Boolean(dashboardData?.lastAdoptedPetName);

  useEffect(() => {
    if (!shouldShowMilestone || petsLoading) return undefined;

    let active = true;
    getMyAdoptionRequests()
      .then((requests) => {
        if (!active) return;
        const requestId = findMilestoneRequest(requests, pets, dashboardData.lastAdoptedPetName);
        setMilestoneRequest({
          loading: false,
          requestId,
          error: requestId ? null : t("adopter.dashboard.milestone.missingRequest"),
        });
      })
      .catch(() => {
        if (active) {
          setMilestoneRequest({
            loading: false,
            requestId: null,
            error: t("adopter.dashboard.milestone.requestLookupError"),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [dashboardData, pets, petsLoading, shouldShowMilestone, t]);

  const retryDashboard = () => setReloadKey((value) => value + 1);

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <TopNavBar />
        <main id="main-content" tabIndex={-1} className="dashboard-main">
          <p>{t("adopter.dashboard.loading")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <TopNavBar />
        <main id="main-content" tabIndex={-1} className="dashboard-main">
          <div className="dashboard-page-state" role="alert">
            <span className="material-symbols-outlined" aria-hidden="true">error</span>
            <p>{t("adopter.dashboard.loadError", { message: error })}</p>
            <button type="button" className="dashboard-retry-button" onClick={retryDashboard}>
              {t("adopter.dashboard.retry")}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // تحويل استجابة الـ API لنفس شكل الـ props يلي بتتوقعها الكومبوننتس
  const kpiData = [
    {
      id: "pending-adoptions",
      label: t("adopter.dashboard.kpis.pendingAdoptions"),
      value: dashboardData.pendingAdoptionsCount,
      icon: "description",
      colorVariant: "primary",
      to: "/adopter/adoption-hub?tab=requests",
    },
    {
      id: "adopted-pets",
      label: t("adopter.dashboard.kpis.adoptedPets"),
      value: dashboardData.adoptedPetsCount,
      icon: "favorite",
      colorVariant: "green",
      to: "/adopter/adoption-hub?tab=requests",
    },
    {
      id: "recent-orders",
      label: t("adopter.dashboard.kpis.recentOrders"),
      value: dashboardData.recentOrdersCount,
      icon: "local_shipping",
      colorVariant: "yellow",
      to: "/adopter/store",
    },
  ];

  const milestoneData = {
    title: t("adopter.dashboard.milestone.title"),
    text: t("adopter.dashboard.milestone.text", {
      days: dashboardData.daysSinceLastAdoption,
      petName: dashboardData.lastAdoptedPetName,
    }),
  };

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const status = String(appointment.status ?? "").trim().toLowerCase();
      const date = new Date(appointment.appointmentDate);
      return !["completed", "cancelled"].includes(status) && !Number.isNaN(date.getTime()) && date >= new Date();
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  function openMilestoneModal() {
    if (!milestoneRequest.requestId || milestoneRequest.loading) return;
    setReportError(null);
    setMilestoneModalOpen(true);
  }

  function closeMilestoneModal() {
    if (reportSubmitting) return;
    setMilestoneModalOpen(false);
    setReportError(null);
  }

  async function handleReportSubmit(values) {
    if (!milestoneRequest.requestId || reportSubmitting) return;

    setReportSubmitting(true);
    setReportError(null);
    setReportFeedback(null);
    try {
      await submitPetReport({ adoptionRequestId: milestoneRequest.requestId, ...values });
      setMilestoneModalOpen(false);
      setReportFeedback({ message: t("adopter.dashboard.milestone.reportSuccess"), type: "success" });
    } catch (err) {
      const message = err.message || t("adopter.dashboard.milestone.reportError");
      setReportError(message);
    } finally {
      setReportSubmitting(false);
    }
  }

  const handleQuickAction = (actionId) => {
    const actionRoutes = {
      "browse-animals": "/adopter/adoption-hub",
      "ai-diagnosis": "/adopter/health",
      "book-vet": "/adopter/vets",
    };

    const route = actionRoutes[actionId];
    if (route) navigate(route);
  };

  return (
    <div className="dashboard-page">
      <TopNavBar />

      <main id="main-content" tabIndex={-1} className="dashboard-main">
        <WelcomeSection
          userName={profile?.fullName || profile?.username || null}
          loading={profileLoading}
          error={profileError}
        />

        {shouldShowMilestone && (
          <MilestoneBanner
            title={milestoneData.title}
            text={milestoneData.text}
            onOpen={openMilestoneModal}
            disabled={!milestoneRequest.requestId}
            resolving={milestoneRequest.loading}
            unavailableMessage={milestoneRequest.loading ? null : milestoneRequest.error}
            feedback={reportFeedback}
          />
        )}

        <KpiCards items={kpiData} />

        <WalletCard
          balance={profile?.balance}
          loading={profileLoading}
          error={Boolean(profileError)}
          onRetry={retryDashboard}
        />

        <QuickActions items={quickActions} onActionClick={handleQuickAction} />

        <div className="content-grid">
          <div className="calendars-column">
            <CareCalendar
              title={t("adopter.dashboard.calendar.careTitle")}
              appointments={upcomingAppointments}
              loading={appointmentsLoading}
              error={appointmentsError}
            />
          </div>

          <div className="side-column">
            <MyPets pets={pets} loading={petsLoading} error={petsError} onRetry={retryDashboard} />

            <Wishlist
              items={wishlistItems}
              loading={wishlistLoading}
              error={wishlistError}
              onRetry={retryDashboard}
            />
          </div>
        </div>
      </main>

      {milestoneModalOpen && (
        <MilestoneReportModal
          petName={dashboardData.lastAdoptedPetName}
          submitting={reportSubmitting}
          error={reportError}
          onClose={closeMilestoneModal}
          onSubmit={handleReportSubmit}
        />
      )}

      <Footer />
    </div>
  );
}
