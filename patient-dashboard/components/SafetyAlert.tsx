export function SafetyAlert() {
  return (
    <section className="patient-safety-alert" role="alert">
      <span className="patient-alert-icon">!</span>
      <div>
        <strong>Chemotherapy safety protocol</strong>
        <span>
          If your body temperature reaches 100.4°F (38°C) or above, or if
          chills, rigors or other acute symptoms occur, contact your care team
          immediately.
        </span>
      </div>
      <button className="patient-emergency-button">Emergency Call</button>
    </section>
  );
}
