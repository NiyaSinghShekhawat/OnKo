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
import { auth } from "@/lib/firebase/client";
import {
  fetchPatients,
  fetchAppointments,
  fetchMedicines,
  fetchQueries,
  fetchReports,
  fetchCareJourneys,
  fetchProcedures,
  fetchMilestones,
} from "@/lib/api";

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
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        if (active) setState((current) => ({ ...current, loading: false, error: "Please sign in." }));
        return;
      }
      try {
        const [patients, appointments, medicines, queries, reports, careJourneys, procedures, milestones] =
          await Promise.all([
            fetchPatients(), fetchAppointments(), fetchMedicines(), fetchQueries(),
            fetchReports(), fetchCareJourneys(), fetchProcedures(), fetchMilestones(),
          ]);
        if (!active) return;
        setState({
          patient: patients[0] ?? null, appointments, medicines, queries, reports,
          careJourneys, procedures, milestones, loading: false, error: null,
        });
      } catch (error) {
        if (!active) return;
        console.error("Patient data load failed", error);
        setState((current) => ({ ...current, loading: false, error: "Unable to load your care data right now." }));
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  return state;
}
