export type DoctorNavItem =
  | "overview"
  | "patients"
  | "queries"
  | "reports"
  | "care-plans"
  | "alerts"
  | "caregivers"
  | "audit";

export interface DoctorNavEntry {
  id: DoctorNavItem;
  label: string;
  icon: string;
}
