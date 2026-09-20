"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Patient } from "@/types/patient";
import type { Milestone } from "@/types/milestone";
import type { Medicine } from "@/types/medicine";
import type { Procedure } from "@/types/procedure";
import { authenticatedFetch } from "@/lib/api/authenticatedFetch";
import { createDoctorMilestone, updateDoctorMilestone } from "@/lib/api/doctorMilestone";
import { createDoctorMedicine, updateDoctorMedicine } from "@/lib/api/doctorMedicine";
import { createDoctorProcedure, updateDoctorProcedure } from "@/lib/api/doctorProcedure";
import { replyToDoctorQuery, updateDoctorQueryStatus } from "@/lib/api/doctorQuery";
import { reviewDoctorReport } from "@/lib/api/doctorReport";
import { updateDoctorCaregiver } from "@/lib/api/doctorCaregiver";
import type { DoctorNote } from "@/types/doctorNote";
import type { CarePlanVersion } from "@/types/carePlanVersion";
import type { DoctorClinicalReview } from "@/types/doctorClinicalReview";

type Row = Record<string, any>;
type WorkspaceData = {
  patients: Patient[];
  appointments: Row[];
  medicines: Medicine[];
  procedures: Row[];
  reports: Row[];
  queries: Row[];
  milestones: Row[];
  caregivers: Row[];
  sosEvents: Row[];
  auditLogs: Row[];
};

const tabs = [
  ["progress", "Progress"],
  ["care-plans", "Care Plans"],
  ["appointments", "Appointments"],
  ["queries", "Queries / Triage"],
  ["reports", "Reports"],
  ["caregivers", "Caregivers"],
  ["audit", "Audit / Emergency"],
  ["ai-review", "AI Evidence Review"],
  ["notes", "Doctor Notes"],
] as const;

function date(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}
function patientName(patients: Patient[], id: string) {
  return patients.find((p) => p.patientId === id)?.name ?? id;
}
function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="doctor-complete-table-wrap"><table className="doctor-complete-table"><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

