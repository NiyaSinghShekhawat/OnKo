import { PatientShell } from "@/patient-dashboard/components/PatientShell";

export default function PatientPage() {
  return (
    <PatientShell>
      <main className="onko-page">
        <h1 className="onko-page-title">Welcome back, Ananya</h1>
        <p className="onko-page-subtitle">
          Your clinical care journey, today&apos;s schedule, and care-team tasks.
        </p>

        <section className="onko-placeholder" aria-label="Patient dashboard foundation">
          <strong>Patient Portal Foundation</strong>
          <p className="onko-page-subtitle">
            The dashboard shell is ready. Patient Home cards and care-journey data will be added in the next sub-phase.
          </p>

          <div className="onko-placeholder-grid">
            <div className="onko-placeholder-card">
              <strong>Today&apos;s Care</strong>
              <p className="onko-page-subtitle">Appointments, doses and daily check-ins.</p>
            </div>
            <div className="onko-placeholder-card">
              <strong>Care Journey</strong>
              <p className="onko-page-subtitle">Milestones, progress and current phase.</p>
            </div>
            <div className="onko-placeholder-card">
              <strong>Care Team</strong>
              <p className="onko-page-subtitle">Doctor updates, queries and support.</p>
            </div>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
