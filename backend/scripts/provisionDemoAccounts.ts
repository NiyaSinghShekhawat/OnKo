import { getAdminAuth } from "@/lib/firebase/admin";

async function provision(
  email: string,
  password: string,
  displayName: string,
  role: "doctor" | "patient",
  linkedId: string,
) {
  const auth = getAdminAuth();
  let user;

  try {
    user = await auth.getUserByEmail(email);
    user = await auth.updateUser(user.uid, {
      password,
      displayName,
      emailVerified: true,
      disabled: false,
    });
  } catch (error: unknown) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";

    if (code !== "auth/user-not-found") throw error;

    user = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
  }

  await auth.setCustomUserClaims(
    user.uid,
    role === "doctor"
      ? { role: "doctor", doctorId: linkedId }
      : { role: "patient", patientId: linkedId },
  );

  return user.uid;
}

async function main() {
  const doctorEmail = process.env.ONKO_DEMO_DOCTOR_EMAIL;
  const doctorPassword = process.env.ONKO_DEMO_DOCTOR_PASSWORD;
  const patientEmail = process.env.ONKO_DEMO_PATIENT_EMAIL;
  const patientPassword = process.env.ONKO_DEMO_PATIENT_PASSWORD;

  if (!doctorEmail || !doctorPassword || !patientEmail || !patientPassword) {
    throw new Error(
      "Set ONKO_DEMO_DOCTOR_EMAIL, ONKO_DEMO_DOCTOR_PASSWORD, ONKO_DEMO_PATIENT_EMAIL and ONKO_DEMO_PATIENT_PASSWORD before running this script.",
    );
  }

  const doctorUid = await provision(
    doctorEmail,
    doctorPassword,
    "Dr. Demo Oncologist",
    "doctor",
    "DOC-DEMO-001",
  );

  const patientUid = await provision(
    patientEmail,
    patientPassword,
    "Demo Patient",
    "patient",
    "ONK-DEMO-001",
  );

  console.log(`Doctor provisioned: ${doctorEmail} (${doctorUid})`);
  console.log(`Patient provisioned: ${patientEmail} (${patientUid})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
