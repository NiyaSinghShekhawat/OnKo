import { NextRequest,NextResponse } from "next/server";
import { requirePatient } from "@/backend/api/auth";
import { createPatientQuery, listQueriesForPatient } from "@/backend/services/queryService";
import { getPatient } from "@/backend/services/patientService";
import { createDoctorNotification } from "@/backend/services/doctorNotificationService";

export async function GET(request:NextRequest){const a=await requirePatient(request);if("error" in a)return a.error;try{return NextResponse.json({data:await listQueriesForPatient(a.patientId)});}catch(e){console.error(e);return NextResponse.json({error:"Unable to load queries."},{status:500});}}

export async function POST(request: NextRequest) {
  const a=await requirePatient(request); if("error" in a)return a.error;
  try {
    const body=await request.json();
    const subject=typeof body.subject==="string"?body.subject.trim():"";
    const message=typeof body.message==="string"?body.message.trim():"";
    const doctorId=typeof body.doctorId==="string"?body.doctorId.trim():"";
    if(!subject||!message||!doctorId) return NextResponse.json({error:"Subject, message and doctor are required."},{status:400});
    const patient=await getPatient(a.patientId);
    if(!patient||patient.doctorId!==doctorId)return NextResponse.json({error:"Care-team relationship not found."},{status:403});
    const query=await createPatientQuery(a.patientId,doctorId,subject,message);
    await createDoctorNotification({doctorId,patientId:a.patientId,type:"patient-query",title:"New patient query",message:patient.name+" sent a new query: "+subject,entityId:query.queryId,metadata:{queryId:query.queryId}});
    return NextResponse.json({data:query},{status:201});
  } catch(e){console.error("POST /api/queries failed",e);return NextResponse.json({error:"Unable to create query."},{status:500});}
}