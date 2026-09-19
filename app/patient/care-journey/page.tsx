"use client";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import { usePatientContext } from "@/app/patient/data-provider";
import { completePatientMilestone } from "@/lib/api/patientMilestone";
import { useState } from "react";

const labels: Record<string,string> = {
  "active-treatment":"Active Treatment",
  "remission-survivorship":"Remission / Survivorship",
  "relapse":"Relapse",
  "transfer-of-care":"Transfer of Care",
  "palliative-end-of-life":"Palliative / End-of-Life",
  "deceased":"Deceased",
};

export default function CareJourneyPage() {
  const { patient, careJourneys, milestones, loading, error } = usePatientContext();
  const [completing, setCompleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function completeMilestone(milestoneId: string) {
    try {
      setCompleting(milestoneId);
      setActionError(null);
      await completePatientMilestone(milestoneId);
      window.location.reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Unable to complete milestone.");
    } finally {
      setCompleting(null);
    }
  }
  const journey = careJourneys[0];
  const progress = journey?.progressPercent ?? patient?.journeyProgress ?? 0;
  const currentState = journey?.currentState ?? patient?.currentCarePhase;
  const completed = milestones.filter((m) => m.status === "completed").length;
  const pending = milestones.filter((m) => m.status === "pending").length;
  const overdue = milestones.filter((m) => m.status === "overdue").length;

  return <PatientShell><main className="onko-page">
    <section className="patient-card">
      <span className="patient-eyebrow">MY CARE JOURNEY</span>
      <h1 className="onko-page-title">Your care journey</h1>
      <p className="onko-page-subtitle">A longitudinal view of milestones and care stages recorded by your care team.</p>
      {error && <p className="patient-muted">{error}</p>}
    </section>

    <section className="patient-card">
      <div className="patient-card-heading"><div><span className="patient-eyebrow">CURRENT STAGE</span><h2 className="journey-section-title">{currentState ? labels[currentState] ?? currentState : "Not yet recorded"}</h2></div><span className="patient-time">{journey?.updatedAt ?? patient?.lastUpdatedAt ?? ""}</span></div>
      <div className="checkin-progress"><span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>
      <div className="patient-action-row"><strong>{progress}% journey progress</strong><span>Stage is controlled by your care team.</span></div>
    </section>

    <section className="patient-today-grid">
      <article className="patient-card care-card"><span className="patient-eyebrow">COMPLETED</span><h3>{completed}</h3><p>Milestones recorded as completed.</p></article>
      <article className="patient-card care-card"><span className="patient-eyebrow">PENDING</span><h3>{pending}</h3><p>Milestones still awaiting completion.</p></article>
      <article className="patient-card care-card"><span className="patient-eyebrow">OVERDUE</span><h3>{overdue}</h3><p>Milestones marked overdue by the care workflow.</p></article>
    </section>

    <section className="patient-card">
      <div className="patient-card-heading"><div><span className="patient-eyebrow">MILESTONES</span><h2 className="journey-section-title">Your care timeline</h2></div><span className="patient-time">{milestones.length} records</span></div>
      {actionError && <p className="patient-directory-error">{actionError}</p>}
      {loading ? <p className="patient-muted">Loading your care journey…</p> : milestones.length ? <div className="clinical-list">{milestones.map((m)=><article className="clinical-list-item" key={m.milestoneId}><div className="clinical-icon">{m.status === "completed" ? "✓" : "○"}</div><div className="clinical-main"><div className="clinical-title-row"><div><h3>{m.title}</h3><span>Due {m.dueDate}</span></div><span className={`clinical-status clinical-status--${m.status === "completed" ? "done" : "scheduled"}`}>{m.status}</span></div>{m.description && <p>{m.description}</p>}{m.status === "pending" && <button type="button" className="report-view-button" onClick={() => completeMilestone(m.milestoneId)} disabled={completing === m.milestoneId}>{completing === m.milestoneId ? "Saving…" : "Mark complete"}</button>}</div></article>)}</div> : <p className="patient-muted">No milestones have been added to your care journey yet.</p>}
    </section>

    <section className="patient-safety-alert"><span className="patient-alert-icon">i</span><div><strong>Clinician-controlled journey</strong><span>Care stages and milestone status are recorded by the care team. OnKo displays this information and does not independently infer or change your clinical journey state.</span></div></section>
  </main></PatientShell>;
}
