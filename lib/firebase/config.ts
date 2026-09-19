const requiredFirebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseConfig() {
  const missing = Object.entries(requiredFirebaseEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(", ")}. Add them to .env.local.`,
    );
  }

  return {
    apiKey: requiredFirebaseEnv.apiKey!,
    authDomain: requiredFirebaseEnv.authDomain!,
    projectId: requiredFirebaseEnv.projectId!,
    storageBucket: requiredFirebaseEnv.storageBucket!,
    messagingSenderId: requiredFirebaseEnv.messagingSenderId!,
    appId: requiredFirebaseEnv.appId!,
  };
}
