export type WhatsAppConsentStatus="pending"|"opted-in"|"opted-out";
export interface WhatsAppConsent{consentId:string;patientId:string;status:WhatsAppConsentStatus;phoneNumber?:string;consentedAt?:string;withdrawnAt?:string;source:"patient";version:string;}
