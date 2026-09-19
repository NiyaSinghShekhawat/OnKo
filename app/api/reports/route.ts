import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { createDocument } from "@/backend/firebase/firestore";
import { getAdminStorageBucket, reportStoragePath } from "@/backend/firebase/storage";
import { notifyDoctorUpdate } from "@/backend/services/notificationTriggers";
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

  let uploadedPath: string | null = null;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A report file is required." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only PDF, JPEG, and PNG reports are supported." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Report files must be between 1 byte and 10 MB." }, { status: 400 });
    }

    const titleValue = form.get("title");
    const typeValue = form.get("reportType");
    const title = typeof titleValue === "string" && titleValue.trim() ? titleValue.trim() : file.name;
    const reportType = typeof typeValue === "string" && typeValue.trim() ? typeValue.trim() : undefined;

    const reportId = crypto.randomUUID();
    const storagePath = reportStoragePath(auth.patientId, reportId, file.name);
    uploadedPath = storagePath;

    const buffer = Buffer.from(await file.arrayBuffer());
    await getAdminStorageBucket().file(storagePath).save(buffer, {
      resumable: false,
      contentType: file.type,
      metadata: {
        metadata: {
          patientId: auth.patientId,
          reportId,
        },
      },
    });

    const report: Report = {
      reportId,
      patientId: auth.patientId,
      title,
      reportType,
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
      storagePath,
      status: "uploaded",
      notes: "Uploaded by the patient for care-team review.",
    };

    await createDocument<Report>("reports", report);
    await notifyDoctorUpdate(
      auth.patientId,
      "New report uploaded",
      "A new report was uploaded to your patient's OnKo record: " + title + ".",
      { reportId },
    );

    return NextResponse.json({ data: report }, { status: 201 });
  } catch (error) {
    if (uploadedPath) {
      try {
        await getAdminStorageBucket().file(uploadedPath).delete({ ignoreNotFound: true });
      } catch (cleanupError) {
        console.error("Report upload cleanup failed", cleanupError);
      }
    }
    console.error("POST /api/reports failed", error);
    return NextResponse.json({ error: "Unable to upload report." }, { status: 500 });
  }
}
