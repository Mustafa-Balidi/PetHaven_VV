import { createContext, useContext } from "react";

export const CenterContext = createContext(null);

export function useCenterContext() {
  const context = useContext(CenterContext);
  if (!context) {
    throw new Error("useCenterContext must be used inside <CenterProvider>");
  }
  return context;
}
