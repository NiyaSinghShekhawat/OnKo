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
  },
  doctors: {
    [doctorId]: {
      doctorId, name: "Dr. Demo Oncologist",
      specialty: "Medical Oncology", department: "Oncology",
      contact: "demo-care-team@onko.example",
    },
  },
  appointments: {
    "APT-DEMO-001": {
      appointmentId:"APT-DEMO-001", patientId, doctorId,
      title:"Follow-up consultation", date:"2026-09-22", time:"10:30 AM",
      location:"OnKo Demo OPD", status:"scheduled",
      instructions:"Bring your care records and follow the instructions provided by your care team.",
    },
    "APT-DEMO-002": {
      appointmentId:"APT-DEMO-002", patientId, doctorId,
      title:"Previous care-team review", date:"2026-09-10", time:"11:00 AM",
      location:"OnKo Demo OPD", status:"completed",
    },
  },
  medicines: {
    "MED-DEMO-001": {
      medicineId:"MED-DEMO-001", patientId, name:"Demo Medication A",
      dosage:"1 tablet", frequency:"Once daily",
      instructions:"Synthetic demo prescription. Follow the instructions shown by the care team in the application.",
      sideEffects:["Example side effect A","Example side effect B"],
      startDate:"2026-09-10", endDate:"2026-09-24", status:"active",
    },
    "MED-DEMO-002": {
      medicineId:"MED-DEMO-002", patientId, name:"Demo Medication B",
      dosage:"5 mL", frequency:"Twice daily",
      instructions:"Synthetic demo prescription for UI testing only.",
      sideEffects:["Example side effect"],
      startDate:"2026-09-05", endDate:"2026-09-20", status:"completed",
    },
  },
  procedures: {
    "PROC-DEMO-001": {
      procedureId:"PROC-DEMO-001", patientId, name:"Demo treatment session",
      date:"2026-09-10", status:"completed",
      reason:"Synthetic demo record", purpose:"Demo treatment milestone",
      details:"Synthetic record for development and demonstration only.",
      followUpDate:"2026-09-22", notes:"No real clinical information.",
    },
    "PROC-DEMO-002": {
      procedureId:"PROC-DEMO-002", patientId, name:"Upcoming care procedure",
      date:"2026-09-24", status:"scheduled",
      reason:"Synthetic demo record", purpose:"Demo upcoming milestone",
      details:"Synthetic record for development and demonstration only.",
      followUpDate:"2026-09-30", notes:"No real clinical information.",
    },
  },
  reports: {
    "REP-DEMO-001": {
      reportId:"REP-DEMO-001", patientId, title:"Demo Laboratory Record",
      reportType:"Laboratory", uploadedAt:"2026-09-15",
      fileName:"demo-lab-record.pdf", status:"reviewed",
      notes:"Synthetic metadata only. No clinical interpretation is provided.",
    },
    "REP-DEMO-002": {
      reportId:"REP-DEMO-002", patientId, title:"Demo Imaging Record",
      reportType:"Imaging", uploadedAt:"2026-09-12",
      fileName:"demo-imaging-record.pdf", status:"uploaded",
      notes:"Synthetic metadata only.",
    },
    "REP-DEMO-003": {
      reportId:"REP-DEMO-003", patientId, title:"Demo Follow-up Report",
      reportType:"Follow-up", uploadedAt:"2026-09-18",
      fileName:"demo-follow-up-report.pdf", status:"uploaded",
      notes:"Synthetic metadata only.",
    },
  },
  careJourneys: {
    "JRN-DEMO-001": {
      journeyId:"JRN-DEMO-001", patientId,
      currentState:"active-treatment", progressPercent:68,
      updatedAt:now, milestones:[],
    },
  },
  milestones: {
    "MS-DEMO-001": {
      milestoneId:"MS-DEMO-001", patientId,
      title:"Complete scheduled care visit",
      description:"Synthetic development milestone.",
      dueDate:"2026-09-22", status:"pending",
    },
    "MS-DEMO-002": {
      milestoneId:"MS-DEMO-002", patientId,
      title:"Care-team review recorded",
      description:"Synthetic development milestone.",
      dueDate:"2026-09-10", status:"completed",
      completedAt:"2026-09-10",
    },
    "MS-DEMO-003": {
      milestoneId:"MS-DEMO-003", patientId,
      title:"Upcoming treatment milestone",
      description:"Synthetic development milestone.",
      dueDate:"2026-09-24", status:"pending",
    },
  },
  queries: {
    "QRY-DEMO-001": {
      queryId:"QRY-DEMO-001", patientId, doctorId,
      subject:"Upcoming visit question", status:"open",
      messages:[{
        messageId:"MSG-DEMO-001", senderId:patientId,
        senderRole:"patient", message:"What should I bring to my next visit?",
        createdAt:"2026-09-18T09:00:00.000Z",
      }],
      createdAt:"2026-09-18T09:00:00.000Z",
      updatedAt:"2026-09-18T09:00:00.000Z",
    },
    "QRY-DEMO-002": {
      queryId:"QRY-DEMO-002", patientId, doctorId,
      subject:"Previous question", status:"answered",
      messages:[
        {
          messageId:"MSG-DEMO-002A", senderId:patientId,
          senderRole:"patient", message:"Can I confirm my next appointment time?",
          createdAt:"2026-09-17T09:00:00.000Z",
        },
        {
          messageId:"MSG-DEMO-002B", senderId:doctorId,
          senderRole:"doctor",
          message:"Please refer to the appointment shown in your OnKo dashboard.",
          createdAt:"2026-09-17T12:00:00.000Z",
        },
      ],
      createdAt:"2026-09-17T09:00:00.000Z",
      updatedAt:"2026-09-17T12:00:00.000Z",
    },
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
  console.log(`Seeded synthetic OnKo patient data: ${patientId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
