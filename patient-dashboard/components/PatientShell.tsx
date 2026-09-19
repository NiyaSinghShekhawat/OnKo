"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { getOnKoRole } from "@/lib/firebase/clientAuth";
import { PatientHeader } from "./PatientHeader";
import { PatientSidebar } from "./PatientSidebar";

export function PatientShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        if (active) router.replace(`/login?role=patient&next=${encodeURIComponent(pathname || "/patient")}`);
        return;
      }
      try {
        const role = await getOnKoRole(user);
        if (!active) return;
        if (role !== "patient") {
          await auth.signOut();
          router.replace(`/login?role=patient&next=${encodeURIComponent(pathname || "/patient")}&error=wrong-role`);
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        console.error("Patient role verification failed", error);
        if (active) {
          await auth.signOut();
          router.replace(`/login?role=patient&next=${encodeURIComponent(pathname || "/patient")}&error=session`);
        }
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
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
