import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import type { Report } from "@/types/report";

const reports: Report[] = [
  { reportId: "REP-001", patientId: "ONK-0821", title: "Complete Blood Count", reportType: "Laboratory", uploadedAt: "Jul 10, 2026", fileName: "cbc-july-10.pdf", status: "reviewed", notes: "Reviewed by the care team." },
  { reportId: "REP-002", patientId: "ONK-0821", title: "Treatment Imaging Record", reportType: "Imaging", uploadedAt: "Jul 08, 2026", fileName: "imaging-july-08.pdf", status: "reviewed", notes: "Record available in the patient file." },
  { reportId: "REP-003", patientId: "ONK-0821", title: "Biochemistry Panel", reportType: "Laboratory", uploadedAt: "Jul 05, 2026", fileName: "biochemistry-july-05.pdf", status: "uploaded" },
];

export default function ReportsPage() {
  return (
    <PatientShell>
      <main className="onko-page">
        <section className="patient-card">
          <div className="patient-card-heading">
            <div>
              <span className="patient-eyebrow">REPORTS & RECORDS</span>
              <h1 className="onko-page-title">Your clinical records</h1>
              <p className="onko-page-subtitle">Reports uploaded to your care record and their review status.</p>
            </div>
            <label className="report-upload-button">
              <span>＋ Upload record</span>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" />
            </label>
          </div>
        </section>

        <section className="patient-card">
          <div className="patient-card-heading">
            <div>
              <span className="patient-eyebrow">DOCUMENT LIBRARY</span>
              <h2 className="journey-section-title">Available records</h2>
            </div>
            <span className="patient-time">{reports.length} records</span>
          </div>
          <div className="report-list">
            {reports.map((report) => (
              <article className="report-item" key={report.reportId}>
                <div className="report-file-icon">PDF</div>
                <div className="report-main">
                  <div className="report-title-row">
                    <div><h3>{report.title}</h3><span>{report.reportType} · {report.uploadedAt}</span></div>
                    <span className={`clinical-status clinical-status--${report.status === "reviewed" ? "done" : "scheduled"}`}>{report.status === "reviewed" ? "Reviewed" : "Uploaded"}</span>
                  </div>
                  <p>{report.fileName}</p>
                  {report.notes && <span className="report-note">{report.notes}</span>}
                </div>
                <button type="button" className="report-view-button">View</button>
              </article>
            ))}
          </div>
        </section>

        <section className="patient-safety-alert">
          <span className="patient-alert-icon">i</span>
          <div><strong>Report information</strong><span>Records are shown as uploaded or reviewed by your care team. OnKo does not independently interpret medical reports or provide a diagnosis.</span></div>
        </section>
      </main>
    </PatientShell>
  );
}
