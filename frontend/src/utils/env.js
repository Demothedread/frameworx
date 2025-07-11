export async function getEnvVars() {
  const res = await fetch('/api/env');
  return res.json();
}
// Extension: Add logging, analytics, or feature flags here.
