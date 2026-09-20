"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { getOnKoRole } from "@/lib/firebase/clientAuth";
import DoctorSidebar from "./DoctorSidebar";
import DoctorHeader from "./DoctorHeader";
import DoctorCompleteWorkspace from "./DoctorCompleteWorkspace";

export default function DoctorWorkspaceShell() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        if (active) router.replace("/login?role=doctor&next=/doctor/workspace");
        return;
      }
      try {
        const role = await getOnKoRole(user);
        if (!active) return;
        if (role !== "doctor") {
          await auth.signOut();
          router.replace("/login?role=doctor&next=/doctor/workspace&error=wrong-role");
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        console.error("Doctor workspace role verification failed", error);
        if (active) {
          await auth.signOut();
          router.replace("/login?role=doctor&next=/doctor/workspace&error=session");
        }
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [router]);

  if (checkingAuth) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f8f8", color: "#123f48", fontFamily: "Arial, sans-serif" }}><strong>Opening Doctor Workspace…</strong></main>;

  return <div className="doctor-shell"><DoctorSidebar/><main className="doctor-main"><DoctorHeader/><DoctorCompleteWorkspace/></main></div>;
}
