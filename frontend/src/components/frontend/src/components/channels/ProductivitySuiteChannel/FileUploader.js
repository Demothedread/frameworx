import React from 'react';

export default function FileUploader({ onFilesSelected }) {
  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="file"
        multiple
        onChange={handleChange}
        style={{ display: 'block' }}
      />
    </div>
  );
}
