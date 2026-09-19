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
