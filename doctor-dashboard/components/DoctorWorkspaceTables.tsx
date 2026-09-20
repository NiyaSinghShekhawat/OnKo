"use client";

import { useEffect, useMemo, useState } from "react";
import { authenticatedFetch } from "@/lib/api/authenticatedFetch";
import type { Patient } from "@/types/patient";

type Row = Record<string, any>;
type WorkspaceData = {
  patients: Patient[];
  appointments: Row[];
  medicines: Row[];
  procedures: Row[];
  reports: Row[];
  queries: Row[];
  milestones: Row[];
  caregivers: Row[];
  sosEvents: Row[];
  auditLogs: Row[];
};

const phase: Record<string, string> = {
  "active-treatment": "Active treatment",
  "remission-survivorship": "Remission / survivorship",
  relapse: "Relapse",
  "transfer-of-care": "Transfer of care",
  "palliative-end-of-life": "Palliative / end-of-life",
  deceased: "Deceased",
};

function date(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

function patientName(patients: Patient[], id: string) {
  return patients.find((p) => p.patientId === id)?.name ?? id;
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="doctor-workspace-table-wrap">
      <table className="doctor-workspace-table">
        <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Section({ id, eyebrow, title, description, children, count }: { id: string; eyebrow: string; title: string; description: string; children: React.ReactNode; count?: number }) {
  return (
    <section id={id} className="doctor-card doctor-workspace-section">
      <div className="doctor-workspace-section-heading">
        <div>
          <span className="doctor-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {count !== undefined && <span className="doctor-neutral-pill">{count} records</span>}
      </div>
      {children}
    </section>
  );
}

export default function DoctorWorkspaceTables() {
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryFilter, setQueryFilter] = useState("all");
  const [carePlanFilter, setCarePlanFilter] = useState("all");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const response = await authenticatedFetch("/api/doctor/workspace");
      if (!response.ok) throw new Error("Workspace request failed.");
      setData((await response.json()).data);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Unable to load workspace tables.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function updateQuery(queryId: string, status: string) {
    try {
      const response = await authenticatedFetch("/api/doctor/queries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ queryId, status }) });
      if (!response.ok) throw new Error("Query update failed.");
      setMessage("Query status updated.");
      await load();
    } catch { setMessage("Unable to update query."); }
  }

  async function updateReport(reportId: string) {
    try {
      const response = await authenticatedFetch("/api/doctor/reports", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId, notes: "Reviewed in Doctor Command Center." }) });
      if (!response.ok) throw new Error("Report review failed.");
      setMessage("Report marked reviewed.");
      await load();
    } catch { setMessage("Unable to review report."); }
  }

  async function updateSOS(sosId: string, status: "acknowledged" | "resolved") {
    try {
      const response = await authenticatedFetch("/api/doctor/sos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sosId, status }) });
      if (!response.ok) throw new Error("SOS update failed.");
      setMessage(`SOS ${status}.`);
      await load();
    } catch { setMessage("Unable to update SOS event."); }
  }

  const queries = useMemo(() => data?.queries.filter((q) => queryFilter === "all" || q.status === queryFilter) ?? [], [data, queryFilter]);
  const carePlanRows = useMemo(() => {
    if (!data) return [];
    const rows = [
      ...data.milestones.map((x) => ({ type: "Milestone", patientId: x.patientId, name: x.title, status: x.status, date: x.dueDate, detail: x.description ?? "Care milestone" })),
      ...data.medicines.map((x) => ({ type: "Medicine", patientId: x.patientId, name: x.name, status: x.status, date: x.endDate ?? x.startDate, detail: `${x.dosage} · ${x.frequency}` })),
      ...data.procedures.map((x) => ({ type: "Procedure", patientId: x.patientId, name: x.name, status: x.status, date: x.date, detail: x.purpose ?? x.reason ?? "Care procedure" })),
    ];
    return carePlanFilter === "all" ? rows : rows.filter((x) => x.type.toLowerCase() === carePlanFilter);
  }, [data, carePlanFilter]);

  if (loading) return <section className="doctor-page"><div className="doctor-card doctor-directory-state">Loading doctor workspace tables…</div></section>;
  if (error || !data) return <section className="doctor-page"><div className="doctor-card doctor-directory-state doctor-directory-error">{error || "No workspace data."}</div></section>;

  return (
    <section className="doctor-page doctor-workspace-tables">
      {message && <div className="doctor-workspace-toast">{message}</div>}

      <Section id="patients" eyebrow="Cohort comparison" title="Patient Management" description="Compare your assigned patients side-by-side by care phase, journey progress and diagnosis." count={data.patients.length}>
        <Table headers={["Patient", "Age", "Diagnosis / care", "Phase", "Journey", "Updated"]}>
          {data.patients.map((p) => (
            <tr key={p.patientId}>
              <td><strong>{p.name}</strong><span>{p.patientId}</span></td>
              <td>{p.age ?? "—"}</td>
              <td>{p.diagnosisLabel ?? "—"}</td>
              <td><span className="doctor-table-pill">{phase[p.currentCarePhase] ?? p.currentCarePhase}</span></td>
              <td><div className="doctor-table-progress"><i style={{ width: `${Math.max(0, Math.min(100, p.journeyProgress))}%` }} /><span>{p.journeyProgress}%</span></div></td>
              <td>{date(p.lastUpdatedAt)}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section id="queries" eyebrow="Communication queue" title="Queries / Triage" description="Review patient questions and move conversations through open, answered and resolved states." count={queries.length}>
        <div className="doctor-workspace-filter"><select value={queryFilter} onChange={(e) => setQueryFilter(e.target.value)}><option value="all">All statuses</option><option value="open">Open</option><option value="answered">Answered</option><option value="resolved">Resolved</option></select></div>
        <Table headers={["Patient", "Subject", "Latest message", "Updated", "Status", "Action"]}>
          {queries.map((q) => {
            const last = q.messages?.[q.messages.length - 1];
            return <tr key={q.queryId}><td><strong>{patientName(data.patients, q.patientId)}</strong><span>{q.patientId}</span></td><td>{q.subject}</td><td className="doctor-table-message">{last?.message ?? "—"}</td><td>{date(q.updatedAt)}</td><td><span className="doctor-table-pill">{q.status}</span></td><td><select value={q.status} onChange={(e) => void updateQuery(q.queryId, e.target.value)}><option value="open">Open</option><option value="answered">Answered</option><option value="resolved">Resolved</option></select></td></tr>;
          })}
        </Table>
      </Section>

      <Section id="reports" eyebrow="Clinical documents" title="Reports" description="Track uploaded reports across the cohort and mark documents as reviewed by the care team." count={data.reports.length}>
        <Table headers={["Patient", "Report", "Type", "Uploaded", "Status", "Action"]}>
          {data.reports.map((r) => <tr key={r.reportId}><td><strong>{patientName(data.patients, r.patientId)}</strong><span>{r.patientId}</span></td><td>{r.title}</td><td>{r.reportType ?? "—"}</td><td>{date(r.uploadedAt)}</td><td><span className="doctor-table-pill">{r.status}</span></td><td>{r.status === "reviewed" ? <span className="doctor-table-ok">Reviewed</span> : <button className="doctor-table-action" onClick={() => void updateReport(r.reportId)}>Mark reviewed</button>}</td></tr>)}
        </Table>
      </Section>

      <Section id="care-plans" eyebrow="Treatment operations" title="Care Plans" description="Unified view of milestones, medicines and procedures so the doctor can compare active care work across patients." count={carePlanRows.length}>
        <div className="doctor-workspace-filter"><select value={carePlanFilter} onChange={(e) => setCarePlanFilter(e.target.value)}><option value="all">All care items</option><option value="milestone">Milestones</option><option value="medicine">Medicines</option><option value="procedure">Procedures</option></select></div>
        <Table headers={["Patient", "Type", "Care item", "Detail", "Date", "Status"]}>
          {carePlanRows.map((x, i) => <tr key={`${x.type}-${x.patientId}-${x.name}-${i}`}><td><strong>{patientName(data.patients, x.patientId)}</strong></td><td>{x.type}</td><td>{x.name}</td><td>{x.detail}</td><td>{date(x.date)}</td><td><span className="doctor-table-pill">{x.status}</span></td></tr>)}
        </Table>
      </Section>

      <Section id="caregivers" eyebrow="Support network" title="Caregivers" description="Compare caregiver access and permissions for patients in the assigned cohort." count={data.caregivers.length}>
        <Table headers={["Patient", "Caregiver", "Relationship", "Contact", "Access", "Permissions"]}>
          {data.caregivers.map((c) => <tr key={c.caregiverId}><td>{patientName(data.patients, c.patientId)}</td><td><strong>{c.name}</strong></td><td>{c.relationship}</td><td>{c.contact ?? "—"}</td><td><span className="doctor-table-pill">{c.accessStatus}</span></td><td>{Array.isArray(c.permissions) ? c.permissions.join(", ") : "—"}</td></tr>)}
        </Table>
      </Section>

      <Section id="audit" eyebrow="Safety & accountability" title="Audit / Emergency" description="Safety events and key workflow actions are visible together for rapid review and traceability." count={data.sosEvents.length + data.auditLogs.length}>
        <div className="doctor-subsection-title">Emergency / SOS queue</div>
        <Table headers={["Patient", "Status", "Message", "Triggered", "Action"]}>
          {data.sosEvents.length ? data.sosEvents.map((s) => <tr key={s.sosId}><td><strong>{patientName(data.patients, s.patientId)}</strong><span>{s.patientId}</span></td><td><span className="doctor-table-pill doctor-table-pill-alert">{s.status}</span></td><td>{s.message ?? "Patient-triggered safety event"}</td><td>{date(s.createdAt)}</td><td>{s.status === "triggered" ? <><button className="doctor-table-action" onClick={() => void updateSOS(s.sosId, "acknowledged")}>Acknowledge</button>{" "}<button className="doctor-table-action" onClick={() => void updateSOS(s.sosId, "resolved")}>Resolve</button></> : s.status === "acknowledged" ? <button className="doctor-table-action" onClick={() => void updateSOS(s.sosId, "resolved")}>Resolve</button> : <span className="doctor-table-ok">Resolved</span>}</td></tr>) : <tr><td colSpan={5}>No SOS events.</td></tr>}
        </Table>
        <div className="doctor-subsection-title">Recent audit trail</div>
        <Table headers={["Time", "Patient", "Action", "Entity", "Actor"]}>
          {data.auditLogs.slice().sort((a,b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 20).map((log, i) => <tr key={log.auditId ?? i}><td>{date(log.createdAt)}</td><td>{patientName(data.patients, log.patientId)}</td><td>{log.action}</td><td>{log.entityType}</td><td>{log.actorRole}</td></tr>)}
        </Table>
      </Section>
    </section>
  );
}
