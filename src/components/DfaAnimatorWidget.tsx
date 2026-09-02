import React, { useState, useEffect, useRef } from 'react';
import { DfaDefinition } from '../types';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

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


interface DfaAnimatorWidgetProps {
  dfa: DfaDefinition;
  onAskAI?: (currentState: string, currentSymbol: string, inputString: string) => void;
}


export const DfaAnimatorWidget: React.FC<DfaAnimatorWidgetProps> = ({ dfa: initialDfa, onAskAI }) => {
  const [showConverted, setShowConverted] = useState(false);
  const dfa = showConverted && initialDfa.convertedDfa ? initialDfa.convertedDfa : initialDfa;

  const [inputString, setInputString] = useState(dfa.testString || "01");
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = before start, 0..length-1 = processing symbol, length = finished

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

  // Compute state positions for rendering diagram
  // Simple layout logic for states
  const stateCoordinates: Record<string, { x: number; y: number }> = {};
  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.max(240, numStates * 34);
    stateCoordinates[st] = {
      x: 320 + radius * Math.cos(angle),
      y: 240 + radius * Math.sin(angle),
    };
  });

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-xl border border-slate-800 flex flex-col gap-5">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/50">
            Interactive DFA Simulator
          </span>
          <h3 className="text-lg font-bold text-white mt-1">{dfa.title}</h3>
        </div>

        {initialDfa.convertedDfa && (
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setShowConverted(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!showConverted ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {initialDfa.title.includes("NFA") ? "NFA View" : "Original DFA"}
            </button>
            <button
              onClick={() => setShowConverted(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${showConverted ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {initialDfa.convertedDfa?.title?.includes("Minim") ? "Minimized DFA" : "Converted DFA"}
            </button>
          </div>
        )}

        {/* Input String Controller */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-mono">Input w:</span>
          <input
            type="text"
            value={inputString}
            onChange={(e) => {
              setInputString(e.target.value.trim());
            }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500 w-32"
            placeholder="e.g. aab"
          />
          <button
            onClick={resetSimulation}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Graph & Controls */}
      <div className="flex flex-col gap-6">
        
        {/* SVG State Diagram */}
        <div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center relative min-h-[240px]">
          <svg className="w-full h-[450px] sm:h-[550px] md:h-[650px]" viewBox="-150 -150 940 780">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="32" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="32" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
              {Array.from<string>(new Set(dfa.transitions.map(t => t.symbol))).map(sym => {
                const color = getSymbolColor(sym);
                return (
                  <React.Fragment key={sym}>
                    <marker id={`arrow-${sym}`} viewBox="0 0 10 10" refX="32" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={color.stroke} />
                    </marker>
                    <marker id={`arrow-active-${sym}`} viewBox="0 0 10 10" refX="32" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={color.text} />
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
                
                // Color based on active symbol or first symbol
                const primarySymbol = activeSymbol || gt.symbols[0];
                const symColor = getSymbolColor(primarySymbol);
                const displayLabel = gt.symbols.join(',');

                // Self loop
                if (gt.from === gt.to) {
                  const labelWidth = Math.max(34, displayLabel.length * 10 + 20);
                  
                  // Compute outward normal vector from center
                  let nx = fromCoord.x - 320;
                  let ny = fromCoord.y - 240;
                  const len = Math.sqrt(nx*nx + ny*ny) || 1;
                  nx = nx / len;
                  ny = ny / len;

                  if (len === 1 && nx === 0 && ny === 0) {
                    ny = -1;
                  }

                  // Control points
                  const cpDist = 140;
                  const cpSpread = 90;
                  
                  // Start and end at fromCoord so marker aligns cleanly
                  const cp1X = fromCoord.x + nx * cpDist - ny * cpSpread;
                  const cp1Y = fromCoord.y + ny * cpDist + nx * cpSpread;
                  
                  const cp2X = fromCoord.x + nx * cpDist + ny * cpSpread;
                  const cp2Y = fromCoord.y + ny * cpDist - nx * cpSpread;
                  
                  // Text and label peak
                  const peakX = fromCoord.x + nx * 115;
                  const peakY = fromCoord.y + ny * 115;

                  return (
                    <g key={i}>
                      <path
                        d={`M ${fromCoord.x} ${fromCoord.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${fromCoord.x} ${fromCoord.y}`}
                        fill="none"
                        stroke={isActiveTransition ? symColor.text : symColor.stroke}
                        strokeWidth={isActiveTransition ? "3.5" : "2.5"}
                        markerEnd={isActiveTransition ? `url(#arrow-active-${primarySymbol})` : `url(#arrow-${primarySymbol})`}
                      />
                      <rect
                        x={peakX - labelWidth/2}
                        y={peakY - 13}
                        width={labelWidth}
                        height="26"
                        rx="6"
                        fill={symColor.box}
                        stroke={isActiveTransition ? symColor.text : symColor.stroke}
                        strokeWidth={isActiveTransition ? "2" : "1.5"}
                      />
                      <text
                        x={peakX}
                        y={peakY + 5}
                        fill={isActiveTransition ? '#ffffff' : symColor.text}
                        fontSize="14"
                        fontFamily="monospace"
                        fontWeight="bold"
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
                const dist = Math.sqrt(dx*dx + dy*dy);
                const angle = Math.atan2(dy, dx);
                
                let pathD = `M ${fromCoord.x} ${fromCoord.y} L ${toCoord.x} ${toCoord.y}`;
                let midX = (fromCoord.x + toCoord.x) / 2;
                let midY = (fromCoord.y + toCoord.y) / 2;
                
                if (gt.isBidirectional) {
                  // Curve the line slightly so it doesn't overlap the reverse direction
                  const curveOffset = 65;
                  const cx = midX - curveOffset * Math.sin(angle);
                  const cy = midY + curveOffset * Math.cos(angle);
                  pathD = `M ${fromCoord.x} ${fromCoord.y} Q ${cx} ${cy} ${toCoord.x} ${toCoord.y}`;
                  // Midpoint of quadratic bezier is roughly halfway between the control point and the direct midpoint
                  midX = (midX + cx) / 2;
                  midY = (midY + cy) / 2;
                } else {
                  // Push labels off the exact center line
                  midX -= 36 * Math.sin(angle);
                  midY += 36 * Math.cos(angle);
                }

                const labelWidth = Math.max(34, displayLabel.length * 10 + 20);

                return (
                  <g key={i}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isActiveTransition ? symColor.text : symColor.stroke}
                      strokeWidth={isActiveTransition ? '3.5' : '2.5'}
                      markerEnd={isActiveTransition ? `url(#arrow-active-${primarySymbol})` : `url(#arrow-${primarySymbol})`}
                    />
                    <rect
                      x={midX - labelWidth/2}
                      y={midY - 13}
                      width={labelWidth}
                      height="26"
                      rx="6"
                      fill={symColor.box}
                      stroke={isActiveTransition ? symColor.text : symColor.stroke}
                      strokeWidth={isActiveTransition ? '2' : '1.5'}
                    />
                    <text
                      x={midX}
                      y={midY + 5}
                      fill={isActiveTransition ? '#ffffff' : symColor.text}
                      fontSize="14"
                      fontFamily="monospace"
                      fontWeight="bold"
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
              const stColor = getStateColor(st);

              return (
                <g key={st} transform={`translate(${coord.x}, ${coord.y})`}>
                  {/* Start State Arrow */}
                  {isStart && (
                    <g>
                      <line x1="-58" y1="0" x2="-34" y2="0" stroke="#94a3b8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    </g>
                  )}

                  {/* Accept State Outer Ring */}
                  {isAccept && (
                    <circle
                      r="34"
                      fill="none"
                      stroke={isCurrent ? stColor.activeStroke : stColor.stroke}
                      strokeWidth="2.5"
                      className={isCurrent ? 'animate-pulse' : ''}
                    />
                  )}

                  {/* Main State Circle */}
                  <circle
                    r="28"
                    fill={isCurrent ? stColor.activeFill : stColor.fill}
                    stroke={isCurrent ? stColor.activeStroke : stColor.stroke}
                    strokeWidth={isCurrent ? '3.5' : '2.5'}
                    className="transition-all duration-300 shadow-lg"
                  />

                  <text
                    y="5"
                    fill="#ffffff"
                    fontSize={st.length > 6 ? "10" : st.length > 4 ? "12" : "14"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {st}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> Current State</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-emerald-400 inline-block"></span> Accepting State</span>
          </div>
        </div>

        {/* Execution & Controls Pane */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* String Token Visualizer */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Input Tape Execution:</span>
            <div className="flex flex-wrap gap-2 items-center font-mono">
              {inputString.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Empty string (ε)</span>
              ) : (
                inputString.split("").map((char, idx) => {
                  const isProcessed = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={idx}
                      className={`w-9 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105 shadow-md shadow-indigo-900'
                          : isProcessed
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-slate-900 text-slate-200 border border-slate-800'
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
          <div className="flex items-center justify-between bg-slate-950/70 px-4 py-3 rounded-xl border border-slate-800">
            <span className="text-sm text-slate-300 font-medium">Status:</span>
            {status === 'idle' && <span className="text-sm text-slate-400 font-semibold px-2.5 py-1 bg-slate-800 rounded-md">Ready</span>}
            {status === 'running' && <span className="text-sm text-indigo-400 font-semibold px-2.5 py-1 bg-indigo-950/80 rounded-md animate-pulse">Running...</span>}
            {status === 'accepted' && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-bold px-3 py-1 bg-emerald-950/80 rounded-md border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> Accepted (Valid String)
              </span>
            )}
            {status === 'rejected' && (
              <span className="flex items-center gap-1.5 text-sm text-rose-400 font-bold px-3 py-1 bg-rose-950/80 rounded-md border border-rose-800">
                <XCircle className="w-4 h-4" /> Rejected (Invalid String)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={status === 'accepted' || status === 'rejected'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-900/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              onClick={stepForward}
              disabled={isPlaying || status === 'accepted' || status === 'rejected'}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
              <span>Step</span>
            </button>
          </div>

          {onAskAI && (
            <button
              onClick={() => onAskAI(currentState, inputString[currentIndex] || 'ε', inputString)}
              className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-900 hover:to-indigo-900 text-purple-200 border border-purple-700/50 rounded-xl text-xs font-medium transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Ask AI Professor about this step</span>
            </button>
          )}

        </div>

      </div>

      {/* Execution Log */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 font-mono text-xs text-slate-400 max-h-24 overflow-y-auto flex flex-col gap-1">
        <span className="text-slate-500 font-semibold mb-0.5">Execution Trace:</span>
        {history.map((log, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-slate-600">›</span>
            <span className={idx === history.length - 1 ? 'text-indigo-300 font-medium' : 'text-slate-400'}>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
