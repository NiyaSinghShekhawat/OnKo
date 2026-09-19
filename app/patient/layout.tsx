import type { ReactNode } from "react";
import PatientAuthGate from "./auth-gate";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <PatientAuthGate>{children}</PatientAuthGate>;
}
