import { Suspense } from "react";
import DoctorCompleteWorkspace from "@/doctor-dashboard/components/DoctorCompleteWorkspace";

function LoadingWorkspace() {
  return <main className="doctor-page"><div className="doctor-card doctor-directory-state">Loading doctor workspace…</div></main>;
}

export default function DoctorWorkspacePage() {
  return <Suspense fallback={<LoadingWorkspace />}><DoctorCompleteWorkspace /></Suspense>;
}
