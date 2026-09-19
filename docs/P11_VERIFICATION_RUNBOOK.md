# P11 Verification Runbook

## Automated checks
- npm run test:core
- npm run test:storage
- npm run test:whatsapp
- npm run test:ai-intent (requires configured Gemini or Groq credentials)
- npx tsc --noEmit

## Manual end-to-end checks
1. Patient login → dashboard → reports → upload a PDF/JPEG/PNG ≤10 MB.
2. Patient opens uploaded report; access URL is short-lived and server-authorized.
3. Patient creates query → doctor replies → patient receives notification.
4. Doctor creates milestone/medicine/procedure → patient notification appears.
5. Patient opts into WhatsApp → eligible care notifications create pending WhatsApp delivery records.
6. Without WhatsApp credentials, no external WhatsApp API request is made.
7. Doctor opens AI Command Center → signal → evidence → review/dismiss → doctor follow-up.
8. Patient asks a general medical question → intent router → RAG.
9. Patient asks for diagnosis/treatment change → safety gate; no RAG or clinical recommendation.
10. Cross-account authorization attempts return 401/403 and never expose another patient's records.

## Release gate
Do not call OnKo production-ready until automated checks and the manual flow above have been executed in a configured Firebase environment.
