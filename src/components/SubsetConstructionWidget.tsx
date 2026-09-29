import React, { useState } from 'react';
import { DfaAnimatorWidget } from './DfaAnimatorWidget';
import { ArrowRight, Play, RotateCcw, Check, Sparkles, Layers, RefreshCw, Cpu, HelpCircle, Table, GitBranch } from 'lucide-react';

export interface NfaDefinition {
  title: string;
  states: string[];
  alphabet: string[];
  startState: string;
  acceptStates: string[];
  epsilonTransitions?: { from: string; to: string[] }[];
  transitions: { from: string; symbol: string; to: string[] }[];
}

const defaultNfaPresets: Record<string, NfaDefinition> = {
  cyclic_enfa: {
    title: "ε-NFA: Cyclic Graph (L = (a|b)*)",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q2"],
    epsilonTransitions: [
      { from: "q0", to: ["q2"] },
      { from: "q2", to: ["q0", "q1"] }
    ],
    transitions: [
      { from: "q0", symbol: "a", to: ["q1"] },
      { from: "q0", symbol: "b", to: ["q0", "q2"] },
      { from: "q1", symbol: "a", to: ["q0"] },
      { from: "q1", symbol: "b", to: [] },
      { from: "q2", symbol: "a", to: [] },
      { from: "q2", symbol: "b", to: ["q0"] }
    ]
  },
  a_star_b_star_a: {
    title: "ε-NFA: L = a*b*a(a|b)*",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q2"],
    epsilonTransitions: [
      { from: "q0", to: ["q1"] }
    ],
    transitions: [
      { from: "q0", symbol: "a", to: ["q0"] },
      { from: "q0", symbol: "b", to: [] },
      { from: "q1", symbol: "a", to: ["q2"] },
      { from: "q1", symbol: "b", to: ["q1"] },
      { from: "q2", symbol: "a", to: ["q2"] },
      { from: "q2", symbol: "b", to: ["q2"] }
    ]
  },
  abc_shortcuts: {
    title: "ε-NFA: L = a*b*c* (With Shortcuts)",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b", "c"],
    startState: "q0",
    acceptStates: ["q2"],
    epsilonTransitions: [
      { from: "q0", to: ["q1", "q2"] },
      { from: "q1", to: ["q2"] }
    ],
    transitions: [
      { from: "q0", symbol: "a", to: ["q0", "q1"] },
      { from: "q0", symbol: "b", to: ["q2"] },
      { from: "q0", symbol: "c", to: [] },
      { from: "q1", symbol: "a", to: [] },
      { from: "q1", symbol: "b", to: ["q1", "q2"] },
      { from: "q1", symbol: "c", to: [] },
      { from: "q2", symbol: "a", to: [] },
      { from: "q2", symbol: "b", to: [] },
      { from: "q2", symbol: "c", to: ["q2"] }
    ]
  },
  abc_language: {
    title: "ε-NFA: Language L = a*b*c*",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b", "c"],
    startState: "q0",
    acceptStates: ["q2"],
    epsilonTransitions: [
      { from: "q0", to: ["q1"] },
      { from: "q1", to: ["q2"] }
    ],
    transitions: [
      { from: "q0", symbol: "a", to: ["q0"] },
      { from: "q0", symbol: "b", to: [] },
      { from: "q0", symbol: "c", to: [] },
      { from: "q1", symbol: "a", to: [] },
      { from: "q1", symbol: "b", to: ["q1"] },
      { from: "q1", symbol: "c", to: [] },
      { from: "q2", symbol: "a", to: [] },
      { from: "q2", symbol: "b", to: [] },
      { from: "q2", symbol: "c", to: ["q2"] }
    ]
  },
  ends_01: {
    title: "NFA 1: Ends with '01'",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    startState: "q0",
    acceptStates: ["q2"],
    transitions: [
      { from: "q0", symbol: "0", to: ["q0", "q1"] },
      { from: "q0", symbol: "1", to: ["q0"] },
      { from: "q1", symbol: "0", to: [] },
      { from: "q1", symbol: "1", to: ["q2"] },
      { from: "q2", symbol: "0", to: [] },
      { from: "q2", symbol: "1", to: [] }
    ]
  },
  contains_11: {
    title: "NFA 2: Contains '11'",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    startState: "q0",
    acceptStates: ["q2"],
    transitions: [
      { from: "q0", symbol: "0", to: ["q0"] },
      { from: "q0", symbol: "1", to: ["q0", "q1"] },
      { from: "q1", symbol: "0", to: [] },
      { from: "q1", symbol: "1", to: ["q2"] },
      { from: "q2", symbol: "0", to: ["q2"] },
      { from: "q2", symbol: "1", to: ["q2"] }
    ]
  },
  second_from_end_1: {
    title: "NFA 3: 2nd symbol from right is '1'",
    states: ["q0", "q1", "q2"],
    alphabet: ["0", "1"],
    startState: "q0",
    acceptStates: ["q2"],
    transitions: [
      { from: "q0", symbol: "0", to: ["q0"] },
      { from: "q0", symbol: "1", to: ["q0", "q1"] },
      { from: "q1", symbol: "0", to: ["q2"] },
      { from: "q1", symbol: "1", to: ["q2"] },
      { from: "q2", symbol: "0", to: [] },
      { from: "q2", symbol: "1", to: [] }
    ]
  },
  decimal_numbers: {
    title: "ε-NFA 4: Decimal Numbers (Hopcroft Fig 2.18)",
    states: ["q0", "q1", "q2", "q3", "q4", "q5"],
    alphabet: ["+/-", "digit", "."],
    startState: "q0",
    acceptStates: ["q5"],
    epsilonTransitions: [
      { from: "q0", to: ["q1"] },
      { from: "q1", to: ["q4"] },
      { from: "q3", to: ["q5"] }
    ],
    transitions: [
      { from: "q0", symbol: "+/-", to: ["q1"] },
      { from: "q0", symbol: "digit", to: [] },
      { from: "q0", symbol: ".", to: [] },
      { from: "q1", symbol: "+/-", to: [] },
      { from: "q1", symbol: "digit", to: ["q1"] },
      { from: "q1", symbol: ".", to: ["q2"] },
      { from: "q2", symbol: "+/-", to: [] },
      { from: "q2", symbol: "digit", to: ["q3"] },
      { from: "q2", symbol: ".", to: [] },
      { from: "q3", symbol: "+/-", to: [] },
      { from: "q3", symbol: "digit", to: ["q3"] },
      { from: "q3", symbol: ".", to: [] },
      { from: "q4", symbol: "+/-", to: [] },
      { from: "q4", symbol: "digit", to: [] },
      { from: "q4", symbol: ".", to: ["q3"] },
      { from: "q5", symbol: "+/-", to: [] },
      { from: "q5", symbol: "digit", to: [] },
      { from: "q5", symbol: ".", to: [] }
    ]
  }
};

