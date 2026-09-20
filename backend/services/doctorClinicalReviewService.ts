import { getPatientContext } from "@/backend/ai/patientContext";
import { retrieveMedicalLiterature } from "@/backend/rag";
import { rankMedicalEvidence } from "@/backend/rag/evidenceRanker";
import type { DoctorClinicalReview } from "@/types/doctorClinicalReview";

function validate(raw: string) {
  const x = JSON.parse(raw) as Partial<DoctorClinicalReview>;
  if (typeof x.contextSummary !== "string" || !Array.isArray(x.evidencePoints) || !Array.isArray(x.considerationsForReview) || !Array.isArray(x.uncertainties)) {
    throw new Error("Invalid AI review output.");
  }
  return {
    contextSummary: x.contextSummary,
    evidencePoints: x.evidencePoints.filter((v): v is string => typeof v === "string"),
    considerationsForReview: x.considerationsForReview.filter((v): v is string => typeof v === "string"),
    uncertainties: x.uncertainties.filter((v): v is string => typeof v === "string"),
  };
}

export async function generateDoctorClinicalReview(input: { patientId: string; doctorId: string; question: string }): Promise<DoctorClinicalReview> {
  const question = input.question.trim().slice(0, 2000);
  if (!question) throw new Error("Question is required.");
  const context = await getPatientContext(input.patientId, input.doctorId);
  const retrieval = await retrieveMedicalLiterature(question, 5);
  const ranked = rankMedicalEvidence(question, retrieval.chunks, 8);
  const prompt = [
    "You are a doctor-facing evidence organization assistant inside a cancer-care coordination platform.",
    "Use only the supplied patient record and literature excerpts.",
    "Do not diagnose the patient, prescribe treatment, calculate clinical risk, or make a final clinical decision.",
    "Do not invent patient facts.",
    "Return evidence points, uncertainties, and neutral considerations/questions a clinician may review.",
    "Every medical statement must be traceable to the supplied patient record or literature excerpts.",
    "Return JSON with contextSummary, evidencePoints, considerationsForReview, uncertainties.",
    "PATIENT CONTEXT:\n" + JSON.stringify({
      patient: context.patient,
      appointments: context.appointments,
      medicines: context.medicines,
      procedures: context.procedures,
      reports: context.reports,
      queries: context.queries,
      milestones: context.milestones,
      careJourney: context.careJourney,
    }),
    "DOCTOR QUESTION:\n" + question,
    "LITERATURE EXCERPTS:\n" + JSON.stringify(ranked.map((c) => ({ title: c.title, publicationDate: c.publicationDate, text: c.text, url: c.pmid ? "https://pubmed.ncbi.nlm.nih.gov/" + c.pmid + "/" : undefined }))),
  ].join("\n\n");

  async function fromGemini() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(process.env.GEMINI_MODEL || "gemini-2.5-flash") + ":generateContent?key=" + encodeURIComponent(key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
    });
    if (!response.ok) return null;
    const body = await response.json();
    const raw = body?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof raw === "string" ? { ...validate(raw), model: "gemini/" + (process.env.GEMINI_MODEL || "gemini-2.5-flash") } : null;
  }

  async function fromGroq() {
    const key = process.env.GROQ_API_KEY;
    if (!key) return null;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", messages: [{ role: "system", content: "Return only JSON with contextSummary, evidencePoints, considerationsForReview, uncertainties. Never diagnose, prescribe, or make a final clinical decision." }, { role: "user", content: prompt }], temperature: 0, response_format: { type: "json_object" } }),
    });
    if (!response.ok) return null;
    const body = await response.json();
    const raw = body?.choices?.[0]?.message?.content;
    return typeof raw === "string" ? { ...validate(raw), model: "groq/" + (process.env.GROQ_MODEL || "llama-3.3-70b-versatile") } : null;
  }

  const output = (await fromGemini()) ?? (await fromGroq());
  if (!output) throw new Error("No configured AI provider could generate the evidence review.");
  return {
    patientId: input.patientId,
    question,
    ...output,
    sources: ranked.map((c) => ({ title: c.title ?? "Medical literature", url: c.pmid ? "https://pubmed.ncbi.nlm.nih.gov/" + c.pmid + "/" : "", publicationDate: c.publicationDate, pmid: c.pmid })),
    disclaimer: "Evidence organization only. This output does not diagnose, prescribe, calculate clinical risk, or change the patient's care plan. Clinician review is required.",
  };
}
