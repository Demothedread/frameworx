import React, { useContext, useMemo } from 'react';
import { SharedStateContext } from '../../context/SharedStateContext';
import { loreData } from '../../gamification/lore';

function buildLoreLookup(data) {
  return data.reduce((acc, fragment) => {
    acc[fragment.id] = fragment;
    return acc;
  }, {});
}

export default function LorePanel({ visible, onClose }) {
  const { unlockedLore } = useContext(SharedStateContext);
  const loreLookup = useMemo(() => buildLoreLookup(loreData), []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: '#fff',
        color: '#222',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        padding: '20px',
        minWidth: '320px',
        maxWidth: '400px',
        zIndex: 9998
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 8,
          right: 12,
          background: 'transparent',
          border: 'none',
          color: '#222',
          fontSize: '1.2em',
          cursor: 'pointer'
        }}
        aria-label='Close lore panel'
      >
        ×
      </button>
      <h3 style={{ marginTop: 0 }}>Unlocked Lore</h3>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {unlockedLore && unlockedLore.length > 0 ? (
          unlockedLore.map((id) => {
            const loreItem = loreLookup[id];
            return (
              <li
                key={id}
                style={{
                  marginBottom: '14px',
                  padding: '10px',
                  background: '#f7f7f7',
                  borderRadius: '5px'
                }}
              >
                <strong>{loreItem?.title || 'Unknown'}</strong>
                <div>{loreItem?.content || 'No lore text available.'}</div>
              </li>
            );
          })
        ) : (
          <li>No lore fragments unlocked yet.</li>
        )}
      </ul>
    </div>
  );
}

export { buildLoreLookup };
