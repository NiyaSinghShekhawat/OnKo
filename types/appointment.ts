export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "missed";

export interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  status: AppointmentStatus;
  instructions?: string;
}
