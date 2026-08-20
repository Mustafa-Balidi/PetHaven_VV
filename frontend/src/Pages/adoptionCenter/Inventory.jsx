import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CenterHeader from "../../Components/common/header/CenterHeader.jsx";
import Footer from "../../Components/Footer.jsx";
import Icon from "../../Components/Icon.jsx";
import ProductInventory from "../../Components/center/ProductInventory.jsx";
import AdoptionInventory from "../../Components/center/AdoptionInventory.jsx";
import { useCenterContext } from "../../context/centerContextBase.js";
import "../../Styling/CenterPages.css";

export default function Inventory() {
  const { t: translate } = useTranslation();
  const t = translate("center.inventory", { returnObjects: true });
  const [activeTab, setActiveTab] = useState("animals");
  const adoptionRef = useRef(null);
  const productRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    productInventory,
    adoptionInventory,
    inventoryLoading,
    inventoryError,
    sidebarRecentAdoptions,
    sidebarRecentSales,
    allProductSales,
    allProductSalesLoading,
    allRecentAdoptions,
    allRecentAdoptionsLoading,
    fetchInventory,
    fetchAllProductSales,
    fetchAllRecentAdoptions,
    addProduct,
    updateProduct,
    deleteProduct,
    addAnimal,
    updateAnimalStatus,
    deleteAnimal,
  } = useCenterContext();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (location.state?.openAddPet) {
      setActiveTab("animals");
      adoptionRef.current?.openAdd();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  function handleAddClick() {
    if (activeTab === "animals") {
      adoptionRef.current?.openAdd();
    } else {
      productRef.current?.openAdd();
    }
  }

  return (
    <div className="center-inv-page">
      <CenterHeader />

      <div className="center-inv-body">
        <div className="center-inv-header">
          <div>
            <h1 className="center-inv-header__title">{t.title}</h1>
            <p className="center-inv-header__subtitle">{t.subtitle[activeTab]}</p>
          </div>
          <button type="button" className="center-inv-header__add-btn" onClick={handleAddClick}>
            <Icon name="add" />
            {t.addButton[activeTab]}
          </button>
        </div>

        <div className="center-inv-tabs">
          <button
            type="button"
            className={`center-inv-tabs__item ${activeTab === "animals" ? "center-inv-tabs__item--active" : ""}`}
            onClick={() => setActiveTab("animals")}
          >
            {t.tabs.animals}
          </button>
          <button
            type="button"
            className={`center-inv-tabs__item ${activeTab === "products" ? "center-inv-tabs__item--active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {t.tabs.products}
          </button>
        </div>

        {activeTab === "animals" ? (
          <AdoptionInventory
            ref={adoptionRef}
            adoptionInventory={adoptionInventory}
            recentAdoptions={sidebarRecentAdoptions}
            loading={inventoryLoading}
            error={inventoryError}
            onStatusChange={updateAnimalStatus}
            onPetAdded={addAnimal}
            onPetSaved={updateAnimalStatus}
            onDelete={deleteAnimal}
            allRecentAdoptions={allRecentAdoptions}
            allRecentAdoptionsLoading={allRecentAdoptionsLoading}
            onOpenAllRecentAdoptions={fetchAllRecentAdoptions}
          />
        ) : (
          <ProductInventory
            ref={productRef}
            productInventory={productInventory}
            recentSales={sidebarRecentSales}
            loading={inventoryLoading}
            error={inventoryError}
            onAdded={addProduct}
            onSaved={updateProduct}
            onDeleted={deleteProduct}
            allProductSales={allProductSales}
            allProductSalesLoading={allProductSalesLoading}
            onOpenAllProductSales={fetchAllProductSales}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
