import React from 'react';
import { Table, Zap, ArrowRight, Star } from 'lucide-react';

export interface TableRowData {
  isStart: boolean;
  isAccept: boolean;
  state: string;
  cells: string[];
}

export interface TransitionTableCardProps {
  title?: string;
  headers: string[];
  rows: TableRowData[];
  theme?: 'dark' | 'light';
  bulletNumber?: number;
}

export const TransitionTableCard: React.FC<TransitionTableCardProps> = ({
  title = 'Formal Transition Table Matrix',
  headers,
  rows,
  theme = 'dark',
  bulletNumber,
}) => {
  const isLight = theme === 'light';

  return (
    <div
      className={`w-full rounded-2xl border shadow-xl p-5 sm:p-6 transition-all relative overflow-hidden ${
        isLight
          ? 'bg-white border-slate-300 text-slate-800 shadow-slate-200'
          : 'bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl'
      }`}
    >
      {/* Decorative top accent glow */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isLight
            ? 'bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500'
            : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400'
        }`}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b pb-4 border-slate-700/40">
        <div className="flex items-center gap-3">
          {bulletNumber !== undefined && (
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                isLight ? 'bg-indigo-600 text-white' : 'bg-cyan-500 text-slate-950'
              }`}
            >
              {bulletNumber}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <span className="text-xs font-mono font-bold opacity-75">δ(Q × Σ → Q)</span>
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-blue-200/80'}`}>
                State transition lookup matrix for current states and input symbols
              </p>
            </div>
          </div>
        </div>

        {/* Alphabet Badge */}
        {headers.length > 1 && (
          <div
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border shrink-0 flex items-center gap-1.5 ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700'
                : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Σ = {'{'}{headers.slice(1).join(', ')}{'}'}</span>
          </div>
        )}
      </div>

      {/* Structured HTML Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/40 shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`text-xs font-extrabold uppercase tracking-wider border-b ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                  : 'bg-blue-900/60 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <th className="py-3.5 px-4 font-black">
                {headers[0] || 'State (Q)'}
              </th>
              {headers.slice(1).map((h, idx) => (
                <th
                  key={idx}
                  className="py-3.5 px-4 text-center font-mono font-black text-sm border-l border-slate-700/30"
                >
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md ${
                      isLight ? 'bg-indigo-100 text-indigo-900' : 'bg-cyan-950 text-cyan-200 border border-cyan-500/30'
                    }`}
                  >
                    {h}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`divide-y text-sm ${isLight ? 'divide-slate-200' : 'divide-blue-900/40'}`}>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`transition-colors hover:bg-cyan-500/10 ${
                  rIdx % 2 === 0
                    ? isLight
                      ? 'bg-white'
                      : 'bg-slate-900/40'
                    : isLight
                    ? 'bg-slate-50'
                    : 'bg-slate-900/80'
                }`}
              >
                {/* State Name & Badges */}
                <td className="py-3 px-4 font-mono font-bold text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    {row.isStart && (
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-400/40 flex items-center gap-1 shrink-0"
                        title="Initial Start State (q0)"
                      >
                        <ArrowRight className="w-3 h-3 text-blue-400" />
                        START
                      </span>
                    )}

                    {row.isAccept && (
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center gap-1 shrink-0"
                        title="Accepting / Final State (F)"
                      >
                        <Star className="w-3 h-3 text-emerald-400 fill-emerald-400/30" />
                        ACCEPT
                      </span>
                    )}

                    <span className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {row.state}
                    </span>
                  </div>
                </td>

                {/* Transition Cells */}
                {row.cells.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="py-3 px-4 text-center font-mono font-bold border-l border-slate-700/30"
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-sm transition-transform hover:scale-105 ${
                        isLight
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-blue-950/90 text-cyan-200 border border-blue-700/60 shadow-sm'
                      }`}
                    >
                      {cell}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend Footnote */}
      <div
        className={`mt-4 pt-3 border-t text-xs flex flex-wrap items-center justify-between gap-3 ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-blue-300/80'
        }`}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1 font-semibold">
            <span className="text-blue-400 font-bold">→ START:</span> Initial State (q₀)
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="text-emerald-400 font-bold">★ ACCEPT:</span> Final State (F)
          </span>
        </div>

        <span className="font-mono text-[11px] opacity-75">
          Matrix entries δ(State, Symbol) define deterministic transitions
        </span>
      </div>
    </div>
  );
};
