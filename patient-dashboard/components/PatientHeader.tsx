"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";

export function PatientHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => auth.onAuthStateChanged((user) => setEmail(user?.email ?? "")), []);

  const current =
    pathname === "/patient"
      ? "Overview"
      : pathname.split("/").filter(Boolean).pop()?.replaceAll("-", " ") ?? "Patient Portal";

  async function signOut() {
    await auth.signOut();
    router.replace("/login?role=patient&next=/patient");
  }

  return (
    <header className="onko-topbar">
      <div className="onko-breadcrumb">
        OnKo / Patient Portal / <strong className="onko-capitalize">{current}</strong>
      </div>
      <div className="onko-patient-meta">
        <span className="onko-status">● Care journey active</span>
        <div className="onko-avatar" aria-label="Patient profile">DP</div>
        <button type="button" onClick={signOut} title={email ? `Sign out ${email}` : "Sign out"} style={{ border: "1px solid #d5e0e2", background: "white", borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: "#164b55" }}>
          Sign out
        </button>
      </div>
    </header>
  );
}
