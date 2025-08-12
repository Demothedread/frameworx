// LoreFragment data model:
// { id: string, title: string, content: string, trigger: { type: string, value: any } }

export const loreData = [
  {
    id: 'lore-1',
    title: 'Channel of the People',
    content: 'You stumble upon communal channel. Many comrades before you, all waiting for ration of WiFi. Like old breadline, but with more clicking. Somewhere, American "Walmart" is mentioned, but nobody knows what it sells.',
    trigger: { type: 'visit-channel', value: 'general' }
  },
  {
    id: 'lore-2',
    title: 'Forbidden Knowledge of the Bourgeois',
    content: 'You read post written by mysterious capitalist. It speaks of "Amazon Prime" and "freedom," but you only understand struggle. Wisdom is heavy, like sack of potatoes.',
    trigger: { type: 'read-post', value: 'post-42' }
  },
  {
    id: 'lore-3',
    title: 'First Message of Solidarity',
    content: 'You send message to collective. Nobody replies, but you feel spirit of revolution. Somewhere, "Facebook" is referenced, but it is unclear if it is food or tractor.',
    trigger: { type: 'send-message', value: null }
  },
  {
    id: 'lore-4',
    title: 'Hero of Three Channels',
    content: 'You visit three channels. Each one promises utopia, but all have ads for "Coca-Cola" and "McDonald\'s." You remain vigilant, comrade.',
    trigger: { type: 'visit-channel-count', value: 3 }
  }
];