"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  ["Overview / Today","/patient","⌂"],["My Care Journey","/patient/care-journey","◌"],["Treatment Details","/patient/treatment","✦"],["My Medicines","/patient/medicines","＋"],["Ask Care Team","/patient/queries","?"],["Reports & Records","/patient/reports","▤"],["Caregiver & Access","/patient/caregiver","♧"],["Notifications & SOS","/patient/notifications","!"],["Community","/patient/community","◉"],
];

export function PatientSidebar() {
  const pathname=usePathname();
  return <aside className="onko-sidebar">
    <div className="onko-brand"><div className="onko-brand-mark">On</div><div className="onko-brand-copy"><div className="onko-brand-name">OnKo</div><div className="onko-brand-subtitle">CANCER CARE COMPANION</div></div></div>
    <div className="onko-section-label">Clinical Portal</div>
    <nav className="onko-sidebar-nav" aria-label="Patient navigation">
      {navigation.map(([label,href,icon])=>{const active=href==="/patient"?pathname==="/patient":pathname.startsWith(href);return <Link key={href} href={href} className={`onko-sidebar-link${active?" active":""}`}><span className="onko-sidebar-icon">{icon}</span><span>{label}</span></Link>})}
    </nav>
    <div className="onko-security"><strong>🔒 Secure clinical portal</strong><br />Access controlled by your care team</div>
  </aside>;
}
