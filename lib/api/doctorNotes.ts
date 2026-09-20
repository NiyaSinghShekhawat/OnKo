import type { DoctorNote } from "@/types/doctorNote";
import { authenticatedFetch } from "./authenticatedFetch";

export async function fetchDoctorNotes(patientId: string) {
  const r = await authenticatedFetch("/api/doctor/notes?patientId=" + encodeURIComponent(patientId));
  if (!r.ok) throw new Error("Unable to load doctor notes.");
  return (await r.json()).data as DoctorNote[];
}
