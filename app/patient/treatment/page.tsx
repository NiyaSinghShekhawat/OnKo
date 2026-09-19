import { PatientShell } from "@/patient-dashboard/components/PatientShell";

const procedures = [
  { name: "Cycle 2 chemotherapy", date: "Jun 24, 2026", status: "Completed", purpose: "Scheduled treatment cycle", details: "Day-care oncology session recorded by the care team." },
  { name: "Central line review", date: "Jun 25, 2026", status: "Completed", purpose: "Post-treatment review", details: "Routine follow-up recorded in the treatment timeline." },
  { name: "Cycle 3 chemotherapy", date: "Jul 15, 2026", status: "Scheduled", purpose: "Next treatment milestone", details: "Upcoming procedure shown from the current care plan." },
];

export default function TreatmentPage() {
  return (
    <PatientShell>
      <main className="onko-page">
        <section className="patient-card">
          <span className="patient-eyebrow">TREATMENT DETAILS</span>
          <h1 className="onko-page-title">Your treatment timeline</h1>
          <p className="onko-page-subtitle">
            Procedures and treatment milestones recorded by your care team.
          </p>
        </section>

        <section className="patient-card">
          <div className="patient-card-heading">
            <div>
              <span className="patient-eyebrow">PROCEDURES</span>
              <h2 className="journey-section-title">Treatment history</h2>
            </div>
            <span className="patient-time">3 records</span>
          </div>

          <div className="clinical-list">
            {procedures.map((procedure) => (
              <article className="clinical-list-item" key={procedure.name}>
                <div className="clinical-icon">✦</div>
                <div className="clinical-main">
                  <div className="clinical-title-row">
                    <div>
                      <h3>{procedure.name}</h3>
                      <span>{procedure.date}</span>
                    </div>
                    <span className={`clinical-status clinical-status--${procedure.status === "Completed" ? "done" : "scheduled"}`}>
                      {procedure.status}
                    </span>
                  </div>
                  <p>{procedure.details}</p>
                  <div className="clinical-purpose">
                    <strong>Purpose</strong>
                    <span>{procedure.purpose}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="patient-safety-alert">
          <span className="patient-alert-icon">i</span>
          <div>
            <strong>Treatment information</strong>
            <span>
              This page displays information entered by your care team. It does not
              independently interpret treatment or recommend changes.
            </span>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
