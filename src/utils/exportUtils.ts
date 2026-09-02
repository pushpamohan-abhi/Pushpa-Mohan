import { DfaDefinition } from '../types';

const stateColorPalette = [
  { fill: '#1e3a8a', stroke: '#3b82f6', text: '#bfdbfe' }, // Blue
  { fill: '#581c87', stroke: '#a855f7', text: '#e9d5ff' }, // Purple
  { fill: '#064e3b', stroke: '#10b981', text: '#a7f3d0' }, // Emerald
  { fill: '#78350f', stroke: '#f59e0b', text: '#fde68a' }, // Amber
  { fill: '#831843', stroke: '#f43f5e', text: '#fecdd3' }, // Rose
  { fill: '#164e63', stroke: '#06b6d4', text: '#cffafe' }, // Cyan
];

export function generateDfaDiagramImage(dfa: DfaDefinition): Promise<string> {
  return new Promise((resolve) => {
    const width = 600;
    const height = 350;
    const svgNamespace = "http://www.w3.org/2000/svg";
    
    const numStates = dfa.states.length;
    const stateCoords: Record<string, { x: number; y: number }> = {};
    dfa.states.forEach((st, idx) => {
      const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
      const radius = 110;
      stateCoords[st] = {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      };
    });

    if (numStates === 2) {
      stateCoords[dfa.states[0]] = { x: 180, y: 175 };
      stateCoords[dfa.states[1]] = { x: 420, y: 175 };
    } else if (numStates === 3) {
      stateCoords[dfa.states[0]] = { x: 150, y: 175 };
      stateCoords[dfa.states[1]] = { x: 300, y: 100 };
      stateCoords[dfa.states[2]] = { x: 450, y: 175 };
    } else if (numStates === 4) {
      stateCoords[dfa.states[0]] = { x: 180, y: 110 };
      stateCoords[dfa.states[1]] = { x: 420, y: 110 };
      stateCoords[dfa.states[2]] = { x: 180, y: 240 };
      stateCoords[dfa.states[3]] = { x: 420, y: 240 };
    }

    let svgContent = `<svg xmlns="${svgNamespace}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svgContent += `<rect width="100%" height="100%" fill="#0f172a" rx="16"/>`;

    svgContent += `<defs>
      <marker id="arrowhead" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/>
      </marker>
    </defs>`;

    const stateColorMap: Record<string, { fill: string; stroke: string; text: string }> = {};
    dfa.states.forEach((st, idx) => {
      stateColorMap[st] = stateColorPalette[idx % stateColorPalette.length];
    });

    const edgeMap: Record<string, string[]> = {};
    dfa.transitions.forEach(t => {
      const key = `${t.from}->${t.to}`;
      if (!edgeMap[key]) edgeMap[key] = [];
      edgeMap[key].push(t.symbol);
    });

    Object.entries(edgeMap).forEach(([key, symbols]) => {
      const [from, to] = key.split('->');
      const fromCoord = stateCoords[from] || { x: 100, y: 100 };
      const toCoord = stateCoords[to] || { x: 200, y: 200 };
      const symbolLabel = symbols.join(', ');
      const sourceColor = stateColorMap[from] || stateColorPalette[0];

      if (from === to) {
        // Self loop
        svgContent += `<path d="M ${fromCoord.x - 15} ${fromCoord.y - 25} C ${fromCoord.x - 55} ${fromCoord.y - 85}, ${fromCoord.x + 55} ${fromCoord.y - 85}, ${fromCoord.x + 15} ${fromCoord.y - 25}" fill="none" stroke="${sourceColor.stroke}" stroke-width="2.5" marker-end="url(#arrowhead)"/>`;
        svgContent += `<rect x="${fromCoord.x - 24}" y="${fromCoord.y - 68}" width="48" height="22" rx="4" fill="${sourceColor.fill}" stroke="${sourceColor.stroke}" stroke-width="1.5"/>`;
        svgContent += `<text x="${fromCoord.x}" y="${fromCoord.y - 53}" fill="${sourceColor.text}" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">${symbolLabel}</text>`;
      } else {
        // Check if reverse edge exists
        const reverseKey = `${to}->${from}`;
        const hasReverse = !!edgeMap[reverseKey];

        const dx = toCoord.x - fromCoord.x;
        const dy = toCoord.y - fromCoord.y;
        const angle = Math.atan2(dy, dx);

        if (hasReverse) {
          // Curved path for bidirectional edges to prevent overlap
          const ctrlX = (fromCoord.x + toCoord.x) / 2 - 35 * Math.sin(angle);
          const ctrlY = (fromCoord.y + toCoord.y) / 2 + 35 * Math.cos(angle);
          const labelX = (fromCoord.x + toCoord.x) / 2 - 22 * Math.sin(angle);
          const labelY = (fromCoord.y + toCoord.y) / 2 + 22 * Math.cos(angle);

          svgContent += `<path d="M ${fromCoord.x} ${fromCoord.y} Q ${ctrlX} ${ctrlY} ${toCoord.x} ${toCoord.y}" fill="none" stroke="${sourceColor.stroke}" stroke-width="2.5" marker-end="url(#arrowhead)"/>`;
          svgContent += `<rect x="${labelX - 22}" y="${labelY - 12}" width="44" height="24" rx="4" fill="${sourceColor.fill}" stroke="${sourceColor.stroke}" stroke-width="1.5"/>`;
          svgContent += `<text x="${labelX}" y="${labelY + 4}" fill="${sourceColor.text}" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">${symbolLabel}</text>`;
        } else {
          // Straight line with offset label
          const midX = (fromCoord.x + toCoord.x) / 2;
          const midY = (fromCoord.y + toCoord.y) / 2;
          svgContent += `<line x1="${fromCoord.x}" y1="${fromCoord.y}" x2="${toCoord.x}" y2="${toCoord.y}" stroke="${sourceColor.stroke}" stroke-width="2.5" marker-end="url(#arrowhead)"/>`;
          svgContent += `<rect x="${midX - 22}" y="${midY - 12}" width="44" height="24" rx="4" fill="${sourceColor.fill}" stroke="${sourceColor.stroke}" stroke-width="1.5"/>`;
          svgContent += `<text x="${midX}" y="${midY + 4}" fill="${sourceColor.text}" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">${symbolLabel}</text>`;
        }
      }
    });

    const startCoord = stateCoords[dfa.startState] || { x: 100, y: 175 };
    svgContent += `<line x1="${startCoord.x - 65}" y1="${startCoord.y}" x2="${startCoord.x - 30}" y2="${startCoord.y}" stroke="#22d3ee" stroke-width="3" marker-end="url(#arrowhead)"/>`;
    svgContent += `<text x="${startCoord.x - 47}" y="${startCoord.y - 10}" fill="#22d3ee" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">Start</text>`;

    dfa.states.forEach((st, idx) => {
      const coord = stateCoords[st] || { x: 100, y: 100 };
      const isAccept = dfa.acceptStates.includes(st);
      const colorScheme = stateColorPalette[idx % stateColorPalette.length];

      if (isAccept) {
        svgContent += `<circle cx="${coord.x}" cy="${coord.y}" r="28" fill="none" stroke="#22d3ee" stroke-width="2.5" stroke-dasharray="5,3"/>`;
      }
      svgContent += `<circle cx="${coord.x}" cy="${coord.y}" r="23" fill="${colorScheme.fill}" stroke="${colorScheme.stroke}" stroke-width="3"/>`;
      svgContent += `<text x="${coord.x}" y="${coord.y + 6}" fill="${colorScheme.text}" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">${st}</text>`;
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(image, 0, 0);
        const png = canvas.toDataURL('image/png');
        URL.revokeObjectURL(blobURL);
        resolve(png);
      } else {
        URL.revokeObjectURL(blobURL);
        resolve('');
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(blobURL);
      resolve('');
    };
    image.src = blobURL;
  });
}

