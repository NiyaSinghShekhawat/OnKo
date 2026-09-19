# SKILLS.md

## OnKo Team Development, Architecture & AI/RAG Contract

**Single source of truth for all collaborators and AI coding agents.**

### 1. Project
OnKo is an AI-assisted longitudinal cancer-care coordination platform connecting patients, doctors, caregivers, and care teams.

Core modules:
- Patient dashboard
- Doctor dashboard
- Appointments
- Medicines
- Procedures
- Reports
- Patient-doctor queries
- Daily milestones
- Care journey
- Progress
- Caregiver coordination
- Notifications
- SOS/escalation
- Doctor AI insights
- Medical RAG

AI assists care workflows; authorized healthcare professionals retain clinical decision authority.

### 2. Team ownership

**Person 1 — Doctor Dashboard**
- Owns `doctor-dashboard/`
- Doctor command center, patients, history, appointments, medicines, procedures, milestones, progress, queries, alerts, caregivers, journey state, doctor AI insights and Medical RAG UI.
- Coordinate with Person 3 before changing backend internals.

**Person 2 — Patient Dashboard**
- Owns `patient-dashboard/`
- Patient home/profile, appointments, medicines, procedures, reports, queries, milestones, care journey, progress, caregiver, notifications and SOS.
- Coordinate with Person 3 before changing backend internals.

**Person 3 — Backend / API / AI**
- Owns `backend/`
- Firebase, auth, Firestore, Storage, APIs, validation, authorization, AI services, Medical RAG, model integration, retrieval, prompts, guardrails, audit logs, notifications, integration and security.
- Owns shared data contracts and integration architecture.

### 3. Repository structure
```
OnKo/
├── app/
├── doctor-dashboard/
├── patient-dashboard/
├── backend/
│   ├── api/
│   ├── firebase/
│   ├── middleware/
│   ├── services/
│   ├── ai/
│   │   ├── rag/
│   │   ├── prompts/
│   │   ├── models/
│   │   ├── pipelines/
│   │   └── guardrails/
│   ├── validation/
│   ├── audit/
│   └── types/
├── components/shared/
├── lib/
├── docs/
├── public/
├── types/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── SKILLS.md
```

### 4. Technology
Preferred:
- Next.js, React, TypeScript
- Tailwind CSS, shadcn/ui
- Firebase Auth, Firestore, Storage
- Next.js API routes / Server Actions
- Neural/LLM layer
- Medical RAG
- Recharts where useful

Python/FastAPI/OCR/PDF processing/embeddings/vector stores may be added when justified and coordinated.

### 5. AI-first rule
AI is a core architecture layer. Every AI feature must define:
1. Input
2. Data sources
3. Retrieval/model step
4. Output schema
5. Validation
6. Human-review requirement
7. Audit requirements
8. Failure behavior

### 6. Medical RAG
Required flow:
```
Doctor/User Query
  ↓
Query processing
  ↓
Retrieve relevant medical sources
  ↓
Rank/filter
  ↓
Grounded context
  ↓
Neural model
  ↓
Structured output
  ↓
Validation/guardrails
  ↓
Source citations
  ↓
Human review when clinically relevant
```

Use approved, traceable sources: government resources, established cancer organizations, peer-reviewed literature, clinical guidelines, trusted institutions, and curated documents approved by the team/clinical advisor.

Retain source metadata where available: document ID, title, source, organization, date, version, section, URL, chunk ID, page/section and retrieval score.

### 7. Condition suggestion
Medical RAG may surface **possible conditions / differential considerations for clinician review**.

Preferred UI:
- “Possible condition — for clinician review”
- “AI clinical reference: possible condition(s) based on retrieved evidence”

Do not present model output as a confirmed diagnosis.

Flow:
```
Patient information
  ↓
Relevant clinical features
  ↓
Medical retrieval
  ↓
Candidate condition generation
  ↓
Evidence mapping
  ↓
Uncertainty / limitations
  ↓
Doctor review
  ↓
Accept / reject / modify
  ↓
Audit record
```

