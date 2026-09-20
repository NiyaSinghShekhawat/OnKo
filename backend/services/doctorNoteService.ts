import { createDocument, getDocument, listDocumentsByField, setDocument } from "@/backend/firebase/firestore";
import type { DoctorNote } from "@/types/doctorNote";

export async function listDoctorNotes(doctorId: string, patientId: string) {
  const notes = await listDocumentsByField<DoctorNote>("doctorNotes", "doctorId", doctorId);
  return notes
    .filter((note) => note.patientId === patientId && note.visibility === "private")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function createDoctorNote(input: { doctorId: string; patientId: string; title: string; body: string }) {
  const now = new Date().toISOString();
  const note: DoctorNote = {
    noteId: crypto.randomUUID(),
    doctorId: input.doctorId,
    patientId: input.patientId,
    title: input.title.trim().slice(0, 160),
    body: input.body.trim().slice(0, 10000),
    visibility: "private",
    createdAt: now,
    updatedAt: now,
  };
  if (!note.title || !note.body) throw new Error("Title and body are required.");
  await setDocument("doctorNotes", note.noteId, note);
  return note;
}

export async function updateDoctorNote(input: { doctorId: string; noteId: string; title?: string; body?: string }) {
  const existing = await getDocument<DoctorNote>("doctorNotes", input.noteId);
  if (!existing || existing.doctorId !== input.doctorId || existing.visibility !== "private") throw new Error("Note not found.");
  const next: DoctorNote = {
    ...existing,
    ...(input.title !== undefined ? { title: input.title.trim().slice(0, 160) } : {}),
    ...(input.body !== undefined ? { body: input.body.trim().slice(0, 10000) } : {}),
    updatedAt: new Date().toISOString(),
  };
  if (!next.title || !next.body) throw new Error("Title and body are required.");
  await setDocument("doctorNotes", input.noteId, next);
  return next;
}
