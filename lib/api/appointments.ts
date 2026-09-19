import type { Appointment } from "@/types/appointment";
import { authenticatedFetch } from "./authenticatedFetch";
export async function fetchAppointments():Promise<Appointment[]>{const r=await authenticatedFetch("/api/appointments");if(!r.ok)throw new Error("Unable to load appointments.");return (await r.json()).data as Appointment[];}
