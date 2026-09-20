import { LiveDoctorUpdateCard } from "@/patient-dashboard/components/LiveDoctorUpdateCard";
import { PatientShell } from "@/patient-dashboard/components/PatientShell";
import { QuickNavigation } from "@/patient-dashboard/components/QuickNavigation";
import { SafetyAlert } from "@/patient-dashboard/components/SafetyAlert";
import { TodayCare } from "@/patient-dashboard/components/TodayCare";
import { WelcomeCard } from "@/patient-dashboard/components/WelcomeCard";

export default function PatientPage(){return <PatientShell><main className="onko-page"><WelcomeCard/><LiveDoctorUpdateCard/><TodayCare/><SafetyAlert/><QuickNavigation/></main></PatientShell>;}
