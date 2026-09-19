import type { Patient } from "@/types/patient";

export async function fetchPatients(): Promise<Patient[]> {
  const response = await fetch("/api/patients", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load patients.");
  const payload = await response.json();
  return payload.data as Patient[];
}
