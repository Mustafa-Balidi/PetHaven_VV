// React & Router
import { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { isAuthenticated } from "./api/authApi.js";
import { getVetDestination, VET_VERIFICATION_STATE } from "./utils/vetVerification.js";
import VetProvider from "./context/VetContext.jsx";
import { useVetContext } from "./context/vetContextBase.js";
import { onSessionExpired } from "./utils/sessionEvents.js";
import { useTranslation } from "react-i18next";

// CSS imports (keep ALL existing CSS imports)
import "./Styling/AdminPages.css";
import "./Styling/CenterPages.css";

// Pages — Public
import PublicPage from "./Pages/public/PublicPage.jsx";

// Pages — Pet Adopter
import PetHavenShopPage from "./Pages/PetHavenShopPage.jsx";
import PetHavenDashboardPage from "./Pages/PetHavenDashboardPage.jsx";
import AdopterProfile from "./Pages/AdopterProfile.jsx";
import PetHavenHealthAssistant from "./Pages/PetHavenHealthAssistant.jsx";
import PetProfilePage from "./Pages/PetProfilePage.jsx";
import AdoptionHubPage from "./Pages/AdoptionHubPage.jsx";
import ApplicationDetailsPage from "./Pages/ApplicationDetailsPage.jsx";
import PetHavenProductPage from "./Pages/PetHavenProductPage.jsx";
import ShoppingCart from "./Pages/ShoppingCart.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import OrderConfirmed from "./Pages/OrderConfirmed.jsx";
import OrderDetailsModal from "./Pages/OrderDetailsModal.jsx";
import {
  BookAppointmentPage,
  ConfirmAppointmentPage,
  MyVisitsPage,
  VetHubPage,
} from "./Pages/VetPages.jsx";

// Pages — Veterinarian
import VetDashboard from "./Pages/vet/VetDashboard.jsx";
import VetProfile from "./Pages/vet/VetProfile.jsx";
import VetReviews from "./Pages/vet/VetReviews.jsx";
import VetPatients from "./Pages/vet/VetPatients.jsx";
import VetAppointments from "./Pages/vet/VetAppointments.jsx";
import VetCalendar from "./Pages/vet/VetCalendar.jsx";
import VetProfessionalVerification from "./Pages/vet/VetProfessionalVerification.jsx";
import VetPendingApproval from "./Pages/vet/VetPendingApproval.jsx";

// Pages — Adoption Center
import CenterDashboard from "./Pages/adoptionCenter/CenterDashboard.jsx";
import AdoptionProfile from "./Pages/adoptionCenter/AdoptionProfile.jsx";
import CenterReviews from "./Pages/adoptionCenter/CenterReviews.jsx";
import Inventory from "./Pages/adoptionCenter/Inventory.jsx";
import Reports from "./Pages/adoptionCenter/Reports.jsx";
import AdoptionRequests from "./Pages/adoptionCenter/AdoptionRequests.jsx";
import CenterProvider from "./context/CenterContext.jsx";

// Pages — Admin
import AdminDashboard from "./Pages/admin/AdminDashboard.jsx";
import AdminVetApprovals from "./Pages/admin/AdminVetApprovals.jsx";
import AdminUsers from "./Pages/admin/AdminUsers.jsx";
import AdminProvider from "./context/AdminContext.jsx";
// pages _ vet
const getRoleRedirect = (role) => {
  switch (role) {
    case "AdoptionCenter": return "/center/dashboard";
    case "Admin": return "/admin";
    case "Adopter": return "/adopter/dashboard";
    case "Vet": return "/vet/dashboard";
    default: return "/";
  }
};

function ProtectedRoute({ allowedRoles, element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  let role;
  try {
    role = JSON.parse(localStorage.getItem("user"))?.role;
  } catch {
    role = undefined;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to={getRoleRedirect(role)} replace />;
  }
  return element;
}

function VetVerificationGuard({ mode, element }) {
  const { t } = useTranslation();
  const {
    verification,
    verificationLoading,
    verificationError,
    verificationState,
    verificationStateError,
    ensureVerification,
    refreshVerification,
  } = useVetContext();

  // `ensureVerification` reuses whatever the provider already holds, so moving
  // between vet routes no longer refetches the status on every mount.
  useEffect(() => {
    ensureVerification().catch(() => {
      /* surfaced through verificationError below */
    });
  }, [ensureVerification]);

  // Only the first resolution blocks the route. A later re-check (the
  // pending page polls on window focus) keeps the page on screen and reports
  // itself inline, instead of flashing this screen over a working page.
  if (!verification && verificationLoading) {
    return (
      <div role="status" className="vet-route-status">
        {t("vetPendingApproval.checkingStatus")}
      </div>
    );
  }

  if (!verification && verificationError) {
    return (
      <div role="alert" className="vet-route-status">
        <p>{verificationError || t("vetPendingApproval.statusError")}</p>
        <button type="button" onClick={() => refreshVerification().catch(() => {})}>
          {t("vetPendingApproval.retry")}
        </button>
      </div>
    );
  }

  if (!verification || verificationStateError) {
    return (
      <div role="alert" className="vet-route-status">
        {verificationStateError || t("vetPendingApproval.checkingStatus")}
      </div>
    );
  }

  const allowed =
    (mode === "operational" && verificationState === VET_VERIFICATION_STATE.APPROVED) ||
    (mode === "verification" && [VET_VERIFICATION_STATE.NOT_SUBMITTED, VET_VERIFICATION_STATE.REJECTED].includes(verificationState)) ||
    (mode === "pending" && [VET_VERIFICATION_STATE.PENDING, VET_VERIFICATION_STATE.REJECTED].includes(verificationState));

  if (!allowed) return <Navigate to={getVetDestination(verification)} replace />;
  // No prop-drilling of the status any more: the pages that need it read the
  // same value straight from VetContext.
  return element;
}

function ProtectedVetRoute({ mode, element }) {
  return (
    <ProtectedRoute
      allowedRoles={["Vet"]}
      element={<VetVerificationGuard mode={mode} element={element} />}
    />
  );
}

function SessionExpiryHandler() {
  const navigate = useNavigate();

  useEffect(
    () => onSessionExpired(() => navigate("/", { replace: true })),
    [navigate]
  );

  return null;
}

function RouteAccessibilityHandler() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const main = document.getElementById("main-content");
      const heading = main?.querySelector("h1");

      if (heading?.textContent?.trim()) {
        document.title = `${heading.textContent.trim()} | PetHaven`;
      }

      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        main?.focus({ preventScroll: true });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

function OrderConfirmedRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const orderDetailsPath = orderId
    ? `/adopter/order-details?orderId=${encodeURIComponent(orderId)}`
    : "/adopter/order-details";

  return (
    <OrderConfirmed
      orderNumber={orderId}
      onContinueShopping={() => navigate("/adopter/store")}
      onViewOrderHistory={() => navigate(orderDetailsPath)}
    />
  );
}

function OrderDetailsRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <OrderDetailsModal
      orderId={searchParams.get("orderId")}
      onClose={() => navigate("/adopter/store")}
    />
  );
}

