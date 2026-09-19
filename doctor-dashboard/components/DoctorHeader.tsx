"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

export default function DoctorHeader() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => auth.onAuthStateChanged((user) => setEmail(user?.email ?? "")), []);

  async function signOut() {
    await auth.signOut();
    router.replace("/login?role=doctor&next=/doctor");
  }

  return (
    <header className="doctor-topbar">
      <div>
        <div className="doctor-breadcrumb">
          OnKo <span>/</span> <strong>Doctor Overview</strong>
        </div>
        <h1>Doctor Command Center</h1>
        <p>Review your care team workload and patient activity.</p>
      </div>

      <div className="doctor-header-actions">
        <div className="doctor-identity">
          <div className="doctor-avatar">DR</div>
          <div>
            <strong>Doctor workspace</strong>
            <span>{email || "Authenticated care team"}</span>
          </div>
        </div>
        <button className="doctor-icon-button" type="button" onClick={signOut} aria-label="Sign out" title="Sign out">
          ↪
        </button>
      </div>
    </header>
  );
}
