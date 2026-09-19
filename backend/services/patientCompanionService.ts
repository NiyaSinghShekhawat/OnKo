import {getPatientCompanionContext} from "@/backend/ai/patientCompanionContext";
import {generatePatientCompanion} from "@/backend/ai/patientCompanionModel";
export async function answerPatientCompanion(patientId:string,question:string){return generatePatientCompanion(question.trim(),await getPatientCompanionContext(patientId));}
