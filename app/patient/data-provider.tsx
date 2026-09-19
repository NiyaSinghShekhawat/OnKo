"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePatientData, type PatientDataState } from "@/lib/api/usePatientData";

const PatientDataContext = createContext<PatientDataState | null>(null);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const data = usePatientData();
  return <PatientDataContext.Provider value={data}>{children}</PatientDataContext.Provider>;
}

export function usePatientContext() {
  const context = useContext(PatientDataContext);
  if (!context) throw new Error("usePatientContext must be used inside PatientDataProvider.");
  return context;
}
