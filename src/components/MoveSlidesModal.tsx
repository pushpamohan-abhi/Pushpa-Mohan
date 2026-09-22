import React, { useState } from 'react';
import { PresentationDeck, Slide } from '../types';
import {
  X,
  ArrowUp,
  ArrowDown,
  Move,
  Check,
  RotateCcw,
  Layers,
  ArrowRight,
  Search,
  ListOrdered,
  Sparkles
} from 'lucide-react';

interface MoveSlidesModalProps {
  deck: PresentationDeck;
  currentSlideIndex?: number;
  onClose: () => void;
  onSave: (updatedDeck: PresentationDeck, newActiveIndex?: number) => void;
}

export const MoveSlidesModal: React.FC<MoveSlidesModalProps> = ({
  deck,
  currentSlideIndex = 0,
  onClose,
  onSave,
}) => {
  const [slides, setSlides] = useState<Slide[]>(() => JSON.parse(JSON.stringify(deck.slides)));
  const [activeIdx, setActiveIdx] = useState<number>(currentSlideIndex);
  const [mode, setMode] = useState<'single' | 'block' | 'list'>('single');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Single Slide Move Form State
  const [singleFrom, setSingleFrom] = useState<number>(currentSlideIndex + 1);
  const [singleTo, setSingleTo] = useState<number>(1);

  // Block / Range Move Form State
  const [blockStart, setBlockStart] = useState<number>(1);
  const [blockEnd, setBlockEnd] = useState<number>(1);
  const [insertAfter, setInsertAfter] = useState<number>(0);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Up/Down individual moves
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index - 1];
    newSlides[index - 1] = temp;
    setSlides(newSlides);
    if (activeIdx === index) setActiveIdx(index - 1);
    else if (activeIdx === index - 1) setActiveIdx(index);
  };

  const moveDown = (index: number) => {
    if (index >= slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + 1];
    newSlides[index + 1] = temp;
    setSlides(newSlides);
    if (activeIdx === index) setActiveIdx(index + 1);
    else if (activeIdx === index + 1) setActiveIdx(index);
  };

  // Move single slide from source to target (1-indexed inputs)
  const handleSingleMove = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fromIdx = singleFrom - 1;
    let toIdx = singleTo - 1;

    if (fromIdx < 0 || fromIdx >= slides.length) return;
    if (toIdx < 0) toIdx = 0;
    if (toIdx >= slides.length) toIdx = slides.length - 1;
    if (fromIdx === toIdx) return;

    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(fromIdx, 1);
    newSlides.splice(toIdx, 0, movedSlide);

    setSlides(newSlides);
    setActiveIdx(toIdx);
    setSingleFrom(toIdx + 1);
    showSuccess(`Moved Slide ${fromIdx + 1} ("${movedSlide.title}") to Position ${toIdx + 1}`);
  };

  // Move block of slides (1-indexed inputs)
  const handleBlockMove = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const start = Math.min(blockStart, blockEnd);
    const end = Math.max(blockStart, blockEnd);

    if (start < 1 || end > slides.length) {
      alert(`Invalid range: Slides must be between 1 and ${slides.length}`);
      return;
    }

    const startIdx = start - 1;
    const count = end - start + 1;

    let targetAfterIdx = insertAfter; // 0 means insert at top (position 1)
    if (targetAfterIdx < 0) targetAfterIdx = 0;
    if (targetAfterIdx > slides.length) targetAfterIdx = slides.length;

    const newSlides = [...slides];
    const block = newSlides.splice(startIdx, count);

    // Calculate insertion index after splicing
    let realInsertIdx = targetAfterIdx;
    if (startIdx < targetAfterIdx) {
      realInsertIdx = targetAfterIdx - count;
    }

    newSlides.splice(realInsertIdx, 0, ...block);
    setSlides(newSlides);
    setActiveIdx(realInsertIdx);
    showSuccess(`Moved Slides ${start}–${end} (${count} slides) after Slide ${insertAfter}`);
  };

  const handleReset = () => {
    setSlides(JSON.parse(JSON.stringify(deck.slides)));
    setActiveIdx(currentSlideIndex);
    showSuccess("Reset deck order to default.");
  };

  const handleSaveAndClose = () => {
    onSave({ ...deck, slides }, activeIdx);
    onClose();
  };

  const filteredSlides = slides.map((slide, originalIndex) => ({ slide, originalIndex })).filter(({ slide }) => {
    if (!searchTerm.trim()) return true;
    return (
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (slide.subtitle && slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 animate-scale-in">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Move & Reorder Presentation Slides
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total {slides.length} slides in deck. Move single slides, reorder blocks, or shift positions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode('single')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'single'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Move className="w-3.5 h-3.5" /> Single Slide Move
            </button>
            <button
              onClick={() => setMode('block')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'block'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Block / Range Move
            </button>
            <button
              onClick={() => setMode('list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" /> Full Reorder List
            </button>
          </div>

          {successMsg && (
            <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/80 flex items-center gap-1.5 animate-pulse">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* MODE 1: Single Slide Move */}
          {mode === 'single' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <form onSubmit={handleSingleMove} className="md:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5" /> Single Slide Position Shift
                </span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Select Slide to Move:</label>
                  <select
                    value={singleFrom}
                    onChange={(e) => setSingleFrom(Number(e.target.value))}
                    className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                  >
                    {slides.map((s, idx) => (
                      <option key={s.id + idx} value={idx + 1}>
                        Slide {idx + 1}: {s.title.length > 45 ? s.title.slice(0, 45) + '...' : s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Move to New Position # (1 to {slides.length}):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={slides.length}
                      value={singleTo}
                      onChange={(e) => setSingleTo(Number(e.target.value))}
                      className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-extrabold w-28 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-slate-400 font-mono">
                      (Currently Slide {singleFrom})
                    </span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSingleTo(1)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    To Top (1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSingleTo(Math.max(1, singleFrom - 1))}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Up 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setSingleTo(Math.min(slides.length, singleFrom + 1))}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Down 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setSingleTo(slides.length)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    To End ({slides.length})
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Execute Move Slide {singleFrom} ➔ Position {singleTo}</span>
                </button>
              </form>

              {/* Preview Box */}
              <div className="md:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3 h-full">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Target Slide Card Preview</span>
                {slides[singleFrom - 1] && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-indigo-400">Original Position #{singleFrom}</span>
                      <span className="font-mono font-bold text-cyan-400">Target Position #{singleTo}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{slides[singleFrom - 1].title}</h3>
                    {slides[singleFrom - 1].subtitle && (
                      <p className="text-xs text-indigo-300">{slides[singleFrom - 1].subtitle}</p>
                    )}
                    <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1 mt-1">
                      {slides[singleFrom - 1].bullets.slice(0, 3).map((b, i) => (
                        <li key={i} className="truncate">{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: Block / Range Move */}
          {mode === 'block' && (
            <form onSubmit={handleBlockMove} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Move Consecutive Range / Block of Slides
                </span>
                <span className="text-xs text-slate-400 font-mono">Total {slides.length} slides</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Start Slide #:</label>
                  <input
                    type="number"
                    min={1}
                    max={slides.length}
                    value={blockStart}
                    onChange={(e) => setBlockStart(Number(e.target.value))}
                    className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-extrabold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 truncate">
                    {slides[blockStart - 1]?.title}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">End Slide #:</label>
                  <input
                    type="number"
                    min={1}
                    max={slides.length}
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(Number(e.target.value))}
                    className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-extrabold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 truncate">
                    {slides[blockEnd - 1]?.title}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Insert After Slide # (0 = Top):</label>
                  <input
                    type="number"
                    min={0}
                    max={slides.length}
                    value={insertAfter}
                    onChange={(e) => setInsertAfter(Number(e.target.value))}
                    className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-extrabold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 truncate">
                    {insertAfter === 0 ? "Place at very beginning" : `After Slide ${insertAfter}: ${slides[insertAfter - 1]?.title || ''}`}
                  </span>
                </div>
              </div>

              {/* Block Info Card */}
              <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs text-indigo-200 flex items-center justify-between">
                <div>
                  <span className="font-bold">Selected Block: </span>
                  <span>
                    Slides {Math.min(blockStart, blockEnd)} through {Math.max(blockStart, blockEnd)} ({Math.abs(blockEnd - blockStart) + 1} slides total)
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="font-bold">Destination: </span>
                  <span>
                    {insertAfter === 0 ? "Top of presentation" : `Right after Slide ${insertAfter}`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Move Selected Block of Slides</span>
              </button>
            </form>
          )}

          {/* MODE 3: Interactive Reorder List */}
          {mode === 'list' && (
            <div className="flex flex-col gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search slides by title or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                {filteredSlides.map(({ slide, originalIndex }) => (
                  <div
                    key={slide.id + originalIndex}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      activeIdx === originalIndex
                        ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate flex-1">
                      <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-extrabold text-indigo-300 shrink-0">
                        {originalIndex + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="text-xs font-bold truncate text-white">{slide.title}</h4>
                        {slide.subtitle && <p className="text-[10px] text-slate-400 truncate">{slide.subtitle}</p>}
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => moveUp(originalIndex)}
                        disabled={originalIndex === 0}
                        className="p-1.5 bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 rounded-lg text-slate-200 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveDown(originalIndex)}
                        disabled={originalIndex === slides.length - 1}
                        className="p-1.5 bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 rounded-lg text-slate-200 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const posStr = prompt(`Move Slide ${originalIndex + 1} to position (1–${slides.length}):`, String(originalIndex + 1));
                          if (posStr) {
                            const newPos = parseInt(posStr, 10);
                            if (!isNaN(newPos)) {
                              setSingleFrom(originalIndex + 1);
                              setSingleTo(newPos);
                              setMode('single');
                            }
                          }
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 rounded-lg border border-slate-700"
                        title="Jump to position"
                      >
                        # Move
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Order</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-900/50 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Deck Order</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
