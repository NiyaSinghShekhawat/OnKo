export interface DoctorClinicalReview {
  patientId: string;
  question: string;
  contextSummary: string;
  evidencePoints: string[];
  considerationsForReview: string[];
  uncertainties: string[];
  sources: Array<{ title: string; url: string; publicationDate?: string; pmid?: string }>;
  model: string;
  disclaimer: string;
}
