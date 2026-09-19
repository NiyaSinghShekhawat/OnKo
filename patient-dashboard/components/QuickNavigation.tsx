import Link from "next/link";

const shortcuts = [
  ["My Treatment", "/patient/treatment"],
  ["My Medicines", "/patient/medicines"],
  ["My Appointments", "/patient"],
  ["Ask Care Team", "/patient/queries"],
  ["My Reports Drive", "/patient/reports"],
  ["Caregiver Sharing", "/patient/caregiver"],
];

export function QuickNavigation() {
  return (
    <section className="patient-quick-nav">
      <span className="patient-eyebrow">QUICK NAVIGATION SHORTCUTS</span>
      <div>
        {shortcuts.map(([label, href]) => (
          <Link key={href} href={href} className="patient-quick-link">
            {label} ↗
          </Link>
        ))}
      </div>
      <button className="patient-sos-button">SOS Protocol</button>
    </section>
  );
}
