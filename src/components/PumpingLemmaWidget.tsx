import React, { useState } from 'react';
import { ShieldAlert, Play, CheckCircle2, XCircle, RefreshCw, HelpCircle, ArrowRight, Zap } from 'lucide-react';

interface LanguageGame {
  id: string;
  name: string;
  formula: string;
  description: string;
  pumpingConstant: number;
  sampleString: string;
  validSplit: { x: string; y: string; z: string };
  pumpAttempts: { i: number; pumpedString: string; isMember: boolean; proofReason: string }[];
  textbookProofSteps: string[];
}

const languageGames: Record<string, LanguageGame> = {
  an_bn: {
    id: "an_bn",
    name: "L = { aⁿ bⁿ | n ≥ 0 }",
    formula: "aⁿ bⁿ",
    description: "Strings consisting of n 'a's followed by exactly n 'b's. Requires unbounded memory count.",
    pumpingConstant: 4,
    sampleString: "aaaabbbb",
    validSplit: { x: "a", y: "aa", z: "abbbb" },
    pumpAttempts: [
      { i: 0, pumpedString: "aabbbb", isMember: false, proofReason: "2 'a's and 4 'b's (2 ≠ 4). String xy⁰z ∉ L!" },
      { i: 2, pumpedString: "aaaaaabbbb", isMember: false, proofReason: "6 'a's and 4 'b's (6 ≠ 4). String xy²z ∉ L!" },
      { i: 3, pumpedString: "aaaaaaaaabbbb", isMember: false, proofReason: "8 'a's and 4 'b's (8 ≠ 4). String xy³z ∉ L!" }
    ],
    textbookProofSteps: [
      "1. Assume L is regular. Let p be the pumping constant given by the Pumping Lemma.",
      "2. Choose string z = aᵖbᵖ ∈ L. Note that |z| = 2p ≥ p.",
      "3. By Pumping Lemma, z = xyz with |xy| ≤ p and |y| ≥ 1.",
      "4. Since |xy| ≤ p, y must consist ENTIRELY of 'a's (y = aᵏ with k ≥ 1).",
      "5. Pump for i = 0: xy⁰z = aᵖ⁻ᵏbᵖ. Since k ≥ 1, p - k ≠ p, so xy⁰z ∉ L!",
      "6. Contradiction! Hence L = { aⁿ bⁿ | n ≥ 0 } is NOT regular. ∎"
    ]
  },
  ww_r: {
    id: "ww_r",
    name: "L = { w wᴿ | w ∈ {0, 1}* }",
    formula: "w wᴿ (Even Palindromes)",
    description: "Strings consisting of a binary string w followed immediately by its reverse wᴿ.",
    pumpingConstant: 4,
    sampleString: "01100110",
    validSplit: { x: "0", y: "11", z: "00110" },
    pumpAttempts: [
      { i: 0, pumpedString: "000110", isMember: false, proofReason: "000110 is not a symmetric palindrome w wᴿ. String xy⁰z ∉ L!" },
      { i: 2, pumpedString: "0111100110", isMember: false, proofReason: "Mismatched center symmetry. String xy²z ∉ L!" }
    ],
    textbookProofSteps: [
      "1. Assume L is regular. Let p be the pumping constant.",
      "2. Choose string z = 0ᵖ110ᵖ ∈ L. Note |z| = 2p + 2 ≥ p.",
      "3. By Pumping Lemma, z = xyz with |xy| ≤ p, so y = 0ᵏ (k ≥ 1).",
      "4. Pump i = 0: xy⁰z = 0ᵖ⁻ᵏ110ᵖ. Left half has fewer '0's than right half!",
      "5. String xy⁰z ∉ L. Contradiction! Hence L is NOT regular. ∎"
    ]
  },
  a_n2: {
    id: "a_n2",
    name: "L = { aⁿ² | n ≥ 1 }",
    formula: "aⁿ² (Perfect Square Lengths)",
    description: "Strings of 'a's whose total length is a perfect square (1, 4, 9, 16, 25, ...).",
    pumpingConstant: 3,
    sampleString: "aaaaaaaaa", // length 9 = 3^2
    validSplit: { x: "a", y: "aa", z: "aaaaaa" },
    pumpAttempts: [
      { i: 2, pumpedString: "aaaaaaaaaaa", isMember: false, proofReason: "Length is 11 (not a perfect square between 9 and 16). String xy²z ∉ L!" }
    ],
    textbookProofSteps: [
      "1. Assume L is regular. Let p be the pumping constant.",
      "2. Choose string z = aᵖ² ∈ L with length |z| = p².",
      "3. Split z = xyz with |xy| ≤ p and 1 ≤ |y| ≤ p.",
      "4. Pump i = 2: |xy²z| = p² + |y|. Since 1 ≤ |y| ≤ p, we have p² < |xy²z| ≤ p² + p < (p + 1)².",
      "5. Length of xy²z strictly lies between consecutive squares p² and (p + 1)², so it CANNOT be a perfect square!",
      "6. String xy²z ∉ L. Contradiction! Hence L is NOT regular. ∎"
    ]
  }
};

