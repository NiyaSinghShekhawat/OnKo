"use client";

import { usePathname } from "next/navigation";

export function PatientHeader() {
  const pathname = usePathname();
  const current = pathname === "/patient" ? "Overview" : pathname.split("/").filter(Boolean).pop()?.replaceAll("-", " ") ?? "Patient Portal";
  return (
    <header className="onko-topbar">
      <div className="onko-breadcrumb">OnKo / Patient Portal / <strong className="onko-capitalize">{current}</strong></div>
      <div className="onko-patient-meta"><span className="onko-status">● Care journey active</span><div className="onko-avatar" aria-label="Patient profile">AR</div></div>
    </header>
  );
}
