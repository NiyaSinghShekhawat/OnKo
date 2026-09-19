"use client";

import { useState } from "react";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";

const notifications = [
  { title: "Appointment reminder", detail: "Your next clinical visit is scheduled for Jul 18, 2026 at 10:30 AM.", time: "Today", unread: true },
  { title: "Care team update", detail: "Dr. S. Kulkarni added an update to your care journey.", time: "Yesterday", unread: true },
  { title: "Medicine reminder", detail: "Your evening medicine reminder is ready.", time: "Yesterday", unread: false },
];

export default function NotificationsPage() {
  const [sosOpen, setSosOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <PatientShell>
      <main className="onko-page">
        <section className="patient-card">
          <span className="patient-eyebrow">NOTIFICATIONS & SAFETY</span>
          <h1 className="onko-page-title">Updates and safety support</h1>
          <p className="onko-page-subtitle">
            Care-team updates, reminders and the SOS entry point for urgent situations.
          </p>
        </section>

        <section className="notification-grid">
          <div className="patient-card">
            <div className="patient-card-heading">
              <div>
                <span className="patient-eyebrow">UPDATES</span>
                <h2 className="journey-section-title">Recent notifications</h2>
              </div>
              <span className="patient-time">{notifications.length} updates</span>
            </div>
            <div className="notification-list">
              {notifications.map((item) => (
                <article className={`notification-item${item.unread ? " unread" : ""}`} key={item.title}>
                  <div className="notification-dot" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <span>{item.time}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <section className="sos-card">
            <span className="patient-eyebrow">URGENT SUPPORT</span>
            <h2>Need immediate help?</h2>
            <p>
              Use SOS to alert the designated care contact configured for your care journey.
            </p>
            {!sosOpen ? (
              <button type="button" className="sos-button" onClick={() => setSosOpen(true)}>
                Open SOS
              </button>
            ) : (
              <div className="sos-confirm">
                <strong>Confirm SOS alert</strong>
                <span>This is for urgent situations requiring immediate care-team escalation.</span>
                <div>
                  <button type="button" className="sos-confirm-button" onClick={() => setSent(true)}>
                    {sent ? "Alert sent" : "Send SOS alert"}
                  </button>
                  {!sent && <button type="button" className="sos-cancel-button" onClick={() => setSosOpen(false)}>Cancel</button>}
                </div>
              </div>
            )}
          </section>
        </section>

        <section className="patient-safety-alert">
          <span className="patient-alert-icon">i</span>
          <div>
            <strong>Safety boundary</strong>
            <span>
              OnKo does not diagnose or determine clinical urgency. SOS escalation follows the care team's configured workflow; for a life-threatening emergency, use local emergency services.
            </span>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
