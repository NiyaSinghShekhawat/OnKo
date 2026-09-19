import { PatientShell } from "@/patient-dashboard/components/PatientShell";

const milestones = [
  { title: "Initial oncology assessment", date: "May 08", status: "completed", detail: "Baseline assessment completed." },
  { title: "Treatment planning", date: "May 15", status: "completed", detail: "Care plan reviewed with the care team." },
  { title: "Cycle 1", date: "Jun 03", status: "completed", detail: "Treatment milestone completed." },
  { title: "Cycle 2", date: "Jun 24", status: "current", detail: "Current treatment milestone." },
  { title: "Cycle 3", date: "Jul 15", status: "upcoming", detail: "Scheduled next milestone." },
  { title: "Follow-up review", date: "Aug 05", status: "upcoming", detail: "Upcoming clinical review." },
];

const statusLabel: Record<string, string> = {
  completed: "Completed",
  current: "Current",
  upcoming: "Upcoming",
};

export default function CareJourneyPage() {
  return (
    <PatientShell>
      <main className="onko-page">
        <section className="journey-hero patient-card">
          <div>
            <span className="patient-eyebrow">MY CARE JOURNEY</span>
            <h1 className="onko-page-title">Active Treatment</h1>
            <p className="onko-page-subtitle">
              A longitudinal view of completed, current, and upcoming care milestones.
            </p>
          </div>
          <div className="journey-progress-ring" aria-label="Journey progress 68 percent">
            <strong>68%</strong>
            <span>journey progress</span>
          </div>
        </section>

        <section className="journey-summary-grid">
          <article className="patient-card">
            <span className="patient-eyebrow">CURRENT PHASE</span>
            <strong className="journey-metric">Active Treatment</strong>
            <span className="patient-muted">Clinician-controlled journey state</span>
          </article>
          <article className="patient-card">
            <span className="patient-eyebrow">MILESTONES</span>
            <strong className="journey-metric">3 / 6</strong>
            <span className="patient-muted">Completed milestones</span>
          </article>
          <article className="patient-card">
            <span className="patient-eyebrow">NEXT MILESTONE</span>
            <strong className="journey-metric">Cycle 3</strong>
            <span className="patient-muted">Scheduled for Jul 15</span>
          </article>
        </section>

        <section className="patient-card journey-timeline-card">
          <div className="patient-card-heading">
            <div>
              <span className="patient-eyebrow">CARE TIMELINE</span>
              <h2 className="journey-section-title">Your journey milestones</h2>
            </div>
            <span className="patient-time">Updated today</span>
          </div>

          <div className="journey-timeline">
            {milestones.map((milestone) => (
              <article className={`journey-item journey-item--${milestone.status}`} key={milestone.title}>
                <div className="journey-marker" aria-hidden="true">
                  {milestone.status === "completed" ? "✓" : milestone.status === "current" ? "●" : "○"}
                </div>
                <div className="journey-content">
                  <div className="journey-item-top">
                    <div>
                      <span className="journey-status">{statusLabel[milestone.status]}</span>
                      <h3>{milestone.title}</h3>
                    </div>
                    <time>{milestone.date}</time>
                  </div>
                  <p>{milestone.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="patient-safety-alert journey-note">
          <span className="patient-alert-icon">i</span>
          <div>
            <strong>About your journey</strong>
            <span>
              Milestones and care phases shown here come from your care team. This page
              tracks care-journey progress and does not make clinical decisions.
            </span>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
