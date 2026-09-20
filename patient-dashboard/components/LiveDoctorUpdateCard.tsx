"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/client";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { Notification } from "@/types/notification";

export function LiveDoctorUpdateCard() {
  const [update, setUpdate] = useState<Notification | null>(null);
  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    const authUnsubscribe = auth.onIdTokenChanged((user) => {
      unsubscribe();
      if (!user) return;
      void user.getIdTokenResult(true).then((token) => {
        const patientId = typeof token.claims.patientId === "string" ? token.claims.patientId : null;
        if (!patientId) return;
        const q = query(collection(db, "notifications"), where("patientId", "==", patientId), where("type", "==", "doctor-update"));
        unsubscribe = onSnapshot(q, (snapshot) => {
          if (!active) return;
          const rows = snapshot.docs.map((d) => d.data() as Notification).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setUpdate(rows[0] ?? null);
        });
      }).catch(() => undefined);
    });
    return () => { active = false; unsubscribe(); authUnsubscribe(); };
  }, []);

  if (!update) return null;
  return <section className="patient-card doctor-update-card">
    <div className="patient-card-heading"><div><span className="patient-eyebrow">CARE TEAM UPDATE</span><h3>{update.title}</h3></div><span className="patient-time">{new Date(update.createdAt).toLocaleString()}</span></div>
    <p>{update.message}</p>
    <a className="patient-secondary-button" href="/patient/notifications">View update history</a>
  </section>;
}
