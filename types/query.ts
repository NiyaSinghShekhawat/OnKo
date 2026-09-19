export type QueryStatus = "open" | "answered" | "resolved";
export type QuerySenderRole = "patient" | "doctor";

export interface QueryMessage {
  messageId: string;
  senderId: string;
  senderRole: QuerySenderRole;
  message: string;
  createdAt: string;
}

export interface Query {
  queryId: string;
  patientId: string;
  doctorId: string;
  subject: string;
  status: QueryStatus;
  messages: QueryMessage[];
  createdAt: string;
  updatedAt: string;
}