// Component to render the visual SVG state machine diagram of the source NFA
const NfaDiagramRenderer: React.FC<{ nfa: NfaDefinition }> = ({ nfa }) => {
  const positions: Record<string, { x: number; y: number }> = {};
  const numStates = nfa.states.length;

  const hasDirectQ0Q2 = nfa.transitions.some(t => t.from === "q0" && t.to.includes("q2")) ||
    nfa.epsilonTransitions?.some(t => t.from === "q0" && t.to.includes("q2"));

  if (nfa.states.length === 3 && nfa.states.includes("q0") && nfa.states.includes("q1") && nfa.states.includes("q2")) {
    if (hasDirectQ0Q2) {
      positions["q0"] = { x: 120, y: 140 };
      positions["q1"] = { x: 340, y: 55 };
      positions["q2"] = { x: 560, y: 140 };
    } else {
      positions["q0"] = { x: 120, y: 110 };
      positions["q1"] = { x: 340, y: 110 };
      positions["q2"] = { x: 560, y: 110 };
    }
  } else if (nfa.states.length === 6 && nfa.states.includes("q0") && nfa.states.includes("q5")) {
    positions["q0"] = { x: 70, y: 110 };
    positions["q1"] = { x: 210, y: 110 };
    positions["q2"] = { x: 350, y: 65 };
    positions["q3"] = { x: 490, y: 110 };
    positions["q4"] = { x: 350, y: 160 };
    positions["q5"] = { x: 630, y: 110 };
  } else {
    nfa.states.forEach((st, idx) => {
      positions[st] = {
        x: 100 + idx * Math.max(150, 500 / numStates),
        y: 110
      };
    });
  }

  interface Edge {
    from: string;
    to: string;
    symbols: string[];
    isEpsilon: boolean;
  }
  const edgesMap = new Map<string, Edge>();

  if (nfa.epsilonTransitions) {
    nfa.epsilonTransitions.forEach(et => {
      et.to.forEach(target => {
        const key = `${et.from}->${target}`;
        if (!edgesMap.has(key)) {
          edgesMap.set(key, { from: et.from, to: target, symbols: ['ε'], isEpsilon: true });
        } else {
          const edge = edgesMap.get(key)!;
          if (!edge.symbols.includes('ε')) edge.symbols.push('ε');
        }
      });
    });
  }

  nfa.transitions.forEach(t => {
    t.to.forEach(target => {
      const key = `${t.from}->${target}`;
      if (!edgesMap.has(key)) {
        edgesMap.set(key, { from: t.from, to: target, symbols: [t.symbol], isEpsilon: false });
      } else {
        const edge = edgesMap.get(key)!;
        if (!edge.symbols.includes(t.symbol)) edge.symbols.push(t.symbol);
      }
    });
  });

  const edges = Array.from(edgesMap.values());
  const svgWidth = Math.max(650, nfa.states.length * 140 + 100);
  const viewBox = `0 0 ${svgWidth} 210`;

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-lg overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>Source ε-NFA Visual Diagram</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          Σ = &#123;{nfa.alphabet.join(', ')}&#125;
        </span>
      </div>

      <svg viewBox={viewBox} className="w-full h-auto font-sans min-w-[500px]">
        <defs>
          <marker id="nfa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
          <marker id="nfa-arrow-eps" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#e0e7ff" />
          </marker>
        </defs>

        {/* Start State Indicator Arrow */}
        {positions[nfa.startState] && (
          <g>
            <line
              x1={positions[nfa.startState].x - 60}
              y1={positions[nfa.startState].y}
              x2={positions[nfa.startState].x - 28}
              y2={positions[nfa.startState].y}
              stroke="#38bdf8"
              strokeWidth="2.5"
              markerEnd="url(#nfa-arrow)"
            />
            <text
              x={positions[nfa.startState].x - 50}
              y={positions[nfa.startState].y - 8}
              fill="#38bdf8"
              fontSize="11"
              fontWeight="900"
            >
              Start
            </text>
          </g>
        )}

        {/* Edges */}
        {edges.map((edge, idx) => {
          const fromPos = positions[edge.from];
          const toPos = positions[edge.to];
          if (!fromPos || !toPos) return null;

          // Self-loop
          if (edge.from === edge.to) {
            return (
              <g key={`edge-${idx}`}>
                <path
                  d={`M ${fromPos.x - 14} ${fromPos.y - 22} C ${fromPos.x - 32} ${fromPos.y - 62}, ${fromPos.x + 32} ${fromPos.y - 62}, ${fromPos.x + 14} ${fromPos.y - 22}`}
                  stroke={edge.isEpsilon ? "#e0e7ff" : "#38bdf8"}
                  strokeWidth="2"
                  fill="none"
                  markerEnd={edge.isEpsilon ? "url(#nfa-arrow-eps)" : "url(#nfa-arrow)"}
                />
                <rect
                  x={fromPos.x - 14}
                  y={fromPos.y - 62}
                  width="28"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                  stroke={edge.isEpsilon ? "#818cf8" : "#0284c7"}
                  strokeWidth="1"
                />
                <text
                  x={fromPos.x}
                  y={fromPos.y - 49}
                  fill={edge.isEpsilon ? "#c7d2fe" : "#38bdf8"}
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {edge.symbols.join(', ')}
                </text>
              </g>
            );
          }

          // Transition between different states
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) return null;

          const normX = dx / dist;
          const normY = dy / dist;

          const r = 26;
          const startX = fromPos.x + normX * r;
          const startY = fromPos.y + normY * r;
          const endX = toPos.x - normX * (r + 4);
          const endY = toPos.y - normY * (r + 4);

          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          const isOpposite = edges.some(e => e.from === edge.to && e.to === edge.from);
          const curveOffset = isOpposite ? -22 : 0;

          let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
          if (curveOffset !== 0) {
            const perpX = -normY * curveOffset;
            const perpY = normX * curveOffset;
            pathD = `M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`;
          }

          return (
            <g key={`edge-${idx}`}>
              <path
                d={pathD}
                stroke={edge.isEpsilon ? "#a855f7" : "#38bdf8"}
                strokeWidth={edge.isEpsilon ? "2.5" : "2"}
                fill="none"
                markerEnd={edge.isEpsilon ? "url(#nfa-arrow-eps)" : "url(#nfa-arrow)"}
              />
              <g transform={`translate(${midX}, ${midY})`}>
                {edge.symbols.map((sym, sIdx) => {
                  const boxY = (sIdx - (edge.symbols.length - 1) / 2) * 22;
                  const isEps = sym === 'ε' || sym === 'eps' || sym === 'epsilon';
                  return (
                    <g key={sIdx} transform={`translate(0, ${boxY})`}>
                      <rect
                        x="-14"
                        y="-10"
                        width="28"
                        height="20"
                        rx="5"
                        fill={isEps ? "#581c87" : "#0f172a"}
                        stroke={isEps ? "#c026d3" : "#0284c7"}
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        fill={isEps ? "#f5d0fe" : "#38bdf8"}
                        fontSize="12"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {sym}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}

        {/* Nodes */}
        {nfa.states.map(st => {
          const pos = positions[st] || { x: 100, y: 110 };
          const isAccept = nfa.acceptStates.includes(st);
          const isStart = st === nfa.startState;

          return (
            <g key={`node-${st}`} transform={`translate(${pos.x}, ${pos.y})`}>
              <circle
                r="26"
                fill={isStart ? "#1e1b4b" : isAccept ? "#064e3b" : "#0f172a"}
                stroke={isAccept ? "#10b981" : isStart ? "#818cf8" : "#38bdf8"}
                strokeWidth="2.5"
              />
              {isAccept && (
                <circle
                  r="21"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              )}
              <text
                fill="#ffffff"
                fontSize="13"
                fontWeight="900"
                textAnchor="middle"
                dy="4"
              >
                {st}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export interface SubsetConstructionWidgetProps {
  initialPreset?: string;
}

export const SubsetConstructionWidget: React.FC<SubsetConstructionWidgetProps> = ({ initialPreset = "decimal_numbers" }) => {
  const initialPresetObj = defaultNfaPresets[initialPreset] || defaultNfaPresets.decimal_numbers;
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>(initialPreset);
  const [nfa, setNfa] = useState<NfaDefinition>(initialPresetObj);

  // Initialize custom table input based on initialPresetObj
  const buildInitialCustomInput = (preset: NfaDefinition) => {
    const custom: Record<string, Record<string, string>> = {};
    preset.states.forEach(st => {
      custom[st] = {};
      preset.alphabet.forEach(sym => {
        const t = preset.transitions.find(x => x.from === st && x.symbol === sym);
        custom[st][sym] = t && t.to.length > 0 ? t.to.join(',') : '-';
      });
    });
    return custom;
  };

  const [customTableInput, setCustomTableInput] = useState<Record<string, Record<string, string>>>(
    buildInitialCustomInput(initialPresetObj)
  );

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Helper to format state set nicely, e.g. ["q0", "q1"] -> "{q0, q1}"
  const formatSet = (states: string[]): string => {
    if (!states || states.length === 0) return "∅";
    const sorted = Array.from(new Set(states)).sort();
    return `{${sorted.join(', ')}}`;
  };

  // Helper to compute ECLOSE of a set of states
  const getEclose = (states: string[]): string[] => {
    const closure = new Set<string>(states);
    const stack = [...states];
    while (stack.length > 0) {
      const curr = stack.pop()!;
      const epsTargets = nfa.epsilonTransitions?.find(x => x.from === curr)?.to || [];
      epsTargets.forEach(target => {
        if (!closure.has(target)) {
          closure.add(target);
          stack.push(target);
        }
      });
    }
    return Array.from(closure).sort();
  };

  // Helper to lookup NFA transitions
  const getNfaTransition = (state: string, symbol: string): string[] => {
    const t = nfa.transitions.find(x => x.from === state && x.symbol === symbol);
    return t ? t.to : [];
  };

  // Algorithm Step Generator
  const computeSteps = () => {
    const steps: {
      stepNumber: number;
      title: string;
      description: string;
      currentSubset: string[];
      processedSubsets: { subset: string[]; label: string; transitions: Record<string, { targetSet: string[]; targetLabel: string; mathStr: string }> }[];
      unprocessedQueue: string[][];
      discoveredLabels: Record<string, string>; // e.g. "{q0}": "A", "{q0,q1}": "B"
      explanationMath?: string;
    }[] = [];

    const labelGen = (idx: number) => String.fromCharCode(65 + idx); // A, B, C, D...
    const discoveredLabels: Record<string, string> = {};
    
    const startSet = getEclose([nfa.startState]);
    const startSetStr = formatSet(startSet);
    discoveredLabels[startSetStr] = "A";

    const queue: string[][] = [startSet];
    const processedMap = new Map<string, { subset: string[]; label: string; transitions: Record<string, { targetSet: string[]; targetLabel: string; mathStr: string }> }>();

    let stepCounter = 1;

    // Initial Step
    steps.push({
      stepNumber: stepCounter++,
      title: "Step 1: Initialize DFA Start State",
      description: `Define DFA start state as ECLOSE({${nfa.startState}}) = ${startSetStr} = State A. Add ${startSetStr} to the unprocessed queue.`,
      currentSubset: startSet,
      processedSubsets: [],
      unprocessedQueue: [startSet],
      discoveredLabels: { ...discoveredLabels }
    });

    let labelCount = 1;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentSetStr = formatSet(current);
      const currentLabel = discoveredLabels[currentSetStr] || labelGen(Object.keys(discoveredLabels).length - 1);

      const rowTransitions: Record<string, { targetSet: string[]; targetLabel: string; mathStr: string }> = {};

      let stepDescMath = `Processing row for DFA State ${currentLabel} = ${currentSetStr}:\n`;

      for (const symbol of nfa.alphabet) {
        let directTargets: string[] = [];
        let mathParts: string[] = [];

        for (const st of current) {
          const targets = getNfaTransition(st, symbol);
          targets.forEach(t => directTargets.push(t));
          mathParts.push(`δ_N(${st}, '${symbol}') = ${formatSet(targets)}`);
        }

        const directTargetSet = Array.from(new Set(directTargets)).sort();
        const eclosedTargets = getEclose(directTargetSet);
        const targetSetStr = formatSet(eclosedTargets);

        let targetLabel = discoveredLabels[targetSetStr];
        let isNew = false;

        if (!targetLabel) {
          targetLabel = labelGen(labelCount++);
          discoveredLabels[targetSetStr] = targetLabel;
          queue.push(eclosedTargets);
          isNew = true;
        }

        const mathStr = nfa.epsilonTransitions && nfa.epsilonTransitions.length > 0
          ? `δ_D(${currentLabel}, '${symbol}') = ECLOSE(${mathParts.join(' ∪ ')}) = ECLOSE(${formatSet(directTargetSet)}) = ${targetSetStr} (${targetLabel})`
          : `δ_D(${currentLabel}, '${symbol}') = ${mathParts.join(' ∪ ')} = ${targetSetStr} (${targetLabel})`;
          
        stepDescMath += `• Input '${symbol}': ${mathStr}${isNew ? ' [NEW STATE DISCOVERED!]' : ''}\n`;

        rowTransitions[symbol] = {
          targetSet: eclosedTargets,
          targetLabel,
          mathStr
        };
      }

      processedMap.set(currentSetStr, {
        subset: current,
        label: currentLabel,
        transitions: rowTransitions
      });

      steps.push({
        stepNumber: stepCounter++,
        title: `Step ${stepCounter - 1}: Process State ${currentLabel} = ${currentSetStr}`,
        description: `Compute transitions for each symbol from subset ${currentSetStr}:`,
        currentSubset: current,
        processedSubsets: Array.from(processedMap.values()),
        unprocessedQueue: [...queue],
        discoveredLabels: { ...discoveredLabels },
        explanationMath: stepDescMath
      });
    }

    // Final Completion Step
    steps.push({
      stepNumber: stepCounter,
      title: "Final Step: Mark Accepting/Final States (F_D)",
      description: `All subsets processed! Mark DFA accepting states: Any subset containing NFA final state (${nfa.acceptStates.join(', ')}).`,
      currentSubset: [],
      processedSubsets: Array.from(processedMap.values()),
      unprocessedQueue: [],
      discoveredLabels: { ...discoveredLabels },
      explanationMath: `DFA Construction Complete!\n• Total DFA States: ${processedMap.size}\n• Accepting DFA States: ${Array.from(processedMap.values()).filter(x => x.subset.some(st => nfa.acceptStates.includes(st))).map(x => `${x.label} (${formatSet(x.subset)})`).join(', ')}`
    });

    return steps;
  };

  const steps = computeSteps();
  const activeStep = steps[Math.min(currentStep, steps.length - 1)];

  // Convert constructed table into a final DfaDefinition for DfaAnimatorWidget
  const convertToDfaDefinition = () => {
    const lastStep = steps[steps.length - 1];
    const states: string[] = [];
    const acceptStates: string[] = [];
    const transitions: { from: string; symbol: string; to: string }[] = [];

    lastStep.processedSubsets.forEach(p => {
      const label = `${p.label} ${formatSet(p.subset)}`;
      states.push(label);

      if (p.subset.some(st => nfa.acceptStates.includes(st))) {
        acceptStates.push(label);
      }

      Object.entries(p.transitions).forEach(([sym, targetObj]) => {
        const targetLabel = `${targetObj.targetLabel} ${formatSet(targetObj.targetSet)}`;
        transitions.push({
          from: label,
          symbol: sym,
          to: targetLabel
        });
      });
    });

    const startLabel = lastStep.processedSubsets[0]
      ? `${lastStep.processedSubsets[0].label} ${formatSet(lastStep.processedSubsets[0].subset)}`
      : "A {q0}";

    return {
      title: `Converted DFA for "${nfa.title}"`,
      states,
      alphabet: nfa.alphabet,
      startState: startLabel,
      acceptStates,
      transitions,
      testString: nfa.title.includes("Decimal") ? "5.6" : nfa.alphabet.includes("a") ? "aabbc" : "01"
    };
  };

  const generatedDfa = convertToDfaDefinition();

  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    const preset = defaultNfaPresets[key];
    setNfa(preset);

    // Update custom inputs
    const newCustom: Record<string, Record<string, string>> = {};
    preset.states.forEach(st => {
      newCustom[st] = {};
      preset.alphabet.forEach(sym => {
        const t = preset.transitions.find(x => x.from === st && x.symbol === sym);
        newCustom[st][sym] = t && t.to.length > 0 ? t.to.join(',') : '-';
      });
    });
    setCustomTableInput(newCustom);
    setCurrentStep(0);
  };

  const handleCellChange = (state: string, symbol: string, value: string) => {
    const updatedCustom = { ...customTableInput };
    if (!updatedCustom[state]) updatedCustom[state] = {};
    updatedCustom[state][symbol] = value;
    setCustomTableInput(updatedCustom);

    // Rebuild transitions
    const newTransitions: { from: string; symbol: string; to: string[] }[] = [];
    nfa.states.forEach(st => {
      nfa.alphabet.forEach(sym => {
        const raw = updatedCustom[st]?.[sym] || '-';
        const parsed = raw === '-' || raw.trim() === '' ? [] : raw.split(',').map(s => s.trim()).filter(Boolean);
        newTransitions.push({ from: st, symbol: sym, to: parsed });
      });
    });

    setNfa(prev => ({
      ...prev,
      transitions: newTransitions
    }));
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
      {/* Title & Presets Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Interactive Table-Input Subset Construction Tool</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            NFA to DFA Conversion Step-by-Step Calculator
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Select NFA Preset:</label>
          <select
            value={selectedPresetKey}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-50 text-indigo-900 font-bold text-sm px-3 py-2 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {Object.entries(defaultNfaPresets).map(([k, p]) => (
              <option key={k} value={k}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Layout: NFA Transition Table Input & Step-by-Step Algorithm Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Source NFA Table Input */}
        <div className="flex flex-col gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Table className="w-5 h-5 text-indigo-600" />
              <span>Source NFA Transition Table (Editable Input)</span>
            </h4>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg">
              Start: {nfa.startState} | Accept: {nfa.acceptStates.join(', ')}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Modify state transitions below by entering comma-separated target states (e.g., <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-900 font-bold">q0,q1</code>) or <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-bold">-</code> for empty set <code className="font-bold">∅</code>.
          </p>

          {/* Visual NFA State Machine Diagram */}
          <NfaDiagramRenderer nfa={nfa} />

          <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-xs bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-slate-700">NFA State (q)</th>
                  {nfa.alphabet.map(sym => (
                    <th key={sym} className="p-3 border-b border-slate-700 text-center">
                      Input '{sym}'
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {nfa.states.map(st => {
                  const isStart = st === nfa.startState;
                  const isAccept = nfa.acceptStates.includes(st);
                  return (
                    <tr key={st} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        {isStart && <span className="text-indigo-600 font-extrabold" title="Start State">→</span>}
                        {isAccept && <span className="text-emerald-600 font-extrabold" title="Accepting State">*</span>}
                        <span>{st}</span>
                      </td>
                      {nfa.alphabet.map(sym => (
                        <td key={sym} className="p-2 text-center">
                          <input
                            type="text"
                            value={customTableInput[st]?.[sym] || '-'}
                            onChange={(e) => handleCellChange(st, sym, e.target.value)}
                            className="w-24 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs text-indigo-950 font-medium flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-indigo-900 block mb-0.5">Subset Construction Rule:</span>
              For a subset of NFA states <code className="font-bold">S = &#123;q₁, q₂, ...&#125;</code> and input <code className="font-bold">a</code>:
              <div className="font-mono text-indigo-900 font-bold my-1 bg-white p-1.5 rounded border border-indigo-300">
                δ_D(S, a) = ⋃ &#123; δ_N(q, a) | q ∈ S &#125;
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Subset Construction Table Calculation */}
        <div className="flex flex-col gap-5 bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-inner">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                Step {activeStep.stepNumber} of {steps.length}
              </span>
              <h4 className="font-extrabold text-white text-lg">
                {activeStep.title}
              </h4>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={currentStep === steps.length - 1}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Reset Stepper"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-snug">
            {activeStep.description}
          </p>

          {/* Mathematical Step Log Box */}
          {activeStep.explanationMath && (
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed shadow-sm">
              {activeStep.explanationMath}
            </div>
          )}

          {/* Growing DFA Subset Transition Table */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resulting DFA Transition Table (Constructed so far):
            </span>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800 text-slate-200 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5 border-b border-slate-700">DFA State Label</th>
                    <th className="p-2.5 border-b border-slate-700">NFA Composite Subset S</th>
                    {nfa.alphabet.map(sym => (
                      <th key={sym} className="p-2.5 border-b border-slate-700 text-center">
                        Input '{sym}'
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {activeStep.processedSubsets.map((row, idx) => {
                    const isStart = idx === 0;
                    const isAccepting = row.subset.some(st => nfa.acceptStates.includes(st));
                    const isCurrentlyProcessing = formatSet(row.subset) === formatSet(activeStep.currentSubset);

                    return (
                      <tr
                        key={row.label}
                        className={`transition-colors ${
                          isCurrentlyProcessing
                            ? 'bg-cyan-950/90 text-cyan-200 border-l-4 border-cyan-400 font-bold'
                            : 'hover:bg-slate-900 text-slate-200'
                        }`}
                      >
                        <td className="p-2.5 font-bold flex items-center gap-1.5">
                          {isStart && <span className="text-cyan-400 font-extrabold" title="DFA Start State">→</span>}
                          {isAccepting && <span className="text-emerald-400 font-extrabold" title="DFA Accepting State">*</span>}
                          <span className="text-cyan-300">{row.label}</span>
                        </td>
                        <td className="p-2.5 font-bold text-slate-300">
                          {formatSet(row.subset)}
                        </td>
                        {nfa.alphabet.map(sym => {
                          const trans = row.transitions[sym];
                          return (
                            <td key={sym} className="p-2.5 text-center">
                              {trans ? (
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  trans.targetSet.some(st => nfa.acceptStates.includes(st))
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                                    : 'bg-slate-800 text-cyan-200'
                                }`}>
                                  {trans.targetLabel} ({formatSet(trans.targetSet)})
                                </span>
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Converted DFA Diagram & Simulator */}
      <div className="pt-6 border-t border-slate-200">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Interactive Visualizer: Converted DFA State Machine</span>
          </h4>
          <p className="text-xs text-slate-500">
            Below is the fully synthesized DFA state machine resulting from the subset construction above. Test inputs to see how it processes strings deterministically!
          </p>
        </div>

        <DfaAnimatorWidget dfa={generatedDfa} />
      </div>
    </div>
  );
};
