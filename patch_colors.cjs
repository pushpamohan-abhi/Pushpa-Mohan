const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

const colorHelpers = `
const getStateColor = (stateName: string) => {
  let hash = 0;
  for (let i = 0; i < stateName.length; i++) {
    hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    { fill: '#164e63', stroke: '#06b6d4', activeFill: '#0891b2', activeStroke: '#67e8f9' },
    { fill: '#701a75', stroke: '#d946ef', activeFill: '#c026d3', activeStroke: '#f0abfc' },
    { fill: '#14532d', stroke: '#22c55e', activeFill: '#16a34a', activeStroke: '#86efac' },
    { fill: '#78350f', stroke: '#f59e0b', activeFill: '#d97706', activeStroke: '#fde047' },
    { fill: '#4c1d95', stroke: '#8b5cf6', activeFill: '#7c3aed', activeStroke: '#c4b5fd' },
    { fill: '#881337', stroke: '#f43f5e', activeFill: '#e11d48', activeStroke: '#fda4af' },
    { fill: '#0f766e', stroke: '#14b8a6', activeFill: '#0d9488', activeStroke: '#5eead4' },
    { fill: '#ea580c', stroke: '#f97316', activeFill: '#c2410c', activeStroke: '#fdba74' },
    { fill: '#3730a3', stroke: '#6366f1', activeFill: '#4f46e5', activeStroke: '#a5b4fc' },
  ];
  return colors[Math.abs(hash) % colors.length];
};

const getSymbolColor = (symbol: string) => {
  if (symbol === '0') return { stroke: '#ef4444', text: '#fca5a5', box: '#7f1d1d' };
  if (symbol === '1') return { stroke: '#3b82f6', text: '#93c5fd', box: '#1e3a8a' };
  if (symbol === 'a') return { stroke: '#eab308', text: '#fde047', box: '#713f12' };
  if (symbol === 'b') return { stroke: '#10b981', text: '#6ee7b7', box: '#064e3b' };
  if (symbol === 'ε') return { stroke: '#a855f7', text: '#d8b4fe', box: '#4c1d95' };
  
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    { stroke: '#ec4899', text: '#f9a8d4', box: '#831843' },
    { stroke: '#06b6d4', text: '#67e8f9', box: '#164e63' },
    { stroke: '#f97316', text: '#fdba74', box: '#7c2d12' },
  ];
  return colors[Math.abs(hash) % colors.length];
};
`;

// Insert after imports
code = code.replace("import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';", 
"import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';\n" + colorHelpers);

// Replace marker definitions to make them dynamic per symbol, but wait, the marker uses the color. We can inject markers per symbol.
// SVG definitions replacement:
const markerDefs = `
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
              {Array.from(new Set(dfa.transitions.map(t => t.symbol))).map(sym => {
                const color = getSymbolColor(sym);
                return (
                  <React.Fragment key={sym}>
                    <marker id={\`arrow-\${sym}\`} viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={color.stroke} />
                    </marker>
                    <marker id={\`arrow-active-\${sym}\`} viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={color.text} />
                    </marker>
                  </React.Fragment>
                );
              })}
            </defs>
`;

code = code.replace(/<defs>[\s\S]*?<\/defs>/, markerDefs);

// Replace self-loop drawing
code = code.replace(
/stroke=\{currentState === t\.from && currentIndex !== -1 \? '#6366f1' : '#475569'\}/g,
"stroke={isActiveTransition ? getSymbolColor(t.symbol).text : getSymbolColor(t.symbol).stroke}"
);
// Actually wait, let's just do a string replacement on the loop body.
fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
