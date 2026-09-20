import { randomBytes, randomUUID } from "node:crypto";
import { getAdminAuth, getAdminDb, getAdminStorage } from "@/lib/firebase/admin";
import type { Patient } from "@/types/patient";
import type { PatientOnboardingInput, PatientOnboardingReport, PatientOnboardingResult } from "@/types/patientOnboarding";

function clean(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}

function defined<T extends Record<string, unknown>>(source: T): Partial<T> {
  return Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined)) as Partial<T>;
}

function generatedPatientId() {
  return "ONK-" + randomBytes(4).toString("hex").toUpperCase();
}

function generatedEmail(patientId: string) {
  return patientId.toLowerCase() + "@onko.example";
}

function generatedPassword() {
  return "OnKo-" + randomBytes(12).toString("base64url") + "!";
}

function reportFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 140) || "report";
}

export async function onboardPatient(
  doctorId: string,
  input: PatientOnboardingInput,
  files: File[],
): Promise<PatientOnboardingResult> {
  const db = getAdminDb();
  const auth = getAdminAuth();
  const storage = getAdminStorage();
  const bucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const storageBucket = bucket ? storage.bucket(bucket) : storage.bucket();

  if (!input.name.trim()) throw new Error("Patient name is required.");
  if (!input.currentCarePhase) throw new Error("Care phase is required.");

  let patientId = generatedPatientId();
  while ((await db.collection("patients").doc(patientId).get()).exists) patientId = generatedPatientId();

  const email = generatedEmail(patientId);
  const temporaryPassword = generatedPassword();
  const user = await auth.createUser({
    email,
    password: temporaryPassword,
    displayName: input.name.trim(),
  });

  try {
    await auth.setCustomUserClaims(user.uid, { role: "patient", patientId });

    const now = new Date().toISOString();
    const patient = defined({
      patientId,
      name: input.name.trim(),
      age: typeof input.age === "number" ? input.age : undefined,
      diagnosisLabel: clean(input.diagnosisLabel),
      currentCarePhase: input.currentCarePhase,
      doctorId,
      journeyProgress: Math.max(0, Math.min(100, Number(input.journeyProgress) || 0)),
      lastUpdatedAt: now,
      authUid: user.uid,
      email,
      dateOfBirth: clean(input.dateOfBirth),
      gender: clean(input.gender),
      phone: clean(input.phone),
      address: clean(input.address),
      emergencyContactName: clean(input.emergencyContactName),
      emergencyContactPhone: clean(input.emergencyContactPhone),
      accountStatus: "active",
    }) as Patient & Record<string, unknown>;

    const batch = db.batch();
    batch.set(db.collection("patients").doc(patientId), patient, { merge: false });

    for (const medicine of input.medicines ?? []) {
      if (!medicine.name?.trim()) continue;
      const medicineId = randomUUID();
      batch.set(db.collection("medicines").doc(medicineId), defined({
        medicineId,
        patientId,
        name: medicine.name.trim(),
        dosage: medicine.dosage?.trim() || "",
        frequency: medicine.frequency?.trim() || "",
        instructions: medicine.instructions?.trim() || "",
        sideEffects: medicine.sideEffects ?? [],
        startDate: medicine.startDate || now.slice(0, 10),
        endDate: clean(medicine.endDate),
        status: "active",
      }));
    }

    for (const procedure of input.procedures ?? []) {
      if (!procedure.name?.trim()) continue;
      const procedureId = randomUUID();
      batch.set(db.collection("procedures").doc(procedureId), defined({
        procedureId,
        patientId,
        name: procedure.name.trim(),
        date: procedure.date || now.slice(0, 10),
        reason: clean(procedure.reason),
        purpose: clean(procedure.purpose),
        details: clean(procedure.details),
        followUpDate: clean(procedure.followUpDate),
        notes: clean(procedure.notes),
        status: procedure.status || "scheduled",
      }));
    }

    for (const appointment of input.appointments ?? []) {
      if (!appointment.title?.trim()) continue;
      const appointmentId = randomUUID();
      batch.set(db.collection("appointments").doc(appointmentId), defined({
        appointmentId,
        patientId,
        doctorId,
        title: appointment.title.trim(),
        date: appointment.date || now.slice(0, 10),
        time: appointment.time || "",
        location: clean(appointment.location),
        status: appointment.status || "scheduled",
        instructions: clean(appointment.instructions),
      }));
    }

    for (const milestone of input.milestones ?? []) {
      if (!milestone.title?.trim()) continue;
      const milestoneId = randomUUID();
      batch.set(db.collection("milestones").doc(milestoneId), defined({
        milestoneId,
        patientId,
        title: milestone.title.trim(),
        description: clean(milestone.description),
        dueDate: milestone.dueDate || now.slice(0, 10),
        status: milestone.status || "pending",
      }));
    }

    for (const caregiver of input.caregivers ?? []) {
      if (!caregiver.name?.trim()) continue;
      const caregiverId = randomUUID();
      batch.set(db.collection("caregivers").doc(caregiverId), defined({
        caregiverId,
        patientId,
        name: caregiver.name.trim(),
        relationship: caregiver.relationship?.trim() || "",
        contact: clean(caregiver.contact),
        accessStatus: "invited",
        permissions: caregiver.permissions ?? [],
      }));
    }

    const storagePath = `patients/${patientId}/onboarding/profile.json`;
    await storageBucket.file(storagePath).save(Buffer.from(JSON.stringify({
      patientId,
      doctorId,
      onboardedAt: now,
      profile: patient,
      clinicalRecords: {
        medicines: input.medicines ?? [],
        procedures: input.procedures ?? [],
        appointments: input.appointments ?? [],
        milestones: input.milestones ?? [],
        caregivers: input.caregivers ?? [],
      },
    }, null, 2)), { contentType: "application/json", resumable: false });

    let reportCount = 0;
    const reports: PatientOnboardingReport[] = input.reports ?? [];
    for (const report of reports) {
      if (!report.title?.trim()) continue;
      const file = typeof report.fileIndex === "number" ? files[report.fileIndex] : undefined;
      let reportStoragePath: string | undefined;
      if (file) {
        reportStoragePath = `patients/${patientId}/reports/${Date.now()}-${reportFileName(file.name)}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await storageBucket.file(reportStoragePath).save(buffer, {
          contentType: file.type || "application/octet-stream",
          resumable: false,
        });
      }
      const reportId = randomUUID();
      batch.set(db.collection("reports").doc(reportId), defined({
        reportId,
        patientId,
        title: report.title.trim(),
        reportType: clean(report.reportType),
        uploadedAt: now,
        fileName: file?.name || report.title.trim(),
        storagePath: reportStoragePath,
        status: "uploaded",
        notes: clean(report.notes),
      }));
      reportCount++;
    }

    batch.set(db.collection("careJourneys").doc(patientId), {
      journeyId: patientId,
      patientId,
      currentState: input.currentCarePhase,
      progressPercent: patient.journeyProgress,
      updatedAt: now,
      milestones: [],
    }, { merge: true });

    const auditId = randomUUID();
    batch.set(db.collection("auditLogs").doc(auditId), {
      auditId,
      actorId: doctorId,
      actorRole: "doctor",
      action: "patient_onboarded",
      entityType: "patient",
      entityId: patientId,
      patientId,
      metadata: {
        authUid: user.uid,
        createdRecords: {
          medicines: input.medicines?.length ?? 0,
          procedures: input.procedures?.length ?? 0,
          appointments: input.appointments?.length ?? 0,
          milestones: input.milestones?.length ?? 0,
          caregivers: input.caregivers?.length ?? 0,
          reports: reportCount,
        },
      },
      createdAt: now,
    });

    await batch.commit();

    return {
      patientId,
      authUid: user.uid,
      email,
      temporaryPassword,
      created: {
        medicines: (input.medicines ?? []).filter((x) => x.name?.trim()).length,
        procedures: (input.procedures ?? []).filter((x) => x.name?.trim()).length,
        appointments: (input.appointments ?? []).filter((x) => x.title?.trim()).length,
        milestones: (input.milestones ?? []).filter((x) => x.title?.trim()).length,
        caregivers: (input.caregivers ?? []).filter((x) => x.name?.trim()).length,
        reports: reportCount,
      },
      storagePath,
    };
  } catch (error) {
    await auth.deleteUser(user.uid).catch(() => undefined);
    throw error;
  }
}
