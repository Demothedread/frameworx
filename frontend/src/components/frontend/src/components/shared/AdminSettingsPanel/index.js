import React from 'react';

// Placeholder for Admin Settings (LLM & API Key management)
export default function AdminSettingsPanel() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Settings Panel</h2>
      <div>
        <label>Active Model Provider:</label>
        <select disabled>
          <option>OpenAI GPT-4o (default)</option>
          <option>Google Gemini</option>
          <option>Llama/Deepseek</option>
        </select>
      </div>
      <div>
        <label>API Key:</label>
        <input type="password" disabled placeholder="Set via environment for now" />
      </div>
      <div style={{ marginTop: 14, color: 'gray' }}>
        <i>Settings UI coming soon. Configure via backend/env in this stub.</i>
      </div>
    </div>
  );
}
