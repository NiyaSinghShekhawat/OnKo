import type { ReactNode } from "react";
import { PatientHeader } from "./PatientHeader";
import { PatientSidebar } from "./PatientSidebar";

export function PatientShell({ children }: { children: ReactNode }) {
  return (
    <div className="onko-patient-shell">
      <PatientSidebar />
      <div className="onko-main">
        <PatientHeader />
        {children}
      </div>
    </div>
  );
}
