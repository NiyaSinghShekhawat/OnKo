import { getStorage } from "@/lib/firebase/admin";

export function getAdminStorageBucket() {
  return getStorage().bucket();
}

export function reportStoragePath(patientId: string, reportId: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `medical-reports/${patientId}/${reportId}/${safeName}`;
}
