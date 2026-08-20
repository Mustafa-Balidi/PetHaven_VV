import { useState, useCallback } from "react";
import * as centerApi from "../api/centerApi.js";
import { CenterContext } from "./centerContextBase.js";

// getMonthlyReports resolves to a single object,
// not a list, so that slice defaults to null rather than [].
// getAdoptionInventory/getProductInventory resolve to plain arrays, so they default to [].
const initialState = {
  // ─── Profile ───────────────────────────────
  profile: null,
  profileLoading: false,
  profileError: null,

  // ─── Dashboard ─────────────────────────────
  dashboardStats: null,
  recentActivity: [],
  latestOrders: [],
  wallet: null,
  dashboardLoading: false,
  dashboardError: null,

  // ─── Reviews ───────────────────────────────
  reviewStats: null,
  reviews: [],
  reviewsLoading: false,
  reviewsError: null,

  // ─── Adoption Requests ─────────────────────
  adoptionRequests: [],
  requestsLoading: false,
  requestsError: null,
  blacklist: [],
  blacklistLoading: false,
  blacklistError: null,

  // ─── Inventory ─────────────────────────────
  productInventory: [],
  adoptionInventory: [],
  categories: [],
  inventoryLoading: false,
  inventoryError: null,
  sidebarRecentAdoptions: [],
  sidebarRecentSales: [],
  allProductSales: [],
  allProductSalesLoading: false,
  allProductSalesError: null,
  allRecentAdoptions: [],
  allRecentAdoptionsLoading: false,
  allRecentAdoptionsError: null,

  // ─── Reports ────────────────────────────────
  monthlyReports: null,
  vaccinationLoading: false,
  vaccinationError: null,
};

