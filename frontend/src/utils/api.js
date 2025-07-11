/**
 * Central API request utility for all frontend fetches.
 * Handles errors, JSON, and will handle auth/session if needed.
 */
export async function apiFetch(url, opts = {}) {
  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw new Error('Network error: ' + err);
  }
  if (!res.ok) throw new Error('API error(' + res.status + '): ' + await res.text());
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json'))
    return res.json();
  return res.text();
}
