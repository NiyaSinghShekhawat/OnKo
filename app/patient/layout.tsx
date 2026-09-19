import type { ReactNode } from "react";
import PatientAuthGate from "./auth-gate";
import { PatientDataProvider } from "./data-provider";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <PatientAuthGate>
      <PatientDataProvider>{children}</PatientDataProvider>
    </PatientAuthGate>
  );
}
