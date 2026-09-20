import { NextRequest, NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { createDocument, listDocumentsByField } from "@/backend/firebase/firestore";
import { createPatientNotification } from "@/backend/services/notificationService";
import { createDoctorNotification } from "@/backend/services/doctorNotificationService";
import { getPatient } from "@/backend/services/patientService";
import type { SOSEvent } from "@/types/sos";
export async function POST(request: NextRequest) {
  const auth=await requirePatient(request); if("error" in auth)return auth.error;
  try{
    const body=await request.json().catch(()=>({}));
    const event:SOSEvent={sosId:"sos-"+crypto.randomUUID(),patientId:auth.patientId,status:"triggered",message:typeof body.message==="string"&&body.message.trim()?body.message.trim().slice(0,500):undefined,createdAt:new Date().toISOString()};
    await createDocument<SOSEvent>("sosEvents",event);
    await createPatientNotification({patientId:auth.patientId,type:"safety-alert",title:"SOS triggered",message:"Your SOS has been recorded and routed to the configured care-team workflow.",metadata:{sosId:event.sosId}});
    const patient=await getPatient(auth.patientId);
    if(patient)await createDoctorNotification({doctorId:patient.doctorId,patientId:auth.patientId,type:"emergency",title:"Patient SOS triggered",message:patient.name+" triggered an SOS"+(event.message?": "+event.message:"")+" .",entityId:event.sosId,metadata:{sosId:event.sosId}});
    await createDocument("auditLogs",{auditId:"sos-triggered-"+event.sosId,actorId:auth.patientId,actorRole:"patient",action:"sos_triggered",entityType:"sos",entityId:event.sosId,patientId:auth.patientId,createdAt:event.createdAt});
    return NextResponse.json({data:event},{status:201});
  }catch(error){console.error("POST /api/sos failed",error);return NextResponse.json({error:"Unable to trigger SOS."},{status:500});}
}
export async function GET(request:NextRequest){const auth=await requirePatient(request);if("error" in auth)return auth.error;try{return NextResponse.json({data:await listDocumentsByField<SOSEvent>("sosEvents","patientId",auth.patientId)});}catch(error){console.error("GET /api/sos failed",error);return NextResponse.json({error:"Unable to load SOS history."},{status:500});}}
