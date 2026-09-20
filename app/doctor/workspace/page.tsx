import { Suspense } from "react";
import DoctorWorkspaceShell from "@/doctor-dashboard/components/DoctorWorkspaceShell";

function LoadingWorkspace() {
  return <main className="doctor-page"><div className="doctor-card doctor-directory-state">Loading doctor workspace…</div></main>;
}

export default function DoctorWorkspacePage() {
  return <Suspense fallback={<LoadingWorkspace />}><DoctorWorkspaceShell /></Suspense>;
}
