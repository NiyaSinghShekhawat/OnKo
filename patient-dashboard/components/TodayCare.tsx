"use client";
import { usePatientContext } from "@/app/patient/data-provider";

export function TodayCare() {
  const { appointments, medicines, loading } = usePatientContext();
  if (loading) return <section className="patient-today-grid"><article className="patient-card care-card"><h3>Loading today&apos;s care…</h3></article></section>;
  const upcoming = appointments.filter((a) => a.status === "scheduled")[0];
  const activeMeds = medicines.filter((m) => m.status === "active");
  return <section className="patient-today-grid">
    <article className="patient-card care-card"><div className="patient-card-heading"><div><span className="patient-eyebrow">NEXT CLINICAL VISIT</span><h3>{upcoming?.title ?? "No scheduled visit"}</h3></div><span className="patient-status-dot">{upcoming ? "Upcoming" : "—"}</span></div><p className="patient-muted">{upcoming ? `${upcoming.date} · ${upcoming.time}` : "Your care team has not added a scheduled visit."}</p><div className="patient-detail-line">{upcoming?.location ?? "Location not provided"}</div><div className="patient-action-row"><span>{upcoming?.instructions ?? "Check your care-team instructions before the visit."}</span></div></article>
    <article className="patient-card care-card"><div className="patient-card-heading"><div><span className="patient-eyebrow">ACTIVE MEDICINES</span><h3>{activeMeds.length} active</h3></div><span className="patient-progress-mini">{activeMeds.length}</span></div>{activeMeds.slice(0,2).map((m)=><div className="dose-row" key={m.medicineId}><div><strong>{m.name} {m.dosage}</strong><span>{m.frequency} · {m.instructions}</span></div><span className="dose-complete">Active</span></div>)}{!activeMeds.length && <p className="patient-muted">No active medicines recorded.</p>}</article>
    <article className="patient-card care-card"><div className="patient-card-heading"><div><span className="patient-eyebrow">CARE JOURNEY</span><h3>Keep your care record up to date</h3></div><span className="patient-time">{appointments.length} visits</span></div><p>Review your milestones, appointments and care-team updates from the portal.</p><div className="patient-action-row"><span>{medicines.length} medicine records · {appointments.length} appointment records</span></div></article>
  </section>;
}