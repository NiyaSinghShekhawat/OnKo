# OnKo Doctor Dashboard — 5 Phase Completion Plan

This completion work is additive. Existing doctor and patient routes remain intact; new workspaces reuse the existing authenticated APIs and shared Firestore collections.

## Phase 1 — Shared workflow foundation
- Preserve existing `/doctor`, `/doctor/ai`, `/doctor/signals`, and `/doctor/reference` implementations.
- Add private doctor notes that are doctor-scoped and never exposed by patient APIs.
- Keep doctor-created medicines, procedures, milestones and care-phase changes on the existing shared collections so the patient realtime provider receives the same records.
- Treat the existing patient-facing data provider as the source of truth for what patients see.

## Phase 2 — Doctor operations workspaces
- Add a dedicated doctor operations workspace for Progress, Care Plans, Appointments, Queries/Triage, Reports, Caregivers and Audit/Emergency.
- Reuse the existing `/api/doctor/workspace` aggregation and existing mutation endpoints instead of duplicating collections.
- Add direct links back to Patient 360 for detailed edits.

## Phase 3 — Clinical-document workflow
- Add report review tooling around the existing report viewer/review API.
- Add report comparison UI based only on documented report metadata/content available to the application; do not invent extracted findings.
- Add private doctor notes and follow-up tasks.
- Keep patient report visibility unchanged.

## Phase 4 — AI doctor review workflow
- Add a doctor-only evidence workspace that uses the existing medical retrieval layer.
- AI output is framed as evidence-backed considerations for clinician review, never as autonomous diagnosis, prescription, risk score or care-plan mutation.
- Allow the doctor to create a follow-up task from an AI observation.
- Preserve the existing AI Command Center and Patient 360 AI summaries.

## Phase 5 — Doctor ↔ patient synchronization and hardening
- Verify every doctor mutation that patients should see uses shared collections.
- Verify patient realtime listeners cover appointments, medicines, queries, reports, care journeys, procedures and milestones.
- Surface patient notifications for doctor-driven care updates through the existing notification trigger path.
- Keep private doctor notes and internal audit data doctor-only.
- Run type/build/test verification before merging.

## Non-overlap rules
1. Do not rename or delete existing doctor components.
2. Do not replace the Patient 360 data model.
3. Do not create parallel medicine/procedure/milestone/query/report collections.
4. Do not let patient APIs read `doctorNotes`.
5. Do not let AI directly mutate clinical records.
6. New routes must use `requireDoctor` and existing doctor ownership checks.
