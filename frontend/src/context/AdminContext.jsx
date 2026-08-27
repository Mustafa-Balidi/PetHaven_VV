import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as adminApi from "../api/adminApi";
import { AdminContext } from "./adminContextBase.js";

export default function AdminProvider({ children }) {
  // ── Dashboard stats (GET /api/Admin/stats) ─────────────────────────
  const [stats, setStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // ── Pending vets (GET /api/Admin/vets/pending) ─────────────────────
  const [pendingVets, setPendingVets] = useState([]);
  const [pendingVetsLoaded, setPendingVetsLoaded] = useState(false);
  const [pendingVetsLoading, setPendingVetsLoading] = useState(false);
  const [pendingVetsError, setPendingVetsError] = useState(null);

  // ── In-flight mutation key, e.g. "verify-12" / "ban" / "unban" ─────
  const [actionLoading, setActionLoading] = useState(null);

  // ── Vet whose certificate is being fetched (a read, not a mutation, so
  //    it stays out of actionLoading and never blocks approve/reject) ──
  const [certificateLoadingId, setCertificateLoadingId] = useState(null);

  const mountedRef = useRef(true);
  const statsLoadedRef = useRef(false);

  /**
   * Errors are kept as `{ message, forbidden }` rather than a bare string.
   *
   * A 403 means the signed-in account is authenticated but its role is not
   * allowed here, so retrying the exact same request can never succeed — the
   * pages read `forbidden` to drop the "Try again" affordance. Every other
   * failure (network, 5xx, malformed payload) stays retryable.
   */
  const toErrorState = (error) => ({
    message: error.message,
    forbidden: Boolean(error.forbidden),
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchStats = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const data = await adminApi.getAdminStats();
      if (!mountedRef.current) return null;
      statsLoadedRef.current = true;
      setStats(data);
      return data;
    } catch (error) {
      if (!mountedRef.current) return null;
      setDashboardError(toErrorState(error));
      return null;
    } finally {
      if (mountedRef.current) setDashboardLoading(false);
    }
  }, []);

  const fetchPendingVets = useCallback(async () => {
    setPendingVetsLoading(true);
    setPendingVetsError(null);
    try {
      const data = await adminApi.getPendingVets();
      if (!mountedRef.current) return [];
      setPendingVets(data);
      setPendingVetsLoaded(true);
      return data;
    } catch (error) {
      if (!mountedRef.current) return [];
      setPendingVetsError(toErrorState(error));
      setPendingVets([]);
      setPendingVetsLoaded(false);
      return [];
    } finally {
      if (mountedRef.current) setPendingVetsLoading(false);
    }
  }, []);

  /** Re-syncs the stat counters only for pages that already loaded them. */
  const refreshStatsIfLoaded = useCallback(() => {
    if (!statsLoadedRef.current) return;
    fetchStats();
  }, [fetchStats]);

  const runAction = useCallback(
    async (key, request, onSuccess) => {
      setActionLoading(key);
      try {
        const result = await request();
        if (onSuccess) onSuccess();
        return { success: true, message: adminApi.extractMessage(result) };
      } catch (error) {
        return { success: false, message: error.message };
      } finally {
        if (mountedRef.current) setActionLoading(null);
      }
    },
    []
  );

  const verifyVet = useCallback(
    (vetId) =>
      runAction(
        `verify-${vetId}`,
        () => adminApi.verifyVet(vetId),
        () => {
          if (!mountedRef.current) return;
          setPendingVets((previous) => previous.filter((vet) => vet.vetId !== vetId));
        }
      ),
    [runAction]
  );

  const rejectVet = useCallback(
    (vetId, reason) =>
      runAction(
        `reject-${vetId}`,
        () => adminApi.rejectVet(vetId, reason),
        () => {
          if (!mountedRef.current) return;
          // Rejection only flips VerificationStatus to "Rejected" — no user
          // and no vet row is deleted — so none of the stat counters move and
          // refetching them here would be a pointless request.
          //
          // The card is dropped for this session only: the backend selects the
          // queue with `IsVerified == false`, which a rejected vet still
          // matches, so the next refresh can legitimately bring it back.
          setPendingVets((previous) => previous.filter((vet) => vet.vetId !== vetId));
        }
      ),
    [runAction]
  );

  /**
   * Loads one vet's certificate URL on demand.
   *
   * Kept out of `runAction` because it mutates nothing: it must not lock the
   * approve/reject buttons, and it returns a URL rather than a message.
   */
  const loadVetCertificate = useCallback(async (vetId) => {
    setCertificateLoadingId(vetId);
    try {
      const { url } = await adminApi.getVetCertificate(vetId);
      return { success: true, url, message: "" };
    } catch (error) {
      return { success: false, url: null, message: error.message };
    } finally {
      if (mountedRef.current) setCertificateLoadingId(null);
    }
  }, []);

  const banUser = useCallback(
    (userId, reason) =>
      runAction("ban", () => adminApi.banUser(userId, reason), refreshStatsIfLoaded),
    [runAction, refreshStatsIfLoaded]
  );

  const unbanUser = useCallback(
    (userId) => runAction("unban", () => adminApi.unbanUser(userId), refreshStatsIfLoaded),
    [runAction, refreshStatsIfLoaded]
  );

  const value = useMemo(
    () => ({
      stats,
      dashboardLoading,
      dashboardError,
      pendingVets,
      pendingVetsLoaded,
      pendingVetsLoading,
      pendingVetsError,
      actionLoading,
      certificateLoadingId,
      fetchStats,
      fetchPendingVets,
      verifyVet,
      rejectVet,
      loadVetCertificate,
      banUser,
      unbanUser,
    }),
    [
      stats,
      dashboardLoading,
      dashboardError,
      pendingVets,
      pendingVetsLoaded,
      pendingVetsLoading,
      pendingVetsError,
      actionLoading,
      certificateLoadingId,
      fetchStats,
      fetchPendingVets,
      verifyVet,
      rejectVet,
      loadVetCertificate,
      banUser,
      unbanUser,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
