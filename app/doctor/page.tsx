"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import DoctorOverviewFoundation from "@/doctor-dashboard/components/DoctorOverviewFoundation";
import DoctorPatientManagement from "@/doctor-dashboard/components/DoctorPatientManagement";
import DoctorPatient360 from "@/doctor-dashboard/components/DoctorPatient360";

export default function DoctorPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/login?role=doctor&next=/doctor");
        return;
      }
      setCheckingAuth(false);
    });
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
          </>
        )}
      </main>
    </div>
  );
}