export default function DoctorCompleteWorkspace() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedTab = params.get("tab") ?? "progress";
  const activeTab = tabs.some(([id]) => id === requestedTab) ? requestedTab : "progress";
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [versions, setVersions] = useState<CarePlanVersion[]>([]);
  const [clinicalReview, setClinicalReview] = useState<DoctorClinicalReview | null>(null);
  const [clinicalQuestion, setClinicalQuestion] = useState("");
  const [clinicalLoading, setClinicalLoading] = useState(false);
  const [reportCurrentText, setReportCurrentText] = useState("");
  const [reportPreviousText, setReportPreviousText] = useState("");
  const [reportAnalysis, setReportAnalysis] = useState<any>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [milestone, setMilestone] = useState({ title: "", dueDate: "", description: "" });
  const [medicine, setMedicine] = useState({ name: "", dosage: "", frequency: "", instructions: "", startDate: "" });
  const [procedure, setProcedure] = useState({ name: "", date: "", purpose: "", details: "" });

  async function load() {
    try {
      setError("");
      const response = await authenticatedFetch("/api/doctor/workspace");
      if (!response.ok) throw new Error("Unable to load doctor workspace.");
      const next = (await response.json()).data as WorkspaceData;
      setData(next);
      if (!selectedPatient && next.patients[0]) setSelectedPatient(next.patients[0].patientId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load doctor workspace.");
    }
  }

  async function loadVersions(patientId = selectedPatient) {
    if (!patientId) return;
    try {
      const response = await authenticatedFetch("/api/doctor/care-plan-versions?patientId=" + encodeURIComponent(patientId));
      if (!response.ok) throw new Error("Unable to load care plan versions.");
      setVersions((await response.json()).data as CarePlanVersion[]);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load care plan versions."); }
  }

  async function loadNotes(patientId = selectedPatient) {
    if (!patientId) return;
    try {
      const response = await authenticatedFetch("/api/doctor/notes?patientId=" + encodeURIComponent(patientId));
      if (!response.ok) throw new Error("Unable to load private notes.");
      setNotes((await response.json()).data as DoctorNote[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load private notes.");
    }
  }

  useEffect(() => { void load(); }, []);
  useEffect(() => { if (activeTab === "notes") void loadNotes(); if (activeTab === "care-plans") void loadVersions(); }, [activeTab, selectedPatient]);

  function go(tab: string) {
    router.push("/doctor/workspace?tab=" + encodeURIComponent(tab), { scroll: false });
  }

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      setSaving(true);
      setError("");
      await action();
      setMessage(success);
      await load();
      if (activeTab === "notes") await loadNotes();
      if (activeTab === "care-plans") await loadVersions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setSaving(false);
    }
  }

  const progressRows = useMemo(() => {
    if (!data) return [];
    return data.patients.map((p) => {
      const appointments = data.appointments.filter((x) => x.patientId === p.patientId);
      const milestones = data.milestones.filter((x) => x.patientId === p.patientId && x.status !== "cancelled");
      const completedAppointments = appointments.filter((x) => x.status === "completed").length;
      const completedMilestones = milestones.filter((x) => x.status === "completed").length;
      const openQueries = data.queries.filter((x) => x.patientId === p.patientId && x.status === "open").length;
      const reportsToReview = data.reports.filter((x) => x.patientId === p.patientId && x.status !== "reviewed").length;
      const overdue = milestones.filter((x) => x.status === "overdue").length;
      const operationalProgress = milestones.length ? Math.round((completedMilestones / milestones.length) * 100) : p.journeyProgress;
      return { p, appointments, completedAppointments, milestones, completedMilestones, openQueries, reportsToReview, overdue, operationalProgress };
    });
  }, [data]);

  if (!data) return <section className="doctor-page"><div className="doctor-card doctor-directory-state">{error || "Loading complete doctor workspace…"}</div></section>;

  const careRows = [
    ...data.milestones.map((x) => ({ type: "Milestone", patientId: x.patientId, id: x.milestoneId, name: x.title, detail: x.description ?? "Care milestone", date: x.dueDate, status: x.status })),
    ...data.medicines.map((x) => ({ type: "Medicine", patientId: x.patientId, id: x.medicineId, name: x.name, detail: x.dosage + " · " + x.frequency, date: x.endDate ?? x.startDate, status: x.status })),
    ...data.procedures.map((x) => ({ type: "Procedure", patientId: x.patientId, id: x.procedureId, name: x.name, detail: x.purpose ?? x.reason ?? "Treatment procedure", date: x.date, status: x.status })),
  ];

  return <section className="doctor-page doctor-complete-workspace">
    <div className="doctor-complete-head">
      <div><span className="doctor-eyebrow">DOCTOR OPERATIONS</span><h1>Complete care workspace</h1><p>Existing OnKo records, Patient 360 workflows and patient-facing data stay on the same shared care record.</p></div>
      <button type="button" onClick={() => router.push("/doctor#patients")}>Back to overview</button>
    </div>

    <div className="doctor-complete-tabs" role="tablist">{tabs.map(([id, label]) => <button key={id} type="button" className={activeTab === id ? "active" : ""} onClick={() => go(id)}>{label}</button>)}</div>
    {message && <div className="doctor-workspace-toast">{message}</div>}
    {error && <div className="doctor-directory-state doctor-directory-error">{error}</div>}

    {activeTab === "progress" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">ALL-PATIENT PROGRESS</span><h2>Care operations at a glance</h2><p className="doctor-muted-text">Progress is calculated from clinician-recorded milestones and appointment/query/report states. It is not a clinical risk score.</p></div><span className="doctor-neutral-pill">{data.patients.length} patients</span></div>
      <Table headers={["Patient","Journey","Milestones","Appointments","Open queries","Reports","Attention"]}>{progressRows.map((r) => <tr key={r.p.patientId}><td><strong>{r.p.name}</strong><span>{r.p.patientId}</span></td><td><div className="doctor-complete-progress"><i style={{ width: Math.max(0, Math.min(100, r.operationalProgress)) + "%" }} /><span>{r.operationalProgress}%</span></div></td><td>{r.completedMilestones}/{r.milestones.length}</td><td>{r.completedAppointments}/{r.appointments.length}</td><td>{r.openQueries}</td><td>{r.reportsToReview}</td><td>{r.overdue + r.openQueries + r.reportsToReview ? <span className="doctor-complete-alert">{r.overdue + r.openQueries + r.reportsToReview} items</span> : <span className="doctor-complete-ok">Clear</span>}</td></tr>)}</Table>
    </section>}

    {activeTab === "care-plans" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">CARE PLAN</span><h2>Milestones, medicines and procedures</h2><p className="doctor-muted-text">These mutations use the existing doctor APIs and therefore remain visible to the patient dashboard through its realtime listeners.</p></div></div>
      <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}><option value="">Select patient</option>{data.patients.map((p) => <option key={p.patientId} value={p.patientId}>{p.name} · {p.patientId}</option>)}</select>
      {selectedPatient && <div className="doctor-complete-form-grid">
        <form onSubmit={(e) => { e.preventDefault(); void run(() => createDoctorMilestone({ patientId: selectedPatient, ...milestone }), "Milestone added; patient care journey updated."); }}>
          <h3>Add milestone</h3><input value={milestone.title} onChange={(e) => setMilestone({ ...milestone, title: e.target.value })} placeholder="Milestone title" required/><input type="date" value={milestone.dueDate} onChange={(e) => setMilestone({ ...milestone, dueDate: e.target.value })} required/><input value={milestone.description} onChange={(e) => setMilestone({ ...milestone, description: e.target.value })} placeholder="Description"/><button disabled={saving}>Add milestone</button>
        </form>
        <form onSubmit={(e) => { e.preventDefault(); void run(() => createDoctorMedicine({ patientId: selectedPatient, ...medicine, sideEffects: [], status: "active" }), "Medicine added; patient medication page will update."); }}>
          <h3>Add medicine</h3><input value={medicine.name} onChange={(e) => setMedicine({ ...medicine, name: e.target.value })} placeholder="Medicine" required/><input value={medicine.dosage} onChange={(e) => setMedicine({ ...medicine, dosage: e.target.value })} placeholder="Dosage" required/><input value={medicine.frequency} onChange={(e) => setMedicine({ ...medicine, frequency: e.target.value })} placeholder="Frequency" required/><input value={medicine.instructions} onChange={(e) => setMedicine({ ...medicine, instructions: e.target.value })} placeholder="Instructions" required/><input type="date" value={medicine.startDate} onChange={(e) => setMedicine({ ...medicine, startDate: e.target.value })} required/><button disabled={saving}>Add medicine</button>
        </form>
        <form onSubmit={(e) => { e.preventDefault(); void run(() => createDoctorProcedure({ patientId: selectedPatient, ...procedure, status: "scheduled" }), "Procedure added; patient treatment timeline will update."); }}>
          <h3>Add procedure</h3><input value={procedure.name} onChange={(e) => setProcedure({ ...procedure, name: e.target.value })} placeholder="Procedure" required/><input type="date" value={procedure.date} onChange={(e) => setProcedure({ ...procedure, date: e.target.value })} required/><input value={procedure.purpose} onChange={(e) => setProcedure({ ...procedure, purpose: e.target.value })} placeholder="Purpose"/><textarea value={procedure.details} onChange={(e) => setProcedure({ ...procedure, details: e.target.value })} placeholder="Details"/><button disabled={saving}>Add procedure</button>
        </form>
      </div>}
      <Table headers={["Patient","Type","Item","Detail","Date","Status"]}>{careRows.map((x) => <tr key={x.type + x.id}><td>{patientName(data.patients, x.patientId)}</td><td>{x.type}</td><td>{x.name}</td><td>{x.detail}</td><td>{date(x.date)}</td><td><select value={x.status} onChange={(e) => { if (x.type === "Milestone") void run(() => updateDoctorMilestone({ milestoneId: x.id, status: e.target.value as Milestone["status"] }), "Milestone updated."); else if (x.type === "Medicine") void run(() => updateDoctorMedicine({ medicineId: x.id, status: e.target.value as Medicine["status"] }), "Medicine updated."); else void run(() => updateDoctorProcedure({ procedureId: x.id, status: e.target.value as Procedure["status"] }), "Procedure updated."); }}><option value="pending">Pending</option><option value="active">Active</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option></select></td></tr>)}</Table>\n      {selectedPatient && <div className="doctor-complete-version-box"><div><strong>Care plan versions</strong><span>Snapshots preserve the existing live care-plan records without replacing them.</span></div><button disabled={saving} onClick={() => void run(async () => { const r = await authenticatedFetch("/api/doctor/care-plan-versions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: selectedPatient }) }); if (!r.ok) throw new Error("Unable to create care plan version."); }, "Care plan version saved.")}>Save version</button><div>{versions.map((v) => <span className="doctor-version-pill" key={v.versionId}>v{v.version} · {date(v.createdAt)} · {v.summary.milestones} milestones · {v.summary.activeMedicines} active medicines</span>)}</div></div>}
    </section>}

    {activeTab === "appointments" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">APPOINTMENTS</span><h2>Patient appointment workload</h2><p className="doctor-muted-text">Appointment records are shared with the patient dashboard. AI appointment summaries remain available in Patient 360.</p></div></div>
      <Table headers={["Patient","Appointment","Date","Time","Location","Status"]}>{data.appointments.slice().sort((a,b) => String(a.date).localeCompare(String(b.date))).map((x) => <tr key={x.appointmentId}><td>{patientName(data.patients, x.patientId)}</td><td><strong>{x.title}</strong><span>{x.appointmentId}</span></td><td>{date(x.date)}</td><td>{x.time}</td><td>{x.location ?? "—"}</td><td><span className="doctor-table-pill">{x.status}</span></td></tr>)}</Table>
    </section>}

    {activeTab === "queries" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">COMMUNICATION + TRIAGE</span><h2>Queries / Triage queue</h2><p className="doctor-muted-text">Reply, resolve, or leave a query open. Escalation remains a human workflow rather than an automatic clinical decision.</p></div></div>
      {data.queries.map((q) => <article className="doctor-complete-thread" key={q.queryId}><div><strong>{patientName(data.patients, q.patientId)} · {q.subject}</strong><span>{q.status} · updated {date(q.updatedAt)}</span></div><div className="doctor-complete-messages">{(q.messages ?? []).map((m: any) => <p key={m.messageId}><b>{m.senderRole === "patient" ? "Patient" : "Doctor"}:</b> {m.message}</p>)}</div><div className="doctor-complete-actions"><select value={q.status} onChange={(e) => void run(() => updateDoctorQueryStatus({ queryId: q.queryId, status: e.target.value as any }), "Query status updated.")}><option value="open">Open</option><option value="answered">Answered</option><option value="resolved">Resolved</option></select><input value={reply[q.queryId] ?? ""} onChange={(e) => setReply({ ...reply, [q.queryId]: e.target.value })} placeholder="Reply to patient…"/><button disabled={!reply[q.queryId]?.trim() || saving} onClick={() => void run(async () => { await replyToDoctorQuery({ queryId: q.queryId, message: reply[q.queryId] }); setReply({ ...reply, [q.queryId]: "" }); }, "Reply sent to patient.")}>Send reply</button></div></article>)}
      {!data.queries.length && <p className="doctor-muted-text">No patient queries.</p>}
    </section>}

    {activeTab === "reports" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">CLINICAL DOCUMENTS</span><h2>Reports review</h2><p className="doctor-muted-text">View the stored report and record a clinician review. No AI interpretation is inferred from metadata alone.</p></div></div>
      <Table headers={["Patient","Report","Type","Uploaded","Status","Action"]}>{data.reports.map((r) => <tr key={r.reportId}><td>{patientName(data.patients, r.patientId)}</td><td><strong>{r.title}</strong><span>{r.fileName}</span></td><td>{r.reportType ?? "Record"}</td><td>{date(r.uploadedAt)}</td><td>{r.status}</td><td><button onClick={async () => { const response = await authenticatedFetch("/api/doctor/reports/" + encodeURIComponent(r.reportId) + "/access"); if (response.ok) { const body = await response.json(); window.open(body.url, "_blank", "noopener,noreferrer"); } }}>View</button>{r.status !== "reviewed" && <button onClick={() => void run(() => reviewDoctorReport({ reportId: r.reportId, notes: "Reviewed in Complete Doctor Workspace." }), "Report marked reviewed; patient record is synchronized.")}>Review</button>}</td></tr>)}</Table>\n      <div className="doctor-report-assistant"><h3>Document comparison assistant</h3><p className="doctor-muted-text">Paste extracted report text when available. The assistant compares text only and does not infer a diagnosis or treatment.</p><textarea value={reportCurrentText} onChange={(e) => setReportCurrentText(e.target.value)} placeholder="Current report text" rows={7}/><textarea value={reportPreviousText} onChange={(e) => setReportPreviousText(e.target.value)} placeholder="Previous report text (optional)" rows={7}/><button disabled={!reportCurrentText.trim() || saving} onClick={() => void run(async () => { const r = await authenticatedFetch("/api/doctor/report-analysis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentText: reportCurrentText, previousText: reportPreviousText }) }); if (!r.ok) throw new Error((await r.json()).error ?? "Unable to compare reports."); setReportAnalysis((await r.json()).data); }, "Report comparison generated.")}>Compare supplied text</button>{reportAnalysis && <div className="doctor-report-result"><strong>{reportAnalysis.summary}</strong><h4>Documented changes</h4><ul>{reportAnalysis.changes.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul><h4>Unchanged</h4><ul>{reportAnalysis.unchanged.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul><h4>Uncertainties</h4><ul>{reportAnalysis.uncertainties.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul><small>{reportAnalysis.model} · {reportAnalysis.disclaimer}</small></div>}</div>
    </section>}

    {activeTab === "caregivers" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">SUPPORT NETWORK</span><h2>Caregiver access</h2><p className="doctor-muted-text">Access changes use the existing consent-controlled caregiver API.</p></div></div>
      <Table headers={["Patient","Caregiver","Relationship","Contact","Access","Permissions"]}>{data.caregivers.map((c) => <tr key={c.caregiverId}><td>{patientName(data.patients, c.patientId)}</td><td>{c.name}</td><td>{c.relationship}</td><td>{c.contact ?? "—"}</td><td><select value={c.accessStatus} onChange={(e) => void run(() => updateDoctorCaregiver({ caregiverId: c.caregiverId, accessStatus: e.target.value as any }), "Caregiver access updated.")}><option value="invited">Invited</option><option value="consented">Consented</option><option value="active">Active</option><option value="revoked">Revoked</option></select></td><td>{Array.isArray(c.permissions) ? c.permissions.join(", ") : "—"}</td></tr>)}</Table>
    </section>}

    {activeTab === "audit" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">SAFETY + ACCOUNTABILITY</span><h2>Audit / Emergency</h2><p className="doctor-muted-text">SOS events are handled explicitly; the audit table remains the traceability record.</p></div></div>
      <h3>Emergency queue</h3><Table headers={["Patient","Status","Message","Created","Action"]}>{data.sosEvents.map((s) => <tr key={s.sosId}><td>{patientName(data.patients, s.patientId)}</td><td>{s.status}</td><td>{s.message ?? "Patient-triggered safety event"}</td><td>{date(s.createdAt)}</td><td>{s.status === "triggered" ? <><button onClick={() => void run(async () => { const r = await authenticatedFetch("/api/doctor/sos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sosId: s.sosId, status: "acknowledged" }) }); if (!r.ok) throw new Error("Unable to acknowledge SOS."); }, "SOS acknowledged.")}>Acknowledge</button><button onClick={() => void run(async () => { const r = await authenticatedFetch("/api/doctor/sos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sosId: s.sosId, status: "resolved" }) }); if (!r.ok) throw new Error("Unable to resolve SOS."); }, "SOS resolved.")}>Resolve</button></> : s.status === "acknowledged" ? <button onClick={() => void run(async () => { const r = await authenticatedFetch("/api/doctor/sos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sosId: s.sosId, status: "resolved" }) }); if (!r.ok) throw new Error("Unable to resolve SOS."); }, "SOS resolved.")}>Resolve</button> : "Resolved"}</td></tr>)}</Table>
      <h3>Recent audit trail</h3><Table headers={["Time","Patient","Action","Entity","Actor"]}>{data.auditLogs.slice().sort((a,b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0,30).map((x) => <tr key={x.auditId}><td>{date(x.createdAt)}</td><td>{patientName(data.patients, x.patientId)}</td><td>{x.action}</td><td>{x.entityType}</td><td>{x.actorRole}</td></tr>)}</Table>
    </section>}

    {activeTab === "ai-review" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">AI EVIDENCE REVIEW</span><h2>Evidence-backed clinician review</h2><p className="doctor-muted-text">Uses the existing patient record plus retrieved medical literature. It produces evidence points and questions for clinician review; it does not diagnose, prescribe, calculate risk, or change the care plan.</p></div></div>
      <select value={selectedPatient} onChange={(e) => { setSelectedPatient(e.target.value); setClinicalReview(null); }}><option value="">Select patient</option>{data.patients.map((p) => <option key={p.patientId} value={p.patientId}>{p.name} · {p.patientId}</option>)}</select>
      <textarea value={clinicalQuestion} onChange={(e) => setClinicalQuestion(e.target.value)} placeholder="What would you like the evidence workspace to organize?" rows={4}/>
      <button disabled={!selectedPatient || !clinicalQuestion.trim() || clinicalLoading} onClick={async () => { try { setClinicalLoading(true); setError(""); const r = await authenticatedFetch("/api/doctor/clinical-review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: selectedPatient, question: clinicalQuestion }) }); if (!r.ok) throw new Error((await r.json()).error ?? "Unable to generate evidence review."); setClinicalReview((await r.json()).data as DoctorClinicalReview); } catch (e) { setError(e instanceof Error ? e.message : "Unable to generate evidence review."); } finally { setClinicalLoading(false); } }}>{clinicalLoading ? "Reviewing evidence…" : "Generate evidence review"}</button>
      {clinicalReview && <div className="doctor-clinical-review"><h3>Record context</h3><p>{clinicalReview.contextSummary}</p><h3>Evidence points</h3><ul>{clinicalReview.evidencePoints.map((x, i) => <li key={i}>{x}</li>)}</ul><h3>Considerations for clinician review</h3><ul>{clinicalReview.considerationsForReview.map((x, i) => <li key={i}>{x}</li>)}</ul><h3>Uncertainties</h3><ul>{clinicalReview.uncertainties.map((x, i) => <li key={i}>{x}</li>)}</ul><h3>Sources</h3><ul>{clinicalReview.sources.map((s, i) => <li key={i}>{s.title} {s.url && <a href={s.url} target="_blank" rel="noreferrer">Source</a>}</li>)}</ul><small>{clinicalReview.model} · {clinicalReview.disclaimer}</small><button disabled={saving} onClick={() => void run(async () => { const r = await authenticatedFetch("/api/doctor/action-tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: selectedPatient, title: "Review AI evidence workspace output", note: clinicalReview.question }) }); if (!r.ok) throw new Error((await r.json()).error ?? "Unable to create follow-up task."); }, "Doctor follow-up task created.")}>Create follow-up task</button></div>}
    </section>}

    {activeTab === "notes" && <section className="doctor-card">
      <div className="doctor-card-heading"><div><span className="doctor-eyebrow">PRIVATE CLINICAL NOTES</span><h2>Doctor-only notes</h2><p className="doctor-muted-text">These notes are stored in a separate doctor-only collection and are not part of the patient dashboard.</p></div></div>
      <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}><option value="">Select patient</option>{data.patients.map((p) => <option key={p.patientId} value={p.patientId}>{p.name} · {p.patientId}</option>)}</select>
      {selectedPatient && <form className="doctor-complete-note-form" onSubmit={async (e) => { e.preventDefault(); await run(async () => { const r = await authenticatedFetch("/api/doctor/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patientId: selectedPatient, title: noteTitle, body: noteBody }) }); if (!r.ok) throw new Error((await r.json()).error ?? "Unable to save note."); setNoteTitle(""); setNoteBody(""); await loadNotes(); }, "Private doctor note saved."); }}><input value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Note title" required/><textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Private note…" rows={5} required/><button disabled={saving}>Save private note</button></form>}
      <div className="doctor-complete-note-list">{notes.map((n) => <article key={n.noteId}><strong>{n.title}</strong><time>{date(n.updatedAt)}</time><p>{n.body}</p></article>)}</div>
      {!notes.length && selectedPatient && <p className="doctor-muted-text">No private notes for this patient.</p>}
    </section>}

    <style jsx global>{`
      .doctor-complete-workspace{padding-top:0}
      .doctor-complete-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:14px}
      .doctor-complete-head h1{margin:5px 0;font-size:22px;color:var(--onko-ink)}
      .doctor-complete-head p{margin:0;color:var(--onko-muted);font-size:10px;line-height:1.5;max-width:700px}
      .doctor-complete-head button,.doctor-complete-workspace button{border:1px solid var(--onko-teal);background:#fff;color:var(--onko-teal);border-radius:6px;padding:7px 10px;font-size:8px;font-weight:700;cursor:pointer}
      .doctor-complete-workspace button:hover{background:var(--onko-teal-soft)}
      .doctor-complete-tabs{display:flex;gap:6px;overflow:auto;margin-bottom:14px;padding-bottom:2px}
      .doctor-complete-tabs button{white-space:nowrap;border:1px solid var(--onko-line);background:#fff;color:var(--onko-muted);border-radius:7px;padding:8px 10px;font-size:8px}
      .doctor-complete-tabs button.active{background:var(--onko-teal);border-color:var(--onko-teal);color:#fff}
      .doctor-complete-table-wrap{overflow-x:auto}
      .doctor-complete-table{width:100%;border-collapse:collapse;min-width:760px}
      .doctor-complete-table th{padding:9px 10px;text-align:left;border-bottom:1px solid var(--onko-line);font-size:7px;color:var(--onko-muted);text-transform:uppercase;letter-spacing:.06em}
      .doctor-complete-table td{padding:10px;border-bottom:1px solid #edf1f1;font-size:8px;color:#53666a;vertical-align:middle}
      .doctor-complete-table td strong,.doctor-complete-table td span{display:block}
      .doctor-complete-table td span{margin-top:3px;font-size:7px;color:var(--onko-muted)}
      .doctor-complete-table select,.doctor-complete-workspace input,.doctor-complete-workspace textarea,.doctor-complete-workspace>section>select{border:1px solid var(--onko-line);border-radius:6px;background:#fff;padding:7px;font-size:8px;color:var(--onko-ink);width:100%;box-sizing:border-box}
      .doctor-complete-progress{display:flex;align-items:center;gap:7px;min-width:100px}.doctor-complete-progress i{display:block;width:70px;height:5px;border-radius:99px;background:var(--onko-teal)}.doctor-complete-progress span{margin:0!important}
      .doctor-complete-alert{display:inline-flex!important;width:max-content;padding:4px 7px;border-radius:99px;background:#fff0f1;color:var(--onko-red)!important;font-weight:700}
      .doctor-complete-ok{color:#2f6e57!important;font-weight:700}
      .doctor-complete-form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0}
      .doctor-complete-form-grid form{border:1px solid var(--onko-line);border-radius:8px;padding:12px;display:grid;gap:7px}.doctor-complete-form-grid h3{margin:0 0 3px;font-size:10px}
      .doctor-complete-thread{border:1px solid var(--onko-line);border-radius:8px;padding:12px;margin-top:10px}.doctor-complete-thread>div:first-child{display:flex;justify-content:space-between;gap:12px}.doctor-complete-thread>div:first-child span{font-size:8px;color:var(--onko-muted)}
      .doctor-complete-messages{margin:10px 0;padding:8px;background:#f7faf9;border-radius:6px}.doctor-complete-messages p{margin:5px 0;font-size:8px;line-height:1.45}
      .doctor-complete-actions{display:grid;grid-template-columns:130px 1fr auto;gap:7px}.doctor-complete-actions select{width:auto}
      .doctor-complete-note-form{display:grid;gap:8px;max-width:720px;margin:14px 0}.doctor-complete-version-box,.doctor-report-assistant,.doctor-clinical-review{border:1px solid var(--onko-line);border-radius:8px;padding:12px;margin:14px 0;display:grid;gap:8px}.doctor-complete-version-box>div:first-child{display:grid;gap:3px}.doctor-complete-version-box>div:first-child span{font-size:8px;color:var(--onko-muted)}.doctor-version-pill{display:inline-block!important;width:max-content!important;padding:5px 7px;margin:3px;border-radius:99px;background:var(--onko-teal-soft);font-size:7px!important;color:var(--onko-teal)!important}.doctor-report-result,.doctor-clinical-review{line-height:1.5}.doctor-report-result h4,.doctor-clinical-review h3{font-size:9px;margin:10px 0 3px}.doctor-report-result li,.doctor-clinical-review li{font-size:8px;margin:4px 0}.doctor-report-assistant textarea{width:100%;box-sizing:border-box}.doctor-complete-note-list{display:grid;gap:8px}.doctor-complete-note-list article{border:1px solid var(--onko-line);border-radius:8px;padding:11px}.doctor-complete-note-list time{float:right;font-size:7px;color:var(--onko-muted)}.doctor-complete-note-list p{white-space:pre-wrap;font-size:8px;line-height:1.55;color:#53666a}
      @media(max-width:900px){.doctor-complete-form-grid{grid-template-columns:1fr 1fr}}@media(max-width:650px){.doctor-complete-head{flex-direction:column}.doctor-complete-form-grid{grid-template-columns:1fr}.doctor-complete-actions{grid-template-columns:1fr}.doctor-complete-tabs{max-width:100%}}
    `}
    </style>
  </section>;
}
