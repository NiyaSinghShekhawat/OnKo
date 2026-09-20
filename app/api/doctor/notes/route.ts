import { NextRequest, NextResponse } from "next/server";
import { requireDoctor } from "@/backend/api/auth";
import { getPatient } from "@/backend/services/patientService";
import { createDoctorNote, listDoctorNotes, updateDoctorNote } from "@/backend/services/doctorNoteService";

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  const patientId = new URL(request.url).searchParams.get("patientId");
  if (!patientId) return NextResponse.json({ error: "patientId is required." }, { status: 400 });
  try {
    const patient = await getPatient(patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    return NextResponse.json({ data: await listDoctorNotes(auth.doctorId, patientId) });
  } catch (error) {
    console.error("GET /api/doctor/notes failed", error);
    return NextResponse.json({ error: "Unable to load doctor notes." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const patientId = typeof body.patientId === "string" ? body.patientId : "";
    const title = typeof body.title === "string" ? body.title : "";
    const noteBody = typeof body.body === "string" ? body.body : "";
    const patient = await getPatient(patientId);
    if (!patient || patient.doctorId !== auth.doctorId) return NextResponse.json({ error: "Patient not found." }, { status: 404 });
    const note = await createDoctorNote({ doctorId: auth.doctorId, patientId, title, body: noteBody });
    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    console.error("POST /api/doctor/notes failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create doctor note." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireDoctor(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    if (typeof body.noteId !== "string") return NextResponse.json({ error: "noteId is required." }, { status: 400 });
    const note = await updateDoctorNote({
      doctorId: auth.doctorId,
      noteId: body.noteId,
      title: typeof body.title === "string" ? body.title : undefined,
      body: typeof body.body === "string" ? body.body : undefined,
    });
    return NextResponse.json({ data: note });
  } catch (error) {
    console.error("PATCH /api/doctor/notes failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update doctor note." }, { status: 400 });
  }
}
