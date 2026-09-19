"use client";

import { useEffect, useState } from "react";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import PatientReportUpload from "@/patient-dashboard/components/PatientReportUpload";
import { usePatientContext } from "@/app/patient/data-provider";
import type { Report } from "@/types/report";
import { getReportAccessUrl } from "@/lib/api/reportAccess";

export default function ReportsPage() {
  const [openingReport, setOpeningReport] = useState<string | null>(null);
  const { reports: loadedReports, loading, error } = usePatientContext();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => setReports(loadedReports), [loadedReports]);

  const addReport = (report: Report) => setReports((current) => [report, ...current.filter((item) => item.reportId !== report.reportId)]);

  return <PatientShell><main className="onko-page">
    <section className="patient-card"><div className="patient-card-heading"><div><span className="patient-eyebrow">REPORTS & RECORDS</span><h1 className="onko-page-title">Your clinical records</h1><p className="onko-page-subtitle">Reports uploaded to your care record and their review status.</p></div></div></section>
    <PatientReportUpload onUploaded={addReport} />
    <section className="patient-card"><div className="patient-card-heading"><div><span className="patient-eyebrow">DOCUMENT LIBRARY</span><h2 className="journey-section-title">Available records</h2></div><span className="patient-time">{reports.length} records</span></div>
      {error ? <p className="patient-muted">{error}</p> : reports.length ? <div className="report-list">{reports.map((r)=><article className="report-item" key={r.reportId}><div className="report-file-icon">{r.fileName.toLowerCase().endsWith(".pdf") ? "PDF" : "IMG"}</div><div className="report-main"><div className="report-title-row"><div><h3>{r.title}</h3><span>{r.reportType ?? "Record"} · {new Date(r.uploadedAt).toLocaleString()}</span></div><span className={`clinical-status clinical-status--${r.status === "reviewed" ? "done" : "scheduled"}`}>{r.status === "reviewed" ? "Reviewed" : "Uploaded"}</span></div><p>{r.fileName}</p>{r.notes && <span className="report-note">{r.notes}</span>}</div><button type="button" className="report-view-button" disabled={!r.storagePath || openingReport === r.reportId} onClick={async () => { try { setOpeningReport(r.reportId); const url = await getReportAccessUrl(r.reportId); window.open(url, "_blank", "noopener,noreferrer"); } catch (e) { window.alert(e instanceof Error ? e.message : "Unable to open report."); } finally { setOpeningReport(null); } }}>{openingReport === r.reportId ? "Opening…" : "View"}</button></article>)}</div> : <p className="patient-muted">{loading ? "Loading records…" : "No reports have been uploaded yet."}</p>}
    </section>
    <section className="patient-safety-alert"><span className="patient-alert-icon">i</span><div><strong>Report information</strong><span>Records are shown as uploaded or reviewed by your care team. OnKo does not independently interpret medical reports or provide a diagnosis.</span></div></section>
  </main></PatientShell>;
}
