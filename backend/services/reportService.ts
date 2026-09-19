import type { Report } from "@/types/report";
import { getDocument, listDocuments } from "../firebase/firestore";

export function getReport(reportId: string) {
  return getDocument<Report>("reports", reportId);
}

export function listReports() {
  return listDocuments<Report>("reports");
}
