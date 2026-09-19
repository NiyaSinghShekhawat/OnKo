"use client";

import { useEffect, useState } from "react";
import type { Patient } from "@/types/patient";
import type { Appointment } from "@/types/appointment";
import type { Medicine } from "@/types/medicine";
import type { Query } from "@/types/query";
import type { Report } from "@/types/report";
import type { CareJourney } from "@/types/careJourney";
import {
  fetchPatients,
  fetchAppointments,
  fetchMedicines,
  fetchQueries,
  fetchReports,
  fetchCareJourneys,
} from "@/lib/api";

export interface PatientDataState {
  patient: Patient | null;
  appointments: Appointment[];
  medicines: Medicine[];
  queries: Query[];
  reports: Report[];
  careJourneys: CareJourney[];
  loading: boolean;
  error: string | null;
}

export function usePatientData(): PatientDataState {
  const [state, setState] = useState<PatientDataState>({
    patient: null,
    appointments: [],
    medicines: [],
    queries: [],
    reports: [],
    careJourneys: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [patients, appointments, medicines, queries, reports, careJourneys] =
          await Promise.all([
            fetchPatients(),
            fetchAppointments(),
            fetchMedicines(),
            fetchQueries(),
            fetchReports(),
            fetchCareJourneys(),
          ]);

        if (!active) return;

        setState({
          patient: patients[0] ?? null,
          appointments,
          medicines,
          queries,
          reports,
          careJourneys,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!active) return;
        console.error("Patient data load failed", error);
        setState((current) => ({
          ...current,
          loading: false,
          error: "Unable to load patient data right now.",
        }));
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
