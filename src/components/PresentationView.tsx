import React, { useState, useMemo, useEffect } from 'react';
import { PresentationDeck, Slide } from '../types';
import { DfaAnimatorWidget } from './DfaAnimatorWidget';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Terminal,
  HelpCircle,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Tv,
  MousePointer,
  Sun,
  Moon,
  Clock,
  Eye,
  X,
  Play,
  Volume2
} from 'lucide-react';

interface PresentationViewProps {
  deck: PresentationDeck;
  onOpenQuiz: () => void;
  initialProjectorMode?: boolean;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  deck,
  onOpenQuiz,
  initialProjectorMode = false,
}) => {
  const processedSlides = useMemo(() => {
    const newSlides: Slide[] = [];
    deck.slides.forEach((slide) => {
      if (slide.dfaExample && slide.bullets && slide.bullets.length > 0) {
        const s1 = { ...slide, dfaExample: undefined, interactiveType: 'none' as const };
        const s2 = {
          ...slide,
          id: slide.id + '-dfa',
          bullets: [],
          explanation: undefined,
          title: slide.title + ' (Simulator)',
        };
        newSlides.push(s1);
        newSlides.push(s2);
      } else {
        newSlides.push(slide);
      }
    });
    return newSlides;
  }, [deck.slides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProjectorMode, setIsProjectorMode] = useState(initialProjectorMode);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [blackoutMode, setBlackoutMode] = useState<'none' | 'black' | 'white'>('none');
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [projectorTheme, setProjectorTheme] = useState<'dark' | 'light'>('dark');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [aiExplanationModal, setAiExplanationModal] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const currentSlide = processedSlides[currentIndex] || processedSlides[0];

  // Presentation Timer
  useEffect(() => {
    let interval: any = null;
    if (isProjectorMode) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProjectorMode]);

  // Keyboard navigation & controls for Projector / Slide Show
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) {
        return;
      }

      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.key === 'PageDown'
      ) {
        e.preventDefault();
        handleNext();
      } else if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'PageUp'
      ) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        } else if (blackoutMode !== 'none') {
          setBlackoutMode('none');
        } else if (isProjectorMode) {
          setIsProjectorMode(false);
        }
      } else if (e.key.toLowerCase() === 'l') {
        setLaserActive((prev) => !prev);
      } else if (e.key.toLowerCase() === 'b') {
        setBlackoutMode((prev) => (prev === 'black' ? 'none' : 'black'));
      } else if (e.key.toLowerCase() === 'w') {
        setBlackoutMode((prev) => (prev === 'white' ? 'none' : 'white'));
      } else if (e.key.toLowerCase() === 'n') {
        setShowPresenterNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 't') {
        setProjectorTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      } else if (e.key === 'f' || e.key === 'F5' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        toggleProjectorMode();
      } else if (e.key === '?') {
        setShowShortcutsHelp((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, processedSlides.length, isProjectorMode, blackoutMode, showShortcutsHelp]);

  // Mouse move tracker for Virtual Laser Pointer
  const handleMouseMove = (e: React.MouseEvent) => {
    if (laserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleNext = () => {
    if (currentIndex < processedSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleProjectorMode = () => {
    if (!isProjectorMode) {
      setIsProjectorMode(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsProjectorMode(false);
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAskAI = async (
    currentState: string,
    currentSymbol: string,
    inputString: string
  ) => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/explain-dfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dfaName: currentSlide.dfaExample?.title || currentSlide.title,
          currentState,
          currentSymbol,
          inputString,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanationModal(data.explanation);
      } else {
        setAiExplanationModal(
          "This state transition reads the input symbol and updates the finite control state according to the transition function δ."
        );
      }
    } catch (err) {
      setAiExplanationModal(
        "State transition successfully executed according to the formal definition δ(q, a) = q'."
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-[calc(100vh-4rem)] flex flex-col font-sans relative ${
        isProjectorMode ? 'cursor-default select-none' : ''
      } ${
        projectorTheme === 'light' && isProjectorMode
          ? 'bg-slate-100 text-slate-900'
          : 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-slate-100'
      }`}
    >
      {/* Laser Pointer Red Glow Overlay */}
      {laserActive && (
        <div
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
          className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        >
          <div className="w-6 h-6 rounded-full bg-red-500 shadow-[0_0_20px_#ef4444,0_0_40px_#ef4444,0_0_60px_#f87171] animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-white absolute"></div>
        </div>
      )}

      {/* Blackout / Whiteout Pause Screen */}
      {blackoutMode !== 'none' && (
        <div
          onClick={() => setBlackoutMode('none')}
          className={`fixed inset-0 z-[9900] flex flex-col items-center justify-center cursor-pointer p-6 ${
            blackoutMode === 'black' ? 'bg-black text-slate-500' : 'bg-white text-slate-400'
          }`}
        >
          <div className="text-center flex flex-col items-center gap-3">
            <Tv className="w-12 h-12 opacity-40 animate-pulse" />
            <h3 className="text-xl font-bold tracking-wide">
              {blackoutMode === 'black' ? 'Projector Blackout Screen (Paused)' : 'Projector Whiteboard Screen (Paused)'}
            </h3>
            <p className="text-xs opacity-70 font-mono">
              Press key <kbd className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded">B</kbd> or <kbd className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded">W</kbd> or click anywhere to resume
            </p>
          </div>
        </div>
      )}

      {/* SHORTCUTS HELP MODAL */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 z-[9990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full text-slate-100 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-indigo-400" /> Projector Shortcuts & Controls
              </h3>
              <button onClick={() => setShowShortcutsHelp(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Next Slide</span>
                <kbd className="font-mono text-indigo-400">→ / Space</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Previous Slide</span>
                <kbd className="font-mono text-indigo-400">← / PgUp</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Projector Mode</span>
                <kbd className="font-mono text-indigo-400">F5 / F / P</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Laser Pointer</span>
                <kbd className="font-mono text-indigo-400">L</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Black Screen</span>
                <kbd className="font-mono text-indigo-400">B</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">White Screen</span>
                <kbd className="font-mono text-indigo-400">W</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Speaker Notes</span>
                <kbd className="font-mono text-indigo-400">N</kbd>
              </div>
              <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">High Contrast Theme</span>
                <kbd className="font-mono text-indigo-400">T</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. PROJECTOR FULLSCREEN / SLIDE SHOW VIEW MODE                 */}
      {/* ------------------------------------------------------------- */}
      {isProjectorMode ? (
        <div className="fixed inset-0 z-[9000] bg-slate-950 text-white flex flex-col justify-between overflow-y-auto p-4 sm:p-6 md:p-10">
          {/* Top Projector Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 z-20">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 text-xs font-bold tracking-wider uppercase">
                <Tv className="w-3.5 h-3.5" /> Projector View
              </span>
              <span className="text-sm font-semibold text-slate-300 hidden sm:inline">{deck.title}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Speaker Timer */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-lg shadow-inner">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setProjectorTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Toggle High-Contrast Theme (T)"
              >
                {projectorTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              {/* Shortcuts button */}
              <button
                onClick={() => setShowShortcutsHelp(true)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Shortcuts (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Exit Presentation */}
              <button
                onClick={toggleProjectorMode}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-bold transition-all"
                title="Exit Slide Show (Esc)"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Exit (Esc)</span>
              </button>
            </div>
          </div>

          {/* MAIN PROJECTOR SLIDE CANVAS */}
          <div className="flex-1 my-auto flex flex-col justify-center items-center w-full max-w-7xl mx-auto py-4 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`w-full min-h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 rounded-3xl border shadow-2xl relative ${
                  projectorTheme === 'light'
                    ? 'bg-white text-slate-900 border-slate-300'
                    : 'bg-slate-900/90 text-white border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Slide Header */}
                <div className="mb-6">
                  {currentSlide.subtitle && (
                    <span className={`text-sm font-extrabold uppercase tracking-widest block mb-2 ${
                      projectorTheme === 'light' ? 'text-indigo-600' : 'text-cyan-400'
                    }`}>
                      {currentSlide.subtitle}
                    </span>
                  )}
                  <h2 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
                    projectorTheme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {currentSlide.title}
                  </h2>
                </div>

                {/* Bullets & DFA Diagram */}
                <div className="flex-1 flex flex-col justify-center my-auto">
                  {currentSlide.dfaExample ? (
                    <div className="w-full">
                      <DfaAnimatorWidget dfa={currentSlide.dfaExample} onAskAI={handleAskAI} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
                      {(currentSlide.bullets || []).map((bullet, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-6 p-6 sm:p-8 rounded-2xl border shadow-md ${
                            projectorTheme === 'light'
                              ? 'bg-slate-50 border-slate-200 text-slate-800'
                              : 'bg-slate-950/80 border-slate-800 text-slate-100'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shrink-0 mt-0.5 shadow-sm ${
                            projectorTheme === 'light'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-cyan-500 text-slate-950'
                          }`}>
                            {idx + 1}
                          </div>
                          <p className="text-xl sm:text-3xl font-bold leading-snug">
                            {bullet}
                          </p>
                        </div>
                      ))}

                      {currentSlide.codeSnippet && (
                        <div className="mt-4 bg-slate-950 text-cyan-300 p-6 rounded-2xl border border-cyan-500/40 font-mono text-xl sm:text-2xl font-bold flex items-center gap-4">
                          <Terminal className="w-8 h-8 text-cyan-400 shrink-0" />
                          <span>Example: {currentSlide.codeSnippet}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Speaker Notes Drawer (Toggled by N) */}
                {showPresenterNotes && currentSlide.explanation && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-6 p-4 rounded-xl bg-indigo-950/90 border border-indigo-700 text-indigo-100 text-sm font-medium flex items-start gap-3"
                  >
                    <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider text-cyan-300 block">Presenter Key Concept:</span>
                      <p className="mt-1">{currentSlide.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="flex items-center justify-between max-w-4xl w-full mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 px-6 py-3 rounded-2xl shadow-2xl z-20">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Slide Selector & Counter */}
            <div className="flex items-center gap-3">
              <select
                value={currentIndex}
                onChange={(e) => setCurrentIndex(Number(e.target.value))}
                className="bg-slate-950 text-cyan-300 border border-slate-700 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl cursor-pointer"
              >
                {processedSlides.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    Slide {idx + 1}: {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLaserActive(prev => !prev)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  laserActive
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_#ef4444]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Laser Pointer (L)"
              >
                <MousePointer className="w-4 h-4" />
                <span className="hidden md:inline">Laser (L)</span>
              </button>

              <button
                onClick={() => setBlackoutMode(prev => prev === 'black' ? 'none' : 'black')}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  blackoutMode === 'black'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Blackout Screen (B)"
              >
                B
              </button>

              <button
                onClick={() => setShowPresenterNotes(prev => !prev)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  showPresenterNotes
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Speaker Notes (N)"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === processedSlides.length - 1}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm shadow-md"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* 2. STANDARD INLINE PRESENTATION WORKSPACE VIEW               */
        /* ------------------------------------------------------------- */
        <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col">
          {/* Top Deck Info & Projector Launcher Bar */}
          <div className="max-w-7xl w-full mx-auto bg-blue-900/40 backdrop-blur-md border border-blue-500/30 rounded-2xl px-6 py-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]"></span>
                {deck.title}
              </h2>
              <p className="text-xs text-blue-200 mt-1 max-w-2xl">{deck.description}</p>
            </div>

            {/* Slide Counter, Progress, & Projector Mode Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={toggleProjectorMode}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105"
                title="Launch Fullscreen Projector Slide Show (F5)"
              >
                <Tv className="w-4 h-4" />
                <span>Start Projector Slide Show (F5)</span>
              </button>

              <div className="text-xs font-bold text-cyan-300 bg-blue-950/80 px-3.5 py-2 rounded-xl border border-cyan-500/30 shadow-inner">
                Slide {currentIndex + 1} of {processedSlides.length}
              </div>
            </div>
          </div>

          {/* Main Presentation Workspace */}
          <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Slide Navigator Thumbnails */}
            <div className="lg:col-span-3 bg-blue-950/60 backdrop-blur-md rounded-2xl border border-blue-500/20 p-4 shadow-xl hidden lg:flex flex-col gap-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-blue-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" /> Presentation Outline
                </span>
                <span className="text-xs text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-full">
                  {processedSlides.length} slides
                </span>
              </div>

              {processedSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1.5 border ${
                    currentIndex === idx
                      ? 'bg-blue-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                      : 'bg-blue-950/40 hover:bg-blue-900/50 border-blue-800/40 text-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                        currentIndex === idx
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-blue-900 text-blue-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {slide.interactiveType === 'dfa-runner' && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Interactive
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold line-clamp-1">{slide.title}</span>
                </button>
              ))}
            </div>

            {/* Center Main Slide Canvas */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, scale: 0.99, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.99, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-blue-950/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6 sm:p-10 flex flex-col gap-6 min-h-[520px] justify-between relative overflow-visible"
                >
                  {/* Background Glow Effect */}
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Slide Header */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      {currentSlide.subtitle && (
                        <div className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"></span>
                          {currentSlide.subtitle}
                        </div>
                      )}
                      <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        {currentSlide.title}
                      </h3>
                    </div>

                    <button
                      onClick={toggleProjectorMode}
                      className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-blue-900/60 hover:bg-blue-800 p-2 rounded-xl border border-blue-700/60 transition-all shrink-0"
                      title="Project on screen"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Projector Mode</span>
                    </button>
                  </div>

                  {/* Bullet Points & Content */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
                    <div
                      className={`${
                        currentSlide.dfaExample ? 'md:col-span-6' : 'md:col-span-12'
                      } flex flex-col gap-6`}
                    >
                      {(currentSlide.bullets || []).map((bullet, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="flex items-start gap-5 bg-blue-900/50 backdrop-blur-md p-6 rounded-2xl border border-blue-500/30 shadow-lg hover:border-cyan-400/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-1 font-extrabold text-base shadow-inner">
                            {idx + 1}
                          </div>
                          <p className="text-xl sm:text-2xl text-blue-50 leading-relaxed font-semibold">
                            {bullet}
                          </p>
                        </motion.div>
                      ))}

                      {/* Code Snippet / Example Highlight */}
                      {currentSlide.codeSnippet && (
                        <div className="bg-slate-950 text-cyan-300 font-mono text-sm sm:text-base p-5 rounded-2xl border border-cyan-500/50 flex items-center gap-3.5 mt-2 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)]">
                          <Terminal className="w-6 h-6 text-cyan-400 shrink-0 animate-pulse" />
                          <span className="font-bold tracking-wide">
                            Example: {currentSlide.codeSnippet}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Embedded DFA Animator if available */}
                    {currentSlide.dfaExample && (
                      <div className="md:col-span-12">
                        <DfaAnimatorWidget dfa={currentSlide.dfaExample} onAskAI={handleAskAI} />
                      </div>
                    )}
                  </div>

                  {/* Professor Explanation Footer */}
                  {currentSlide.explanation && (
                    <div className="relative z-10 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-lg">
                      <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl shrink-0 mt-0.5 shadow-lg">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                          Professor's Conceptual Note
                        </h4>
                        <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed font-medium">
                          {currentSlide.explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quiz Trigger if slide is quiz */}
                  {currentSlide.interactiveType === 'quiz' && (
                    <div className="relative z-10 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl border border-cyan-500/40">
                      <div>
                        <h4 className="text-lg font-black text-cyan-200">
                          Ready for the Module 1 Assessment?
                        </h4>
                        <p className="text-xs sm:text-sm text-blue-200 mt-1">
                          Test your understanding of DFA formal definitions, set theory, alphabets, and state transitions.
                        </p>
                      </div>
                      <button
                        onClick={onOpenQuiz}
                        className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all flex items-center gap-2.5 shrink-0"
                      >
                        <HelpCircle className="w-5 h-5" />
                        <span>Start Module 1 Quiz</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom Navigation Controls & Shortcuts Prompt */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-950/80 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-4 sm:p-5 shadow-xl gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-blue-200 bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all w-full sm:w-auto justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Slide</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-cyan-300 tracking-wider">
                    Slide {currentIndex + 1} of {processedSlides.length}
                  </span>
                  <span className="text-xs text-blue-400 font-mono hidden md:inline">
                    (Use ← → keys or press F5)
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === processedSlides.length - 1}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all w-full sm:w-auto justify-center"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Explanation Modal */}
      {aiExplanationModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-blue-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col gap-5 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-cyan-300">
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
                <h4 className="text-lg font-bold">AI Professor Explanation</h4>
              </div>
              <button
                onClick={() => setAiExplanationModal(null)}
                className="text-blue-300 hover:text-white font-bold text-base p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed font-medium bg-blue-900/40 p-4 rounded-2xl border border-blue-800/60">
              {aiExplanationModal}
            </p>
            <button
              onClick={() => setAiExplanationModal(null)}
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              Got it, continue learning
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
