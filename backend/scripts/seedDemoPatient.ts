import { getAdminDb } from "@/lib/firebase/admin";

const patientId = "ONK-DEMO-001";
const doctorId = "DOC-DEMO-001";
const now = "2026-09-19T10:00:00.000Z";

const seed = {
  patients: {
    [patientId]: {
      patientId, name: "Demo Patient", age: 42,
      diagnosisLabel: "Cancer Care — Demo Record",
      currentCarePhase: "active-treatment", doctorId,
      journeyProgress: 68, lastUpdatedAt: now,
    },
    "ONK-DEMO-002": {
      patientId: "ONK-DEMO-002", name: "Aarav Mehta", age: 56,
      diagnosisLabel: "Oncology follow-up — synthetic",
      currentCarePhase: "active-treatment", doctorId,
      journeyProgress: 82, lastUpdatedAt: "2026-09-18T08:30:00.000Z",
    },
    "ONK-DEMO-003": {
      patientId: "ONK-DEMO-003", name: "Priya Nair", age: 38,
      diagnosisLabel: "Survivorship review — synthetic",
      currentCarePhase: "remission-survivorship", doctorId,
      journeyProgress: 91, lastUpdatedAt: "2026-09-17T11:15:00.000Z",
    },
    "ONK-DEMO-004": {
      patientId: "ONK-DEMO-004", name: "Rohan Kapoor", age: 64,
      diagnosisLabel: "Treatment monitoring — synthetic",
      currentCarePhase: "relapse", doctorId,
      journeyProgress: 47, lastUpdatedAt: "2026-09-19T06:45:00.000Z",
    },
    "ONK-DEMO-005": {
      patientId: "ONK-DEMO-005", name: "Meera Iyer", age: 49,
      diagnosisLabel: "Care transition — synthetic",
      currentCarePhase: "transfer-of-care", doctorId,
      journeyProgress: 73, lastUpdatedAt: "2026-09-16T14:20:00.000Z",
    },
  },
  doctors: {
    [doctorId]: {
      doctorId, name: "Dr. Demo Oncologist",
      specialty: "Medical Oncology", department: "Oncology",
      contact: "demo-care-team@onko.example",
    },
  },
  appointments: {
    "APT-DEMO-001": { appointmentId:"APT-DEMO-001", patientId, doctorId, title:"Follow-up consultation", date:"2026-09-22", time:"10:30 AM", location:"OnKo Demo OPD", status:"scheduled", instructions:"Synthetic demo appointment." },
    "APT-DEMO-002": { appointmentId:"APT-DEMO-002", patientId, doctorId, title:"Previous care-team review", date:"2026-09-10", time:"11:00 AM", location:"OnKo Demo OPD", status:"completed" },
    "APT-DEMO-003": { appointmentId:"APT-DEMO-003", patientId:"ONK-DEMO-002", doctorId, title:"Treatment review", date:"2026-09-21", time:"09:30 AM", location:"OnKo Demo OPD", status:"scheduled" },
    "APT-DEMO-004": { appointmentId:"APT-DEMO-004", patientId:"ONK-DEMO-003", doctorId, title:"Survivorship check", date:"2026-09-25", time:"12:00 PM", location:"OnKo Demo OPD", status:"scheduled" },
    "APT-DEMO-005": { appointmentId:"APT-DEMO-005", patientId:"ONK-DEMO-004", doctorId, title:"Escalation review", date:"2026-09-20", time:"03:00 PM", location:"OnKo Demo OPD", status:"scheduled" },
    "APT-DEMO-006": { appointmentId:"APT-DEMO-006", patientId:"ONK-DEMO-005", doctorId, title:"Transfer-of-care meeting", date:"2026-09-23", time:"02:00 PM", location:"OnKo Demo OPD", status:"scheduled" },
  },
  medicines: {
    "MED-DEMO-001": { medicineId:"MED-DEMO-001", patientId, name:"Demo Medication A", dosage:"1 tablet", frequency:"Once daily", instructions:"Synthetic demo prescription.", sideEffects:["Example side effect A"], startDate:"2026-09-10", endDate:"2026-09-24", status:"active" },
    "MED-DEMO-002": { medicineId:"MED-DEMO-002", patientId:"ONK-DEMO-002", name:"Maintenance Medication", dosage:"1 tablet", frequency:"Once daily", instructions:"Synthetic demo prescription.", sideEffects:["Example side effect"], startDate:"2026-09-01", status:"active" },
    "MED-DEMO-003": { medicineId:"MED-DEMO-003", patientId:"ONK-DEMO-004", name:"Supportive Medication", dosage:"1 tablet", frequency:"Twice daily", instructions:"Synthetic demo prescription.", sideEffects:[], startDate:"2026-09-12", status:"active" },
  },
  procedures: {
    "PROC-DEMO-001": { procedureId:"PROC-DEMO-001", patientId, name:"Demo treatment session", date:"2026-09-10", status:"completed", reason:"Synthetic demo record", purpose:"Demo treatment milestone", details:"Synthetic record only.", followUpDate:"2026-09-22", notes:"No real clinical information." },
    "PROC-DEMO-002": { procedureId:"PROC-DEMO-002", patientId:"ONK-DEMO-002", name:"Treatment session", date:"2026-09-19", status:"completed", reason:"Synthetic demo", purpose:"Treatment monitoring", details:"Synthetic record only." },
    "PROC-DEMO-003": { procedureId:"PROC-DEMO-003", patientId:"ONK-DEMO-004", name:"Review procedure", date:"2026-09-24", status:"scheduled", reason:"Synthetic demo", purpose:"Relapse review", details:"Synthetic record only." },
  },
  reports: {
    "REP-DEMO-001": { reportId:"REP-DEMO-001", patientId, title:"Demo Laboratory Record", reportType:"Laboratory", uploadedAt:"2026-09-15", fileName:"demo-lab-record.pdf", status:"reviewed", notes:"Synthetic metadata only." },
    "REP-DEMO-002": { reportId:"REP-DEMO-002", patientId, title:"Demo Imaging Record", reportType:"Imaging", uploadedAt:"2026-09-12", fileName:"demo-imaging-record.pdf", status:"uploaded", notes:"Synthetic metadata only." },
    "REP-DEMO-003": { reportId:"REP-DEMO-003", patientId:"ONK-DEMO-002", title:"Treatment Review Report", reportType:"Follow-up", uploadedAt:"2026-09-18", fileName:"demo-followup.pdf", status:"uploaded", notes:"Synthetic metadata only." },
    "REP-DEMO-004": { reportId:"REP-DEMO-004", patientId:"ONK-DEMO-004", title:"Monitoring Report", reportType:"Imaging", uploadedAt:"2026-09-19", fileName:"demo-monitoring.pdf", status:"uploaded", notes:"Synthetic metadata only." },
    "REP-DEMO-005": { reportId:"REP-DEMO-005", patientId:"ONK-DEMO-005", title:"Transfer Summary", reportType:"Summary", uploadedAt:"2026-09-16", fileName:"demo-transfer.pdf", status:"reviewed", notes:"Synthetic metadata only." },
  },
  careJourneys: {
    "JRN-DEMO-001": { journeyId:"JRN-DEMO-001", patientId, currentState:"active-treatment", progressPercent:68, updatedAt:now, milestones:[] },
    "JRN-DEMO-002": { journeyId:"JRN-DEMO-002", patientId:"ONK-DEMO-002", currentState:"active-treatment", progressPercent:82, updatedAt:"2026-09-18T08:30:00.000Z", milestones:[] },
    "JRN-DEMO-003": { journeyId:"JRN-DEMO-003", patientId:"ONK-DEMO-003", currentState:"remission-survivorship", progressPercent:91, updatedAt:"2026-09-17T11:15:00.000Z", milestones:[] },
    "JRN-DEMO-004": { journeyId:"JRN-DEMO-004", patientId:"ONK-DEMO-004", currentState:"relapse", progressPercent:47, updatedAt:"2026-09-19T06:45:00.000Z", milestones:[] },
    "JRN-DEMO-005": { journeyId:"JRN-DEMO-005", patientId:"ONK-DEMO-005", currentState:"transfer-of-care", progressPercent:73, updatedAt:"2026-09-16T14:20:00.000Z", milestones:[] },
  },
  milestones: {
    "MS-DEMO-001": { milestoneId:"MS-DEMO-001", patientId, title:"Complete scheduled care visit", description:"Synthetic development milestone.", dueDate:"2026-09-22", status:"pending" },
    "MS-DEMO-002": { milestoneId:"MS-DEMO-002", patientId:"ONK-DEMO-002", title:"Treatment review completed", description:"Synthetic milestone.", dueDate:"2026-09-19", status:"completed", completedAt:"2026-09-19" },
    "MS-DEMO-003": { milestoneId:"MS-DEMO-003", patientId:"ONK-DEMO-003", title:"Survivorship check-in", description:"Synthetic milestone.", dueDate:"2026-09-25", status:"pending" },
    "MS-DEMO-004": { milestoneId:"MS-DEMO-004", patientId:"ONK-DEMO-004", title:"Escalation review", description:"Synthetic milestone.", dueDate:"2026-09-20", status:"overdue" },
    "MS-DEMO-005": { milestoneId:"MS-DEMO-005", patientId:"ONK-DEMO-005", title:"Transfer summary accepted", description:"Synthetic milestone.", dueDate:"2026-09-23", status:"pending" },
  },
  queries: {
    "QRY-DEMO-001": { queryId:"QRY-DEMO-001", patientId, doctorId, subject:"Upcoming visit question", status:"open", messages:[{messageId:"MSG-DEMO-001",senderId:patientId,senderRole:"patient",message:"What should I bring to my next visit?",createdAt:"2026-09-18T09:00:00.000Z"}], createdAt:"2026-09-18T09:00:00.000Z", updatedAt:"2026-09-18T09:00:00.000Z" },
    "QRY-DEMO-002": { queryId:"QRY-DEMO-002", patientId:"ONK-DEMO-002", doctorId, subject:"Medication timing", status:"answered", messages:[{messageId:"MSG-DEMO-002",senderId:"ONK-DEMO-002",senderRole:"patient",message:"Can I confirm the timing shown in my care plan?",createdAt:"2026-09-18T10:00:00.000Z"}], createdAt:"2026-09-18T10:00:00.000Z", updatedAt:"2026-09-18T12:00:00.000Z" },
    "QRY-DEMO-003": { queryId:"QRY-DEMO-003", patientId:"ONK-DEMO-004", doctorId, subject:"Upcoming review", status:"open", messages:[{messageId:"MSG-DEMO-003",senderId:"ONK-DEMO-004",senderRole:"patient",message:"When is my next review?",createdAt:"2026-09-19T07:00:00.000Z"}], createdAt:"2026-09-19T07:00:00.000Z", updatedAt:"2026-09-19T07:00:00.000Z" },
  },
  caregivers: {
    "CG-DEMO-001": { caregiverId:"CG-DEMO-001", patientId, name:"Demo Caregiver", relationship:"Family", contact:"+91 90000 00001", accessStatus:"active", permissions:["appointments","milestones","notifications"] },
    "CG-DEMO-002": { caregiverId:"CG-DEMO-002", patientId:"ONK-DEMO-002", name:"Anita Mehta", relationship:"Spouse", contact:"+91 90000 00002", accessStatus:"consented", permissions:["appointments","care-plan"] },
    "CG-DEMO-003": { caregiverId:"CG-DEMO-003", patientId:"ONK-DEMO-004", name:"Vikram Kapoor", relationship:"Sibling", contact:"+91 90000 00003", accessStatus:"invited", permissions:["appointments"] },
  },
  sosEvents: {
    "SOS-DEMO-001": { sosId:"SOS-DEMO-001", patientId:"ONK-DEMO-004", status:"triggered", message:"Synthetic emergency event for dashboard demonstration.", createdAt:"2026-09-19T08:45:00.000Z" },
    "SOS-DEMO-002": { sosId:"SOS-DEMO-002", patientId:"ONK-DEMO-002", status:"acknowledged", message:"Synthetic safety event.", createdAt:"2026-09-18T13:20:00.000Z", acknowledgedAt:"2026-09-18T13:25:00.000Z", acknowledgedBy:doctorId },
  },
  auditLogs: {
    "AUDIT-DEMO-001": { auditId:"AUDIT-DEMO-001", actorId:doctorId, actorRole:"doctor", action:"report_reviewed", entityType:"report", entityId:"REP-DEMO-001", patientId, createdAt:"2026-09-18T09:20:00.000Z" },
    "AUDIT-DEMO-002": { auditId:"AUDIT-DEMO-002", actorId:doctorId, actorRole:"doctor", action:"milestone_completed", entityType:"milestone", entityId:"MS-DEMO-002", patientId:"ONK-DEMO-002", createdAt:"2026-09-19T12:00:00.000Z" },
    "AUDIT-DEMO-003": { auditId:"AUDIT-DEMO-003", actorId:"patient", actorRole:"patient", action:"sos_triggered", entityType:"sos", entityId:"SOS-DEMO-001", patientId:"ONK-DEMO-004", createdAt:"2026-09-19T08:45:00.000Z" },
  },
};

async function main() {
  const db = getAdminDb();
  const batch = db.batch();

  for (const [collection, docs] of Object.entries(seed)) {
    for (const [id, data] of Object.entries(docs)) {
      batch.set(db.collection(collection).doc(id), data, { merge: true });
    }
  }

  await batch.commit();
  console.log("Seeded synthetic OnKo doctor cohort: 5 patients with comparison/workspace data.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
