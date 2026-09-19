import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { createDocument } from "@/backend/firebase/firestore";
import { getAdminStorageBucket, reportStoragePath } from "@/backend/firebase/storage";
import type { Report } from "@/types/report";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request);
  if ("error" in auth) return auth.error;
  const { listReportsForPatient } = await import("@/backend/services/reportService");
  try {
    return NextResponse.json({ data: await listReportsForPatient(auth.patientId) });
  } catch (error) {
    console.error("GET /api/reports failed", error);
    return NextResponse.json({ error: "Unable to load reports." }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Medical report file storage is disabled in the free prototype. Reports can be added as metadata/demo records." },
    { status: 501 },
  );
}
