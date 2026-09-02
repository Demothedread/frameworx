const PERSONAS = {
  'belle-epoque': [
    ['Salon Host', 'A discerning convener who brings distinct circles into productive conversation.'],
    ['Cultural Patron', 'A close confidante with a strong eye for culture, context, and enduring ideas.'],
    ['Independent Editor', 'A trusted interlocutor who sharpens ideas through candid and precise exchange.'],
    ['Research Correspondent', 'A specialist connection who contributes evidence, perspective, and new questions.'],
    ['Creative Associate', 'A versatile collaborator working where social insight meets creative practice.']
  ],
  'neural-network': [
    ['Network Principal', 'The central intelligence joining people, context, and decisions across the network.'],
    ['Signal Curator', 'A high-trust connection who identifies meaningful patterns in a noisy information field.'],
    ['Systems Editor', 'A close collaborator who tests assumptions and turns raw thought into useful structure.'],
    ['Research Node', 'A specialist connection supplying evidence and domain-specific perspective.'],
    ['Creative Node', 'A flexible collaborator translating ideas across people, media, and systems.']
  ]
};

const TOPICS = {
  'belle-epoque': [
    ['Network stewardship', 'Cultural movements', 'Long-range planning'],
    ['Artistic patronage', 'Social change', 'Shared history'],
    ['Editorial judgment', 'Emerging ideas', 'Trusted introductions'],
    ['Research findings', 'Institutional memory', 'Open questions'],
    ['Creative practice', 'New collaborations', 'Public presentation']
  ],
  'neural-network': [
    ['Network strategy', 'Signal quality', 'Decision pathways'],
    ['Pattern recognition', 'Context sharing', 'Emergent risks'],
    ['Systems design', 'Knowledge synthesis', 'Priority setting'],
    ['Research signals', 'Evidence quality', 'Unknown variables'],
    ['Creative systems', 'Interface design', 'Cross-domain work']
  ]
};

export function buildSalonGuests(nodes, mode) {
  const personas = PERSONAS[mode] || PERSONAS['belle-epoque'];
  const topics = TOPICS[mode] || TOPICS['belle-epoque'];
  return nodes.map((node, index) => ({
    ...node,
    monogram: node.id.slice(0, 2).toUpperCase(),
    persona: {
      title: personas[index % personas.length][0],
      description: personas[index % personas.length][1]
    },
    topics: topics[index % topics.length],
    circleLabel: node.closeness === 0 ? 'Center' : node.closeness === 1 ? 'Inner' : 'Extended'
  }));
}

export function getGroupLabel(group) {
  return {
    self: 'Primary',
    family: 'Family',
    friend: 'Friend',
    work: 'Professional'
  }[group] || 'Connection';
}
