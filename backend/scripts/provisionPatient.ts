import { getAdminAuth } from "@/lib/firebase/admin";

async function main() {
  const [, , uid, patientId] = process.argv;

  if (!uid || !patientId) {
    throw new Error("Usage: provision:patient <firebase-uid> <patient-id>");
  }

  await getAdminAuth().setCustomUserClaims(uid, {
    role: "patient",
    patientId,
  });

  console.log(`Provisioned patient ${patientId} for Firebase UID ${uid}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
