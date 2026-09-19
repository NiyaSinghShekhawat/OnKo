import {NextRequest} from "next/server";
import {requirePatient} from "@/backend/api/auth";
import {listPatientNotifications,markPatientNotificationRead} from "@/backend/services/notificationService";
export async function getPatientNotifications(req:NextRequest){const auth=await requirePatient(req);return listPatientNotifications(auth.patientId)}
export async function markPatientNotificationReadApi(req:NextRequest,notificationId:string){const auth=await requirePatient(req);return markPatientNotificationRead(notificationId,auth.patientId)}
