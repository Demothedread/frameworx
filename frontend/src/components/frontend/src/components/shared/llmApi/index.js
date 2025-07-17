import { useCallback } from 'react';

// LLM API interface (swappable, points at configured channel backend)
export function useLLMApi() {
  // Later, URL/config will be dynamic (from admin/settings)
  const BASE_URL = '/api/channels/productivitysuitechannel';

  // Calls our backend, which handles/forwards to the actual LLM
  const extractInfo = useCallback(async (formData) => {
    const resp = await fetch(`${BASE_URL}/extract-info`, {
      method: 'POST',
      body: formData,
    });
    if (!resp.ok) throw new Error('Backend extraction failed');
    return await resp.json();
  }, []);

  return { extractInfo };
}
