import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../Styling/PetHavenShopPage.css";
import TopNavBar from "../Components/TopNavBar.jsx";
import Footer from "../Components/Footer.jsx";
import HeroBanner from "../Components/PetHavenShopPage/HeroBanner.jsx";
import TrustSection from "../Components/PetHavenShopPage/TrustSection.jsx";
import CategoryNav from "../Components/PetHavenShopPage/CategoryNav.jsx";
import Sidebar from "../Components/PetHavenShopPage/Sidebar.jsx";
import ProductCard from "../Components/PetHavenShopPage/ProductCard.jsx";
import Toast from "../Components/Toast.jsx";
import {
  getHeroBanner,
  getTrustItems,
  getCategories,
  getProducts,
} from "../api/shopApi.js";
import { addToCart } from "../api/cartData.js";
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
} from "../api/wishlistApi.js";

export default function PetHavenShopPage() {
  const { t } = useTranslation();
  const [hero, setHero] = useState(null);
  const [trustItems, setTrustItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalResults: 0 });
  const [sort, setSort] = useState("popular");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [availableBrands, setAvailableBrands] = useState([]);

  const [toast, setToast] = useState(null);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function closeToast() {
    setToast(null);
  }

  useEffect(() => {
    let isMounted = true;

    getHeroBanner().then((data) => isMounted && setHero(data));
    getTrustItems().then((data) => isMounted && setTrustItems(data));
    getCategories().then((data) => isMounted && setCategories(data));

    if (localStorage.getItem("token")) {
      fetchWishlist()
        .then((items) => isMounted && setWishlistedIds(new Set(items.map((item) => item.productId))))
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      await Promise.resolve();
      if (!isMounted) return;

      setProductsLoading(true);
      setProductsError(false);

      try {
        const data = await getProducts({
          page: pagination.currentPage,
          sort,
          filters: {
            categoryId: selectedCategoryId,
            brands: selectedBrands,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
          },
        });

        if (isMounted) {
          setProducts(data.products);
          setPagination(data.pagination);
          setAvailableBrands(data.filterOptions.brands);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
          setProductsError(true);
        }
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [pagination.currentPage, sort, selectedCategoryId, selectedBrands, priceRange]);

  function handleSelectCategory(categoryId) {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }

  function handleClearCategory() {
    setSelectedCategoryId(null);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }

  function handleToggleBrand(brand) {
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    );
    setPagination((current) => ({ ...current, currentPage: 1 }));
  }

  function handlePriceChange(field, value) {
    setPriceRange((current) => ({ ...current, [field]: value }));
    setPagination((current) => ({ ...current, currentPage: 1 }));
  }

  function handleClearFilters() {
    setSelectedCategoryId(null);
    setSelectedBrands([]);
    setPriceRange({ min: "", max: "" });
    setPagination((current) => ({ ...current, currentPage: 1 }));
  }

  async function handleAddToCart(productId) {
    const token = localStorage.getItem('token');

    if (!token) {
      showToast(t("adopter.store.messages.loginRequired"), "error");
      return;
    }

    try {
      await addToCart(productId, 1);
      showToast(t("adopter.store.messages.addedToCart"), "success");
    } catch (err) {
      showToast(err.message || t("adopter.store.messages.cartError"), "error");
    }
  }

  async function handleToggleWishlist(productId) {
    const wasWishlisted = wishlistedIds.has(productId);
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });

    try {
      await (wasWishlisted
        ? removeWishlistItem(productId)
        : addWishlistItem(productId));
      showToast(
        t(wasWishlisted
          ? "adopter.store.messages.removedFromWishlist"
          : "adopter.store.messages.addedToWishlist"),
        "success"
      );
    } catch (err) {
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        next.has(productId) ? next.delete(productId) : next.add(productId);
        return next;
      });
      showToast(err.message || t("adopter.store.messages.wishlistError"), "error");
    }
  }

  function handleShopNowClick() {
    document.getElementById("products-grid")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="pethaven-wrapper">
      <TopNavBar />

      <main className="main-content">
        {hero && <HeroBanner hero={hero} onShopNowClick={handleShopNowClick} />}

        <TrustSection items={trustItems} />

        <CategoryNav
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          onClearCategory={handleClearCategory}
        />

        <div className="shop-layout">
          <Sidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            selectedBrands={selectedBrands}
            availableBrands={availableBrands}
            priceRange={priceRange}
            onSelectCategory={handleSelectCategory}
            onToggleBrand={handleToggleBrand}
            onPriceChange={handlePriceChange}
            onClearAll={handleClearFilters}
          />

          <div className="products-container">
            <div className="sorting-bar">
              <span className="results-count">
                {t("adopter.store.results", {
                  from: pagination.totalResults ? (pagination.currentPage - 1) * (pagination.resultsPerPage ?? 12) + 1 : 0,
                  to: Math.min(
                    pagination.currentPage * (pagination.resultsPerPage ?? 12),
                    pagination.totalResults,
                  ),
                  total: pagination.totalResults,
                })}
              </span>
              <div className="sort-select-wrapper">
                <label className="sort-label" htmlFor="sort">
                  {t("adopter.store.sort.label")}
                </label>
                <select
                  className="sort-select"
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="popular">{t("adopter.store.sort.popular")}</option>
                  <option value="price-asc">{t("adopter.store.sort.priceAsc")}</option>
                  <option value="price-desc">{t("adopter.store.sort.priceDesc")}</option>
                  <option value="rating">{t("adopter.store.sort.rating")}</option>
                  <option value="newest">{t("adopter.store.sort.newest")}</option>
                </select>
              </div>
            </div>

            <div id="products-grid" className="products-grid">
              {productsLoading ? (
                <div className="products-state" aria-live="polite">
                  {t("adopter.store.loadingProducts")}
                </div>
              ) : productsError ? (
                <div className="products-state products-state--error" role="alert">
                  {t("adopter.store.productsError")}
                </div>
              ) : products.length === 0 ? (
                <div className="products-state">
                  {t("adopter.store.emptyProducts")}
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlistedIds.has(product.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
