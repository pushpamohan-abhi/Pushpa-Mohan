import React, { useState } from 'react';
import { PresentationDeck } from '../types';
import { Sparkles, Loader2, BookOpen, Check, Wand2 } from 'lucide-react';

interface AiGeneratorModalProps {
  onDeckGenerated: (deck: PresentationDeck) => void;
  onClose: () => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({ onDeckGenerated, onClose }) => {
  const [topic, setTopic] = useState("DFA Minimization & Myhill-Nerode Theorem");
  const [style, setStyle] = useState("Academic Professor & Step-by-Step Examples");
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, slideCount }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate presentation");
      }

      if (data && data.slides && data.slides.length > 0) {
        onDeckGenerated(data);
      } else {
        throw new Error("Invalid slide structure returned by AI");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate AI slides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Presentation & PPT Generator</h2>
            <p className="text-sm text-slate-500">Powered by Gemini AI to instantly generate custom theory of computation slides and animated examples.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="flex flex-col gap-5">
          {/* Topic Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Presentation Topic or Sub-Module</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600 font-medium"
              placeholder="e.g. NFA to DFA Conversion (Subset Construction)"
              required
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {["NFA to DFA Conversion", "Moore and Mealy Machines", "Regular Expressions to DFA", "Pumping Lemma for Regular Languages"].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(suggestion)}
                  className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Style & Tone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Teaching Style & Tone</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600 font-medium"
            >
              <option value="Academic Professor & Step-by-Step Examples">Academic Professor & Step-by-Step Examples</option>
              <option value="Beginner Friendly with Analogies">Beginner Friendly with Analogies</option>
              <option value="Gate Exam & Interview Prep Style">GATE Exam & Interview Prep Style</option>
              <option value="Rigorous Mathematical Proofs">Rigorous Mathematical Proofs</option>
            </select>
          </div>

          {/* Slide Count */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Number of Slides: {slideCount}</label>
            <input
              type="range"
              min="3"
              max="8"
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>3 Slides (Brief)</span>
              <span>5 Slides (Standard)</span>
              <span>8 Slides (In-depth)</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI Presentation...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate AI Presentation Deck</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
