import React, { useState } from 'react';
import { Layers, CheckCircle2, Sparkles, Cpu, BookOpen, Info } from 'lucide-react';

export const AutomataComparisonWidget: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<number | null>(null);

  const tableData = [
    {
      id: 1,
      property: "Formal 5-Tuple Definition",
      dfa: "M = (Q, Σ, δ, q₀, F) where δ : Q × Σ → Q",
      nfa: "M = (Q, Σ, δ, q₀, F) where δ : Q × Σ → 2^Q",
      enfa: "M = (Q, Σ, δ, q₀, F) where δ : Q × (Σ ∪ {ε}) → 2^Q",
      solutionNote: "The fundamental difference lies solely in the signature of the transition function δ. DFA returns a single state Q, whereas NFA and ε-NFA return a power set 2^Q of reachable states."
    },
    {
      id: 2,
      property: "Transitions per Input Symbol",
      dfa: "There can be zero or one transition from a state on an input symbol (exactly 1 next state).",
      nfa: "There can be zero, one or more transitions from a state on an input symbol.",
      enfa: "There can be zero, one or more transitions from a state with or without giving any input (ε-moves).",
      solutionNote: "DFA requires deterministic single-path execution. NFA allows multi-path non-deterministic branching. ε-NFA adds spontaneous ε-transitions without consuming input."
    },
    {
      id: 3,
      property: "Total Number of Transitions",
      dfa: "More number of explicit transitions required (must specify every symbol for every state).",
      nfa: "Less number of transitions required (dead moves can be omitted).",
      enfa: "Relatively more transitions when compared with NFA (due to spontaneous ε-arcs).",
      solutionNote: "DFAs require complete transition specifications, often leading to explicit dead/trap states. NFAs and ε-NFAs can omit invalid transitions, making diagrams cleaner."
    },
    {
      id: 4,
      property: "Ease of Construction",
      dfa: "Difficult to construct directly for complex languages.",
      nfa: "Easy to construct directly from specifications.",
      enfa: "Easiest to construct systematically using regular expressions (Thompson's Algorithm).",
      solutionNote: "ε-NFAs are ideal for automated compiler construction (e.g. Thompson's algorithm for regex matching), which are then converted into DFAs via subset construction."
    },
    {
      id: 5,
      property: "Active State Tracking & Power",
      dfa: "Less succinct state representation since at any point of time it will be in only one state.",
      nfa: "More succinct state tracking since at any point of time it can be in more than one state.",
      enfa: "Highly succinct state tracking since at any point of time it can be in more than one state with or without giving input.",
      solutionNote: "NFAs and ε-NFAs track multiple active states simultaneously. When converted to DFA, these active state combinations form composite subset states."
    },
    {
      id: 6,
      property: "Class of Languages Accepted",
      dfa: "Regular Languages",
      nfa: "Regular Languages",
      enfa: "Regular Languages (DFA ≡ NFA ≡ ε-NFA)",
      solutionNote: "Mathematical Theorem: All three automata models are EQUIVALENT in language recognition power! Any ε-NFA or NFA can be converted into an equivalent DFA using Subset / Powerset Construction."
    }
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4" />
            <span>Formal Mathematical Solution & Comparison</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive Difference Table: DFA vs. NFA vs. ε-NFA
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Strictly speaking, the difference between DFA and NFA lies only in the definition of <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">δ</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Equivalence: DFA ≡ NFA ≡ ε-NFA</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-800/80 text-slate-200 text-xs font-black uppercase tracking-wider border-b border-slate-700">
              <th className="py-4 px-5 w-1/5">Property / Aspect</th>
              <th className="py-4 px-5 w-1/4 text-indigo-300">DFA</th>
              <th className="py-4 px-5 w-1/4 text-amber-300">NFA</th>
              <th className="py-4 px-5 w-1/4 text-purple-300">ε-NFA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {tableData.map((row) => {
              const isSelected = selectedAspect === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedAspect(isSelected ? null : row.id)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? 'bg-indigo-950/60' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-4 px-5 font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-mono">
                      {row.id}
                    </span>
                    <span>{row.property}</span>
                  </td>
                  <td className="py-4 px-5 text-slate-300 font-medium leading-relaxed bg-indigo-950/20">
                    {row.id === 1 ? (
                      <code className="text-indigo-300 bg-indigo-950 px-2 py-1 rounded font-mono text-xs block font-bold border border-indigo-800">
                        {row.dfa}
                      </code>
                    ) : (
                      row.dfa
                    )}
                  </td>
                  <td className="py-4 px-5 text-slate-300 font-medium leading-relaxed bg-amber-950/10">
                    {row.id === 1 ? (
                      <code className="text-amber-300 bg-amber-950 px-2 py-1 rounded font-mono text-xs block font-bold border border-amber-800">
                        {row.nfa}
                      </code>
                    ) : (
                      row.nfa
                    )}
                  </td>
                  <td className="py-4 px-5 text-slate-300 font-medium leading-relaxed bg-purple-950/20">
                    {row.id === 1 ? (
                      <code className="text-purple-300 bg-purple-950 px-2 py-1 rounded font-mono text-xs block font-bold border border-purple-800">
                        {row.enfa}
                      </code>
                    ) : (
                      row.enfa
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Aspect Solution Explanation Box */}
      {selectedAspect && (
        <div className="mt-6 p-5 rounded-2xl bg-indigo-950/80 border border-indigo-700 text-indigo-100 flex items-start gap-4 animate-fadeIn">
          <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-cyan-300 text-sm uppercase tracking-wider">
              Detailed Solution Note for Aspect #{selectedAspect}: {tableData.find(t => t.id === selectedAspect)?.property}
            </h4>
            <p className="mt-1 text-sm font-medium leading-relaxed text-indigo-100">
              {tableData.find(t => t.id === selectedAspect)?.solutionNote}
            </p>
          </div>
        </div>
      )}

      {/* Summary Solution Banner */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Core Exam Solution & Proof Strategy:
            </span>
            <p className="text-xs text-slate-300 mt-0.5 leading-normal">
              To prove equivalence between models: Use <strong>Subset Construction</strong> to convert any NFA or ε-NFA into a DFA. Compute <code className="text-cyan-300 font-mono">ECLOSE(q)</code> for ε-transitions, and map <code className="text-cyan-300 font-mono">δ_D(S, a) = ECLOSE(⋃_{'{p∈S}'} δ_N(p,a))</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Click any row for solution explanation</span>
        </div>
      </div>
    </div>
  );
};
