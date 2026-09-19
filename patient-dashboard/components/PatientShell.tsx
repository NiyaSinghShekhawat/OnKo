"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { PatientHeader } from "./PatientHeader";
import { PatientSidebar } from "./PatientSidebar";

export function PatientShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace(`/login?role=patient&next=${encodeURIComponent(pathname || "/patient")}`);
        return;
      }
      setCheckingAuth(false);
    });
  }, [pathname, router]);

  if (checkingAuth) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f8f8", color: "#123f48", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <strong>Opening your OnKo care portal…</strong>
          <p style={{ color: "#64777b" }}>Checking your secure patient session.</p>
        </div>
      </main>
    );
  }

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
