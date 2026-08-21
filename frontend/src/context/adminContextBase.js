import { createContext, useContext } from "react";

export const AdminContext = createContext(null);

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used inside <AdminProvider>");
  }
  return context;
}
