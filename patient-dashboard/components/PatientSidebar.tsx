import Link from "next/link";

const navigation = [
  { label: "Overview / Today", href: "/patient", icon: "⌂", active: true },
  { label: "My Care Journey", href: "/patient/care-journey", icon: "◌" },
  { label: "Treatment Details", href: "/patient/treatment", icon: "✦" },
  { label: "My Medicines", href: "/patient/medicines", icon: "＋" },
  { label: "Ask Care Team", href: "/patient/queries", icon: "?" },
  { label: "Reports & Records", href: "/patient/reports", icon: "▤" },
  { label: "Caregiver & Access", href: "/patient/caregiver", icon: "♧" },
  { label: "Community", href: "/patient/community", icon: "◉" },
];

export function PatientSidebar() {
  return (
    <aside className="onko-sidebar">
      <div className="onko-brand">
        <div className="onko-brand-mark">On</div>
        <div className="onko-brand-copy">
          <div className="onko-brand-name">OnKo</div>
          <div className="onko-brand-subtitle">CANCER CARE COMPANION</div>
        </div>
      </div>

      <div className="onko-section-label">Clinical Portal</div>

      <nav className="onko-sidebar-nav" aria-label="Patient navigation">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`onko-sidebar-link${item.active ? " active" : ""}`}
          >
            <span className="onko-sidebar-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="onko-security">
        <strong>🔒 HIPAA Encrypted</strong>
        <br />
        TMC Secure Cloud
      </div>
    </aside>
  );
}
