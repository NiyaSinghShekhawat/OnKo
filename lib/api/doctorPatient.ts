import type { Patient } from "@/types/patient";
import type { Appointment } from "@/types/appointment";
import type { Medicine } from "@/types/medicine";
import type { Procedure } from "@/types/procedure";
import type { Report } from "@/types/report";
import type { Query } from "@/types/query";
import type { CareJourney } from "@/types/careJourney";
import type { Milestone } from "@/types/milestone";
import { authenticatedFetch } from "./authenticatedFetch";
export interface DoctorPatient360 { patient: Patient; appointments: Appointment[]; medicines: Medicine[]; procedures: Procedure[]; reports: Report[]; queries: Query[]; careJourneys: CareJourney[]; milestones: Milestone[]; }
export async function fetchDoctorPatient360(patientId: string): Promise<DoctorPatient360> {
  const r=await authenticatedFetch(`/api/doctor/patients/${encodeURIComponent(patientId)}`);
  if(!r.ok) throw new Error("Unable to load patient history.");
  return (await r.json()).data as DoctorPatient360;
}
