import React, { useState } from 'react';
import { Layers, CheckCircle2, Sparkles, RefreshCw, Grid, HelpCircle, ArrowRight } from 'lucide-react';

interface MinimizationPreset {
  id: string;
  title: string;
  description: string;
  states: string[];
  acceptStates: string[];
  alphabet: string[];
  transitions: Record<string, Record<string, string>>;
  steps: {
    pass: number;
    title: string;
    description: string;
    markedPairs: { pair: string; reason: string }[];
  }[];
  finalEquivalenceClasses: string[];
}

const minimizationPresets: Record<string, MinimizationPreset> = {
  padma_reddy_fig_4_4: {
    id: "padma_reddy_fig_4_4",
    title: "Padma Reddy Ex 4.4: 8-State DFA Minimization",
    description: "Minimizing an 8-state DFA Q = {A, B, C, D, E, F, G, H} with accepting states F = {C, D, E}.",
    states: ["A", "B", "C", "D", "E", "F", "G", "H"],
    acceptStates: ["C", "D", "E"],
    alphabet: ["0", "1"],
    transitions: {
      A: { "0": "B", "1": "F" },
      B: { "0": "G", "1": "C" },
      C: { "0": "A", "1": "C" },
      D: { "0": "C", "1": "G" },
      E: { "0": "H", "1": "F" },
      F: { "0": "C", "1": "G" },
      G: { "0": "G", "1": "E" },
      H: { "0": "G", "1": "C" }
    },
    steps: [
      {
        pass: 0,
        title: "Pass 0 (Basis Step: Accepting vs Non-Accepting)",
        description: "Mark 'X' for all pairs (p, q) where one state is accepting (C, D, E) and the other is non-accepting.",
        markedPairs: [
          { pair: "A-C", reason: "C ∈ F, A ∉ F" },
          { pair: "A-D", reason: "D ∈ F, A ∉ F" },
          { pair: "A-E", reason: "E ∈ F, A ∉ F" },
          { pair: "B-C", reason: "C ∈ F, B ∉ F" },
          { pair: "B-D", reason: "D ∈ F, B ∉ F" },
          { pair: "B-E", reason: "E ∈ F, B ∉ F" },
          { pair: "F-C", reason: "C ∈ F, F ∉ F" },
          { pair: "F-D", reason: "D ∈ F, F ∉ F" },
          { pair: "F-E", reason: "E ∈ F, F ∉ F" },
          { pair: "G-C", reason: "C ∈ F, G ∉ F" },
          { pair: "G-D", reason: "D ∈ F, G ∉ F" },
          { pair: "G-E", reason: "E ∈ F, G ∉ F" },
          { pair: "H-C", reason: "C ∈ F, H ∉ F" },
          { pair: "H-D", reason: "D ∈ F, H ∉ F" },
          { pair: "H-E", reason: "E ∈ F, H ∉ F" }
        ]
      },
      {
        pass: 1,
        title: "Pass 1: Propagate Distinguishability",
        description: "Check remaining un-marked pairs (p, q): if δ(p, a) and δ(q, a) transition to an already marked pair, mark (p, q) as 'X'.",
        markedPairs: [
          { pair: "A-B", reason: "On '1': δ(A,1)=F, δ(B,1)=C. Pair (F,C) is marked!" },
          { pair: "A-F", reason: "On '0': δ(A,0)=B, δ(F,0)=C. Pair (B,C) is marked!" },
          { pair: "B-G", reason: "On '1': δ(B,1)=C, δ(G,1)=E. Pair (C,E) is marked!" }
        ]
      },
      {
        pass: 2,
        title: "Pass 2: Further Propagation until Convergence",
        description: "Repeat pass until no new pairs can be marked.",
        markedPairs: [
          { pair: "C-D", reason: "On '0': δ(C,0)=A, δ(D,0)=C. Pair (A,C) is marked!" },
          { pair: "C-E", reason: "On '0': δ(C,0)=A, δ(E,0)=H. Pair (A,H) is marked!" }
        ]
      }
    ],
    finalEquivalenceClasses: ["[A]", "[B, H]", "[C]", "[D, E]", "[F]", "[G]"]
  }
};

