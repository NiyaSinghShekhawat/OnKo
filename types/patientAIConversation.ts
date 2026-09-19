export type PatientAIMessageRole="patient"|"ai";
export interface PatientAIMessage{messageId:string;conversationId:string;patientId:string;role:PatientAIMessageRole;text:string;evidence?:string[];limitations?:string[];model?:string;createdAt:string;}
export interface PatientAIConversation{conversationId:string;patientId:string;title:string;createdAt:string;updatedAt:string;}
