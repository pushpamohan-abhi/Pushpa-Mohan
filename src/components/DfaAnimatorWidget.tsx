import React, { useState, useEffect, useRef } from 'react';
import { DfaDefinition } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  XCircle,
  Sparkles,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Eye
} from 'lucide-react';

export const getStateColor = (stateName: string, isLightBg: boolean = false) => {
  let hash = 0;
  for (let i = 0; i < stateName.length; i++) {
    hash = stateName.charCodeAt(i) + ((hash << 5) - hash);
  }

  if (isLightBg) {
    const lightColors = [
      { fill: '#0284c7', stroke: '#0369a1', activeFill: '#0284c7', activeStroke: '#0c4a6e', box: '#e0f2fe', text: '#0369a1', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#c026d3', stroke: '#a21caf', activeFill: '#c026d3', activeStroke: '#701a75', box: '#fae8ff', text: '#a21caf', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#16a34a', stroke: '#15803d', activeFill: '#16a34a', activeStroke: '#14532d', box: '#dcfce7', text: '#15803d', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#d97706', stroke: '#b45309', activeFill: '#d97706', activeStroke: '#78350f', box: '#fef3c7', text: '#b45309', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#7c3aed', stroke: '#6d28d9', activeFill: '#7c3aed', activeStroke: '#4c1d95', box: '#f3e8ff', text: '#6d28d9', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#e11d48', stroke: '#be123c', activeFill: '#e11d48', activeStroke: '#881337', box: '#ffe4e6', text: '#be123c', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#0d9488', stroke: '#0f766e', activeFill: '#0d9488', activeStroke: '#134e4a', box: '#ccfbf1', text: '#0f766e', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#ea580c', stroke: '#c2410c', activeFill: '#ea580c', activeStroke: '#7c2d12', box: '#ffedd5', text: '#c2410c', strokeWidth: '4', textFill: '#ffffff' },
      { fill: '#4f46e5', stroke: '#4338ca', activeFill: '#4f46e5', activeStroke: '#312e81', box: '#e0e7ff', text: '#4338ca', strokeWidth: '4', textFill: '#ffffff' },
    ];
    return lightColors[Math.abs(hash) % lightColors.length];
  }

  const darkColors = [
    { fill: '#083344', stroke: '#22d3ee', activeFill: '#0284c7', activeStroke: '#67e8f9', box: '#0e7490', text: '#cffaff', border: 'border-cyan-400', bg: 'bg-cyan-950/90', textClass: 'text-cyan-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#4a044e', stroke: '#e879f9', activeFill: '#c026d3', activeStroke: '#f5d0fe', box: '#a21caf', text: '#fae8ff', border: 'border-fuchsia-400', bg: 'bg-fuchsia-950/90', textClass: 'text-fuchsia-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#052e16', stroke: '#34d399', activeFill: '#16a34a', activeStroke: '#a7f3d0', box: '#15803d', text: '#d1fae5', border: 'border-emerald-400', bg: 'bg-emerald-950/90', textClass: 'text-emerald-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#451a03', stroke: '#fbbf24', activeFill: '#d97706', activeStroke: '#fef08a', box: '#b45309', text: '#fef3c7', border: 'border-amber-400', bg: 'bg-amber-950/90', textClass: 'text-amber-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#2e1065', stroke: '#a855f7', activeFill: '#7c3aed', activeStroke: '#e9d5ff', box: '#7e22ce', text: '#f3e8ff', border: 'border-purple-400', bg: 'bg-purple-950/90', textClass: 'text-purple-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#4c0519', stroke: '#fb7185', activeFill: '#e11d48', activeStroke: '#fecdd3', box: '#be123c', text: '#ffe4e6', border: 'border-rose-400', bg: 'bg-rose-950/90', textClass: 'text-rose-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#042f2e', stroke: '#2dd4bf', activeFill: '#0d9488', activeStroke: '#99f6e4', box: '#0f766e', text: '#ccfbf1', border: 'border-teal-400', bg: 'bg-teal-950/90', textClass: 'text-teal-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#431407', stroke: '#fb923c', activeFill: '#ea580c', activeStroke: '#ffedd5', box: '#c2410c', text: '#ffedd5', border: 'border-orange-400', bg: 'bg-orange-950/90', textClass: 'text-orange-200', strokeWidth: '4', textFill: '#ffffff' },
    { fill: '#1e1b4b', stroke: '#818cf8', activeFill: '#4f46e5', activeStroke: '#c7d2fe', box: '#4338ca', text: '#e0e7ff', border: 'border-indigo-400', bg: 'bg-indigo-950/90', textClass: 'text-indigo-200', strokeWidth: '4', textFill: '#ffffff' },
  ];
  return darkColors[Math.abs(hash) % darkColors.length];
};

interface DfaAnimatorWidgetProps {
  dfa: DfaDefinition;
  onAskAI?: (currentState: string, currentSymbol: string, inputString: string) => void;
  defaultTheme?: 'dark' | 'light';
}


export const DfaAnimatorWidget: React.FC<DfaAnimatorWidgetProps> = ({ dfa: initialDfa, onAskAI, defaultTheme = 'dark' }) => {
  const [showConverted, setShowConverted] = useState(false);
  const dfa = showConverted && initialDfa.convertedDfa ? initialDfa.convertedDfa : initialDfa;

  const [inputString, setInputString] = useState(dfa.testString || "01");
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = before start, 0..length-1 = processing symbol, length = finished

  const [canvasTheme, setCanvasTheme] = useState<'dark' | 'bright-room' | 'light-slate'>(
    defaultTheme === 'light' ? 'bright-room' : 'dark'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const getEpsilonClosure = (states: string[]): string[] => {
    const closure = new Set<string>(states);
    const stack = [...states];
    while (stack.length > 0) {
      const st = stack.pop()!;
      dfa.transitions
        .filter(t => t.from === st && (t.symbol === 'ε' || t.symbol === 'eps'))
        .forEach(t => {
          if (!closure.has(t.to)) {
            closure.add(t.to);
            stack.push(t.to);
          }
        });
    }
    return Array.from(closure);
  };

  const initialStates = getEpsilonClosure([dfa.startState]);
  const [activeStates, setActiveStates] = useState<string[]>(initialStates);
  const [currentState, setCurrentState] = useState<string>(dfa.startState); // Primary display state
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'accepted' | 'rejected'>('idle');
  const [history, setHistory] = useState<string[]>([]);
  const timerRef = useRef<any>(null);

  // Reset when dfa or testString changes
  useEffect(() => {
    resetSimulation();
  }, [dfa, inputString]);

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentIndex(-1);
    const init = getEpsilonClosure([dfa.startState]);
    setActiveStates(init);
    setCurrentState(dfa.startState);
    setStatus('idle');
    setHistory([`Started at state(s) {${init.join(', ')}}${init.length > 1 ? ' (via ε-closure)' : ''}`]);
  };

  const stepForward = () => {
    if (status === 'accepted' || status === 'rejected') return;

    if (currentIndex === -1) {
      if (inputString.length === 0) {
        const isAccept = activeStates.some(st => dfa.acceptStates.includes(st));
        setStatus(isAccept ? 'accepted' : 'rejected');
        setHistory(prev => [...prev, `Empty string ε processed. Active states {${activeStates.join(', ')}} contain accepting state: ${isAccept ? 'YES ✅' : 'NO ❌'}`]);
        return;
      }
      setCurrentIndex(0);
      setStatus('running');
      setHistory(prev => [...prev, `Reading first symbol '${inputString[0]}' from active states {${activeStates.join(', ')}}`]);
      return;
    }

    if (currentIndex < inputString.length) {
      const symbol = inputString[currentIndex];
      const nextStatesSet = new Set<string>();

      activeStates.forEach(st => {
        dfa.transitions
          .filter(t => t.from === st && t.symbol === symbol)
          .forEach(t => nextStatesSet.add(t.to));
      });

      if (nextStatesSet.size === 0) {
        setStatus('rejected');
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setHistory(prev => [...prev, `No transitions from active states {${activeStates.join(', ')}} on symbol '${symbol}'. String REJECTED ❌`]);
        return;
      }

      const reachedStates = Array.from(nextStatesSet);
      const withEpsilon = getEpsilonClosure(reachedStates);

      setActiveStates(withEpsilon);
      if (withEpsilon.length > 0) setCurrentState(withEpsilon[0]);

      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      setHistory(prev => [...prev, `δ({${activeStates.join(', ')}}, '${symbol}') → {${reachedStates.join(', ')}} + ε-closure → {${withEpsilon.join(', ')}}`]);

      if (nextIdx >= inputString.length) {
        const isAccept = withEpsilon.some(st => dfa.acceptStates.includes(st));
        setStatus(isAccept ? 'accepted' : 'rejected');
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setHistory(prev => [...prev, `Reached end of string. Final active states {${withEpsilon.join(', ')}} include accepting state: ${isAccept ? 'ACCEPTING ✅' : 'REJECTING ❌'}`]);
      }
    }
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        stepForward();
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, currentState, status]);

  // Compute state positions for rendering enlarged diagram
  const stateCoordinates: Record<string, { x: number; y: number }> = {};
  const numStates = dfa.states.length;

  if (numStates === 2) {
    // Standard horizontal textbook layout for 2-state DFAs (e.g. q_even, q_odd)
    stateCoordinates[dfa.states[0]] = { x: 200, y: 220 };
    stateCoordinates[dfa.states[1]] = { x: 560, y: 220 };
  } else if (numStates === 3) {
    // Triangle layout
    stateCoordinates[dfa.states[0]] = { x: 180, y: 280 };
    stateCoordinates[dfa.states[1]] = { x: 480, y: 150 };
    stateCoordinates[dfa.states[2]] = { x: 480, y: 410 };
  } else if (numStates === 4) {
    // Square layout
    stateCoordinates[dfa.states[0]] = { x: 180, y: 160 };
    stateCoordinates[dfa.states[1]] = { x: 540, y: 160 };
    stateCoordinates[dfa.states[2]] = { x: 540, y: 420 };
    stateCoordinates[dfa.states[3]] = { x: 180, y: 420 };
  } else {
    // Circular layout for >= 5 states
    dfa.states.forEach((st, idx) => {
      const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
      const radius = Math.max(260, numStates * 40);
      stateCoordinates[st] = {
        x: 400 + radius * Math.cos(angle),
        y: 300 + radius * Math.sin(angle),
      };
    });
  }

  // Calculate dynamic tight viewBox around states, self-loops, and labels
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  Object.values(stateCoordinates).forEach(c => {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  });

  const centerX = (minX + maxX) / 2 || 350;
  const centerY = (minY + maxY) / 2 || 220;

  // Generous margins for start arrow (-140px left), self-loops (+130px top/bottom), label text
  const vMinX = minX - 160;
  const vMaxX = maxX + 160;
  const vMinY = minY - 130;
  const vMaxY = maxY + 130;

  const viewBoxWidth = Math.max(520, vMaxX - vMinX);
  const viewBoxHeight = Math.max(320, vMaxY - vMinY);
  const viewBoxStr = `${vMinX} ${vMinY} ${viewBoxWidth} ${viewBoxHeight}`;

  const isLightCanvas = canvasTheme === 'bright-room' || canvasTheme === 'light-slate';

  const renderSvgContent = (customClass = '') => (
    <svg
      className={`w-full transition-transform duration-200 ${customClass}`}
      style={{ transform: `scale(${zoomLevel})` }}
      viewBox={viewBoxStr}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill={isLightCanvas ? '#0284c7' : '#38bdf8'} />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill={isLightCanvas ? '#6d28d9' : '#818cf8'} />
        </marker>
        {dfa.states.map(st => {
          const stColor = getStateColor(st, isLightCanvas);
          return (
            <React.Fragment key={st}>
              <marker id={`arrow-state-${st}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill={stColor.stroke} />
              </marker>
              <marker id={`arrow-active-state-${st}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill={stColor.activeStroke} />
              </marker>
            </React.Fragment>
          );
        })}
      </defs>

      {/* Draw Transitions */}
      {(() => {
        const groupedTransitions: {from: string, to: string, symbols: string[], isBidirectional?: boolean}[] = [];
        dfa.transitions.forEach(t => {
          const existing = groupedTransitions.find(gt => gt.from === t.from && gt.to === t.to);
          if (existing) {
            if (!existing.symbols.includes(t.symbol)) {
              existing.symbols.push(t.symbol);
            }
          } else {
            groupedTransitions.push({ from: t.from, to: t.to, symbols: [t.symbol] });
          }
        });

        groupedTransitions.forEach(gt => {
          gt.isBidirectional = groupedTransitions.some(other => other.from === gt.to && other.to === gt.from);
        });

        return groupedTransitions.map((gt, i) => {
          const fromCoord = stateCoordinates[gt.from] || { x: 50, y: 50 };
          const toCoord = stateCoordinates[gt.to] || { x: 150, y: 150 };
          
          // Active if any of the grouped symbols match the current input symbol
          const activeSymbol = gt.symbols.find(sym => currentState === gt.from && currentIndex !== -1 && inputString[currentIndex] === sym);
          const isActiveTransition = !!activeSymbol;
          
          // Color matches the origin state (gt.from)
          const fromStateColor = getStateColor(gt.from, isLightCanvas);
          const displayLabel = gt.symbols.join(',');

          const strokeColor = isActiveTransition ? fromStateColor.activeStroke : fromStateColor.stroke;
          const boxColor = isActiveTransition ? fromStateColor.activeFill : (isLightCanvas ? '#ffffff' : fromStateColor.box);
          const textColor = isActiveTransition ? '#ffffff' : (isLightCanvas ? fromStateColor.stroke : fromStateColor.text);
          const markerEndUrl = isActiveTransition ? `url(#arrow-active-state-${gt.from})` : `url(#arrow-state-${gt.from})`;

          const R_from = dfa.acceptStates.includes(gt.from) ? 50 : 44;
          const R_to = dfa.acceptStates.includes(gt.to) ? 50 : 44;

          // Self loop
          if (gt.from === gt.to) {
            const labelWidth = Math.max(48, displayLabel.length * 14 + 28);
            
            // Compute outward normal vector from graph center
            let nx = fromCoord.x - centerX;
            let ny = fromCoord.y - centerY;
            const len = Math.sqrt(nx*nx + ny*ny);
            if (len < 10) {
              nx = 0;
              ny = -1;
            } else {
              nx /= len;
              ny /= len;
            }

            const phi = Math.atan2(ny, nx);
            const startAngle = phi - 0.45;
            const endAngle = phi + 0.45;

            const startX = fromCoord.x + R_from * Math.cos(startAngle);
            const startY = fromCoord.y + R_from * Math.sin(startAngle);

            const endX = fromCoord.x + R_from * Math.cos(endAngle);
            const endY = fromCoord.y + R_from * Math.sin(endAngle);

            const loopDist = 110;
            const cp1X = startX + loopDist * Math.cos(startAngle);
            const cp1Y = startY + loopDist * Math.sin(startAngle);

            const cp2X = endX + loopDist * Math.cos(endAngle);
            const cp2Y = endY + loopDist * Math.sin(endAngle);

            const peakX = fromCoord.x + (R_from + 75) * nx;
            const peakY = fromCoord.y + (R_from + 75) * ny;

            return (
              <g key={i}>
                <path
                  d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isActiveTransition ? "6" : "4"}
                  markerEnd={markerEndUrl}
                />
                <rect
                  x={peakX - labelWidth/2}
                  y={peakY - 18}
                  width={labelWidth}
                  height="36"
                  rx="10"
                  fill={boxColor}
                  stroke={strokeColor}
                  strokeWidth={isActiveTransition ? "3.5" : "2.5"}
                />
                <text
                  x={peakX}
                  y={peakY + 7}
                  fill={textColor}
                  fontSize="20"
                  fontFamily="monospace"
                  fontWeight="900"
                  textAnchor="middle"
                >
                  {displayLabel}
                </text>
              </g>
            );
          }

          // Standard directed edge
          const dx = toCoord.x - fromCoord.x;
          const dy = toCoord.y - fromCoord.y;
          const angle = Math.atan2(dy, dx);
          
          let pathD = '';
          let midX = (fromCoord.x + toCoord.x) / 2;
          let midY = (fromCoord.y + toCoord.y) / 2;
          
          if (gt.isBidirectional) {
            const curveOffset = 65;
            const cx = midX - curveOffset * Math.sin(angle);
            const cy = midY + curveOffset * Math.cos(angle);

            const startAngle = Math.atan2(cy - fromCoord.y, cx - fromCoord.x);
            const endAngle = Math.atan2(toCoord.y - cy, toCoord.x - cx);

            const startX = fromCoord.x + R_from * Math.cos(startAngle);
            const startY = fromCoord.y + R_from * Math.sin(startAngle);

            const endX = toCoord.x - R_to * Math.cos(endAngle);
            const endY = toCoord.y - R_to * Math.sin(endAngle);

            pathD = `M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`;
            midX = (midX + cx) / 2;
            midY = (midY + cy) / 2;
          } else {
            const startX = fromCoord.x + R_from * Math.cos(angle);
            const startY = fromCoord.y + R_from * Math.sin(angle);

            const endX = toCoord.x - R_to * Math.cos(angle);
            const endY = toCoord.y - R_to * Math.sin(angle);

            pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
            midX -= 25 * Math.sin(angle);
            midY += 25 * Math.cos(angle);
          }

          const labelWidth = Math.max(48, displayLabel.length * 14 + 28);

          return (
            <g key={i}>
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isActiveTransition ? '6' : '4'}
                markerEnd={markerEndUrl}
              />
              <rect
                x={midX - labelWidth/2}
                y={midY - 18}
                width={labelWidth}
                height="36"
                rx="10"
                fill={boxColor}
                stroke={strokeColor}
                strokeWidth={isActiveTransition ? '3.5' : '2.5'}
              />
              <text
                x={midX}
                y={midY + 7}
                fill={textColor}
                fontSize="20"
                fontFamily="monospace"
                fontWeight="900"
                textAnchor="middle"
              >
                {displayLabel}
              </text>
            </g>
          );
        });
      })()}

      {/* Draw States */}
      {dfa.states.map((st) => {
        const coord = stateCoordinates[st] || { x: 50, y: 50 };
        const isCurrent = activeStates.includes(st);
        const isAccept = dfa.acceptStates.includes(st);
        const isStart = st === dfa.startState;
        const stColor = getStateColor(st, isLightCanvas);

        return (
          <g key={st} transform={`translate(${coord.x}, ${coord.y})`}>
            {/* Start State Arrow */}
            {isStart && (
              <g>
                <line x1="-80" y1="0" x2="-46" y2="0" stroke={isLightCanvas ? "#0284c7" : "#38bdf8"} strokeWidth="5" markerEnd="url(#arrow)" />
                <text x="-75" y="-12" fill={isLightCanvas ? "#0369a1" : "#38bdf8"} fontSize="15" fontFamily="sans-serif" fontWeight="900">START</text>
              </g>
            )}

            {/* Accept State Outer Ring */}
            {isAccept && (
              <circle
                r="50"
                fill="none"
                stroke={isCurrent ? stColor.activeStroke : stColor.stroke}
                strokeWidth="4"
                className={isCurrent ? 'animate-pulse' : ''}
              />
            )}

            {/* Main State Circle */}
            <circle
              r="42"
              fill={isCurrent ? stColor.activeFill : stColor.fill}
              stroke={isCurrent ? stColor.activeStroke : stColor.stroke}
              strokeWidth={isCurrent ? '6' : '4'}
              className="transition-all duration-300 shadow-2xl"
            />

            <text
              y="7"
              fill="#ffffff"
              fontSize={st.length > 6 ? "15" : st.length > 4 ? "18" : "22"}
              fontFamily="monospace"
              fontWeight="900"
              textAnchor="middle"
            >
              {st}
            </text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className={`rounded-2xl p-5 shadow-2xl border flex flex-col gap-5 transition-colors duration-200 ${
      canvasTheme === 'bright-room'
        ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-slate-300'
        : canvasTheme === 'light-slate'
        ? 'bg-white text-slate-900 border-slate-300 shadow-slate-200'
        : 'bg-slate-900 text-slate-100 border-slate-800'
    }`}>
      {/* Header & Title */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b ${
        isLightCanvas ? 'border-slate-300' : 'border-slate-800'
      }`}>
        <div>
          <span className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1 rounded-md border ${
            isLightCanvas
              ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
              : 'bg-indigo-950/80 text-indigo-300 border-indigo-800/50'
          }`}>
            Interactive DFA Simulator
          </span>
          <h3 className={`text-xl font-black mt-1 ${isLightCanvas ? 'text-slate-950' : 'text-white'}`}>{dfa.title}</h3>
        </div>

        {/* Ambient Room Brightness Background Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex p-1 rounded-xl border ${
            isLightCanvas ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => setCanvasTheme('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                canvasTheme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Dark Night Mode"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setCanvasTheme('bright-room')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                canvasTheme === 'bright-room'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Bright Room / Classroom Light Canvas"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Bright Room</span>
            </button>
          </div>

          {initialDfa.convertedDfa && (
            <div className={`flex p-1 rounded-xl border ${
              isLightCanvas ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setShowConverted(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${!showConverted ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
              >
                {initialDfa.title.includes("NFA") ? "NFA View" : "Original DFA"}
              </button>
              <button
                onClick={() => setShowConverted(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${showConverted ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
              >
                {initialDfa.convertedDfa?.title?.includes("Minim") ? "Minimized DFA" : "Converted DFA"}
              </button>
            </div>
          )}

          {/* Input String & Direct Playback Controller */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold">Input w:</span>
            <input
              type="text"
              value={inputString}
              onChange={(e) => {
                setInputString(e.target.value.trim());
              }}
              className={`border rounded-lg px-3 py-1 text-sm font-mono font-bold focus:outline-none focus:border-indigo-500 w-28 ${
                isLightCanvas
                  ? 'bg-white border-slate-300 text-slate-950 shadow-xs'
                  : 'bg-slate-800 border-slate-700 text-white'
              }`}
              placeholder="e.g. 010"
            />

            {/* Auto Play Button right next to Input */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={status === 'accepted' || status === 'rejected'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs transition-all shadow-sm ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isPlaying ? "Pause Simulation" : "Auto Play Simulation"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            {/* Step Button next to Auto Play */}
            <button
              onClick={stepForward}
              disabled={isPlaying || status === 'accepted' || status === 'rejected'}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors border disabled:opacity-50 ${
                isLightCanvas
                  ? 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Step 1 Symbol Forward"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Step</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={resetSimulation}
              className={`p-1.5 rounded-lg border transition-colors ${
                isLightCanvas
                  ? 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
              }`}
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Graph & Controls */}
      <div className="flex flex-col gap-6">
        
        {/* SVG State Diagram Container */}
        <div className={`w-full rounded-2xl p-4 border flex flex-col items-center justify-center relative transition-colors duration-200 overflow-hidden ${
          canvasTheme === 'bright-room'
            ? 'bg-white border-slate-300 shadow-xl'
            : canvasTheme === 'light-slate'
            ? 'bg-slate-50 border-slate-300 shadow-lg'
            : 'bg-slate-950/90 border-slate-800 shadow-2xl'
        }`}>
          {/* Top Controls Overlay: Zoom & Maximize */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg text-white">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.2))}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-1.5 text-cyan-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1.0)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-xs font-mono font-bold"
              title="Reset Zoom"
            >
              100%
            </button>
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
              title="Maximize / Full Screen DFA Diagram"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enlarge DFA</span>
            </button>
          </div>

          <div className="w-full min-h-[380px] sm:min-h-[480px] max-h-[65vh] flex items-center justify-center overflow-auto p-2">
            {renderSvgContent("w-full h-full max-h-[60vh]")}
          </div>

          {/* Legend */}
          <div className={`flex items-center gap-6 text-xs font-bold mt-2 ${
            isLightCanvas ? 'text-slate-700' : 'text-slate-400'
          }`}>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 inline-block shadow-sm"></span> Current Active State
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 inline-block shadow-sm"></span> Accepting (Final) State
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-1 bg-cyan-500 inline-block"></span> Transition Path
            </span>
          </div>
        </div>

        {/* Execution & Controls Pane */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* String Token Visualizer */}
          <div className={`p-4 rounded-xl border ${
            isLightCanvas
              ? 'bg-white border-slate-300 shadow-sm'
              : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className="text-xs font-extrabold uppercase tracking-wider block mb-2">Input Tape Execution:</span>
            <div className="flex flex-wrap gap-2 items-center font-mono">
              {inputString.length === 0 ? (
                <span className="text-xs italic">Empty string (ε)</span>
              ) : (
                inputString.split("").map((char, idx) => {
                  const isProcessed = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-11 rounded-lg flex items-center justify-center font-black text-base transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105 shadow-md shadow-indigo-900'
                          : isProcessed
                          ? 'bg-slate-200 text-slate-500 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                          : 'bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {char}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
            isLightCanvas
              ? 'bg-white border-slate-300 shadow-sm'
              : 'bg-slate-950/70 border-slate-800'
          }`}>
            <span className="text-sm font-bold">Status:</span>
            {status === 'idle' && <span className="text-sm font-extrabold px-3 py-1 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-md">Ready</span>}
            {status === 'running' && <span className="text-sm font-extrabold px-3 py-1 bg-indigo-100 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-md animate-pulse border border-indigo-400">Running...</span>}
            {status === 'accepted' && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-800 dark:text-emerald-300 font-black px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 rounded-md border border-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Accepted (Valid String)
              </span>
            )}
            {status === 'rejected' && (
              <span className="flex items-center gap-1.5 text-sm text-rose-800 dark:text-rose-300 font-black px-3 py-1 bg-rose-100 dark:bg-rose-950/80 rounded-md border border-rose-400">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Rejected (Invalid String)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={status === 'accepted' || status === 'rejected'}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-sm transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={stepForward}
              disabled={isPlaying || status === 'accepted' || status === 'rejected'}
              className={`flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-extrabold text-sm transition-colors border disabled:opacity-50 ${
                isLightCanvas
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <SkipForward className="w-4 h-4" />
              <span>Step</span>
            </button>
          </div>

          {onAskAI && (
            <button
              onClick={() => onAskAI(currentState, inputString[currentIndex] || 'ε', inputString)}
              className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white border border-purple-500 rounded-xl text-xs font-black transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Ask AI Professor about this step</span>
            </button>
          )}

        </div>

      </div>

      {/* Execution Log */}
      <div className={`rounded-xl p-3 border font-mono text-xs max-h-28 overflow-y-auto flex flex-col gap-1 ${
        isLightCanvas
          ? 'bg-white border-slate-300 text-slate-800 shadow-inner'
          : 'bg-slate-950/80 border-slate-800 text-slate-400'
      }`}>
        <span className="font-bold mb-0.5 text-indigo-600 dark:text-indigo-400">Execution Trace:</span>
        {history.map((log, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-slate-400">›</span>
            <span className={idx === history.length - 1 ? 'font-bold text-slate-950 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}>{log}</span>
          </div>
        ))}
      </div>

      {/* Fullscreen Enlarge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex flex-col p-4 sm:p-8 overflow-hidden text-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-extrabold text-indigo-400 bg-indigo-950 px-3 py-1 rounded border border-indigo-800">
                Enlarged Presentation DFA Diagram
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{dfa.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCanvasTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    canvasTheme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  onClick={() => setCanvasTheme('bright-room')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    canvasTheme === 'bright-room' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Bright Room
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors font-bold flex items-center gap-1"
              >
                <Minimize2 className="w-5 h-5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          <div className="flex-1 my-4 flex items-center justify-center rounded-2xl border border-slate-800 p-4 bg-slate-900/60 overflow-hidden">
            <div className="w-full h-full max-w-6xl flex items-center justify-center">
              {renderSvgContent("h-full max-h-[80vh]")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
