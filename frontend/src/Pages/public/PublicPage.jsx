import { useState } from "react";
import PublicHeader from "../../Components/common/header/PublicHeader.jsx";
import AuthModal from "../../Components/common/AuthModal.jsx";
import ContactModal from "../../Components/common/ContactModal.jsx";
import Footer from "../../Components/Footer.jsx";
import Hero from "../../Components/common/Hero.jsx";
import ImpactStats from "../../Components/common/ImpactStats.jsx";
import CategoriesGrid from "../../Components/common/CategoriesGrid.jsx";
import FeaturedPets from "../../Components/common/FeaturedPets.jsx";
import TrendingProducts from "../../Components/common/TrendingProducts.jsx";
import HowItWorks from "../../Components/common/HowItWorks.jsx";
import EventsSection from "../../Components/common/EventsSection.jsx";
import VetExpertsSection from "../../Components/common/VetExpertsSection.jsx";
import BlogArticles from "../../Components/common/BlogArticles.jsx";
import Testimonials from "../../Components/common/Testimonials.jsx";
import Newsletter from "../../Components/common/Newsletter.jsx";
import PetModal from "../../Components/common/PetModal.jsx";
import ProductModal from "../../Components/common/ProductModal.jsx";
import "../../Styling/PublicPage.css";

export default function PublicPage() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  const requireAuth = () => {
    setSelectedPet(null);
    setSelectedProduct(null);
    setAuthModal("signin");
    return false;
  };

  return (
    <>
      <PublicHeader onSignIn={() => setAuthModal("signin")} onSignUp={() => setAuthModal("signup")} />
      <main id="main-content" tabIndex={-1} className="public-page">
        <Hero requireAuth={requireAuth} />
        <ImpactStats />
        <CategoriesGrid requireAuth={requireAuth} />
        <FeaturedPets
          onPetClick={(pet) =>
            setSelectedPet(pet)
          }
          requireAuth={requireAuth}
        />
        <TrendingProducts
          onProductClick={(product) =>
            setSelectedProduct(product)
          }
          requireAuth={requireAuth}
        />
        <HowItWorks />
        <EventsSection requireAuth={requireAuth} />
        <VetExpertsSection requireAuth={requireAuth} />
        <BlogArticles />
        <Testimonials />
        <Newsletter requireAuth={requireAuth} />
        <PetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onRequireAuth={requireAuth}
        />
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRequireAuth={requireAuth}
        />
      </main>
      <Footer onContactClick={() => setContactOpen(true)} />
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}
