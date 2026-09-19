export type DoctorActionTaskStatus="open"|"completed"|"cancelled";
export interface DoctorActionTask{taskId:string;doctorId:string;patientId:string;signalId?:string;insightId?:string;title:string;note?:string;status:DoctorActionTaskStatus;createdAt:string;createdBy:string;}
