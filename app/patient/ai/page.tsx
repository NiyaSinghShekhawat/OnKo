"use client";
import PatientAICompanion from "@/patient-dashboard/components/PatientAICompanion";
import {PatientShell} from "@/patient-dashboard/components/PatientShell";
export default function PatientAIPage(){return <PatientShell><main className="onko-page"><PatientAICompanion/><section className="patient-safety-alert"><span className="patient-alert-icon">i</span><div><strong>Need medical advice?</strong><span>Use Ask Care Team for questions requiring your clinician's judgment. Use SOS for urgent support.</span></div></section></main></PatientShell>;}