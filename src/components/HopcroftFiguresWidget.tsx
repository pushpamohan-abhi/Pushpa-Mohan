import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Sparkles, Layers, Info } from 'lucide-react';

interface HopcroftFiguresWidgetProps {
  initialFigure?: '2.18' | '2.19' | '2.20' | '2.21' | '2.22';
}

export const HopcroftFiguresWidget: React.FC<HopcroftFiguresWidgetProps> = ({ initialFigure = '2.18' }) => {
  const [activeFigure, setActiveFigure] = useState<'2.18' | '2.19' | '2.20' | '2.21' | '2.22'>(initialFigure);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const handleSelectFigure = (fig: '2.18' | '2.19' | '2.20' | '2.21' | '2.22') => {
    setActiveFigure(fig);
    setStepIndex(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-6">
      {/* Top Figure Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-700/50 rounded-xl text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Hopcroft Textbook Figures</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['2.18', '2.19', '2.20', '2.21', '2.22'] as const).map(fig => (
            <button
              key={fig}
              onClick={() => handleSelectFigure(fig)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                activeFigure === fig
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>Fig {fig}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Figure Display & Step Controls */}
      {activeFigure === '2.18' && (
        <Figure218View stepIndex={stepIndex} setStepIndex={setStepIndex} />
      )}
      {activeFigure === '2.19' && (
        <Figure219View stepIndex={stepIndex} setStepIndex={setStepIndex} />
      )}
      {activeFigure === '2.20' && (
        <Figure220View stepIndex={stepIndex} setStepIndex={setStepIndex} />
      )}
      {activeFigure === '2.21' && (
        <Figure221View stepIndex={stepIndex} setStepIndex={setStepIndex} />
      )}
      {activeFigure === '2.22' && (
        <Figure222View stepIndex={stepIndex} setStepIndex={setStepIndex} />
      )}
    </div>
  );
};

// ==========================================
// FIGURE 2.18: ε-NFA FOR DECIMAL NUMBERS
// ==========================================
const Figure218View: React.FC<{ stepIndex: number; setStepIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ stepIndex, setStepIndex }) => {
  const steps = [
    {
      title: "Step 1: Start State & Optional Sign (+ / -)",
      desc: "Start state q₀ processes optional sign + or - or ε-transition directly to state q₁.",
      highlight: ["q0", "q1"],
      edges: ["q0-q1"]
    },
    {
      title: "Step 2: Digits Before Decimal Point",
      desc: "At q₁, digits 0..9 repeat (q₁ loop) or branch non-deterministically to q₄.",
      highlight: ["q1", "q4"],
      edges: ["q1-q1", "q1-q4"]
    },
    {
      title: "Step 3: Decimal Point Transition (.)",
      desc: "State q₁ transitions on '.' to q₂, or q₄ transitions on '.' to q₃.",
      highlight: ["q1", "q2", "q4", "q3"],
      edges: ["q1-q2", "q4-q3"]
    },
    {
      title: "Step 4: Fractional Digits",
      desc: "State q₂ requires at least one digit 0..9 to reach q₃, where digits repeat.",
      highlight: ["q2", "q3"],
      edges: ["q2-q3", "q3-q3"]
    },
    {
      title: "Step 5: Completion via ε-Transition to Final State q₅",
      desc: "State q₃ reaches final accepting state q₅ instantaneously via ε.",
      highlight: ["q3", "q5"],
      edges: ["q3-q5"]
    }
  ];

  const curr = steps[stepIndex];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-cyan-400 flex items-center gap-2">
            <span>Figure 2.18: The ε-NFA for Decimal Numbers</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Accepts optional sign (+/-), integer digits, decimal point, and fractional digits.</p>
        </div>
        <StepNavigation current={stepIndex} total={steps.length} onChange={setStepIndex} />
      </div>

      {/* Interactive Diagram SVG */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-x-auto flex justify-center">
        <svg viewBox="0 0 700 320" className="w-full max-w-3xl h-auto">
          <defs>
            <marker id="arrow218" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
            <marker id="arrow218-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Start Arrow */}
          <line x1="20" y1="160" x2="60" y2="160" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow218)" />
          <text x="35" y="150" fill="#94a3b8" fontSize="12" fontWeight="bold">Start</text>

          {/* Edges */}
          {/* q0 -> q1 */}
          <path d="M 80 160 Q 130 110 180 160" fill="none" 
            stroke={curr.edges.includes("q0-q1") ? "#f43f5e" : "#38bdf8"} 
            strokeWidth={curr.edges.includes("q0-q1") ? "4" : "2"} 
            markerEnd={curr.edges.includes("q0-q1") ? "url(#arrow218-active)" : "url(#arrow218)"} />
          <text x="130" y="125" fill="#f43f5e" fontSize="13" fontWeight="extrabold" textAnchor="middle">ε, +, -</text>

          {/* q1 loop */}
          <path d="M 180 140 C 160 80 200 80 180 140" fill="none"
            stroke={curr.edges.includes("q1-q1") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q1-q1") ? "4" : "2"} />
          <text x="180" y="75" fill="#f43f5e" fontSize="12" fontWeight="extrabold" textAnchor="middle">0, 1, ..., 9</text>

          {/* q1 -> q4 */}
          <path d="M 180 180 L 300 240" fill="none"
            stroke={curr.edges.includes("q1-q4") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q1-q4") ? "4" : "2"}
            markerEnd={curr.edges.includes("q1-q4") ? "url(#arrow218-active)" : "url(#arrow218)"} />
          <text x="225" y="225" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">0, 1, ..., 9</text>

          {/* q1 -> q2 */}
          <path d="M 200 160 L 320 160" fill="none"
            stroke={curr.edges.includes("q1-q2") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q1-q2") ? "4" : "2"}
            markerEnd={curr.edges.includes("q1-q2") ? "url(#arrow218-active)" : "url(#arrow218)"} />
          <text x="260" y="150" fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="middle">.</text>

          {/* q2 -> q3 */}
          <path d="M 340 160 L 460 160" fill="none"
            stroke={curr.edges.includes("q2-q3") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q2-q3") ? "4" : "2"}
            markerEnd={curr.edges.includes("q2-q3") ? "url(#arrow218-active)" : "url(#arrow218)"} />
          <text x="400" y="150" fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">0, 1, ..., 9</text>

          {/* q4 -> q3 */}
          <path d="M 320 240 L 460 180" fill="none"
            stroke={curr.edges.includes("q4-q3") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q4-q3") ? "4" : "2"}
            markerEnd={curr.edges.includes("q4-q3") ? "url(#arrow218-active)" : "url(#arrow218)"} />
          <text x="400" y="225" fill="#e2e8f0" fontSize="13" fontWeight="bold" textAnchor="middle">.</text>

          {/* q3 loop */}
          <path d="M 480 140 C 460 80 500 80 480 140" fill="none"
            stroke={curr.edges.includes("q3-q3") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q3-q3") ? "4" : "2"} />
          <text x="480" y="75" fill="#f43f5e" fontSize="12" fontWeight="extrabold" textAnchor="middle">0, 1, ..., 9</text>

          {/* q3 -> q5 */}
          <path d="M 500 160 L 620 160" fill="none"
            stroke={curr.edges.includes("q3-q5") ? "#f43f5e" : "#38bdf8"}
            strokeWidth={curr.edges.includes("q3-q5") ? "4" : "2"}
            markerEnd={curr.edges.includes("q3-q5") ? "url(#arrow218-active)" : "url(#arrow218)"} />
          <text x="560" y="150" fill="#f43f5e" fontSize="14" fontWeight="black" textAnchor="middle">ε</text>

          {/* Nodes */}
          {/* q0 */}
          <g transform="translate(80, 160)">
            <circle r="20" fill={curr.highlight.includes("q0") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">q₀</text>
          </g>

          {/* q1 */}
          <g transform="translate(180, 160)">
            <circle r="20" fill={curr.highlight.includes("q1") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">q₁</text>
          </g>

          {/* q2 */}
          <g transform="translate(330, 160)">
            <circle r="20" fill={curr.highlight.includes("q2") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">q₂</text>
          </g>

          {/* q3 */}
          <g transform="translate(480, 160)">
            <circle r="20" fill={curr.highlight.includes("q3") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">q₃</text>
          </g>

          {/* q4 */}
          <g transform="translate(310, 240)">
            <circle r="20" fill={curr.highlight.includes("q4") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">q₄</text>
          </g>

          {/* q5 (Accepting) */}
          <g transform="translate(630, 160)">
            <circle r="23" fill={curr.highlight.includes("q5") ? "#10b981" : "#1e293b"} stroke="#10b981" strokeWidth="3" />
            <circle r="18" fill="none" stroke="#10b981" strokeWidth="2" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">q₅</text>
          </g>
        </svg>
      </div>

      {/* Step Explanation Card */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 mt-0.5 shadow-md">
          {stepIndex + 1}
        </div>
        <div>
          <h4 className="font-extrabold text-cyan-300 text-base">{curr.title}</h4>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{curr.desc}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// FIGURE 2.19: USING ε-TRANSITIONS FOR KEYWORDS
// ==========================================
const Figure219View: React.FC<{ stepIndex: number; setStepIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ stepIndex, setStepIndex }) => {
  const steps = [
    {
      title: "Step 1: Start State & Non-Deterministic Forking",
      desc: "Start state q₀ loops on any input character Σ to scan continuous text, while forking on ε to keyword pathways.",
      highlight: ["0"],
      edges: ["loop0"]
    },
    {
      title: "Step 2: Keyword Branch 'web' Pathway",
      desc: "An ε-transition moves to state 1, matching symbols 'w' → 'e' → 'b' to reach accepting state 4.",
      highlight: ["1", "2", "3", "4"],
      edges: ["0-1", "1-2", "2-3", "3-4"]
    },
    {
      title: "Step 3: Keyword Branch 'ebay' Pathway",
      desc: "Simultaneously, another ε-transition moves to state 5, matching symbols 'e' → 'b' → 'a' → 'y' to reach accepting state 9.",
      highlight: ["5", "6", "7", "8", "9"],
      edges: ["0-5", "5-6", "6-7", "7-8", "8-9"]
    }
  ];

  const curr = steps[stepIndex];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-cyan-400">Figure 2.19: Using ε-Transitions to Recognize Keywords</h3>
          <p className="text-xs text-slate-400 mt-1">Simultaneous pattern matching for keywords 'web' and 'ebay' in a text stream.</p>
        </div>
        <StepNavigation current={stepIndex} total={steps.length} onChange={setStepIndex} />
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto flex justify-center">
        <svg viewBox="0 0 720 280" className="w-full max-w-3xl h-auto">
          {/* Loop on state 0 */}
          <path d="M 60 140 C 30 70 90 70 60 140" fill="none" stroke={curr.edges.includes("loop0") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="60" y="65" fill="#f43f5e" fontSize="12" fontWeight="extrabold" textAnchor="middle">Σ (any char)</text>

          {/* Branch to web: 0 -> 1 -> 2 -> 3 -> 4 */}
          <path d="M 75 125 L 150 80" fill="none" stroke={curr.edges.includes("0-1") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="105" y="95" fill="#f43f5e" fontSize="13" fontWeight="bold">ε</text>

          <line x1="170" y1="80" x2="270" y2="80" stroke={curr.edges.includes("1-2") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="220" y="70" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">w</text>

          <line x1="290" y1="80" x2="390" y2="80" stroke={curr.edges.includes("2-3") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="340" y="70" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">e</text>

          <line x1="410" y1="80" x2="510" y2="80" stroke={curr.edges.includes("3-4") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="460" y="70" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">b</text>

          {/* Branch to ebay: 0 -> 5 -> 6 -> 7 -> 8 -> 9 */}
          <path d="M 75 155 L 150 200" fill="none" stroke={curr.edges.includes("0-5") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="105" y="190" fill="#f43f5e" fontSize="13" fontWeight="bold">ε</text>

          <line x1="170" y1="200" x2="270" y2="200" stroke={curr.edges.includes("5-6") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="220" y="190" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">e</text>

          <line x1="290" y1="200" x2="390" y2="200" stroke={curr.edges.includes("6-7") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="340" y="190" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">b</text>

          <line x1="410" y1="200" x2="510" y2="200" stroke={curr.edges.includes("7-8") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="460" y="190" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">a</text>

          <line x1="530" y1="200" x2="630" y2="200" stroke={curr.edges.includes("8-9") ? "#f43f5e" : "#38bdf8"} strokeWidth="2.5" />
          <text x="580" y="190" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">y</text>

          {/* Nodes */}
          {/* Node 0 */}
          <g transform="translate(60, 140)">
            <circle r="18" fill={curr.highlight.includes("0") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="2.5" />
            <text fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" dy="4">0</text>
          </g>

          {/* Web nodes: 1, 2, 3, 4 */}
          {[
            { id: "1", x: 160 },
            { id: "2", x: 280 },
            { id: "3", x: 400 },
          ].map(n => (
            <g key={n.id} transform={`translate(${n.x}, 80)`}>
              <circle r="18" fill={curr.highlight.includes(n.id) ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="2.5" />
              <text fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" dy="4">{n.id}</text>
            </g>
          ))}
          <g transform="translate(520, 80)">
            <circle r="20" fill={curr.highlight.includes("4") ? "#10b981" : "#1e293b"} stroke="#10b981" strokeWidth="2.5" />
            <circle r="15" fill="none" stroke="#10b981" strokeWidth="2" />
            <text fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" dy="4">4</text>
          </g>

          {/* Ebay nodes: 5, 6, 7, 8, 9 */}
          {[
            { id: "5", x: 160 },
            { id: "6", x: 280 },
            { id: "7", x: 400 },
            { id: "8", x: 520 },
          ].map(n => (
            <g key={n.id} transform={`translate(${n.x}, 200)`}>
              <circle r="18" fill={curr.highlight.includes(n.id) ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="2.5" />
              <text fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" dy="4">{n.id}</text>
            </g>
          ))}
          <g transform="translate(640, 200)">
            <circle r="20" fill={curr.highlight.includes("9") ? "#10b981" : "#1e293b"} stroke="#10b981" strokeWidth="2.5" />
            <circle r="15" fill="none" stroke="#10b981" strokeWidth="2" />
            <text fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" dy="4">9</text>
          </g>
        </svg>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 mt-0.5 shadow-md">
          {stepIndex + 1}
        </div>
        <div>
          <h4 className="font-extrabold text-cyan-300 text-base">{curr.title}</h4>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{curr.desc}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// FIGURE 2.20: TRANSITION TABLE FOR FIG 2.18
// ==========================================
const Figure220View: React.FC<{ stepIndex: number; setStepIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ stepIndex, setStepIndex }) => {
  const steps = [
    {
      title: "Step 1: ε-Transitions Column",
      desc: "State q₀ has ε → {q₁}, and state q₃ has ε → {q₅}.",
      highlightRow: ["q0", "q3"],
      highlightCol: "epsilon"
    },
    {
      title: "Step 2: Non-Deterministic Choice Cell (q₁, digit)",
      desc: "Row q₁ under 'digit' contains TWO target states: {q₁, q₄}.",
      highlightRow: ["q1"],
      highlightCol: "digit"
    },
    {
      title: "Step 3: Complete Matrix Table",
      desc: "Full transition mapping for all states q₀ through q₅ across all alphabet inputs.",
      highlightRow: ["q0", "q1", "q2", "q3", "q4", "q5"],
      highlightCol: "all"
    }
  ];

  const curr = steps[stepIndex];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-cyan-400">Figure 2.20: Transition Table for Fig 2.18 ε-NFA</h3>
          <p className="text-xs text-slate-400 mt-1">Formal tabular representation of δ for the decimal numbers automaton.</p>
        </div>
        <StepNavigation current={stepIndex} total={steps.length} onChange={setStepIndex} />
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs font-black uppercase tracking-wider">
              <th className="py-3 px-4 text-left">State</th>
              <th className={`py-3 px-4 ${curr.highlightCol === 'epsilon' ? 'bg-indigo-900/60 text-cyan-300 font-extrabold' : ''}`}>ε</th>
              <th className="py-3 px-4">+ / -</th>
              <th className="py-3 px-4">.</th>
              <th className={`py-3 px-4 ${curr.highlightCol === 'digit' ? 'bg-indigo-900/60 text-cyan-300 font-extrabold' : ''}`}>0, 1, ..., 9</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm font-semibold">
            <tr className={curr.highlightRow.includes("q0") ? "bg-indigo-950/40" : ""}>
              <td className="py-3 px-4 text-left font-black text-indigo-400">→ q₀</td>
              <td className="py-3 px-4 font-bold text-rose-400">{'{q₁}'}</td>
              <td className="py-3 px-4">{'{q₁}'}</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
            </tr>
            <tr className={curr.highlightRow.includes("q1") ? "bg-indigo-950/40" : ""}>
              <td className="py-3 px-4 text-left font-black text-indigo-400">q₁</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4">{'{q₂}'}</td>
              <td className="py-3 px-4 font-extrabold text-amber-400">{'{q₁, q₄}'}</td>
            </tr>
            <tr className={curr.highlightRow.includes("q2") ? "bg-indigo-950/40" : ""}>
              <td className="py-3 px-4 text-left font-black text-indigo-400">q₂</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4">{'{q₃}'}</td>
            </tr>
            <tr className={curr.highlightRow.includes("q3") ? "bg-indigo-950/40" : ""}>
              <td className="py-3 px-4 text-left font-black text-indigo-400">q₃</td>
              <td className="py-3 px-4 font-bold text-rose-400">{'{q₅}'}</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4">{'{q₃}'}</td>
            </tr>
            <tr className={curr.highlightRow.includes("q4") ? "bg-indigo-950/40" : ""}>
              <td className="py-3 px-4 text-left font-black text-indigo-400">q₄</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4">{'{q₃}'}</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
            </tr>
            <tr className={curr.highlightRow.includes("q5") ? "bg-indigo-950/40" : ""}>
              <td className="py-3 px-4 text-left font-black text-emerald-400">* q₅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
              <td className="py-3 px-4 text-slate-600">∅</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 mt-0.5 shadow-md">
          {stepIndex + 1}
        </div>
        <div>
          <h4 className="font-extrabold text-cyan-300 text-base">{curr.title}</h4>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{curr.desc}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// FIGURE 2.21: ECLOSE(1) STEP-BY-STEP
// ==========================================
const Figure221View: React.FC<{ stepIndex: number; setStepIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ stepIndex, setStepIndex }) => {
  const steps = [
    {
      title: "Step 1: Basis ECLOSE(1) = {1}",
      desc: "Every state belongs to its own ε-closure. Initial set is {1}.",
      closure: ["1"],
      edges: []
    },
    {
      title: "Step 2: Follow Direct ε-Arcs from State 1",
      desc: "State 1 has ε-arcs to states 2 and 4. Closure becomes {1, 2, 4}.",
      closure: ["1", "2", "4"],
      edges: ["1-2", "1-4"]
    },
    {
      title: "Step 3: Follow ε-Arcs from State 2",
      desc: "State 2 has an ε-arc to state 3. Closure becomes {1, 2, 3, 4}.",
      closure: ["1", "2", "3", "4"],
      edges: ["1-2", "1-4", "2-3"]
    },
    {
      title: "Step 4: Follow ε-Arcs from State 3",
      desc: "State 3 has an ε-arc to state 6. Closure becomes {1, 2, 3, 4, 6}.",
      closure: ["1", "2", "3", "4", "6"],
      edges: ["1-2", "1-4", "2-3", "3-6"]
    },
    {
      title: "Step 5: Inspect State 4 Arc ('a')",
      desc: "State 4 has an arc to state 5 labeled 'a' (NOT ε!). Therefore, state 5 is NOT added to ECLOSE(1).",
      closure: ["1", "2", "3", "4", "6"],
      edges: ["1-2", "1-4", "2-3", "3-6", "4-5"]
    }
  ];

  const curr = steps[stepIndex];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-cyan-400">Figure 2.21: Step-by-Step ECLOSE(1) Computation</h3>
          <p className="text-xs text-slate-400 mt-1">Demonstrates inductive construction of ECLOSE(1) = {'{1, 2, 3, 4, 6}'}.</p>
        </div>
        <StepNavigation current={stepIndex} total={steps.length} onChange={setStepIndex} />
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto flex justify-center">
        <svg viewBox="0 0 650 240" className="w-full max-w-2xl h-auto">
          {/* Edges */}
          <line x1="100" y1="120" x2="200" y2="70" stroke={curr.edges.includes("1-2") ? "#f43f5e" : "#334155"} strokeWidth="3" />
          <text x="140" y="85" fill="#f43f5e" fontSize="13" fontWeight="bold">ε</text>

          <line x1="100" y1="120" x2="200" y2="170" stroke={curr.edges.includes("1-4") ? "#f43f5e" : "#334155"} strokeWidth="3" />
          <text x="140" y="160" fill="#f43f5e" fontSize="13" fontWeight="bold">ε</text>

          <line x1="220" y1="70" x2="320" y2="70" stroke={curr.edges.includes("2-3") ? "#f43f5e" : "#334155"} strokeWidth="3" />
          <text x="270" y="60" fill="#f43f5e" fontSize="13" fontWeight="bold">ε</text>

          <line x1="340" y1="70" x2="440" y2="120" stroke={curr.edges.includes("3-6") ? "#f43f5e" : "#334155"} strokeWidth="3" />
          <text x="400" y="85" fill="#f43f5e" fontSize="13" fontWeight="bold">ε</text>

          <line x1="220" y1="170" x2="320" y2="170" stroke={curr.edges.includes("4-5") ? "#eab308" : "#334155"} strokeWidth="3" />
          <text x="270" y="160" fill="#eab308" fontSize="13" fontWeight="bold">a (non-ε)</text>

          <line x1="340" y1="170" x2="440" y2="120" stroke="#334155" strokeWidth="2" />
          <text x="400" y="160" fill="#94a3b8" fontSize="12">b</text>

          {/* Nodes */}
          {/* Node 1 */}
          <g transform="translate(100, 120)">
            <circle r="20" fill={curr.closure.includes("1") ? "#10b981" : "#1e293b"} stroke="#10b981" strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">1</text>
          </g>

          {/* Node 2 */}
          <g transform="translate(210, 70)">
            <circle r="20" fill={curr.closure.includes("2") ? "#10b981" : "#1e293b"} stroke={curr.closure.includes("2") ? "#10b981" : "#475569"} strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">2</text>
          </g>

          {/* Node 3 */}
          <g transform="translate(330, 70)">
            <circle r="20" fill={curr.closure.includes("3") ? "#10b981" : "#1e293b"} stroke={curr.closure.includes("3") ? "#10b981" : "#475569"} strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">3</text>
          </g>

          {/* Node 4 */}
          <g transform="translate(210, 170)">
            <circle r="20" fill={curr.closure.includes("4") ? "#10b981" : "#1e293b"} stroke={curr.closure.includes("4") ? "#10b981" : "#475569"} strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">4</text>
          </g>

          {/* Node 5 (EXCLUDED) */}
          <g transform="translate(330, 170)">
            <circle r="20" fill="#1e293b" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 2" />
            <text fill="#ef4444" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">5</text>
          </g>

          {/* Node 6 */}
          <g transform="translate(450, 120)">
            <circle r="20" fill={curr.closure.includes("6") ? "#10b981" : "#1e293b"} stroke={curr.closure.includes("6") ? "#10b981" : "#475569"} strokeWidth="3" />
            <text fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">6</text>
          </g>

          {/* Node 7 (Disconnected) */}
          <g transform="translate(560, 120)">
            <circle r="20" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <text fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="middle" dy="4">7</text>
          </g>
        </svg>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-emerald-400 text-base">{curr.title}</h4>
          <p className="text-sm text-slate-300 mt-1">{curr.desc}</p>
        </div>
        <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono text-base font-extrabold px-4 py-2 rounded-xl shrink-0">
          ECLOSE(1) = {'{'}{curr.closure.join(', ')}{'}'}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// FIGURE 2.22: CONVERTED DFA D
// ==========================================
const Figure222View: React.FC<{ stepIndex: number; setStepIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ stepIndex, setStepIndex }) => {
  const steps = [
    {
      title: "Step 1: Start State A = {q₀, q₁}",
      desc: "Constructed by taking ECLOSE(q₀) = {q₀, q₁}.",
      highlight: ["A"]
    },
    {
      title: "Step 2: Non-Accepting States B, C, D",
      desc: "State B = {q₁}, State C = {q₁, q₄}, State D = {q₂}. None contain final state q₅.",
      highlight: ["B", "C", "D"]
    },
    {
      title: "Step 3: Final Accepting States E and F",
      desc: "State E = {q₂, q₃, q₅} and State F = {q₃, q₅} contain q₅ and are marked as double-circle accepting states.",
      highlight: ["E", "F"]
    }
  ];

  const curr = steps[stepIndex];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black text-cyan-400">Figure 2.22: DFA D Eliminating ε-Transitions</h3>
          <p className="text-xs text-slate-400 mt-1">Resulting deterministic finite automaton generated by subset construction.</p>
        </div>
        <StepNavigation current={stepIndex} total={steps.length} onChange={setStepIndex} />
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto flex justify-center">
        <svg viewBox="0 0 700 280" className="w-full max-w-3xl h-auto">
          {/* Start arrow */}
          <line x1="20" y1="140" x2="60" y2="140" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Edges */}
          <line x1="120" y1="140" x2="220" y2="80" stroke="#38bdf8" strokeWidth="2" />
          <text x="160" y="100" fill="#38bdf8" fontSize="12" fontWeight="bold">+ / -</text>

          <line x1="120" y1="140" x2="220" y2="140" stroke="#38bdf8" strokeWidth="2" />
          <text x="170" y="130" fill="#38bdf8" fontSize="12" fontWeight="bold">digit</text>

          <line x1="120" y1="140" x2="220" y2="200" stroke="#38bdf8" strokeWidth="2" />
          <text x="160" y="185" fill="#38bdf8" fontSize="12" fontWeight="bold">.</text>

          <line x1="260" y1="140" x2="400" y2="140" stroke="#38bdf8" strokeWidth="2" />
          <text x="330" y="130" fill="#38bdf8" fontSize="12" fontWeight="bold">.</text>

          <line x1="260" y1="200" x2="560" y2="200" stroke="#38bdf8" strokeWidth="2" />
          <text x="410" y="190" fill="#38bdf8" fontSize="12" fontWeight="bold">digit</text>

          <line x1="440" y1="140" x2="560" y2="200" stroke="#38bdf8" strokeWidth="2" />
          <text x="510" y="160" fill="#38bdf8" fontSize="12" fontWeight="bold">digit</text>

          {/* Nodes */}
          {/* Node A */}
          <g transform="translate(90, 140)">
            <circle r="25" fill={curr.highlight.includes("A") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="3" />
            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" dy="-3">A</text>
            <text fill="#94a3b8" fontSize="9" textAnchor="middle" dy="10">{'{q₀,q₁}'}</text>
          </g>

          {/* Node B */}
          <g transform="translate(240, 80)">
            <circle r="22" fill={curr.highlight.includes("B") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="2.5" />
            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" dy="-2">B</text>
            <text fill="#94a3b8" fontSize="9" textAnchor="middle" dy="10">{'{q₁}'}</text>
          </g>

          {/* Node C */}
          <g transform="translate(240, 140)">
            <circle r="22" fill={curr.highlight.includes("C") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="2.5" />
            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" dy="-2">C</text>
            <text fill="#94a3b8" fontSize="9" textAnchor="middle" dy="10">{'{q₁,q₄}'}</text>
          </g>

          {/* Node D */}
          <g transform="translate(240, 200)">
            <circle r="22" fill={curr.highlight.includes("D") ? "#818cf8" : "#1e293b"} stroke="#818cf8" strokeWidth="2.5" />
            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" dy="-2">D</text>
            <text fill="#94a3b8" fontSize="9" textAnchor="middle" dy="10">{'{q₂}'}</text>
          </g>

          {/* Node E (Accepting) */}
          <g transform="translate(420, 140)">
            <circle r="26" fill={curr.highlight.includes("E") ? "#10b981" : "#1e293b"} stroke="#10b981" strokeWidth="3" />
            <circle r="21" fill="none" stroke="#10b981" strokeWidth="2" />
            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" dy="-3">E</text>
            <text fill="#a7f3d0" fontSize="8" textAnchor="middle" dy="10">{'{q₂,q₃,q₅}'}</text>
          </g>

          {/* Node F (Accepting) */}
          <g transform="translate(580, 200)">
            <circle r="26" fill={curr.highlight.includes("F") ? "#10b981" : "#1e293b"} stroke="#10b981" strokeWidth="3" />
            <circle r="21" fill="none" stroke="#10b981" strokeWidth="2" />
            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" dy="-3">F</text>
            <text fill="#a7f3d0" fontSize="8" textAnchor="middle" dy="10">{'{q₃,q₅}'}</text>
          </g>
        </svg>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 mt-0.5 shadow-md">
          {stepIndex + 1}
        </div>
        <div>
          <h4 className="font-extrabold text-cyan-300 text-base">{curr.title}</h4>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{curr.desc}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// STEP NAVIGATION UTILITY
// ==========================================
const StepNavigation: React.FC<{ current: number; total: number; onChange: React.Dispatch<React.SetStateAction<number>> }> = ({ current, total, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
      <button
        disabled={current === 0}
        onClick={() => onChange(prev => Math.max(0, prev - 1))}
        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <span className="text-xs font-black text-slate-300 px-2 font-mono">
        Step {current + 1} / {total}
      </span>

      <button
        disabled={current === total - 1}
        onClick={() => onChange(prev => Math.min(total - 1, prev + 1))}
        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
