# Firebase identity provisioning and demo data

## Patient identity provisioning
Patient APIs require Firebase ID-token custom claims:
- role: "patient"
- patientId: "<patients document id>"

Run:
`npm run provision:patient -- <firebase-uid> <patient-id>`

After claims change, sign out/in or refresh the ID token.

## Synthetic demo data
The repository includes a development-only synthetic dataset. It contains no real patient data and must not be used as production clinical data.

Run:
`npm run seed:demo`

The seed creates a patient with document ID `ONK-DEMO-001`, doctor `DOC-DEMO-001`, appointments, medicines, procedures, reports metadata, care journey, milestones and a sample care-team query.

Then provision a Firebase test account to the demo patient:
`npm run provision:patient -- <firebase-uid> ONK-DEMO-001`

Do not put real patient identifiers, medical records, or credentials into this seed script.
