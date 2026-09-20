export type DoctorNoteVisibility = "private";
export interface DoctorNote {
  noteId: string;
  doctorId: string;
  patientId: string;
  title: string;
  body: string;
  visibility: DoctorNoteVisibility;
  createdAt: string;
  updatedAt: string;
}
