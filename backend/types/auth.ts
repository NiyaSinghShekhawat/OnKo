export type UserRole = "patient" | "doctor" | "admin" | "caregiver";

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  patientId?: string;
  doctorId?: string;
  caregiverId?: string;
}
