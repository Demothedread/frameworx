const PALETTES = {
  'belle-epoque': {
    light: { background: ['#f8f5ef', '#e9e1d3'], line: '#9f7f48', pulse: '#d7a94d', text: '#241f1a', card: '#fffdf8' },
    dark: { background: ['#1b1815', '#0d0c0b'], line: '#bd9860', pulse: '#f0c36a', text: '#f7f0e5', card: '#25211d' }
  },
  'neural-network': {
    light: { background: ['#f2f6f8', '#dce7eb'], line: '#397b86', pulse: '#16a3b5', text: '#15272b', card: '#fbfeff' },
    dark: { background: ['#10191d', '#071014'], line: '#4fb4bf', pulse: '#6be0e8', text: '#e9fbfc', card: '#14242a' }
  }
};

const GROUP_COLORS = {
  'belle-epoque': { self: '#8d6c35', family: '#b17859', friend: '#57756b', work: '#69758a' },
  'neural-network': { self: '#2d8e9c', family: '#b85778', friend: '#397baf', work: '#735ca3' }
};

function project(position, centerX, centerY) {
  const perspective = 680;
  const scale = perspective / (perspective - position.z);
  return { x: position.x * scale + centerX, y: position.y * scale + centerY, scale, z: position.z };
}

function createLayout(guests, width, height, rotation) {
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width * 0.34, height * 0.35);
  const innerRadius = outerRadius * 0.6;
  const rings = [
    guests.filter((guest) => guest.closeness === 1),
    guests.filter((guest) => guest.closeness >= 2)
  ];
  const positions = new Map();

  rings.forEach((ring, ringIndex) => ring.forEach((guest, index) => {
    const angle = (index / Math.max(ring.length, 1)) * Math.PI * 2 - Math.PI / 2
      + ringIndex * 0.35 + rotation;
    const radius = ringIndex === 0 ? innerRadius : outerRadius;
    positions.set(guest.id, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.72,
      z: Math.cos(angle) * (ringIndex === 0 ? 28 : 38)
    });
  }));
  guests
    .filter((guest) => guest.closeness === 0)
    .forEach((guest) => positions.set(guest.id, { x: 0, y: 0, z: 42 }));

  return guests.map((guest) => ({
    ...guest,
    ...project(positions.get(guest.id) || { x: 0, y: 0, z: 0 }, centerX, centerY)
  }));
}

function quadraticPoint(source, control, target, progress) {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * source.x + 2 * inverse * progress * control.x + progress * progress * target.x,
    y: inverse * inverse * source.y + 2 * inverse * progress * control.y + progress * progress * target.y
  };
}

function drawConnection(context, source, target, palette, elapsed, index, reducedMotion) {
  const control = {
    x: (source.x + target.x) / 2,
    y: (source.y + target.y) / 2 - Math.min(34, Math.abs(target.x - source.x) * 0.08)
  };
  context.beginPath();
  context.moveTo(source.x, source.y);
  context.quadraticCurveTo(control.x, control.y, target.x, target.y);
  context.strokeStyle = `${palette.line}8f`;
  context.lineWidth = 1.25;
  context.stroke();

  if (reducedMotion) return;
  [0, 0.5].forEach((offset) => {
    const progress = (elapsed * 0.13 + index * 0.17 + offset) % 1;
    const point = quadraticPoint(source, control, target, progress);
    context.beginPath();
    context.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
    context.fillStyle = palette.pulse;
    context.shadowColor = palette.pulse;
    context.shadowBlur = 8;
    context.fill();
    context.shadowBlur = 0;
  });
}

function drawNode(context, node, palette, mode, emphasis) {
  const color = GROUP_COLORS[mode][node.group] || palette.line;
  const baseRadius = 22 + Math.min(node.mutual, 5) * 1.2;
  const radius = baseRadius * node.scale * (1 + emphasis * 0.12);

  if (emphasis > 0.05) {
    context.beginPath();
    context.arc(node.x, node.y, radius + 7 + emphasis * 3, 0, Math.PI * 2);
    const alpha = Math.round(80 + emphasis * 120).toString(16).padStart(2, '0');
    context.strokeStyle = `${color}${alpha}`;
    context.lineWidth = 1.5;
    context.stroke();
  }

  context.beginPath();
  context.arc(node.x, node.y, radius, 0, Math.PI * 2);
  context.fillStyle = palette.card;
  context.shadowColor = `${color}66`;
  context.shadowBlur = 12 + emphasis * 10;
  context.fill();
  context.shadowBlur = 0;
  context.strokeStyle = color;
  context.lineWidth = 2.25;
  context.stroke();

  context.fillStyle = color;
  context.font = `600 ${Math.round(11 * node.scale)}px ui-sans-serif, system-ui, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(node.monogram, node.x, node.y);

  context.font = '600 11px ui-sans-serif, system-ui, sans-serif';
  const labelWidth = Math.max(72, context.measureText(node.id).width + 32);
  const labelY = node.y + radius + 13;
  context.beginPath();
  if (typeof context.roundRect === 'function') {
    context.roundRect(node.x - labelWidth / 2, labelY - 10, labelWidth, 22, 7);
  } else {
    const x = node.x - labelWidth / 2;
    const y = labelY - 10;
    const w = labelWidth;
    const h = 22;
    const r = 7;
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }
  context.fillStyle = `${palette.card}f2`;
  context.fill();
  context.fillStyle = palette.text;
  context.fillText(node.id, node.x, labelY + 1);

  return { id: node.id, x: node.x, y: node.y, hitRadius: radius + 12 };
}

export function drawSalonScene(options) {
  const {
    context, width, height, guests, connections, mode, theme, rotation, elapsed, delta,
    reducedMotion, hoveredId, selectedId, motionState
  } = options;
  if (!width || !height) return [];
  const palette = PALETTES[mode][theme] || PALETTES[mode].light;
  const gradient = context.createRadialGradient(
    width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, palette.background[0]);
  gradient.addColorStop(1, palette.background[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const nodes = createLayout(guests, width, height, rotation);
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  connections.forEach((connection, index) => {
    const source = nodeMap.get(connection.source);
    const target = nodeMap.get(connection.target);
    if (source && target) drawConnection(context, source, target, palette, elapsed, index, reducedMotion);
  });

  return nodes
    .sort((left, right) => left.z - right.z)
    .map((node) => {
      const target = node.id === selectedId ? 1 : node.id === hoveredId ? 0.7 : 0;
      const current = motionState.get(node.id) || 0;
      const interpolation = 1 - Math.exp(-11 * delta);
      const emphasis = reducedMotion ? target : current + (target - current) * interpolation;
      motionState.set(node.id, emphasis);
      return drawNode(context, node, palette, mode, emphasis);
    });
}
