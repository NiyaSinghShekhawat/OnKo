import type { CareJourneyState } from "./patient";
import type { Milestone } from "./milestone";

export interface CareJourney {
  journeyId: string;
  patientId: string;
  currentState: CareJourneyState;
  progressPercent: number;
  milestones: Milestone[];
  updatedAt: string;
}
