import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { listMilestonesForPatient } from "@/backend/services/milestoneService";
import { createDocument } from "@/backend/firebase/firestore";

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request);
  if ("error" in auth) return auth.error;
  try {
    return NextResponse.json({ data: await listMilestonesForPatient(auth.patientId) });
  } catch (error) {
    console.error("GET /api/milestones failed", error);
    return NextResponse.json({ error: "Unable to load milestones." }, { status: 500 });
  }
}


export async function PATCH(request: NextRequest) {
  const auth = await requirePatient(request);
  if ("error" in auth) return auth.error;
  try {
    const body = await request.json();
    const milestoneId = typeof body.milestoneId === "string" ? body.milestoneId : "";
    const status = body.status;
    if (!milestoneId || status !== "completed") {
      return NextResponse.json({ error: "Only completing a milestone is supported." }, { status: 400 });
    }

    const { getDocument, setDocument } = await import("@/backend/firebase/firestore");
    const existing = await getDocument<import("@/types/milestone").Milestone>("milestones", milestoneId);
    if (!existing || existing.patientId !== auth.patientId) {
      return NextResponse.json({ error: "Milestone not found." }, { status: 404 });
    }
    if (existing.status === "cancelled") {
      return NextResponse.json({ error: "Cancelled milestones cannot be completed." }, { status: 400 });
    }

    const next = {
      ...existing,
      status: "completed" as const,
      completedAt: existing.completedAt ?? new Date().toISOString(),
    };
    await setDocument("milestones", milestoneId, next);
    await createDocument("auditLogs", { auditId: "milestone-completed-" + milestoneId + "-" + Date.now(), actorId: auth.patientId, actorRole: "patient", action: "milestone_completed", entityType: "milestone", entityId: milestoneId, patientId: auth.patientId, createdAt: new Date().toISOString() });
    const milestones = await (await import("@/backend/services/milestoneService")).listMilestonesForPatient(auth.patientId);
    const activeMilestones = milestones.filter((m) => m.status !== "cancelled");
    const completedMilestones = activeMilestones.filter((m) => m.status === "completed").length;
    const journeyProgress = activeMilestones.length ? Math.round((completedMilestones / activeMilestones.length) * 100) : 0;
    const { getDocument: getPatientDocument, setDocument: setPatientDocument } = await import("@/backend/firebase/firestore");
    const patient = await getPatientDocument<import("@/types/patient").Patient>("patients", auth.patientId);
    if (patient && patient.journeyProgress !== journeyProgress) {
      await setPatientDocument("patients", auth.patientId, { ...patient, journeyProgress, lastUpdatedAt: new Date().toISOString() });
    }
    return NextResponse.json({ data: next, progress: { journeyProgress, milestoneCompletion: journeyProgress, totalMilestones: activeMilestones.length, completedMilestones } });
  } catch (error) {
    console.error("PATCH /api/milestones failed", error);
    return NextResponse.json({ error: "Unable to complete milestone." }, { status: 500 });
  }
}
