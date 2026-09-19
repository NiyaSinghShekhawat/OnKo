export type CareJourneyState = "active-treatment" | "remission-survivorship" | "relapse" | "transfer-of-care" | "palliative-end-of-life" | "deceased";

export interface Patient {
  patientId: string;
  name: string;
  age?: number;
  diagnosisLabel?: string;
  currentCarePhase: CareJourneyState;
  doctorId: string;
  caregiverId?: string;
  journeyProgress: number;
  lastUpdatedAt: string;
}
