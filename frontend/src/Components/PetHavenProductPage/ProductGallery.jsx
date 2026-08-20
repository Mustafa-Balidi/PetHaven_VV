import { useTranslation } from "react-i18next";
import Icon from "../Icon.jsx";

export default function ProductGallery({ product, loading, error }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="product-gallery product-gallery-loading">
        {t("adopter.product.galleryLoading")}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-gallery product-gallery-error">
        {t("adopter.product.galleryError")}
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="main-image-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="main-image"
          />
        ) : (
          <div className="product-image-placeholder">
            <Icon name="inventory_2" />
            <span>{t("adopter.product.imageUnavailable")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