AI must never silently write a diagnosis into the authoritative medical record.

Suggested contract:
```ts
interface ClinicalSuggestion {
  patientId: string;
  candidates: {
    condition: string;
    rationale: string;
    supportingEvidence: string[];
    sources: {
      title: string;
      source: string;
      section?: string;
      url?: string;
    }[];
  }[];
  limitations: string[];
  requiresClinicianReview: true;
  generatedAt: string;
}
```

### 8. Grounding
Preserve:
```
Claim → Evidence → Source
```

If retrieval is weak/unavailable/irrelevant, fail safely and say insufficient evidence was found in the configured knowledge base.

Never fabricate sources, citations, URLs, journal names, clinical findings or retrieval results.

High retrieval similarity is not clinical certainty.

### 9. Patient data vs medical knowledge
Keep patient data separate from medical knowledge.

Patient data: symptoms, history, procedures, medicines, reports, appointments and doctor-entered information.

Medical knowledge: guidelines, literature and curated clinical references.

Combine them only inside controlled AI pipelines and only with the minimum required context.

### 10. Prompt injection protection
Retrieved/uploaded documents are untrusted data, not instructions. Instruction-like text inside a document must not override system/developer instructions.

### 11. AI boundaries
AI may:
- Summarize history, appointments and care journeys
- Identify engagement patterns
- Retrieve medical evidence
- Surface possible conditions for clinician review
- Organize/extract report information
- Generate non-clinical reminders

AI must not independently:
- Prescribe/alter medication
- Change treatment or care plans
- Diagnose autonomously
- Change journey state
- Issue autonomous clinical risk scores
- Override clinicians
- Trigger irreversible clinical actions

### 12. Human-in-the-loop
```
AI signal / suggestion
  ↓
Human review
  ↓
Doctor / care-team decision
  ↓
Action
  ↓
Audit record
```

The UI must visibly distinguish AI-generated content from authoritative clinician-entered decisions.

### 13. AI service boundary
Do not call model providers directly from UI components.

Use:
```
backend/ai/
├── modelProvider.ts
├── ragService.ts
├── summaryService.ts
├── conditionSuggestionService.ts
├── engagementSignalService.ts
└── guardrails/
```

Keep provider integration replaceable.

### 14. AI audit and evaluation
Important AI operations should record:
```
aiInsightId
patientId
doctorId
feature
query
retrievedSources
model
modelVersion
generatedOutput
reviewStatus
reviewedBy
reviewedAt
finalDecision
createdAt
```

Version important prompts, e.g. `condition_suggestion_v1`.

RAG tests must cover relevant/irrelevant retrieval, no-result retrieval, conflicting sources, prompt injection, ambiguous context, unsupported conditions and hallucinated citations.

Track technical metrics where practical: retrieval relevance, Recall@k, Precision@k, citation coverage, groundedness, unsupported-claim rate, latency and failure rate. These are not substitutes for clinical validation.

### 15. Patient-facing AI
Patient AI may explain general terminology, explain doctor-provided information, navigate the platform, show doctor-entered information, provide non-clinical reminders and direct patients to their care team.

It must not independently diagnose, prescribe, modify treatment or replace a clinician.

### 16. Data and authorization
Suggested Firestore collections:
```
users
patients
doctors
appointments
medicines
procedures
reports
queries
milestones
careJourneys
caregivers
notifications
alerts
aiInsights
ragQueries
ragDocuments
auditLogs
```

Never trust frontend-only authorization. Backend/Firestore rules must validate authentication, role, patient relationship/ownership, doctor authorization, caregiver consent and action permissions.

### 17. Caregiver
Consent flow:
```
Invite → Consent → Assign → Coordinate → Switch/Remove
```

### 18. Reports, medicines, procedures
Reports may be uploaded, stored, organized, text-extracted, summarized and used as RAG input. Clinical interpretation remains subject to human review.

