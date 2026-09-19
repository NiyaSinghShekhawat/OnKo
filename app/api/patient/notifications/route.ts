import {NextRequest,NextResponse} from "next/server";
import {getPatientNotifications,markPatientNotificationReadApi} from "@/backend/api/notifications";

export async function GET(req:NextRequest){
  const result=await getPatientNotifications(req);
  if("error" in result)return result.error;
  return NextResponse.json({notifications:result});
}
export async function PATCH(req:NextRequest){
  try{
    const body=await req.json();
    if(!body.notificationId)return NextResponse.json({error:"notificationId is required."},{status:400});
    const result=await markPatientNotificationReadApi(req,body.notificationId);
    if("error" in result)return result.error;
    return NextResponse.json({notification:result});
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:"Unable to mark notification as read."},{status:500});
  }
}
