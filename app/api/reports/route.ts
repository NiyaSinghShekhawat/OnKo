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

export async function POST(request: NextRequest) {
  const auth = await requirePatient(request);
  if ("error" in auth) return auth.error;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A report file is required." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only PDF, JPEG, and PNG reports are supported." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Report file must be between 1 byte and 10 MB." }, { status: 400 });
    }

    const reportId = crypto.randomUUID();
    const fileName = file.name || "report";
    const storagePath = reportStoragePath(auth.patientId, reportId, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getAdminStorageBucket();
    const storageFile = bucket.file(storagePath);

    await storageFile.save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        metadata: {
          patientId: auth.patientId,
          reportId,
        },
      },
    });

    const report: Report = {
      reportId,
      patientId: auth.patientId,
      title: String(form.get("title") || fileName).trim() || fileName,
      reportType: String(form.get("reportType") || "").trim() || undefined,
      uploadedAt: new Date().toISOString(),
      fileName,
      storagePath,
      status: "uploaded",
    };

    try {
      await createDocument("reports", report);
    } catch (error) {
      await storageFile.delete().catch(() => undefined);
      throw error;
    }

    return NextResponse.json({ data: report }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reports failed", error);
    return NextResponse.json({ error: "Unable to upload report." }, { status: 500 });
  }
}
