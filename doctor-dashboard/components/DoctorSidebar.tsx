import type { DoctorNavEntry } from "../types/doctor";

const navItems: DoctorNavEntry[] = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "patients", label: "Patient Management", icon: "♙" },
  { id: "queries", label: "Queries / Triage", icon: "?" },
  { id: "reports", label: "Reports", icon: "▤" },
  { id: "care-plans", label: "Care Plans", icon: "✓" },
  { id: "alerts", label: "Alerts & Signals", icon: "!" },
  { id: "caregivers", label: "Caregivers", icon: "♧" },
  { id: "audit", label: "Audit / Emergency", icon: "◈" },
];

export default function DoctorSidebar() {
  return (
    <aside className="doctor-sidebar">
      <div className="doctor-brand">
        <div className="doctor-brand-mark">O</div>
        <div>
          <div className="doctor-brand-name">OnKo</div>
          <div className="doctor-brand-subtitle">Care coordination</div>
        </div>
      </div>

      <div className="doctor-section-label">Doctor workspace</div>

      <nav className="doctor-sidebar-nav" aria-label="Doctor dashboard">
        {navItems.map((item, index) => (
          <a
            key={item.id}
            href={item.id === "overview" ? "/doctor" : `#${item.id}`}
            className={`doctor-sidebar-link${index === 0 ? " active" : ""}`}
          >
            <span className="doctor-sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="doctor-security">
        <strong>Human-in-the-loop</strong>
        <span>
          AI surfaces summaries and non-clinical signals. Clinical decisions
          remain with the care team.
        </span>
      </div>
    </aside>
  );
}
