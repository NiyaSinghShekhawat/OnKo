"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { getOnKoRole } from "@/lib/firebase/clientAuth";
import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import DoctorOverviewFoundation from "@/doctor-dashboard/components/DoctorOverviewFoundation";
import DoctorPatientManagement from "@/doctor-dashboard/components/DoctorPatientManagement";
import DoctorPatient360 from "@/doctor-dashboard/components/DoctorPatient360";
import DoctorWorkspaceTables from "@/doctor-dashboard/components/DoctorWorkspaceTables";

export default function DoctorPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        if (active) router.replace("/login?role=doctor&next=/doctor");
        return;
      }
      try {
        const role = await getOnKoRole(user);
        if (!active) return;
        if (role !== "doctor") {
          await auth.signOut();
          router.replace("/login?role=doctor&next=/doctor&error=wrong-role");
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        console.error("Doctor role verification failed", error);
        if (active) {
          await auth.signOut();
          router.replace("/login?role=doctor&next=/doctor&error=session");
        }
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f8f8", color: "#123f48", fontFamily: "Arial, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <strong>Opening Doctor Command Center…</strong>
          <p style={{ color: "#64777b" }}>Checking your secure care-team session.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="doctor-shell">
      <DoctorSidebar />
      <main className="doctor-main">
        <DoctorHeader />
        {patientId ? (
          <DoctorPatient360 patientId={patientId} onBack={() => setPatientId(null)} />
        ) : (
          <>
            <DoctorOverviewFoundation />
            <DoctorPatientManagement onOpenPatient={setPatientId} />
            <DoctorWorkspaceTables />
          </>
        )}
      </main>
    </div>
  );
}
