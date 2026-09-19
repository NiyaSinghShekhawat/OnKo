import type { Patient } from "@/types/patient";
import { authenticatedFetch } from "./authenticatedFetch";

export async function fetchDoctorPatients(): Promise<Patient[]> {
  const response = await authenticatedFetch("/api/doctor/patients");
  if (!response.ok) throw new Error("Unable to load doctor patients.");
  return (await response.json()).data as Patient[];
}
