import React from 'react';

function getFileTypes(files) {
  const groups = {};
  files.forEach(f => {
    const ext = (f.name.split('.').pop() || 'Unknown').toLowerCase();
    if (!groups[ext]) groups[ext] = [];
    groups[ext].push(f);
  });
  return Object.entries(groups);
}

export default function FileTypeTabs({ files, selectedType, setSelectedType }) {
  const fileGroups = getFileTypes(files);
  return (
    <div style={{ margin: '12px 0' }}>
      {fileGroups.map(([type, fList]) => (
        <button
          key={type}
          onClick={() => setSelectedType(type)}
          style={{
            marginRight: 8,
            padding: 6,
            fontWeight: selectedType === type ? 'bold' : undefined,
            borderBottom: selectedType === type ? '2px solid blue' : 'none',
          }}
        >
          {type} ({fList.length})
        </button>
      ))}
    </div>
  );
}
