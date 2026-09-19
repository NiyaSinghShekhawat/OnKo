"use client";

import { useState } from "react";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import type { Caregiver } from "@/types/caregiver";

const initialCaregiver: Caregiver = {
  caregiverId: "CG-001",
  patientId: "ONK-0821",
  name: "Meera Sharma",
  relationship: "Mother",
  email: "meera@example.com",
  accessStatus: "active",
};

export default function CaregiverPage() {
  const [caregiver, setCaregiver] = useState<Caregiver>(initialCaregiver);
  const [inviteSent, setInviteSent] = useState(false);

  function switchAccess() {
    setCaregiver((current) => ({
      ...current,
      accessStatus: current.accessStatus === "active" ? "revoked" : "active",
    }));
  }

  return (
    <PatientShell>
      <main className="onko-page">
        <section className="patient-card">
          <span className="patient-eyebrow">CAREGIVER & ACCESS</span>
          <h1 className="onko-page-title">Manage trusted support</h1>
          <p className="onko-page-subtitle">
            Invite a caregiver and control access to your care-journey information.
          </p>
        </section>

        <section className="caregiver-flow">
          <article className="patient-card caregiver-card">
            <div className="patient-card-heading">
              <div>
                <span className="patient-eyebrow">CURRENT CAREGIVER</span>
                <h2 className="journey-section-title">{caregiver.name}</h2>
              </div>
              <span className={`clinical-status clinical-status--${caregiver.accessStatus === "active" ? "done" : "scheduled"}`}>
                {caregiver.accessStatus === "active" ? "Access active" : "Access revoked"}
              </span>
            </div>

            <div className="caregiver-details">
              <div><span>RELATIONSHIP</span><strong>{caregiver.relationship}</strong></div>
              <div><span>EMAIL</span><strong>{caregiver.email}</strong></div>
              <div><span>ACCESS</span><strong>Care-journey coordination</strong></div>
            </div>

            <div className="caregiver-actions">
              <button type="button" className="caregiver-secondary" onClick={switchAccess}>
                {caregiver.accessStatus === "active" ? "Revoke access" : "Restore access"}
              </button>
            </div>
          </article>

          <article className="patient-card caregiver-card">
            <span className="patient-eyebrow">INVITE</span>
            <h2 className="journey-section-title">Invite another caregiver</h2>
            <p className="onko-page-subtitle">
              An invited person must provide consent before access is assigned.
            </p>
            <button type="button" className="caregiver-primary" onClick={() => setInviteSent(true)}>
              {inviteSent ? "Invitation sent" : "Send caregiver invitation"}
            </button>
          </article>
        </section>

        <section className="patient-card">
          <span className="patient-eyebrow">ACCESS FLOW</span>
          <div className="caregiver-steps">
            {["Invite", "Consent", "Assign", "Coordinate", "Switch"].map((step, index) => (
              <div className="caregiver-step" key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="patient-safety-alert">
          <span className="patient-alert-icon">i</span>
          <div>
            <strong>Consent-controlled access</strong>
            <span>
              Caregiver access is controlled by consent and can be revoked. Caregiver
              access does not replace the patient's or clinician's authority.
            </span>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
