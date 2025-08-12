// App.js: Cleaned up, test button removed, LorePanel toggle retained
import React, { useState } from 'react';
import ChannelContainer from '../components/ChannelContainer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SharedStateProvider } from '../context/SharedStateContext';
import NotificationContainer from '../components/notifications/NotificationContainer';
import LorePanel from '../components/gamification/LorePanel';

export default function App() {
  const [loreVisible, setLoreVisible] = useState(false);

  return (
    <SharedStateProvider>
      <ErrorBoundary>
        <NotificationContainer />
        <button
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 10000,
            padding: '10px 18px',
            borderRadius: '6px',
            background: '#222',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          onClick={() => setLoreVisible((v) => !v)}
        >
          {loreVisible ? 'Hide Lore Panel' : 'Show Lore Panel'}
        </button>
        <LorePanel visible={loreVisible} onClose={() => setLoreVisible(false)} />
        <ChannelContainer />
      </ErrorBoundary>
    </SharedStateProvider>
  );
}
