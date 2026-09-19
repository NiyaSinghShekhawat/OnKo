import {NextRequest,NextResponse} from "next/server";
import {requirePatient} from "@/backend/api/auth";
import {createReportAccessUrl,getPatientReport} from "@/backend/services/reportStorageService";
export const runtime="nodejs";
export async function GET(request:NextRequest,{params}:{params:Promise<{reportId:string}>}){
 const auth=await requirePatient(request);if("error"in auth)return auth.error;
 try{const {reportId}=await params;const report=await getPatientReport(reportId,auth.patientId);if(!report)return NextResponse.json({error:"Report not found."},{status:404});return NextResponse.json({url:await createReportAccessUrl(report)});}
 catch(e){console.error(e);return NextResponse.json({error:"Unable to access report."},{status:500});}
}