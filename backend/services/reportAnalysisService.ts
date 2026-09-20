import type { ReportAnalysis } from "@/types/reportAnalysis";

function validate(raw: string): Omit<ReportAnalysis, "model" | "disclaimer"> {
  const parsed = JSON.parse(raw) as Partial<ReportAnalysis>;
  if (typeof parsed.summary !== "string" || !Array.isArray(parsed.changes) || !Array.isArray(parsed.unchanged) || !Array.isArray(parsed.uncertainties)) {
    throw new Error("Invalid report comparison output.");
  }
  return {
    summary: parsed.summary,
    changes: parsed.changes.filter((x): x is string => typeof x === "string"),
    unchanged: parsed.unchanged.filter((x): x is string => typeof x === "string"),
    uncertainties: parsed.uncertainties.filter((x): x is string => typeof x === "string"),
  };
}

export async function compareReportText(input: { currentText: string; previousText?: string }) {
  const current = input.currentText.trim().slice(0, 30000);
  const previous = (input.previousText ?? "").trim().slice(0, 30000);
  if (!current) throw new Error("Current report text is required.");
  const prompt = [
    "You are a document comparison assistant for a doctor.",
    "Compare only the supplied report text.",
    "Do not diagnose, infer disease severity, recommend treatment, or interpret medical findings beyond stating textual differences.",
    "Quote or paraphrase only what is present in the supplied documents.",
    "If no previous report is supplied, summarize the current document without inventing a comparison.",
    "Return JSON with summary, changes, unchanged, uncertainties.",
    "CURRENT REPORT:\n" + current,
    "PREVIOUS REPORT:\n" + (previous || "[not supplied]"),
  ].join("\n\n");

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(process.env.GEMINI_MODEL || "gemini-2.5-flash") + ":generateContent?key=" + encodeURIComponent(process.env.GEMINI_API_KEY), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
      });
      if (response.ok) {
        const body = await response.json();
        const raw = body?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof raw === "string") return { ...validate(raw), model: "gemini/" + (process.env.GEMINI_MODEL || "gemini-2.5-flash"), disclaimer: "Text comparison only; clinician review required. No diagnosis or treatment recommendation is generated." };
      }
    } catch (error) { console.error("Gemini report comparison failed.", error); }
  }
  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.GROQ_API_KEY },
        body: JSON.stringify({ model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", messages: [{ role: "system", content: "Return only valid JSON with summary, changes, unchanged, uncertainties." }, { role: "user", content: prompt }], temperature: 0, response_format: { type: "json_object" } }),
      });
      if (response.ok) {
        const body = await response.json();
        const raw = body?.choices?.[0]?.message?.content;
        if (typeof raw === "string") return { ...validate(raw), model: "groq/" + (process.env.GROQ_MODEL || "llama-3.3-70b-versatile"), disclaimer: "Text comparison only; clinician review required. No diagnosis or treatment recommendation is generated." };
      }
    } catch (error) { console.error("Groq report comparison failed.", error); }
  }
  throw new Error("No configured AI provider could compare the supplied report text.");
}
