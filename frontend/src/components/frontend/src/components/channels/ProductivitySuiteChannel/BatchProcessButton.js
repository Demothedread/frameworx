import React from 'react';

export default function BatchProcessButton({ onProcess, loading }) {
  return (
    <button disabled={loading} onClick={onProcess} style={{ marginTop: 14 }}>
      {loading ? 'Processing…' : 'Extract Info (via LLM)'}
    </button>
  );
}
