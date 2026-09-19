import { PatientShell } from "@/patient-dashboard/components/PatientShell";

const medicines = [
  {
    name: "Ondansetron",
    dosage: "4 mg",
    frequency: "Twice daily",
    instructions: "After breakfast and after dinner",
    sideEffects: "Headache, constipation",
    dates: "Jun 24 – Jul 15, 2026",
    status: "Active",
  },
  {
    name: "Pantoprazole",
    dosage: "40 mg",
    frequency: "Once daily",
    instructions: "Before breakfast",
    sideEffects: "Headache, stomach discomfort",
    dates: "Jun 24 – Jul 15, 2026",
    status: "Active",
  },
  {
    name: "Dexamethasone",
    dosage: "4 mg",
    frequency: "As directed",
    instructions: "Follow the schedule provided by your care team",
    sideEffects: "Increased appetite, sleep disturbance",
    dates: "Jun 24 – Jun 27, 2026",
    status: "Completed",
  },
];

export default function MedicinesPage() {
  return (
    <PatientShell>
      <main className="onko-page">
        <section className="patient-card">
          <span className="patient-eyebrow">MY MEDICINES</span>
          <h1 className="onko-page-title">Medication schedule</h1>
          <p className="onko-page-subtitle">
            Medicines assigned by your care team, including dosage and instructions.
          </p>
        </section>

        <section className="medicine-grid">
          {medicines.map((medicine) => (
            <article className="patient-card medicine-card" key={medicine.name}>
              <div className="patient-card-heading">
                <div className="medicine-title">
                  <div className="clinical-icon">＋</div>
                  <div>
                    <h2>{medicine.name}</h2>
                    <span>{medicine.dosage} · {medicine.frequency}</span>
                  </div>
                </div>
                <span className={`clinical-status clinical-status--${medicine.status === "Active" ? "done" : "scheduled"}`}>
                  {medicine.status}
                </span>
              </div>

              <div className="medicine-detail">
                <span className="patient-eyebrow">INSTRUCTIONS</span>
                <p>{medicine.instructions}</p>
              </div>
              <div className="medicine-detail">
                <span className="patient-eyebrow">PRESCRIBED PERIOD</span>
                <p>{medicine.dates}</p>
              </div>
              <div className="medicine-detail">
                <span className="patient-eyebrow">RECORDED SIDE EFFECTS</span>
                <p>{medicine.sideEffects}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="patient-safety-alert">
          <span className="patient-alert-icon">i</span>
          <div>
            <strong>Medicine information</strong>
            <span>
              Dosage and instructions shown here come from your care team. Do not
              change a prescribed medicine based on this page; contact your care team
              with questions.
            </span>
          </div>
        </section>
      </main>
    </PatientShell>
  );
}
