import {NextRequest,NextResponse} from "next/server";
import {requireDoctor} from "@/backend/api/auth";
import {listDoctorNotifications,markDoctorNotificationRead} from "@/backend/services/doctorNotificationService";
export async function GET(request:NextRequest){
  const a=await requireDoctor(request);if("error"in a)return a.error;
  try{return NextResponse.json({data:await listDoctorNotifications(a.doctorId)});}catch(e){console.error(e);return NextResponse.json({error:"Unable to load doctor notifications."},{status:500});}
}
export async function PATCH(request:NextRequest){
  const a=await requireDoctor(request);if("error"in a)return a.error;
  try{const b=await request.json();if(typeof b.notificationId!=="string"||!b.notificationId)return NextResponse.json({error:"notificationId is required."},{status:400});return NextResponse.json({data:await markDoctorNotificationRead(a.doctorId,b.notificationId)});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Unable to update notification."},{status:400});}
}