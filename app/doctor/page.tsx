"use client";
import { useState } from "react";
import DoctorSidebar from "@/doctor-dashboard/components/DoctorSidebar";
import DoctorHeader from "@/doctor-dashboard/components/DoctorHeader";
import DoctorOverviewFoundation from "@/doctor-dashboard/components/DoctorOverviewFoundation";
import DoctorPatientManagement from "@/doctor-dashboard/components/DoctorPatientManagement";
import DoctorPatient360 from "@/doctor-dashboard/components/DoctorPatient360";
export default function DoctorPage() {
  const [patientId, setPatientId] = useState<string | null>(null);
  return <div className="doctor-shell"><DoctorSidebar/><main className="doctor-main"><DoctorHeader/>{patientId ? <DoctorPatient360 patientId={patientId} onBack={()=>setPatientId(null)}/> : <><DoctorOverviewFoundation/><DoctorPatientManagement onOpenPatient={setPatientId}/></>}</main></div>;
}
