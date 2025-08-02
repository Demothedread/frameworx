import React from 'react';
import ChannelContainer from './components/ChannelContainer';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  // Optionally wrap each Channel individually for finer-grained error recovery
  return (
    <ErrorBoundary>
      <ChannelContainer />
    </ErrorBoundary>
  );
}
