import React, { createContext, useMemo, useState, useEffect } from 'react';
import eventBus from '../utils/eventBus';
import { NarrativeEngine } from '../gamification/NarrativeEngine';
import { loreData } from '../gamification/lore';

export const SharedStateContext = createContext({
  eventBus,
  sharedState: {},
  narrativeEngine: null,
  unlockedLoreIds: [],
});

export function SharedStateProvider({ children }) {
  const [unlockedLoreIds, setUnlockedLoreIds] = useState([]);
  const narrativeEngine = useMemo(() => new NarrativeEngine(eventBus, loreData), []);

  useEffect(() => {
    narrativeEngine.init();
    const updateLore = () => {
      setUnlockedLoreIds(narrativeEngine.getUnlockedLoreIds());
    };
    eventBus.on('lore-unlocked', updateLore);
    return () => {
      eventBus.off('lore-unlocked', updateLore);
    };
  }, [narrativeEngine]);

  const value = {
    eventBus,
    sharedState: {},
    narrativeEngine,
    unlockedLoreIds,
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
}