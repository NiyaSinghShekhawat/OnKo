export type DoctorNotificationType = "new-report"|"patient-query"|"emergency"|"missed-follow-up"|"caregiver-change"|"milestone-change"|"doctor-update";
export interface DoctorNotification {
  notificationId:string;
  doctorId:string;
  patientId:string;
  type:DoctorNotificationType;
  title:string;
  message:string;
  createdAt:string;
  readAt?:string;
  status:"unread"|"read";
  entityId?:string;
  metadata?:Record<string,string>;
}