export const PumpingLemmaWidget: React.FC = () => {
  const [selectedLangKey, setSelectedLangKey] = useState<string>("an_bn");
  const [selectedPumpIndex, setSelectedPumpIndex] = useState<number>(0);

  const lang = languageGames[selectedLangKey] || languageGames.an_bn;
  const currentAttempt = lang.pumpAttempts[selectedPumpIndex] || lang.pumpAttempts[0];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-widest mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Module 2 Game: Proving Languages Not to be Regular</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pumping Lemma Adversary Game & Proof Simulator
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Step through the 4-step adversary game to prove non-regularity by pumping string $z = xyz$ to a contradiction!
          </p>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-2">Language:</span>
          <select
            value={selectedLangKey}
            onChange={(e) => {
              setSelectedLangKey(e.target.value);
              setSelectedPumpIndex(0);
            }}
            className="bg-slate-900 text-amber-300 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 outline-none cursor-pointer"
          >
            {Object.entries(languageGames).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Split Visualization & Proof Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): String Split & Pumping Execution */}
        <div className="lg:col-span-6 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 block mb-2">
              Step 1: Chosen Target String z ∈ L (Constant p = {lang.pumpingConstant})
            </span>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-center text-xl font-black text-cyan-300">
              z = "{lang.sampleString}"  (|z| = {lang.sampleString.length} ≥ p)
            </div>
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 block mb-2">
              Step 2: Adversary Split z = x · y · z (|xy| ≤ p, |y| ≥ 1)
            </span>
            <div className="flex items-center justify-center gap-2 font-mono text-center text-sm">
              <div className="p-3 bg-indigo-950 border border-indigo-700 rounded-xl text-indigo-200">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">x</span>
                <span className="text-lg font-bold">"{lang.validSplit.x}"</span>
              </div>
              <span className="text-slate-600 font-bold">+</span>
              <div className="p-3 bg-amber-950 border border-amber-600 rounded-xl text-amber-300 ring-2 ring-amber-500/50 animate-pulse">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">y (Pumped)</span>
                <span className="text-lg font-bold">"{lang.validSplit.y}"</span>
              </div>
              <span className="text-slate-600 font-bold">+</span>
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">z</span>
                <span className="text-lg font-bold">"{lang.validSplit.z}"</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 block mb-2">
              Step 3: Select Pumping Factor i (xyⁱz):
            </span>
            <div className="flex items-center gap-2">
              {lang.pumpAttempts.map((att, idx) => (
                <button
                  key={`pump-${idx}`}
                  onClick={() => setSelectedPumpIndex(idx)}
                  className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all border ${
                    selectedPumpIndex === idx
                      ? 'bg-rose-600 text-white border-rose-400 shadow-lg'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  i = {att.i} (xy^{att.i}z)
                </button>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-700 text-rose-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Pumped Result String (xy^{currentAttempt.i}z):
              </span>
              <span className="px-2.5 py-0.5 rounded bg-rose-900 text-rose-200 text-xs font-mono font-bold border border-rose-700">
                {currentAttempt.isMember ? 'MEMBER' : 'CONTRADICTION ❌'}
              </span>
            </div>
            <div className="font-mono text-lg font-extrabold text-amber-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
              "{currentAttempt.pumpedString}"
            </div>
            <p className="text-xs text-rose-200 font-medium leading-relaxed">
              <strong>Proof Result:</strong> {currentAttempt.proofReason}
            </p>
          </div>
        </div>

        {/* Right Column (6 cols): Formal Padma Reddy Proof Steps */}
        <div className="lg:col-span-6 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Formal Padma Reddy Textbook Proof Steps
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                Pumping Lemma Proof
              </span>
            </div>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {lang.textbookProofSteps.map((stepText, idx) => (
                <div
                  key={`step-${idx}`}
                  className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-200 font-medium leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{stepText}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 leading-normal">
            <strong className="text-cyan-400">Exam Note:</strong> To prove a language is non-regular, you only need to find <strong>ONE split choice</strong> and <strong>ONE pumping factor i</strong> that forces $x y^i z \notin L$.
          </div>
        </div>
      </div>
    </div>
  );
};
