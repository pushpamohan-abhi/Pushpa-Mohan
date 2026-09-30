import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, XCircle, ArrowRight, Layers, HelpCircle, RefreshCw, Cpu } from 'lucide-react';

interface RegexPreset {
  id: string;
  regex: string;
  title: string;
  description: string;
  acceptExamples: string[];
  rejectExamples: string[];
  thompsonNodes: { id: string; label: string; isStart?: boolean; isAccept?: boolean }[];
  thompsonEdges: { from: string; to: string; label: string }[];
  dfaNodes?: { id: string; label: string; isStart?: boolean; isAccept?: boolean }[];
  dfaEdges?: { from: string; to: string; label: string }[];
  stateEliminationSteps: {
    step: number;
    title: string;
    diagram: string;
    equation: string;
  }[];
}

const regexPresets: Record<string, RegexPreset> = {
  thompson_a_or_b_star_ab: {
    id: "thompson_a_or_b_star_ab",
    regex: "(a|b)*ab",
    title: "Padma Reddy Ex 3.2: (a|b)*ab Thompson ε-NFA",
    description: "Full 10-state Thompson ε-NFA transition diagram for RE r = (a + b)*ab.",
    acceptExamples: ["ab", "aab", "bab", "ababb", "abbab"],
    rejectExamples: ["", "a", "b", "ba", "aba"],
    thompsonNodes: [
      { id: "q6", label: "q6 (Start)", isStart: true },
      { id: "q0", label: "q0" },
      { id: "q1", label: "q1" },
      { id: "q2", label: "q2" },
      { id: "q3", label: "q3" },
      { id: "q4", label: "q4" },
      { id: "q5", label: "q5" },
      { id: "q7", label: "q7" },
      { id: "q8", label: "q8" },
      { id: "q9", label: "q9*", isAccept: true }
    ],
    thompsonEdges: [
      { from: "q6", to: "q0", label: "ε" },
      { from: "q6", to: "q7", label: "ε" },
      { from: "q0", to: "q1", label: "ε" },
      { from: "q0", to: "q3", label: "ε" },
      { from: "q1", to: "q2", label: "a" },
      { from: "q3", to: "q4", label: "b" },
      { from: "q2", to: "q5", label: "ε" },
      { from: "q4", to: "q5", label: "ε" },
      { from: "q5", to: "q0", label: "ε" },
      { from: "q5", to: "q7", label: "ε" },
      { from: "q7", to: "q8", label: "a" },
      { from: "q8", to: "q9", label: "b" }
    ],
    dfaNodes: [
      { id: "A", label: "q0 (Start)", isStart: true },
      { id: "B", label: "q1 (Seen 'a')" },
      { id: "C", label: "q2* (Seen 'ab')", isAccept: true }
    ],
    dfaEdges: [
      { from: "A", to: "A", label: "b" },
      { from: "A", to: "B", label: "a" },
      { from: "B", to: "B", label: "a" },
      { from: "B", to: "C", label: "b" },
      { from: "C", to: "B", label: "a" },
      { from: "C", to: "A", label: "b" }
    ],
    stateEliminationSteps: [
      {
        step: 1,
        title: "Step 1: Atomic Machines for 'a' and 'b'",
        diagram: "N_a: q1 --'a'--> q2;   N_b: q3 --'b'--> q4",
        equation: "Construct base transition arcs for single symbols 'a' and 'b'"
      },
      {
        step: 2,
        title: "Step 2: Union Machine (a + b)",
        diagram: "q0 --ε--> {q1, q3};  {q2, q4} --ε--> q5",
        equation: "Parallel branching with initial fork state q0 and join state q5"
      },
      {
        step: 3,
        title: "Step 3: Kleene Star Machine (a + b)*",
        diagram: "q6 --ε--> {q0, q7};  q5 --ε--> {q0, q7}",
        equation: "Add feedback loop q5 --ε--> q0 and bypass arc q6 --ε--> q7"
      },
      {
        step: 4,
        title: "Step 4: Concatenation with 'ab'",
        diagram: "q7 --'a'--> q8 --'b'--> q9*",
        equation: "Complete 10-state Thompson ε-NFA for (a + b)*ab ✅"
      }
    ]
  },
  padma_reddy_example1: {
    id: "padma_reddy_example1",
    regex: "0(0|1)*1",
    title: "Padma Reddy Ex 3.1: 0(0|1)*1 Thompson ε-NFA",
    description: "Thompson ε-NFA for RE 0(0 + 1)*1 (Starts with 0, Ends with 1).",
    acceptExamples: ["01", "001", "011", "0101", "00011"],
    rejectExamples: ["0", "1", "10", "010", "101"],
    thompsonNodes: [
      { id: "q6", label: "q6 (Start)", isStart: true },
      { id: "q0", label: "q0" },
      { id: "q1", label: "q1" },
      { id: "q2", label: "q2" },
      { id: "q3", label: "q3" },
      { id: "q4", label: "q4" },
      { id: "q5", label: "q5" },
      { id: "q7", label: "q7" },
      { id: "q9", label: "q9*", isAccept: true }
    ],
    thompsonEdges: [
      { from: "q6", to: "q0", label: "0" },
      { from: "q0", to: "q1", label: "ε" },
      { from: "q0", to: "q3", label: "ε" },
      { from: "q1", to: "q2", label: "0" },
      { from: "q3", to: "q4", label: "1" },
      { from: "q2", to: "q5", label: "ε" },
      { from: "q4", to: "q5", label: "ε" },
      { from: "q5", to: "q0", label: "ε" },
      { from: "q5", to: "q7", label: "ε" },
      { from: "q0", to: "q7", label: "ε" },
      { from: "q7", to: "q9", label: "1" }
    ],
    dfaNodes: [
      { id: "A", label: "A (Start)", isStart: true },
      { id: "B", label: "B (Seen '0')" },
      { id: "C", label: "C* (Seen '0...1')", isAccept: true }
    ],
    dfaEdges: [
      { from: "A", to: "B", label: "0" },
      { from: "B", to: "B", label: "0" },
      { from: "B", to: "C", label: "1" },
      { from: "C", to: "B", label: "0" },
      { from: "C", to: "C", label: "1" }
    ],
    stateEliminationSteps: [
      {
        step: 1,
        title: "DFA Equations (Padma Reddy Method)",
        diagram: "A --'0'--> B --(0,1)--> B --'1'--> C*",
        equation: "A = start;  B = A.0 + B.0 + B.1;  C = B.1"
      },
      {
        step: 2,
        title: "Factor B equation",
        diagram: "B = A.0 + B.(0 + 1)",
        equation: "Apply Arden's Law: R = Q + RP  ⇒  R = QP*"
      },
      {
        step: 3,
        title: "Solve for B using Arden's Law",
        diagram: "B = A.0.(0 + 1)*",
        equation: "Substitute B into C equation: C = A.0.(0 + 1)*.1"
      },
      {
        step: 4,
        title: "Final Regular Expression",
        diagram: "L = 0(0|1)*1",
        equation: "R = 0(0 + 1)*1  ✅"
      }
    ]
  },
  even_zeros: {
    id: "even_zeros",
    regex: "(1|01*0)*",
    title: "Even Number of 0s: RE (1|01*0)* Thompson ε-NFA",
    description: "Thompson ε-NFA for language containing an EVEN number of '0's.",
    acceptExamples: ["", "1", "11", "00", "010", "1001", "0110"],
    rejectExamples: ["0", "01", "10", "000", "10100"],
    thompsonNodes: [
      { id: "q6", label: "q6 (Start)", isStart: true, isAccept: true },
      { id: "q0", label: "q0" },
      { id: "q1", label: "q1" },
      { id: "q2", label: "q2" },
      { id: "q3", label: "q3" },
      { id: "q4", label: "q4" },
      { id: "q5", label: "q5" },
      { id: "q7", label: "q7" },
      { id: "q9", label: "q9*", isAccept: true }
    ],
    thompsonEdges: [
      { from: "q6", to: "q0", label: "ε" },
      { from: "q0", to: "q1", label: "1" },
      { from: "q0", to: "q2", label: "0" },
      { from: "q2", to: "q3", label: "ε" },
      { from: "q3", to: "q3", label: "1" },
      { from: "q3", to: "q4", label: "0" },
      { from: "q1", to: "q5", label: "ε" },
      { from: "q4", to: "q5", label: "ε" },
      { from: "q5", to: "q0", label: "ε" },
      { from: "q5", to: "q7", label: "ε" },
      { from: "q6", to: "q7", label: "ε" },
      { from: "q7", to: "q9", label: "ε" }
    ],
    dfaNodes: [
      { id: "A", label: "q_even* (Even 0s)", isStart: true, isAccept: true },
      { id: "B", label: "q_odd (Odd 0s)" }
    ],
    dfaEdges: [
      { from: "A", to: "A", label: "1" },
      { from: "A", to: "B", label: "0" },
      { from: "B", to: "B", label: "1" },
      { from: "B", to: "A", label: "0" }
    ],
    stateEliminationSteps: [
      {
        step: 1,
        title: "2-State Parity Automaton for EVEN Number of 0s",
        diagram: "q_even* --0--> q_odd --0--> q_even*;  self-loops on 1",
        equation: "q_even = ε + q_even.1 + q_odd.0;  q_odd = q_even.0 + q_odd.1"
      },
      {
        step: 2,
        title: "Solve for q_odd using Arden's Law",
        diagram: "q_odd = q_even.0 + q_odd.1  ⇒  q_odd = q_even.0.1*",
        equation: "Substitute q_odd into q_even equation"
      },
      {
        step: 3,
        title: "Substitute q_odd into q_even",
        diagram: "q_even = ε + q_even.1 + (q_even.0.1*).0 = ε + q_even.(1 + 0.1*.0)",
        equation: "q_even = ε + q_even.(1 + 0.1*0)"
      },
      {
        step: 4,
        title: "Apply Arden's Law for Final RE",
        diagram: "R = ε + R.P  ⇒  R = P*",
        equation: "q_even = (1 + 0.1*0)*  ✅"
      }
    ]
  },
  odd_zeros: {
    id: "odd_zeros",
    regex: "1*0(1|01*0)*",
    title: "Odd Number of 0s: RE 1*0(1|01*0)* Thompson ε-NFA",
    description: "Thompson ε-NFA for language containing an ODD number of '0's.",
    acceptExamples: ["0", "01", "10", "000", "1011000", "011"],
    rejectExamples: ["", "1", "11", "00", "010", "1001"],
    thompsonNodes: [
      { id: "q6", label: "q6 (Start)", isStart: true },
      { id: "q0", label: "q0" },
      { id: "q1", label: "q1" },
      { id: "q2", label: "q2" },
      { id: "q3", label: "q3" },
      { id: "q4", label: "q4" },
      { id: "q5", label: "q5" },
      { id: "q7", label: "q7" },
      { id: "q9", label: "q9*", isAccept: true }
    ],
    thompsonEdges: [
      { from: "q6", to: "q0", label: "ε" },
      { from: "q0", to: "q0", label: "1" },
      { from: "q0", to: "q1", label: "0" },
      { from: "q1", to: "q2", label: "ε" },
      { from: "q2", to: "q3", label: "1" },
      { from: "q2", to: "q4", label: "0" },
      { from: "q4", to: "q4", label: "1" },
      { from: "q4", to: "q5", label: "0" },
      { from: "q3", to: "q7", label: "ε" },
      { from: "q5", to: "q7", label: "ε" },
      { from: "q7", to: "q2", label: "ε" },
      { from: "q1", to: "q9", label: "ε" },
      { from: "q7", to: "q9", label: "ε" }
    ],
    dfaNodes: [
      { id: "A", label: "q_even (Even 0s)", isStart: true },
      { id: "B", label: "q_odd* (Odd 0s)", isAccept: true }
    ],
    dfaEdges: [
      { from: "A", to: "A", label: "1" },
      { from: "A", to: "B", label: "0" },
      { from: "B", to: "B", label: "1" },
      { from: "B", to: "A", label: "0" }
    ],
    stateEliminationSteps: [
      {
        step: 1,
        title: "2-State Parity Automaton for ODD Number of 0s",
        diagram: "q_even --0--> q_odd* --0--> q_even;  self-loops on 1",
        equation: "q_even = start state;  q_odd = q_even.0.1*"
      },
      {
        step: 2,
        title: "Solve for q_odd using Arden's Law",
        diagram: "q_odd = 1*0 (1 + 01*0)*",
        equation: "RE for Odd 0s = 1*0(1 + 01*0)*  ✅"
      }
    ]
  }
};

