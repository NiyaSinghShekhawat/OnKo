#!/usr/bin/env bash
set -euo pipefail
echo "TypeScript compile check"
npx tsc --noEmit
echo "AI intent tests require configured GEMINI_API_KEY or GROQ_API_KEY; run npm run test:ai-intent when credentials are available."
