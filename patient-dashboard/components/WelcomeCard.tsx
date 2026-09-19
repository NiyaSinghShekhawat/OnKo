"use client";
import { usePatientContext } from "@/app/patient/data-provider";

export function WelcomeCard() {
  const { patient, loading } = usePatientContext();
  if (loading) return <section className="patient-welcome-card"><div><span className="patient-eyebrow">PATIENT COMPANION</span><h2>Loading your care profile…</h2><p>Preparing your clinical care journey and companion tasks.</p></div></section>;
  if (!patient) return <section className="patient-welcome-card"><div><span className="patient-eyebrow">PATIENT COMPANION</span><h2>Care profile unavailable</h2><p>Your signed-in account is not yet linked to a patient record.</p></div></section>;
  return <section className="patient-welcome-card"><div><span className="patient-eyebrow">PATIENT COMPANION</span><h2>Welcome back, {patient.name}</h2><p>Your clinical care journey, today&apos;s schedule, and companion tasks.</p><div className="patient-meta-row"><span className="patient-chip">{patient.diagnosisLabel ?? "Care journey"}</span><span>Patient ID: {patient.patientId}</span><span>{patient.currentCarePhase.replaceAll("-", " ")}</span></div></div></section>;
}