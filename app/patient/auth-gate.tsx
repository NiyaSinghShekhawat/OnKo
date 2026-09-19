"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function PatientAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/login");
      setChecking(false);
    });
  }, [router]);

  if (checking) return <main style={{ padding: 32 }}>Checking your session...</main>;
  if (!auth.currentUser) return null;

  return children;
}
