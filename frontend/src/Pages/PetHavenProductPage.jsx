import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Styling/PetHavenProductPage.css";
import Footer from "../Components/Footer.jsx";
import TopNavBar from "../Components/TopNavBar.jsx";
import Icon from "../Components/Icon.jsx";
import ProductGallery from "../Components/PetHavenProductPage/ProductGallery.jsx";
import ProductDetails from "../Components/PetHavenProductPage/ProductDetails.jsx";
import ProductReviews from "../Components/PetHavenProductPage/ProductReviews.jsx";
import { getProductDetails } from "../api/productApi.js";

export default function PetHavenProductPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);
      setProduct(null);
      setReviewSummary(null);

      if (!productId) {
        setError(new Error(t("adopter.product.loadError")));
        setLoading(false);
        return;
      }

      try {
        const data = await getProductDetails(productId);
        if (active) {
          setProduct(data);
          setReviewSummary({
            average: data.averageRating,
            count: data.totalReviews,
          });
        }
      } catch (loadError) {
        if (active) setError(loadError);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId, t]);

  return (
    <div className="page-root">
      <TopNavBar />

      <main id="main-content" tabIndex={-1} className="main-content">
        <div className="breadcrumb">
          <Link to="/adopter/store" className="back-link">
            <Icon name="arrow_back" className="icon-24" />
            {t("adopter.product.backToStore")}
          </Link>
        </div>

        <div className="product-section">
          <ProductGallery product={product} loading={loading} error={error} />
          <ProductDetails
            product={product}
            loading={loading}
            error={error}
            reviewSummary={reviewSummary}
          />
        </div>

        {!loading && !error && product && (
          <>
            <section className="details-section">
              <h2 className="section-heading">{t("adopter.product.detailsTitle")}</h2>
              <div className="product-description-card">
                {product.description || t("adopter.product.noDescription")}
              </div>
            </section>

            <ProductReviews
              key={productId}
              productId={productId}
              onSummaryChange={setReviewSummary}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
