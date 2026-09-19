# Firebase identity provisioning

Patient APIs require Firebase ID-token custom claims:

- `role: "patient"`
- `patientId: "<patients document id>"`

The claims are intentionally server-managed. Do not let the browser choose a patient ID or role.

For a local/admin environment, run the provisioning utility with the Firebase Admin environment variables configured:

```
npm run provision:patient -- <firebase-uid> <patient-id>
```

After claims are changed, the patient must obtain a fresh ID token (sign out/in, or refresh the token) before the new claims are visible.

This utility is an operational setup tool, not a public API endpoint.
