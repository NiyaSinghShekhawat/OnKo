import type { Appointment } from "@/types/appointment";

export async function fetchAppointments(): Promise<Appointment[]> {
  const response = await fetch("/api/appointments", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load appointments.");
  const payload = await response.json();
  return payload.data as Appointment[];
}
