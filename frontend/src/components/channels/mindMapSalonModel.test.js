import { buildSalonGuests, getGroupLabel } from './mindMapSalonModel';

const nodes = [
  { id: 'You', group: 'self', mutual: 0, closeness: 0 },
  { id: 'Alice', group: 'family', mutual: 5, closeness: 1 }
];

describe('mind map salon model', () => {
  test('builds deterministic, presentation-ready guest records', () => {
    const first = buildSalonGuests(nodes, 'belle-epoque');
    const second = buildSalonGuests(nodes, 'belle-epoque');

    expect(first).toEqual(second);
    expect(first[0]).toMatchObject({ monogram: 'YO', circleLabel: 'Center' });
    expect(first[1]).toMatchObject({ monogram: 'AL', circleLabel: 'Inner' });
    expect(first[1].topics).toHaveLength(3);
  });

  test('changes professional copy with the selected view', () => {
    const salonGuest = buildSalonGuests(nodes, 'belle-epoque')[0];
    const networkGuest = buildSalonGuests(nodes, 'neural-network')[0];

    expect(salonGuest.persona.title).toBe('Salon Host');
    expect(networkGuest.persona.title).toBe('Network Principal');
  });

  test('maps internal groups to reader-facing labels', () => {
    expect(getGroupLabel('work')).toBe('Professional');
    expect(getGroupLabel('unknown')).toBe('Connection');
  });
});
