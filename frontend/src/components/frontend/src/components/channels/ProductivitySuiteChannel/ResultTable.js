import React from 'react';

// resultRows: array of objects; columns: array of column headers
export default function ResultTable({ resultRows, columns }) {
  if (!columns.length) return <div>No data extracted.</div>;

  return (
    <table style={{ marginTop: 16, minWidth: 480 }} border="1">
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resultRows.map((row, idx) => (
          <tr key={idx}>
            {columns.map(c => (
              <td key={c}>{row[c] || ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