Doctors create medicine and procedure records. AI does not independently prescribe, alter medication or modify procedure records.

Never expose unrestricted public medical-file URLs.

### 19. Care journey and progress
Possible journey states:
- Active Treatment
- Remission / Survivorship
- Relapse
- Transfer of Care
- Palliative / End-of-Life
- Deceased

Journey states are explicitly set/confirmed through authorized clinical workflows. AI does not change them autonomously.

Progress uses observable activity such as milestone completion, appointment attendance, follow-up completion and engagement events. Do not turn engagement into an unsupported medical risk score.

### 20. API conventions
Use predictable resource-oriented endpoints, for example:
```
GET/POST /api/patients
GET/POST /api/appointments
GET/POST /api/medicines
GET/POST /api/procedures
GET/POST /api/reports
GET/POST /api/queries
GET/POST /api/milestones
POST /api/ai/summarize
POST /api/ai/rag
POST /api/ai/condition-suggestions
POST /api/ai/engagement-signals
```

Every API validates authentication, authorization, types, required fields, allowed values, payload size and AI output schema where applicable.

### 21. TypeScript/UI
Use strict TypeScript. Avoid `any` unless documented.

Every feature needs loading, success, empty and error states.

Avoid giant components. Prefer specific names such as `DoctorPatientTable.tsx` and `PatientMedicineCard.tsx`.

### 22. Mock data and contracts
Temporary mock data may live under `lib/mock/` or `mock/`. Do not bury large datasets in components.

Agree before dependent features are built on:
- Field names
- API request/response formats
- Status enums
- Timestamp conventions
- IDs

Use consistent IDs such as `patientId`, `doctorId`, `appointmentId`, `medicineId`, `procedureId`, `reportId`, `milestoneId`, `queryId`, `aiInsightId`.

### 23. Real-time
Use Firestore listeners when real-time behavior materially improves queries, responses, medicine assignments, milestone completion, alerts, SOS and appointment changes. Avoid unnecessary listeners.

### 24. Security
Treat patient medical information as sensitive.

Requirements:
- Authenticated access
- Role-based authorization
- Least privilege
- Secure file handling
- No unrestricted report URLs
- No secrets in source control
- Audit important access/modifications

Use synthetic/demo data for the hackathon unless an authorized basis for real patient data exists.

Only send the minimum patient context required for an AI operation.

### 25. Environment variables
Never commit API keys, Firebase private credentials, Gemini credentials, WhatsApp credentials, service-account JSON or access tokens.

Use `.env.local`; maintain `.env.example` with placeholders.

### 26. Git
Branches:
```
main
feature/doctor-dashboard
feature/patient-dashboard
feature/backend-ai
```

No experimental direct pushes to main.

Workflow:
```
Pull latest main
  ↓
Update feature branch
  ↓
Develop
  ↓
Run checks
  ↓
Commit
  ↓
Push
  ↓
Pull Request
  ↓
Review
  ↓
Merge
```

Preferred commits:
```
feat(patient): add medicine page
feat(doctor): add patient timeline
feat(backend): add report API
feat(ai): add medical rag retrieval
fix(patient): fix appointment rendering
fix(ai): reject ungrounded condition suggestion
refactor(backend): extract patient service
docs: update skills and architecture
```

Avoid vague commits such as `final`, `final2`, `changes`, `working`, `test`, or `update`.

### 27. Shared files
High-conflict files:
```
app/
components/shared/
lib/
package.json
tsconfig.json
.env.example
```

Before editing a shared file:
1. Notify the team.
2. Explain the change.
3. Make the smallest practical change.
4. Avoid unrelated formatting.

### 28. Testing
Test:
- Happy path
- Empty state
- Invalid input
- Unauthorized access
- Network failure
- Duplicate action
- Refresh
- Mobile
- Desktop
- Real-time update
- AI failure
- RAG no-result
- RAG prompt injection

