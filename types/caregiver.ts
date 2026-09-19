export type CaregiverAccessStatus = "invited" | "consented" | "active" | "revoked";

export interface Caregiver {
  caregiverId: string;
  patientId: string;
  name: string;
  relationship: string;
  contact?: string;
  accessStatus: CaregiverAccessStatus;
  permissions: string[];
}
