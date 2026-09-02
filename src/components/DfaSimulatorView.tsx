import React, { useState } from 'react';
import { DfaDefinition } from '../types';
import { DfaAnimatorWidget } from './DfaAnimatorWidget';
import { Cpu, Plus, Trash2, CheckCircle2, Bookmark, Sliders, Layers, GitBranch, ArrowRight } from 'lucide-react';

const presetDfas: Record<string, DfaDefinition & { category?: string; explanationNotes?: string[]; nfaDetails?: { title: string; states: string[]; transitions: { from: string; symbol: string; to: string[] }[] } }> = {
  ends_ab: {
    category: "Standard DFA",
    title: "Ends with 'ab'",
    description: "Accepts binary strings ending with 'ab' over Σ = {a, b}",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q2"],
    transitions: [
      { from: "q0", symbol: "a", to: "q1" },
      { from: "q0", symbol: "b", to: "q0" },
      { from: "q1", symbol: "a", to: "q1" },
      { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "a", to: "q1" },
      { from: "q2", symbol: "b", to: "q0" }
    ],
    testString: "aabab",
    explanationNotes: [
      "q0: Start state (waiting for 'a')",
      "q1: Saw 'a' (waiting for 'b' to complete 'ab')",
      "q2: Accepting state (ended with 'ab')"
    ]
  },
  even_ones: {
    category: "Standard DFA",
    title: "Even Number of 1s",
    description: "Accepts binary strings containing an even number of 1s over Σ = {0, 1}",
    states: ["q0", "q1"],
    alphabet: ["0", "1"],
    startState: "q0",
    acceptStates: ["q0"],
    transitions: [
      { from: "q0", symbol: "0", to: "q0" },
      { from: "q0", symbol: "1", to: "q1" },
      { from: "q1", symbol: "0", to: "q1" },
      { from: "q1", symbol: "1", to: "q0" }
    ],
    testString: "110110",
    explanationNotes: [
      "q0: Even count of 1s (Accepting)",
      "q1: Odd count of 1s (Non-accepting)",
      "Each '1' flips the state parity."
    ]
  },
  nfa_subset: {
    category: "NFA to DFA",
    title: "NFA to DFA Subset Construction",
    description: "NFA accepting binary strings ending in '1' with non-deterministic branching converted to DFA",
    states: ["{q0}", "{q0,q1}"],
    alphabet: ["0", "1"],
    startState: "{q0}",
    acceptStates: ["{q0,q1}"],
    transitions: [
      { from: "{q0}", symbol: "0", to: "{q0}" },
      { from: "{q0}", symbol: "1", to: "{q0,q1}" },
      { from: "{q0,q1}", symbol: "0", to: "{q0}" },
      { from: "{q0,q1}", symbol: "1", to: "{q0,q1}" }
    ],
    testString: "0101",
    nfaDetails: {
      title: "Original Source NFA (Ends with '1')",
      states: ["q0", "q1"],
      transitions: [
        { from: "q0", symbol: "0", to: ["q0"] },
        { from: "q0", symbol: "1", to: ["q0", "q1"] }, // Non-deterministic branch!
        { from: "q1", symbol: "0", to: ["q1"] },
        { from: "q1", symbol: "1", to: ["q1"] }
      ]
    },
    explanationNotes: [
      "Original NFA has non-deterministic choice on symbol '1' from state q0 leading to both q0 and q1 ({q0, q1}).",
      "Subset Construction algorithm groups sets of NFA states into single deterministic DFA composite states.",
      "Any composite set containing NFA final state q1 (i.e., {q0, q1}) becomes an accepting DFA state."
    ]
  },
  dfa_min_1: {
    category: "DFA Minimization (Ex 1)",
    title: "Minimization Ex 1: Equivalent States",
    description: "DFA with 4 states where q2 and q3 are functionally equivalent and merged",
    states: ["A", "B", "C", "D"],
    alphabet: ["0", "1"],
    startState: "A",
    acceptStates: ["C", "D"], // Equivalent final states C and D merged
    transitions: [
      { from: "A", symbol: "0", to: "B" },
      { from: "A", symbol: "1", to: "C" },
      { from: "B", symbol: "0", to: "A" },
      { from: "B", symbol: "1", to: "D" },
      { from: "C", symbol: "0", to: "C" },
      { from: "C", symbol: "1", to: "C" },
      { from: "D", symbol: "0", to: "D" },
      { from: "D", symbol: "1", to: "D" }
    ],
    testString: "0110",
    explanationNotes: [
      "Table-Filling Analysis: States C and D both transition to C/D on all inputs and are both final.",
      "Pair (C, D) is indistinguishable and merged into equivalence class [C, D].",
      "Resulting minimized DFA reduces state count from 4 to 3."
    ]
  },
  dfa_min_2: {
    category: "DFA Minimization (Ex 2)",
    title: "Minimization Ex 2: Unreachable & Merge",
    description: "DFA with unreachable state q4 and equivalent states q1 & q3",
    states: ["q0", "q1", "q2", "q3", "q4"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q2", "q3"],
    transitions: [
      { from: "q0", symbol: "a", to: "q1" },
      { from: "q0", symbol: "b", to: "q2" },
      { from: "q1", symbol: "a", to: "q3" },
      { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "a", to: "q2" },
      { from: "q2", symbol: "b", to: "q2" },
      { from: "q3", symbol: "a", to: "q3" },
      { from: "q3", symbol: "b", to: "q2" },
      { from: "q4", symbol: "a", to: "q0" }, // Unreachable state q4
      { from: "q4", symbol: "b", to: "q1" }
    ],
    testString: "abbab",
    explanationNotes: [
      "Step 1: Remove unreachable state q4 (no incoming paths from start state q0).",
      "Step 2: Apply table-filling on remaining states {q0, q1, q2, q3}.",
      "Step 3: q1 and q3 exhibit identical transition behaviors and are merged into [q1, q3]."
    ]
  }
};

export const DfaSimulatorView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>("ends_ab");
  const [currentDfa, setCurrentDfa] = useState<any>(presetDfas.ends_ab);

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    setCurrentDfa(presetDfas[key]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Cpu className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">State Machine Studio & Simulators</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Interactive DFA, NFA-to-DFA & Minimization Simulator</h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore standard DFAs, NFA Subset Construction conversions, and 2 complete DFA Minimization examples step-by-step.
          </p>
        </div>

        {/* Preset Selector by Category */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Select Automaton / Example:</span>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(presetDfas).map(([key, dfa]) => (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedPreset === key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {dfa.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* If NFA Subset Construction, show Original NFA side-by-side or above */}
      {currentDfa.nfaDetails && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <GitBranch className="w-5 h-5 text-amber-600" />
            <span>{currentDfa.nfaDetails.title} (Starting Point with Non-Determinism)</span>
          </div>
          <p className="text-xs text-amber-800">
            Notice how state <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">q0</code> on symbol <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">1</code> transitions to multiple states <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">{'{q0, q1}'}</code>. This non-determinism is eliminated via Subset Construction below.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs bg-white rounded-xl overflow-hidden border border-amber-200">
              <thead>
                <tr className="bg-amber-100 text-amber-900 border-b border-amber-200">
                  <th className="p-3">NFA State \ Symbol</th>
                  <th className="p-3 text-center">0</th>
                  <th className="p-3 text-center">1 (Non-deterministic branch)</th>
                </tr>
              </thead>
              <tbody>
                {currentDfa.nfaDetails.states.map((st: string) => (
                  <tr key={st} className="border-b border-amber-100">
                    <td className="p-3 font-bold text-amber-900">
                      {st === 'q0' ? '→ (Start) ' : ''}
                      {st === 'q1' ? '* (Accept) ' : ''}
                      {st}
                    </td>
                    <td className="p-3 text-center text-slate-700">
                      {JSON.stringify(currentDfa.nfaDetails.transitions.find((t: any) => t.from === st && t.symbol === '0')?.to)}
                    </td>
                    <td className="p-3 text-center text-amber-700 font-bold bg-amber-50/50">
                      {JSON.stringify(currentDfa.nfaDetails.transitions.find((t: any) => t.from === st && t.symbol === '1')?.to)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800 my-1">
            <ArrowRight className="w-4 h-4 animate-bounce" /> Converted via Subset Construction into Equivalent Deterministic DFA below <ArrowRight className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      )}

      {/* Main Animator Widget */}
      <div className="w-full">
        <DfaAnimatorWidget dfa={currentDfa} />
      </div>

      {/* Explanation & Pedagogical Notes */}
      {currentDfa.explanationNotes && (
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex flex-col gap-2">
          <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" /> Pedagogical Analysis & Conversion Notes
          </h4>
          <ul className="list-disc list-inside text-xs text-indigo-800 space-y-1 font-medium">
            {currentDfa.explanationNotes.map((note: string, idx: number) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transition Table & Formal Definition Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" /> Formal 5-Tuple & Transition Table
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">States (Q)</span>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {currentDfa.states.map((st: string, i: number) => (
                <span key={i} className={`px-2.5 py-1 rounded text-xs font-bold ${st === currentDfa.startState ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-800'}`}>
                  {st} {st === currentDfa.startState ? '(Start)' : ''} {currentDfa.acceptStates.includes(st) ? '(Accept)' : ''}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Alphabet (Σ)</span>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {currentDfa.alphabet.map((sym: string, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-800">
                  {sym}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Accept States (F)</span>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {currentDfa.acceptStates.map((st: string, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Transition Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th className="p-3">State \ Symbol</th>
                {currentDfa.alphabet.map((sym: string, i: number) => (
                  <th key={i} className="p-3 text-center">{sym}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentDfa.states.map((st: string) => (
                <tr key={st} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-bold text-indigo-600">
                    {st === currentDfa.startState ? '→ ' : ''}
                    {currentDfa.acceptStates.includes(st) ? '*' : ' '}
                    {st}
                  </td>
                  {currentDfa.alphabet.map((sym: string) => {
                    const trans = currentDfa.transitions.find((t: any) => t.from === st && t.symbol === sym);
                    return (
                      <td key={sym} className="p-3 text-center text-slate-700 font-bold">
                        {trans ? trans.to : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


