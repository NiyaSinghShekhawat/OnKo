export default function DoctorHeader() {
  return (
    <header className="doctor-topbar">
      <div>
        <div className="doctor-breadcrumb">
          OnKo <span>/</span> <strong>Doctor Overview</strong>
        </div>
        <h1>Doctor Command Center</h1>
        <p>Review your care team workload and patient activity.</p>
      </div>

      <div className="doctor-header-actions">
        <button className="doctor-icon-button" type="button" aria-label="Notifications">
          ♢
        </button>
        <div className="doctor-identity">
          <div className="doctor-avatar">DR</div>
          <div>
            <strong>Doctor workspace</strong>
            <span>Care team</span>
          </div>
        </div>
      </div>
    </header>
  );
}
