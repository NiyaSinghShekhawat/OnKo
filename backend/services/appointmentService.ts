import type { Appointment } from "@/types/appointment";
import { getDocument, listDocuments } from "../firebase/firestore";

export function getAppointment(appointmentId: string) {
  return getDocument<Appointment>("appointments", appointmentId);
}

export function listAppointments() {
  return listDocuments<Appointment>("appointments");
}
