import type { Query } from "@/types/query";
import { getDocument, listDocuments } from "../firebase/firestore";

export function getPatientQuery(queryId: string) {
  return getDocument<Query>("queries", queryId);
}

export function listPatientQueries() {
  return listDocuments<Query>("queries");
}