export const TableFillingWidget: React.FC = () => {
  const [activePresetKey] = useState<string>("padma_reddy_fig_4_4");
  const [currentPass, setCurrentPass] = useState<number>(0);

  const preset = minimizationPresets[activePresetKey] || minimizationPresets.padma_reddy_fig_4_4;

  // Build list of all distinct pairs (row > col)
  const allPairs: { p: string; q: string; key: string }[] = [];
  for (let i = 1; i < preset.states.length; i++) {
    for (let j = 0; j < i; j++) {
      const p = preset.states[i];
      const q = preset.states[j];
      allPairs.push({ p, q, key: `${q}-${p}` });
    }
  }

  // Determine marked pairs up to currentPass
  const markedPairsMap: Record<string, string> = {};
  for (let stepIdx = 0; stepIdx <= currentPass && stepIdx < preset.steps.length; stepIdx++) {
    const step = preset.steps[stepIdx];
    step.markedPairs.forEach((mp) => {
      markedPairsMap[mp.pair] = mp.reason;
      // also set reverse key
      const parts = mp.pair.split('-');
      if (parts.length === 2) {
        markedPairsMap[`${parts[1]}-${parts[0]}`] = mp.reason;
      }
    });
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-widest mb-1">
            <Grid className="w-4 h-4" />
            <span>Module 2 Simulator: DFA Minimization (Table Filling Algorithm)</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Myhill-Nerode / Hopcroft Table Filling Simulator
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Step through Pass 0 (Basis) and Pass 1..N to mark distinguishable state pairs $(p, q)$!
          </p>
        </div>

        {/* Pass Step Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-2">Pass:</span>
          {preset.steps.map((st) => (
            <button
              key={st.pass}
              onClick={() => setCurrentPass(st.pass)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all border ${
                currentPass === st.pass
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Pass {st.pass}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Left Column (Table Grid Matrix), Right Column (Step Explanation & Classes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Triangular Matrix Table */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 block mb-3">
              Distinguishability Matrix Table (Mark 'X' for Distinguishable Pairs):
            </span>

            <div className="overflow-x-auto">
              <table className="border-collapse text-center mx-auto text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2 border border-slate-800 bg-slate-900 text-slate-500">State</th>
                    {preset.states.slice(0, preset.states.length - 1).map((s) => (
                      <th key={`th-${s}`} className="p-2 border border-slate-800 bg-slate-900 text-cyan-300 font-bold w-10">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preset.states.slice(1).map((rowState, rIdx) => (
                    <tr key={`tr-${rowState}`}>
                      <td className="p-2 border border-slate-800 bg-slate-900 text-amber-300 font-bold w-10">
                        {rowState}
                      </td>
                      {preset.states.slice(0, preset.states.length - 1).map((colState, cIdx) => {
                        // Only render lower triangular matrix
                        if (cIdx > rIdx) {
                          return <td key={`td-${rowState}-${colState}`} className="bg-slate-900/40 border border-slate-800/40"></td>;
                        }
                        const pairKey = `${colState}-${rowState}`;
                        const altKey = `${rowState}-${colState}`;
                        const isMarked = markedPairsMap[pairKey] || markedPairsMap[altKey];

                        return (
                          <td
                            key={`td-${rowState}-${colState}`}
                            title={isMarked ? markedPairsMap[pairKey] || markedPairsMap[altKey] : "Equivalent so far"}
                            className={`p-2.5 border border-slate-800 font-extrabold text-sm transition-all ${
                              isMarked
                                ? 'bg-rose-950/80 text-rose-400 border-rose-800 shadow-inner'
                                : 'bg-emerald-950/30 text-emerald-400 border-slate-800'
                            }`}
                          >
                            {isMarked ? 'X' : '≡'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-3 h-3 rounded bg-rose-950 border border-rose-700 inline-block"></span>
              X = Distinguishable State Pair
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-700 inline-block"></span>
              ≡ = Equivalent (Merged in Minimal DFA)
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Active Pass Step Info & Final Classes */}
        <div className="lg:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
                {preset.steps[currentPass]?.title || "Pass Description"}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {preset.steps[currentPass]?.description}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pairs Marked 'X' in this step:
              </span>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {preset.steps[currentPass]?.markedPairs.map((mp, idx) => (
                  <div
                    key={`mp-${idx}`}
                    className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono flex items-start gap-2"
                  >
                    <span className="text-rose-400 font-bold shrink-0">[{mp.pair}]:</span>
                    <span className="text-slate-300 text-[11px]">{mp.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Final Equivalence Classes Result */}
          <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-700 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300 block">
              Resulting Minimal DFA Equivalence Classes:
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {preset.finalEquivalenceClasses.map((cls, idx) => (
                <span key={`cls-${idx}`} className="px-2.5 py-1 rounded-lg bg-indigo-900 text-cyan-200 font-extrabold border border-indigo-700">
                  {cls}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-indigo-200 font-medium">
              The original 8 states reduce cleanly to 6 minimal states!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
