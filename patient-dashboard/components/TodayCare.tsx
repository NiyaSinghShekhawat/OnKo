export function TodayCare() {
  return (
    <section className="patient-today-grid">
      <article className="patient-card care-card">
        <div className="patient-card-heading">
          <div>
            <span className="patient-eyebrow">NEXT CLINICAL VISIT</span>
            <h3>Follow-up &amp; Routine Pre-Chemo Lab</h3>
          </div>
          <span className="patient-status-dot">Upcoming</span>
        </div>
        <p className="patient-muted">Tomorrow · 10:30 AM · OPD 4</p>
        <div className="patient-detail-line">CBC + LFT · Day-care OPD</div>
        <div className="patient-action-row">
          <span>Arrive 15 min early for vitals</span>
          <button className="patient-link-button">View gate pass ↗</button>
        </div>
      </article>

      <article className="patient-card care-card">
        <div className="patient-card-heading">
          <div>
            <span className="patient-eyebrow">TODAY&apos;S DOSES</span>
            <h3>1 of 2 complete</h3>
          </div>
          <span className="patient-progress-mini">50%</span>
        </div>
        <div className="dose-row">
          <div>
            <strong>Ondansetron 4 mg</strong>
            <span>07:30 AM · After breakfast</span>
          </div>
          <span className="dose-complete">✓ Taken</span>
        </div>
        <div className="dose-row">
          <div>
            <strong>Ondansetron 4 mg</strong>
            <span>07:30 PM · After dinner</span>
          </div>
          <button className="patient-outline-button">Mark taken</button>
        </div>
      </article>

      <article className="patient-card care-card">
        <div className="patient-card-heading">
          <div>
            <span className="patient-eyebrow">DAY 4 CHECK-IN</span>
            <h3>Hydration &amp; Fatigue Pulse</h3>
          </div>
          <span className="patient-time">3 mins</span>
        </div>
        <p>Tell your care team how you are doing today.</p>
        <div className="checkin-progress">
          <span style={{ width: "72%" }} />
        </div>
        <div className="patient-action-row">
          <span>Today&apos;s fluid intake target</span>
          <strong>1.8 / 2.5 L</strong>
        </div>
        <button className="patient-primary-button">Log Day + 4 Symptoms</button>
      </article>
    </section>
  );
}