export const RegexSimulatorWidget: React.FC = () => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("thompson_a_or_b_star_ab");
  const [testInput, setTestInput] = useState<string>("ab");
  const [customRegex, setCustomRegex] = useState<string>("(a|b)*ab");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showEpsilon, setShowEpsilon] = useState<boolean>(true);

  const preset = regexPresets[selectedPresetKey] || regexPresets.thompson_a_or_b_star_ab;
  const currentNodes = (showEpsilon || !preset.dfaNodes) ? preset.thompsonNodes : preset.dfaNodes;
  const currentEdges = (showEpsilon || !preset.dfaEdges) ? preset.thompsonEdges : preset.dfaEdges;

  const testMatch = (str: string, pattern: string): boolean => {
    try {
      // Convert standard CS regex notation (a|b)* into JS notation (a|b)*
      const jsPattern = `^(${pattern.replace(/\+/g, '|').replace(/ε/g, '')})$`;
      const re = new RegExp(jsPattern);
      return re.test(str);
    } catch {
      return false;
    }
  };

  const isMatched = testMatch(testInput, customRegex);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-widest mb-1">
            <Cpu className="w-4 h-4" />
            <span>Module 2 Simulator: Regular Expressions & State Elimination</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Regex Evaluator & Visual Automaton Transition Diagram
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Explore interactive visual state transition diagrams, test strings, and step through Arden's Law state elimination!
          </p>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-2">Preset:</span>
          <select
            value={selectedPresetKey}
            onChange={(e) => {
              setSelectedPresetKey(e.target.value);
              const p = regexPresets[e.target.value];
              if (p) {
                setCustomRegex(p.regex);
                setTestInput(p.acceptExamples[0] || "abb");
                setActiveStep(1);
              }
            }}
            className="bg-slate-900 text-cyan-300 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 outline-none cursor-pointer"
          >
            {Object.entries(regexPresets).map(([key, val]) => (
              <option key={key} value={key}>
                {val.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Graphical SVG Transition Diagram - LARGE & HIGH VISIBILITY WITH / WITHOUT EPSILON TOGGLE */}
      <div className="w-full bg-slate-950 p-6 rounded-3xl border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-500/50 rounded-xl text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-widest text-cyan-300 block">
                Visual State Transition Diagram ({showEpsilon ? 'With ε-Transitions' : 'Without ε-Transitions'}):
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {preset.title}
              </span>
            </div>
          </div>

          {/* Mode Toggle Buttons: With ε vs Without ε */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setShowEpsilon(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                showEpsilon
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              With ε-Moves (ε-NFA)
            </button>
            <button
              onClick={() => setShowEpsilon(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                !showEpsilon
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Without ε-Moves (DFA)
            </button>
          </div>
        </div>

        {/* Large High-Contrast SVG Viewport */}
        <div className="w-full overflow-x-auto bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex justify-center">
          <svg viewBox="0 0 1000 340" className="w-full min-w-[850px] max-w-[1100px] h-auto select-none">
            <defs>
              <marker id="arrowhead" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker id="arrowhead-loop" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
              </marker>
              <marker id="arrowhead-symbol" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
              </marker>
            </defs>

            {/* Render Edges / Arcs */}
            {currentEdges.map((e, idx) => {
              const positions: Record<string, { x: number; y: number }> = {
                q6: { x: 60, y: 170 },
                q0: { x: 170, y: 170 },
                q1: { x: 290, y: 70 },
                q2: { x: 420, y: 70 },
                q3: { x: 290, y: 270 },
                q4: { x: 420, y: 270 },
                q5: { x: 540, y: 170 },
                q7: { x: 660, y: 170 },
                q8: { x: 780, y: 170 },
                q9: { x: 910, y: 170 },
                A: { x: 120, y: 170 },
                B: { x: 500, y: 170 },
                C: { x: 880, y: 170 },
              };

              const src = positions[e.from] || { x: 100 + idx * 90, y: 170 };
              const tgt = positions[e.to] || { x: 200 + idx * 90, y: 170 };

              // Curved bypass arc q6 -> q7
              if (e.from === 'q6' && e.to === 'q7') {
                return (
                  <g key={`edge-${idx}`}>
                    <path
                      d={`M ${src.x} ${src.y} Q 360 -30 ${tgt.x} ${tgt.y}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeDasharray="6 3"
                      markerEnd="url(#arrowhead)"
                    />
                    <rect x="340" y="5" width="40" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="360" y="22" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">
                      {e.label}
                    </text>
                  </g>
                );
              }

              // Curved feedback loop q5 -> q0
              if (e.from === 'q5' && e.to === 'q0') {
                return (
                  <g key={`edge-${idx}`}>
                    <path
                      d={`M ${src.x} ${src.y} Q 355 370 ${tgt.x} ${tgt.y}`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3.5"
                      strokeDasharray="6 3"
                      markerEnd="url(#arrowhead-loop)"
                    />
                    <rect x="335" y="305" width="40" height="24" rx="6" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />
                    <text x="355" y="322" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">
                      {e.label}
                    </text>
                  </g>
                );
              }

              // Self loop
              if (e.from === e.to) {
                return (
                  <g key={`edge-${idx}`}>
                    <path
                      d={`M ${src.x - 12} ${src.y - 20} C ${src.x - 40} ${src.y - 65}, ${src.x + 40} ${src.y - 65}, ${src.x + 12} ${src.y - 20}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      markerEnd="url(#arrowhead)"
                    />
                    <rect x={src.x - 20} y={src.y - 72} width="40" height="24" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x={src.x} y={src.y - 55} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">
                      {e.label}
                    </text>
                  </g>
                );
              }

              // Standard straight arc
              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;
              const isEpsilon = e.label === 'ε';
              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isEpsilon ? '#38bdf8' : '#34d399'}
                    strokeWidth="3.5"
                    markerEnd={isEpsilon ? 'url(#arrowhead)' : 'url(#arrowhead-symbol)'}
                  />
                  <rect
                    x={midX - 18}
                    y={midY - 12}
                    width="36"
                    height="24"
                    rx="6"
                    fill={isEpsilon ? '#0284c7' : '#059669'}
                    stroke={isEpsilon ? '#38bdf8' : '#34d399'}
                    strokeWidth="1.5"
                  />
                  <text
                    x={midX}
                    y={midY + 5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="14"
                    fontWeight="900"
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes / States - LARGE HIGH VISIBILITY CIRCLES */}
            {currentNodes.map((n) => {
              const positions: Record<string, { x: number; y: number }> = {
                q6: { x: 60, y: 170 },
                q0: { x: 170, y: 170 },
                q1: { x: 290, y: 70 },
                q2: { x: 420, y: 70 },
                q3: { x: 290, y: 270 },
                q4: { x: 420, y: 270 },
                q5: { x: 540, y: 170 },
                q7: { x: 660, y: 170 },
                q8: { x: 780, y: 170 },
                q9: { x: 910, y: 170 },
                A: { x: 120, y: 170 },
                B: { x: 500, y: 170 },
                C: { x: 880, y: 170 },
              };

              const pos = positions[n.id] || { x: 100, y: 170 };
              return (
                <g key={`node-${n.id}`} className="cursor-pointer group">
                  {/* Start State Indicator Arrow */}
                  {n.isStart && (
                    <g>
                      <line x1={pos.x - 45} y1={pos.y} x2={pos.x - 25} y2={pos.y} stroke="#38bdf8" strokeWidth="4" markerEnd="url(#arrowhead)" />
                      <text x={pos.x - 52} y={pos.y - 10} fill="#38bdf8" fontSize="11" fontWeight="900">START</text>
                    </g>
                  )}

                  {/* Outer Glow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    fill="none"
                    stroke={n.isAccept ? 'rgba(52,211,153,0.3)' : n.isStart ? 'rgba(56,189,248,0.3)' : 'rgba(100,116,139,0.2)'}
                    strokeWidth="8"
                  />

                  {/* Main State Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="23"
                    fill={n.isAccept ? '#064e3b' : '#0f172a'}
                    stroke={n.isAccept ? '#34d399' : n.isStart ? '#38bdf8' : '#94a3b8'}
                    strokeWidth="3.5"
                    className="transition-all group-hover:stroke-cyan-300 group-hover:scale-110"
                  />

                  {/* Accept State Double Ring */}
                  {n.isAccept && (
                    <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke="#34d399" strokeWidth="2.5" />
                  )}

                  {/* State Label */}
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="15"
                    fontWeight="900"
                  >
                    {n.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Grid: Left Column (Regex Input & Matcher), Right Column (State Elimination Walkthrough) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Regex Evaluator & Sample Test Strings */}
        <div className="lg:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 block mb-2">
              Regular Expression Input (CS Notation: <code className="text-white">+</code> or <code className="text-white">|</code> for Union):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customRegex}
                onChange={(e) => setCustomRegex(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-cyan-300 font-mono text-lg font-bold outline-none focus:border-cyan-400"
                placeholder="(a|b)*abb"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Test String Evaluation:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white font-mono text-base font-bold outline-none focus:border-indigo-400"
                placeholder="Enter test string e.g. abb"
              />
              <div
                className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                  isMatched
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-rose-950 text-rose-400 border border-rose-700'
                }`}
              >
                {isMatched ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{isMatched ? 'MATCHED ✅' : 'REJECTED ❌'}</span>
              </div>
            </div>
          </div>

          {/* Preset Sample Strings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                Valid Example Strings (Should Match):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {preset.acceptExamples.map((ex, idx) => (
                  <button
                    key={`acc-${idx}`}
                    onClick={() => setTestInput(ex)}
                    className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 font-mono text-xs rounded-lg border border-emerald-800/80 transition-all"
                  >
                    "{ex === '' ? 'ε' : ex}"
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                Invalid Example Strings (Should Reject):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {preset.rejectExamples.map((ex, idx) => (
                  <button
                    key={`rej-${idx}`}
                    onClick={() => setTestInput(ex)}
                    className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-mono text-xs rounded-lg border border-rose-800/80 transition-all"
                  >
                    "{ex === '' ? 'ε' : ex}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Step-by-Step State Elimination / Arden's Theorem Walkthrough */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                DFA ➔ RE Conversion via State Elimination (Arden's Law)
              </span>
              <span className="text-xs font-mono font-extrabold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                Step {activeStep} of {preset.stateEliminationSteps.length}
              </span>
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-2 mb-4">
              {preset.stateEliminationSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`flex-1 py-1.5 rounded-xl font-extrabold text-xs transition-all border ${
                    activeStep === s.step
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Step {s.step}
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            {(() => {
              const currentStepData = preset.stateEliminationSteps.find((s) => s.step === activeStep) || preset.stateEliminationSteps[0];
              return (
                <div className="space-y-4 bg-slate-900/90 p-4 rounded-xl border border-indigo-900/50">
                  <h4 className="text-base font-extrabold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {currentStepData.title}
                  </h4>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">State Machine Diagram:</span>
                    <div className="text-amber-300 font-bold">{currentStepData.diagram}</div>
                  </div>

                  <div className="bg-indigo-950/60 p-3 rounded-lg border border-indigo-800/80 font-mono text-xs text-indigo-200">
                    <span className="text-indigo-400 block text-[10px] uppercase font-bold mb-1">Algebraic Elimination Equation:</span>
                    <div className="text-cyan-300 font-extrabold text-sm">{currentStepData.equation}</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Arden's Law Formula Footer */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-amber-400">Arden's Theorem:</span>
            <code className="bg-slate-950 px-2 py-1 rounded text-cyan-300 font-mono text-xs border border-slate-800">
              R = Q + RP  ⇒  R = QP*  (If ε ∉ P)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
