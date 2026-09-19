import type { CareJourney } from "@/types/careJourney";
import { getDocument, listDocuments } from "../firebase/firestore";

export function getCareJourney(journeyId: string) {
  return getDocument<CareJourney>("careJourneys", journeyId);
}

export function listCareJourneys() {
  return listDocuments<CareJourney>("careJourneys");
}
