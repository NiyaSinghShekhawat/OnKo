export function PatientHeader() {
  return (
    <header className="onko-topbar">
      <div className="onko-breadcrumb">
        OnKo / Patient Portal / <strong>Overview</strong>
      </div>

      <div className="onko-patient-meta">
        <span className="onko-status">● Care journey active</span>
        <div className="onko-avatar" aria-label="Patient profile">AR</div>
      </div>
    </header>
  );
}
