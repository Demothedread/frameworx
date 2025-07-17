import React from 'react';

export default function InstructionBox({ value, setValue }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor="instructions"><b>Custom LLM Instructions:</b></label><br />
      <textarea
        id="instructions"
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={3}
        style={{ width: 400 }}
        placeholder="Describe what details you want extracted from these files..."
      />
    </div>
  );
}
