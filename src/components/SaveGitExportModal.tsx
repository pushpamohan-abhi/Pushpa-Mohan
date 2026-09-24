import React, { useState } from 'react';
import { PresentationDeck } from '../types';
import { module1Deck as defaultModule1Deck, module1Quiz } from '../data/module1Data';
import {
  X,
  Save,
  Download,
  Copy,
  Check,
  GitBranch,
  RotateCcw,
  AlertCircle,
  FileCode,
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface SaveGitExportModalProps {
  deck: PresentationDeck;
  onClose: () => void;
  onDeckUpdated: (newDeck: PresentationDeck) => void;
}

export const SaveGitExportModal: React.FC<SaveGitExportModalProps> = ({
  deck,
  onClose,
  onDeckUpdated,
}) => {
  const [isSavingDisk, setIsSavingDisk] = useState(false);
  const [saveDiskMsg, setSaveDiskMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate full module1Data.ts string
  const generateSourceCode = () => {
    const fileHeader = `import { PresentationDeck, QuizQuestion } from '../types';\n\n`;
    const deckExport = `export const module1Deck: PresentationDeck = ${JSON.stringify(deck, null, 2)};\n\n`;
    const quizExport = `export const module1Quiz: QuizQuestion[] = ${JSON.stringify(module1Quiz, null, 2)};\n`;
    return fileHeader + deckExport + quizExport;
  };

  const handleSaveToDisk = async () => {
    try {
      setIsSavingDisk(true);
      setSaveDiskMsg(null);
      const res = await fetch('/api/save-source-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveDiskMsg({
          type: 'success',
          text: `Saved ${deck.slides.length} slides directly into src/data/module1Data.ts! Ready for git commit.`,
        });
      } else {
        setSaveDiskMsg({
          type: 'error',
          text: data.error || 'Failed to update file on disk.',
        });
      }
    } catch (err: any) {
      setSaveDiskMsg({
        type: 'error',
        text: err.message || 'Server connection error.',
      });
    } finally {
      setIsSavingDisk(false);
    }
  };

  const handleDownloadFile = () => {
    const code = generateSourceCode();
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'module1Data.ts');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = async () => {
    const code = generateSourceCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm('Are you sure you want to reset the deck back to the default original slides?')) {
      localStorage.removeItem('toc_module1_deck');
      onDeckUpdated(defaultModule1Deck);
      setSaveDiskMsg({
        type: 'success',
        text: 'Reset deck to original default order.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-md">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Save & Push Changes to GitHub
              </h2>
              <p className="text-xs text-slate-400">
                Commit updated slide order ({deck.slides.length} slides) into <code className="text-indigo-300 font-mono">src/data/module1Data.ts</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-200">
          
          {/* Explanation Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3.5 items-start">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-200 text-sm">
                Why reordered slides were not showing in <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">git push</code>
              </p>
              <p className="text-amber-300/80 leading-relaxed">
                Reordering slides in the browser updates runtime state. Git only tracks physical files in your repository repository file tree (<code className="text-amber-200 font-mono">src/data/module1Data.ts</code>). Saving changes back to this file makes them visible to Git.
              </p>
            </div>
          </div>

          {/* Action Step 1: Save directly to disk */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">1</span>
                <h3 className="font-bold text-sm text-white">Update Source File on Disk</h3>
              </div>
              <button
                onClick={handleSaveToDisk}
                disabled={isSavingDisk}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-900/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingDisk ? 'Saving to file...' : 'Save to src/data/module1Data.ts'}</span>
              </button>
            </div>

            {saveDiskMsg && (
              <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${saveDiskMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
                {saveDiskMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{saveDiskMsg.text}</span>
              </div>
            )}
          </div>

          {/* Action Step 2: Git commands */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">2</span>
              <h3 className="font-bold text-sm text-white">Run Git Commands in Terminal</h3>
            </div>
            
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-indigo-300 space-y-2 relative group">
              <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-slate-800/60">
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> Terminal / Bash</span>
              </div>
              <div className="space-y-1 selection:bg-indigo-500/40">
                <p><span className="text-slate-600"># 1. Stage the modified slide data file</span></p>
                <p className="text-emerald-400 font-bold">git add src/data/module1Data.ts</p>
                <p><span className="text-slate-600"># 2. Commit the new slide order</span></p>
                <p className="text-emerald-400 font-bold">git commit -m "Reordered Module 1 presentation slides"</p>
                <p><span className="text-slate-600"># 3. Push changes to GitHub</span></p>
                <p className="text-cyan-400 font-bold">git push</p>
              </div>
            </div>
          </div>

          {/* Manual Backup Options */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Alternative Manual Options
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download module1Data.ts File</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy module1Data.ts Code'}</span>
              </button>

              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-bold transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Original Deck</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