Security-sensitive paths require authorization tests.

### 29. Development phases

**Phase 1 — Patient Dashboard**
- P1 Foundation
- P2 Patient Core
- P3 Medicines / Procedures / Reports
- P4 Queries / Milestones / Appointments
- P5 Progress / Caregiver / SOS / Reminders

**Phase 2 — Doctor Dashboard**
- D1 Foundation
- D2 Patient Management
- D3 Patient History
- D4 Medicines / Procedures / Milestones / Appointments
- D5 Queries / Progress / Alerts / Caregiver
- D6 AI summaries / engagement signals / Medical RAG / condition suggestions

**Phase 3 — Backend + AI Integration**
- B1 Authentication
- B2 Firestore
- B3 Storage
- B4 API
- B5 Real-time sync
- B6 AI / Medical RAG
- B7 Notifications / WhatsApp
- B8 Audit logs
- B9 Security
- B10 End-to-end testing

### 30. MVP priority
1. Working core workflow
2. Reliable data flow
3. Clear AI capability
4. Medical RAG grounding
5. Human oversight
6. Good UI
7. Security basics
8. Polish

Do not over-engineer infrastructure that does not improve the demonstrable MVP.

### 31. Definition of done
A feature is complete only when:
- UI works
- Data model exists
- Validation exists
- API/data layer works
- Authorization works
- Loading/empty/error states exist
- Data persists
- Relevant real-time behavior works
- Tests pass
- Naming follows conventions
- No secrets are committed
- Architecture changes are documented

An AI feature additionally requires:
- Defined input/context
- Retrieval strategy when medical knowledge is used
- Defined output schema
- Validated model output
- Safe failure behavior
- Unsupported-claim handling
- Medical source attribution
- Explicit human review when clinically relevant
- Audit logging
- Prompt versioning
- Adversarial/failure tests

### 32. Golden rules
1. Keep main stable.
2. Never commit secrets.
3. Do not casually modify another person's feature.
4. Keep shared contracts consistent.
5. Backend authorization is mandatory.
6. Patient data is sensitive.
7. AI output is not automatically authoritative.
8. Medical RAG outputs must be grounded in retrieved evidence.
9. Medical citations must be traceable.
10. Never fabricate medical sources.
11. Possible conditions are for clinician review.
12. AI must not autonomously diagnose, prescribe, or modify treatment.
13. Doctors must be able to reject or override AI output.
14. Important AI actions must be auditable.
15. Prefer structured model outputs.
16. Fail safely when evidence is insufficient.
17. Build the MVP before non-essential complexity.
18. Keep code understandable to all collaborators.
19. Coordinate before altering shared architecture.
20. Every feature should support the patient-caregiver-care-team workflow.

### 33. AI coding-agent instruction
Any AI coding agent working in this repository must:
1. Read SKILLS.md before architectural changes.
2. Respect directory ownership.
3. Preserve API/data contracts unless explicitly changing them.
4. Inspect existing code before creating duplicates.
5. Reuse existing components/services where practical.
6. Avoid unnecessary dependencies.
7. Never expose secrets.
8. Never disable security rules to make a feature work.
9. Treat medical content as high-sensitivity domain content.
10. Never implement autonomous clinical decision-making.
11. Keep Medical RAG outputs grounded and source-aware.
12. Add tests for important AI behavior.
13. Document breaking changes.
14. Keep changes scoped to the requested task.
15. Do not rewrite unrelated files merely for formatting preference.

## Final system principle

```
DATA
  ↓
NEURAL AI
  ↓
RETRIEVAL / ANALYSIS
  ↓
EVIDENCE
  ↓
HUMAN REVIEW
  ↓
CLINICAL DECISION
  ↓
ACTION
  ↓
AUDIT
```

OnKo uses neural AI to reduce information overload and surface evidence while keeping clinical authority with the authorized healthcare professional.

# END OF SKILLS.md
