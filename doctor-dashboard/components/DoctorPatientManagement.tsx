"use client";

import { useEffect, useMemo, useState } from "react";
import type { CareJourneyState, Patient } from "@/types/patient";
import { auth } from "@/lib/firebase/client";
import { fetchDoctorPatients } from "@/lib/api/doctor";

const phaseLabels: Record<CareJourneyState, string> = {
  "active-treatment": "Active Treatment",
  "remission-survivorship": "Remission / Survivorship",
  relapse: "Relapse",
  "transfer-of-care": "Transfer of Care",
  "palliative-end-of-life": "Palliative / End-of-Life",
  deceased: "Deceased",
};

const phaseOptions: Array<"all" | CareJourneyState> = [
  "all",
  "active-treatment",
  "remission-survivorship",
  "relapse",
  "transfer-of-care",
  "palliative-end-of-life",
  "deceased",
];

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function DoctorPatientManagement({ onOpenPatient }: { onOpenPatient: (patientId: string) => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState<"all" | CareJourneyState>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (!user) {
        if (active) {
          setPatients([]);
          setLoading(false);
          setError("Sign in with a doctor account to view patients.");
        }
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDoctorPatients();
        if (active) setPatients(data);
      } catch (requestError) {
        console.error("Doctor patient list load failed", requestError);
        if (active) setError("Unable to load the patient directory right now.");
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        patient.patientId.toLowerCase().includes(query) ||
        patient.diagnosisLabel?.toLowerCase().includes(query);
      const matchesPhase = phase === "all" || patient.currentCarePhase === phase;
      return matchesSearch && matchesPhase;
    });
  }, [patients, search, phase]);

  return (
    <section className="doctor-page">
      <div className="doctor-card doctor-patient-toolbar">
        <div>
          <span className="doctor-eyebrow">Doctor workspace</span>
          <h2>Patient Management</h2>
          <p>Search the patients assigned to your authenticated doctor account.</p>
        </div>
        <div className="doctor-directory-count">{filteredPatients.length} shown</div>
      </div>

      <div className="doctor-card">
        <div className="doctor-patient-controls">
          <input
            aria-label="Search patients"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, patient ID, or diagnosis label"
          />
          <select aria-label="Filter by care phase" value={phase} onChange={(event) => setPhase(event.target.value as "all" | CareJourneyState)}>
            <option value="all">All care phases</option>
            {phaseOptions.slice(1).map((value) => <option key={value} value={value}>{phaseLabels[value as CareJourneyState]}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="doctor-directory-state">Loading patient directory…</div>
        ) : error ? (
          <div className="doctor-directory-state doctor-directory-error">{error}</div>
        ) : filteredPatients.length === 0 ? (
          <div className="doctor-directory-state">No patients match the current search or filter.</div>
        ) : (
          <div className="doctor-patient-table-wrap">
            <table className="doctor-patient-table">
              <thead>
                <tr><th>Patient</th><th>Care phase</th><th>Journey</th><th>Last updated</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientId}>
                    <td>
                      <strong>{patient.name}</strong>
                      <span>{patient.patientId}</span>
                    </td>
                    <td><span className="doctor-phase-pill">{phaseLabels[patient.currentCarePhase]}</span></td>
                    <td>
                      <div className="doctor-progress">
                        <div><span style={{ width: `${Math.max(0, Math.min(100, patient.journeyProgress))}%` }} /></div>
                        <small>{patient.journeyProgress}%</small>
                      </div>
                    </td>
                    <td>{formatDate(patient.lastUpdatedAt)}</td>
                    <td><button className="doctor-open-patient" type="button" onClick={() => onOpenPatient(patient.patientId)}>Open 360°</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