function App() {
  return (
    <Router>
      <SessionExpiryHandler />
      <RouteAccessibilityHandler />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicPage />} />

        {/* PET ADOPTER */}
        <Route path="/adopter/dashboard" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<PetHavenDashboardPage />} />} />
        <Route path="/adopter/profile" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<AdopterProfile />} />} />
        <Route path="/adopter/store" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<PetHavenShopPage />} />} />
        <Route path="/adopter/product" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<PetHavenProductPage />} />} />
        <Route path="/adopter/cart" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<ShoppingCart />} />} />
        <Route path="/adopter/checkout" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<CheckoutPage />} />} />
        <Route path="/adopter/order-confirmed" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<OrderConfirmedRoute />} />} />
        <Route path="/adopter/order-details" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<OrderDetailsRoute />} />} />
        <Route path="/adopter/adoption-hub" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<AdoptionHubPage />} />} />
        <Route path="/adopter/application-details/:requestId" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<ApplicationDetailsPage />} />} />
        <Route path="/adopter/pet-profile/:petId" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<PetProfilePage />} />} />
        <Route path="/adopter/pet-profile" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<PetProfilePage />} />} />
        <Route path="/adopter/health" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<PetHavenHealthAssistant />} />} />
        <Route path="/adopter/vets" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<VetHubPage />} />} />
        <Route path="/adopter/vets/visits" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<MyVisitsPage />} />} />
        <Route path="/adopter/vets/book/:vetId" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<BookAppointmentPage />} />} />
        <Route path="/adopter/vets/confirm" element={<ProtectedRoute allowedRoles={["Adopter"]} element={<ConfirmAppointmentPage />} />} />

        {/* ADOPTION CENTER */}
        <Route
          path="/center/*"
          element={
            <CenterProvider>
              <Routes>
                <Route path="dashboard" element={<ProtectedRoute allowedRoles={["AdoptionCenter"]} element={<CenterDashboard />} />} />
                <Route path="profile" element={<ProtectedRoute allowedRoles={["AdoptionCenter"]} element={<AdoptionProfile />} />} />
                <Route path="reviews" element={<ProtectedRoute allowedRoles={["AdoptionCenter"]} element={<CenterReviews />} />} />
                <Route path="inventory" element={<ProtectedRoute allowedRoles={["AdoptionCenter"]} element={<Inventory />} />} />
                <Route path="vaccinations" element={<ProtectedRoute allowedRoles={["AdoptionCenter"]} element={<Reports />} />} />
                <Route path="adoptions" element={<ProtectedRoute allowedRoles={["AdoptionCenter"]} element={<AdoptionRequests />} />} />
              </Routes>
            </CenterProvider>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={
            <AdminProvider>
              <Routes>
                <Route path="" element={<ProtectedRoute allowedRoles={["Admin"]} element={<AdminDashboard />} />} />
                <Route path="vet-approvals" element={<ProtectedRoute allowedRoles={["Admin"]} element={<AdminVetApprovals />} />} />
                <Route path="users" element={<ProtectedRoute allowedRoles={["Admin"]} element={<AdminUsers />} />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminProvider>
          }
        />

        {/* VETERINARIAN */}
        {/* One provider for the whole section: it stays mounted across
            /vet/* navigations, so the verification status and the profile are
            fetched once instead of once per route. */}
        <Route
          path="/vet/*"
          element={
            <VetProvider>
              <Routes>
                <Route path="dashboard" element={<ProtectedVetRoute mode="operational" element={<VetDashboard />} />} />
                <Route path="profile" element={<ProtectedVetRoute mode="operational" element={<VetProfile />} />} />
                <Route path="reviews" element={<ProtectedVetRoute mode="operational" element={<VetReviews />} />} />
                <Route path="patients" element={<ProtectedVetRoute mode="operational" element={<VetPatients />} />} />
                <Route path="appointments" element={<ProtectedVetRoute mode="operational" element={<VetAppointments />} />} />
                <Route path="calendar" element={<ProtectedVetRoute mode="operational" element={<VetCalendar />} />} />
                <Route path="professional-verification" element={<ProtectedVetRoute mode="verification" element={<VetProfessionalVerification />} />} />
                <Route path="pending-approval" element={<ProtectedVetRoute mode="pending" element={<VetPendingApproval />} />} />
                <Route path="*" element={<Navigate to="/vet/dashboard" replace />} />
              </Routes>
            </VetProvider>
          }
        />

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
