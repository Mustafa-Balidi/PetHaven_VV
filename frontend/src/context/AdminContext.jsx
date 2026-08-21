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

  const mountedRef = useRef(true);
  const statsLoadedRef = useRef(false);

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
      setDashboardError(error.message);
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
      setPendingVetsError(error.message);
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
    (vetId) =>
      runAction(
        `reject-${vetId}`,
        () => adminApi.rejectVet(vetId),
        () => {
          if (!mountedRef.current) return;
          setPendingVets((previous) => previous.filter((vet) => vet.vetId !== vetId));
          // Rejection deletes the user account, so the counters move too.
          refreshStatsIfLoaded();
        }
      ),
    [runAction, refreshStatsIfLoaded]
  );

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
      fetchStats,
      fetchPendingVets,
      verifyVet,
      rejectVet,
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
      fetchStats,
      fetchPendingVets,
      verifyVet,
      rejectVet,
      banUser,
      unbanUser,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
