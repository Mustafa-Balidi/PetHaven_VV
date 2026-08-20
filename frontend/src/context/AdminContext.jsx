import { createContext, useState, useCallback } from 'react';
import * as adminApi from '../api/adminApi';

export const AdminContext = createContext(null);

const initialState = {
  // Dashboard
  kpis: null,
  platformHealth: null,
  clinicPerformance: [],
  systemAlerts: [],
  dashboardLoading: false,
  dashboardError: null,

  // Clinic Approvals
  clinicApprovals: [],
  blocklist: [],
  approvalsLoading: false,
  approvalsError: null,

  // Users
  users: [],
  usersLoading: false,
  usersError: null,
};

export default function AdminProvider({ children }) {
  const [state, setState] = useState(initialState);

  const set = useCallback(
    (slice) => setState((prev) => ({ ...prev, ...slice })),
    []
  );

  // ── Dashboard ──────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    set({ dashboardLoading: true, dashboardError: null });
    try {
      const [kpis, platformHealth, clinicPerformance, systemAlerts] =
        await Promise.all([
          adminApi.getAdminKpis(),
          adminApi.getPlatformHealth(),
          adminApi.getClinicPerformance(),
          adminApi.getSystemAlerts(),
        ]);
      set({ kpis, platformHealth, clinicPerformance,
            systemAlerts, dashboardLoading: false });
    } catch (e) {
      set({ dashboardError: e.message, dashboardLoading: false });
    }
  }, [set]);

  // ── Clinic Approvals ───────────────────────────────────
  const fetchApprovals = useCallback(async () => {
    set({ approvalsLoading: true, approvalsError: null });
    try {
      const [clinicApprovals, blocklist] = await Promise.all([
        adminApi.getClinicApprovals(),
        adminApi.getBlocklist(),
      ]);
      set({ clinicApprovals, blocklist, approvalsLoading: false });
    } catch (e) {
      set({ approvalsError: e.message, approvalsLoading: false });
    }
  }, [set]);

  // ── Users ──────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    set({ usersLoading: true, usersError: null });
    try {
      const users = await adminApi.getUsers();
      set({ users, usersLoading: false });
    } catch (e) {
      set({ usersError: e.message, usersLoading: false });
    }
  }, [set]);

  const value = {
    ...state,
    fetchDashboard,
    fetchApprovals,
    fetchUsers,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
