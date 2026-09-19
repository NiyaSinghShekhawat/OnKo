export type MilestoneStatus = "pending" | "completed" | "overdue" | "cancelled";

export interface Milestone {
  milestoneId: string;
  patientId: string;
  title: string;
  description?: string;
  dueDate: string;
  status: MilestoneStatus;
  completedAt?: string;
}
