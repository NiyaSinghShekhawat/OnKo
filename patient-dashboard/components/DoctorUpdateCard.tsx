export function DoctorUpdateCard() {
  return (
    <section className="patient-card doctor-update-card">
      <div className="patient-card-heading">
        <div>
          <span className="patient-eyebrow">CLINICAL ONCOLOGIST UPDATE</span>
          <h3>Post-cycle recovery update</h3>
        </div>
        <span className="patient-time">Yesterday, 6:40 PM</span>
      </div>
      <p>
        Dr. S. Kulkarni reviewed your latest care update. Your next scheduled
        cycle remains on the current care plan.
      </p>
      <button className="patient-secondary-button">Acknowledge / Reply</button>
    </section>
  );
}