export default function CenterProvider({ children }) {
  const [state, setState] = useState(initialState);

  const set = useCallback((slice) => setState((prev) => ({ ...prev, ...slice })), []);

  // ── Profile actions ──────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    set({ profileLoading: true, profileError: null });
    try {
      const profile = await centerApi.getCenterProfile();
      set({ profile, profileLoading: false });
      return profile;
    } catch (err) {
      set({ profileError: err.message, profileLoading: false });
      throw err;
    }
  }, [set]);

  const updateProfile = useCallback(async (patch) => {
    try {
      const saved = await centerApi.updateCenterProfile(patch);
      setState((prev) => ({ ...prev, profile: saved, profileError: null }));
      return saved;
    } catch (err) {
      setState((prev) => ({ ...prev, profileError: err.message }));
      throw err;
    }
  }, []);

  // ── Dashboard actions ────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const [dashboardStats, recentActivity, latestOrders, wallet] = await Promise.all([
        centerApi.getDashboardStats(),
        centerApi.getRecentActivity(),
        centerApi.getLatestOrders(),
        centerApi.getWallet(),
      ]);
      set({ dashboardStats, recentActivity, latestOrders, wallet, dashboardLoading: false });
    } catch (err) {
      set({ dashboardError: err.message, dashboardLoading: false });
      throw err;
    }
  }, [set]);

  // ── Reviews actions ──────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    set({ reviewsLoading: true, reviewsError: null });
    try {
      const { reviews, reviewStats } = await centerApi.getCenterProductReviews();
      set({ reviews, reviewStats, reviewsLoading: false });
    } catch (err) {
      set({ reviews: [], reviewStats: null, reviewsError: err.message, reviewsLoading: false });
      throw err;
    }
  }, [set]);

  // ── Adoption Requests actions ────────────────────────────
  const fetchRequests = useCallback(async () => {
    set({ requestsLoading: true, requestsError: null });
    try {
      const adoptionRequests = await centerApi.getAdoptionRequests();
      set({ adoptionRequests, requestsLoading: false });
    } catch (err) {
      set({ requestsError: err.message, requestsLoading: false });
      throw err;
    }
  }, [set]);

  const approveRequest = useCallback(async (id) => {
    let previousRequests;
    setState((prev) => {
      previousRequests = prev.adoptionRequests;
      return {
        ...prev,
        adoptionRequests: prev.adoptionRequests.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)),
      };
    });
    try {
      const updated = await centerApi.approveRequest(id);
      setState((prev) => ({
        ...prev,
        adoptionRequests: prev.adoptionRequests.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      }));
      return updated;
    } catch (err) {
      setState((prev) => ({ ...prev, adoptionRequests: previousRequests, requestsError: err.message }));
      throw err;
    }
  }, []);

  const rejectRequest = useCallback(async (id, reason) => {
    let previousRequests;
    setState((prev) => {
      previousRequests = prev.adoptionRequests;
      return {
        ...prev,
        adoptionRequests: prev.adoptionRequests.map((r) =>
          r.id === id ? { ...r, status: "Rejected", rejectionReason: reason } : r
        ),
      };
    });
    try {
      const updated = await centerApi.rejectRequest(id, reason);
      setState((prev) => ({
        ...prev,
        adoptionRequests: prev.adoptionRequests.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      }));
      return updated;
    } catch (err) {
      setState((prev) => ({ ...prev, adoptionRequests: previousRequests, requestsError: err.message }));
      throw err;
    }
  }, []);

  const fetchBlacklist = useCallback(async () => {
    set({ blacklistLoading: true, blacklistError: null, blacklist: [] });
    try {
      const blacklist = await centerApi.getCenterBlacklist();
      set({ blacklist, blacklistLoading: false });
      return blacklist;
    } catch (err) {
      set({ blacklist: [], blacklistError: err.message, blacklistLoading: false });
      throw err;
    }
  }, [set]);

  const blockAdopter = useCallback(async ({ adopterId, reason }) => {
    return centerApi.banAdopter({ adopterId, reason });
  }, []);

  // ── Inventory actions ────────────────────────────────────
  const fetchProductInventory = useCallback(async () => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      const productInventory = await centerApi.getProductInventory();
      set({ productInventory, inventoryLoading: false });
    } catch (err) {
      set({ inventoryError: err.message, inventoryLoading: false });
      throw err;
    }
  }, [set]);

  const fetchAdoptionInventory = useCallback(async () => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      const adoptionInventory = await centerApi.getAdoptionInventory();
      set({ adoptionInventory, inventoryLoading: false });
    } catch (err) {
      set({ inventoryError: err.message, inventoryLoading: false });
      throw err;
    }
  }, [set]);

  const fetchInventory = useCallback(async () => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      const [productInventory, adoptionInventory, sidebarRecentAdoptions, sidebarRecentSales] = await Promise.all([
        centerApi.getProductInventory(),
        centerApi.getAdoptionInventory(),
        centerApi.getRecentAdoptions(),
        centerApi.getRecentSales(),
      ]);
      set({ productInventory, adoptionInventory, sidebarRecentAdoptions, sidebarRecentSales, inventoryLoading: false });
    } catch (err) {
      set({ inventoryError: err.message, inventoryLoading: false });
      throw err;
    }
  }, [set]);

  const fetchAllProductSales = useCallback(async () => {
    set({ allProductSalesLoading: true, allProductSalesError: null });
    try {
      const allProductSales = await centerApi.getAllProductSales();
      set({ allProductSales, allProductSalesLoading: false });
    } catch (err) {
      set({ allProductSalesError: err.message, allProductSalesLoading: false });
      throw err;
    }
  }, [set]);

  const fetchAllRecentAdoptions = useCallback(async () => {
    set({ allRecentAdoptionsLoading: true, allRecentAdoptionsError: null });
    try {
      const allRecentAdoptions = await centerApi.getAllRecentAdoptions();
      set({ allRecentAdoptions, allRecentAdoptionsLoading: false });
    } catch (err) {
      set({ allRecentAdoptionsError: err.message, allRecentAdoptionsLoading: false });
      throw err;
    }
  }, [set]);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await centerApi.getCategories();
      set({ categories });
    } catch (err) {
      set({ inventoryError: err.message });
      throw err;
    }
  }, [set]);

  const addProduct = useCallback(async (product) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticProduct = { productId: tempId, rating: 0, ...product };
    setState((prev) => ({
      ...prev,
      productInventory: [optimisticProduct, ...prev.productInventory],
    }));
    try {
      const created = await centerApi.addProduct(product);
      setState((prev) => ({
        ...prev,
        productInventory: prev.productInventory.map((p) => (p.productId === tempId ? created : p)),
      }));
      return created;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        productInventory: prev.productInventory.filter((p) => p.productId !== tempId),
        inventoryError: err.message,
      }));
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (id, patch) => {
    let previousProducts;
    setState((prev) => {
      previousProducts = prev.productInventory;
      return {
        ...prev,
        productInventory: prev.productInventory.map((p) => (p.productId === id ? { ...p, ...patch } : p)),
      };
    });
    try {
      const updated = await centerApi.updateProduct(id, patch);
      setState((prev) => ({
        ...prev,
        productInventory: prev.productInventory.map((p) => (p.productId === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        productInventory: previousProducts ?? prev.productInventory,
        inventoryError: err.message,
      }));
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    let previousProducts;
    setState((prev) => {
      previousProducts = prev.productInventory;
      return {
        ...prev,
        productInventory: prev.productInventory.filter((p) => p.productId !== id),
      };
    });
    try {
      await centerApi.deleteProduct(id);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        productInventory: previousProducts ?? prev.productInventory,
        inventoryError: err.message,
      }));
      throw err;
    }
  }, []);

  const addAnimal = useCallback(async (pet) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticAnimal = { petId: tempId, status: "Available", vaccinations: [], ...pet };
    setState((prev) => ({
      ...prev,
      adoptionInventory: [optimisticAnimal, ...prev.adoptionInventory],
    }));
    try {
      const created = await centerApi.addAnimal(pet);
      setState((prev) => ({
        ...prev,
        adoptionInventory: prev.adoptionInventory.map((a) => (a.petId === tempId ? created : a)),
      }));
      return created;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        adoptionInventory: prev.adoptionInventory.filter((a) => a.petId !== tempId),
        inventoryError: err.message,
      }));
      throw err;
    }
  }, []);

  const updateAnimalStatus = useCallback(async (id, patch) => {
    let previousAnimals;
    setState((prev) => {
      previousAnimals = prev.adoptionInventory;
      const changes = typeof patch === "string" ? { status: patch } : patch;
      return {
        ...prev,
        adoptionInventory: prev.adoptionInventory.map((a) => (a.petId === id ? { ...a, ...changes } : a)),
      };
    });
    try {
      console.log('updateAnimalStatus id:', id, 'dto:', patch);
      const updated = await centerApi.updateAnimalStatus(id, patch);
      setState((prev) => ({
        ...prev,
        adoptionInventory: prev.adoptionInventory.map((a) => (a.petId === id ? updated : a)),
      }));
      return updated;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        adoptionInventory: previousAnimals ?? prev.adoptionInventory,
        inventoryError: err.message,
      }));
      throw err;
    }
  }, []);

  const deleteAnimal = useCallback(async (id) => {
    let previousAnimals;
    setState((prev) => {
      previousAnimals = prev.adoptionInventory;
      return {
        ...prev,
        adoptionInventory: prev.adoptionInventory.filter((a) => a.petId !== id),
      };
    });
    try {
      await centerApi.deleteAnimal(id);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        adoptionInventory: previousAnimals ?? prev.adoptionInventory,
        inventoryError: err.message,
      }));
      throw err;
    }
  }, []);

  // ── Report actions ───────────────────────────────────────
  const fetchMonthlyReports = useCallback(async () => {
    set({ vaccinationLoading: true, vaccinationError: null });
    try {
      const monthlyReports = await centerApi.getMonthlyReports();
      set({ monthlyReports, vaccinationLoading: false });
    } catch (err) {
      set({ vaccinationError: err.message, vaccinationLoading: false });
      throw err;
    }
  }, [set]);

  const addReport = useCallback(async (report) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticReport = { id: tempId, submittedDate: new Date().toISOString().slice(0, 10), ...report };
    setState((prev) => ({
      ...prev,
      monthlyReports: prev.monthlyReports
        ? { ...prev.monthlyReports, submitted: [optimisticReport, ...prev.monthlyReports.submitted] }
        : prev.monthlyReports,
    }));
    try {
      const created = await centerApi.addReport(report);
      setState((prev) => ({
        ...prev,
        monthlyReports: prev.monthlyReports
          ? {
              ...prev.monthlyReports,
              submitted: prev.monthlyReports.submitted.map((r) => (r.id === tempId ? created : r)),
            }
          : prev.monthlyReports,
      }));
      return created;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        monthlyReports: prev.monthlyReports
          ? { ...prev.monthlyReports, submitted: prev.monthlyReports.submitted.filter((r) => r.id !== tempId) }
          : prev.monthlyReports,
        vaccinationError: err.message,
      }));
      throw err;
    }
  }, []);

  const deleteReport = useCallback(async (id) => {
    let previousSubmitted;
    setState((prev) => {
      if (!prev.monthlyReports) return prev;
      previousSubmitted = prev.monthlyReports.submitted;
      return {
        ...prev,
        monthlyReports: { ...prev.monthlyReports, submitted: prev.monthlyReports.submitted.filter((r) => r.id !== id) },
      };
    });
    try {
      await centerApi.deleteReport(id);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        monthlyReports:
          prev.monthlyReports && previousSubmitted
            ? { ...prev.monthlyReports, submitted: previousSubmitted }
            : prev.monthlyReports,
        vaccinationError: err.message,
      }));
      throw err;
    }
  }, []);

  const value = {
    ...state,
    fetchProfile,
    updateProfile,
    fetchDashboard,
    fetchReviews,
    fetchRequests,
    approveRequest,
    rejectRequest,
    fetchBlacklist,
    blockAdopter,
    fetchInventory,
    fetchProductInventory,
    fetchAdoptionInventory,
    fetchCategories,
    fetchAllProductSales,
    fetchAllRecentAdoptions,
    addProduct,
    updateProduct,
    deleteProduct,
    addAnimal,
    updateAnimalStatus,
    deleteAnimal,
    fetchMonthlyReports,
    addReport,
    deleteReport,
  };

  return <CenterContext.Provider value={value}>{children}</CenterContext.Provider>;
}
