export type MedicineStatus = "active" | "completed" | "cancelled";

export interface Medicine {
  medicineId: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  sideEffects?: string[];
  startDate: string;
  endDate?: string;
  status: MedicineStatus;
}
