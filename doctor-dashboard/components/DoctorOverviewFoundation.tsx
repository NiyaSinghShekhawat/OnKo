const overviewCards = [
  { label: "Total patients", value: "—", detail: "Connected patient cohort" },
  { label: "Today appointments", value: "—", detail: "Scheduled care activities" },
  { label: "Pending queries", value: "—", detail: "Patient conversations needing review" },
  { label: "Human review", value: "—", detail: "Signals awaiting clinician review" },
];

const queueItems = [
  ["Patient directory", "Search and open longitudinal patient records."],
  ["Today's appointments", "Review scheduled encounters and follow-up context."],
  ["Patient queries", "See conversations that require a care-team response."],
  ["Review queue", "Review AI summaries and non-clinical engagement signals before action."],
];

export default function DoctorOverviewFoundation() {
  return (
    <section className="doctor-page">
      <div className="doctor-welcome-card">
        <div>
          <span className="doctor-eyebrow">Care-team overview</span>
          <h2>One workspace for the longitudinal care journey.</h2>
          <p>
            This foundation will connect the doctor experience to the same
            patient data already powering the Patient Dashboard.
          </p>
        </div>
        <div className="doctor-flow-badge">Shared patient data</div>
      </div>

      <div className="doctor-metric-grid">
        {overviewCards.map((card) => (
          <article className="doctor-card doctor-metric-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.detail}</small>
          </article>
        ))}
      </div>

      <div className="doctor-content-grid">
        <article className="doctor-card">
          <div className="doctor-card-heading">
            <div>
              <span className="doctor-eyebrow">Attention workspace</span>
              <h2>Review areas</h2>
            </div>
            <span className="doctor-neutral-pill">Foundation</span>
          </div>

          <div className="doctor-review-list">
            {queueItems.map(([title, description], index) => (
              <div className="doctor-review-item" key={title}>
                <div className="doctor-review-number">{index + 1}</div>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="doctor-card doctor-ai-card">
          <span className="doctor-eyebrow">AI workflow</span>
          <h2>AI supports review, not clinical decisions.</h2>
          <div className="doctor-ai-flow">
            <span>Patient data</span>
            <b>→</b>
            <span>Neural AI</span>
            <b>→</b>
            <span>Evidence / signal</span>
            <b>→</b>
            <span>Doctor review</span>
          </div>
          <p>
            The next doctor phases will attach real Firestore-backed data and
            review workflows to this shell.
          </p>
        </article>
      </div>
    </section>
  );
}
