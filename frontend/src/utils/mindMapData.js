/**
 * Sample dataset for the MindMap channel.
 * Each entry describes a person and their relations.
 * - id: unique name
 * - group: relationship type (family|friend|work|self)
 * - mutual: count of shared connections with you
 * - closeness: 1=inner circle, 2=outer
 */
export function getSampleMindMap() {
  const YOU = 'You';
  const nodes = [
    { id: YOU, group: 'self', mutual: 0, closeness: 0 },
    { id: 'Alice', group: 'family', mutual: 5, closeness: 1 },
    { id: 'Bob', group: 'friend', mutual: 3, closeness: 1 },
    { id: 'Carol', group: 'work', mutual: 1, closeness: 2 },
    { id: 'Dave', group: 'friend', mutual: 2, closeness: 2 }
  ];
  const links = [
    { source: YOU, target: 'Alice' },
    { source: YOU, target: 'Bob' },
    { source: YOU, target: 'Carol' },
    { source: YOU, target: 'Dave' },
    { source: 'Bob', target: 'Dave' },
    { source: 'Alice', target: 'Bob' }
  ];
  return { nodes, links };
}
