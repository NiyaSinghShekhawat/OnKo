"use client";

import { useEffect, useState } from "react";
import type { Patient } from "@/types/patient";
import type { Appointment } from "@/types/appointment";
import type { Medicine } from "@/types/medicine";
import type { Query } from "@/types/query";
import type { Report } from "@/types/report";
import type { CareJourney } from "@/types/careJourney";
import type { Procedure } from "@/types/procedure";
import type { Milestone } from "@/types/milestone";
import { auth, db } from "@/lib/firebase/client";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";

export interface PatientDataState {
  patient: Patient | null;
  appointments: Appointment[];
  medicines: Medicine[];
  queries: Query[];
  reports: Report[];
  careJourneys: CareJourney[];
  procedures: Procedure[];
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
}

export function usePatientData(): PatientDataState {
  const [state, setState] = useState<PatientDataState>({
    patient: null, appointments: [], medicines: [], queries: [], reports: [],
    careJourneys: [], procedures: [], milestones: [], loading: true, error: null,
  });

  useEffect(() => {
    let active = true;
    let unsubscribers: (() => void)[] = [];

    const unsubscribeAuth = auth.onIdTokenChanged((user) => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribers = [];
      if (!user) {
        if (active) setState((current) => ({ ...current, loading: false, error: "Please sign in." }));
        return;
      }

      void user.getIdTokenResult(true).then((tokenResult) => {
        if (!active) return;
        const patientId = typeof tokenResult.claims.patientId === "string" ? tokenResult.claims.patientId : null;
        if (!patientId || tokenResult.claims.role !== "patient") {
          setState((current) => ({ ...current, loading: false, error: "Your account is not linked to a patient record." }));
          return;
        }

        const listen = <T,>(path: string, setter: (value: T[]) => void) => {
          const q = query(collection(db, path), where("patientId", "==", patientId));
          return onSnapshot(q, (snapshot) => {
            if (!active) return;
            setter(snapshot.docs.map((item) => item.data() as T));
            setState((current) => ({ ...current, loading: false, error: null }));
          }, (error) => {
            console.error("Realtime listener failed", path, error);
            if (active) setState((current) => ({ ...current, loading: false, error: "Unable to sync your care data right now." }));
          });
        };

        unsubscribers = [
          onSnapshot(doc(db, "patients", patientId), (snapshot) => {
            if (snapshot.exists() && active) setState((current) => ({ ...current, patient: snapshot.data() as Patient, loading: false, error: null }));
          }, (error) => console.error("Realtime patient listener failed", error)),
          listen<Appointment>("appointments", value => setState(current => ({ ...current, appointments: value }))),
          listen<Medicine>("medicines", value => setState(current => ({ ...current, medicines: value }))),
          listen<Query>("queries", value => setState(current => ({ ...current, queries: value }))),
          listen<Report>("reports", value => setState(current => ({ ...current, reports: value }))),
          listen<CareJourney>("careJourneys", value => setState(current => ({ ...current, careJourneys: value }))),
          listen<Procedure>("procedures", value => setState(current => ({ ...current, procedures: value }))),
          listen<Milestone>("milestones", value => setState(current => ({ ...current, milestones: value }))),
        ];
      }).catch((error) => {
        console.error("Unable to initialize realtime patient data", error);
        if (active) setState((current) => ({ ...current, loading: false, error: "Unable to initialize realtime care data." }));
      });
    });

    return () => {
      active = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      unsubscribeAuth();
    };
  }, []);

  return state;
}
