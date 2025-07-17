import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

// Helper to display default table based on uploaded files and backend LLM response
function TableTabs({ tables }) {
  const [tab, setTab] = useState(Object.keys(tables)[0] || '');
  if (!tables || Object.keys(tables).length === 0) return <div>No tables to display.</div>;
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {Object.keys(tables).map(type => (
          <button
            key={type}
            onClick={() => setTab(type)}
            style={{ marginRight: 8, fontWeight: tab === type ? 'bold' : 'normal' }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 350, width: '100%', background: '#222', borderRadius: 12, padding: '8px' }}>
        <DataGrid
          rows={tables[tab].rows}
          columns={tables[tab].columns}
          autoHeight
          pageSize={Math.min(6, tables[tab].rows.length || 1)}
        />
      </div>
    </div>
  );
}

// The main Upload & Sort Channel
export default function UploadAndSort() {
  const [files, setFiles] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [tables, setTables] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file(s) upload
  function onFileChange(e) {
    setFiles(Array.from(e.target.files || []));
    setTables({}); // reset output on new upload
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!files.length) {
      setError('Please select file(s).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = new FormData();
      files.forEach(f => body.append('files', f));
      body.append('instructions', instructions || '');
      const res = await fetch('/api/uploadandsort', {
        method: 'POST',
        body,
      });
      if (!res.ok) throw new Error('Upload or processing failed.');
      const data = await res.json();
      // Expect backend to return: { tables: { filetype1: {columns, rows}, ... } }
      setTables(data.tables || {});
    } catch (e) {
      setError('Error during processing: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{color:'#ddd'}}>
      <h2>Upload and Sort (LLM-powered)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', margin: '16px 0 8px' }}>
          Select files to upload (multiple allowed):
          <input type="file" multiple onChange={onFileChange} />
        </label>
        <label style={{ display: 'block', margin: '16px 0 8px' }}>
          Optional: Tell the AI what info you want for each file (e.g. extract summary, tags, inventory, etc):
          <textarea value={instructions} onChange={e => setInstructions(e.target.value)}
            rows={3} cols={60}
            placeholder="E.g., for images: Return size, format, detected objects. For docs: Return summary, topics, word count." />
        </label>
        <button disabled={loading} type="submit" style={{padding:'7px 18px', fontWeight:'bold'}}>Upload & Sort</button>
      </form>
      {error && <div style={{color: 'tomato', marginBottom:10}}>{error}</div>}
      {loading && <div>Processing files with AI... Please wait.</div>}
      {!loading && Object.keys(tables).length > 0 && (
        <TableTabs tables={tables} />
      )}
    </div>
  );
}
