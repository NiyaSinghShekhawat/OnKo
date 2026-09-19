import type { Medicine } from "@/types/medicine";
import { getDocument, listDocuments } from "../firebase/firestore";

export function getMedicine(medicineId: string) {
  return getDocument<Medicine>("medicines", medicineId);
}

export function listMedicines() {
  return listDocuments<Medicine>("medicines");
}
