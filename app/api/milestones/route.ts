import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { listMilestonesForPatient } from "@/backend/services/milestoneService";

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
    return NextResponse.json({ data: next });
  } catch (error) {
    console.error("PATCH /api/milestones failed", error);
    return NextResponse.json({ error: "Unable to complete milestone." }, { status: 500 });
  }
}
