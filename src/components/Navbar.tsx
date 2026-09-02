import React from 'react';
import { Presentation, Play, Sparkles, Edit3, HelpCircle, BookOpen, Download, Tv } from 'lucide-react';

interface NavbarProps {
  currentTab: 'presentation' | 'simulator' | 'ai-generator' | 'editor';
  setCurrentTab: (tab: 'presentation' | 'simulator' | 'ai-generator' | 'editor') => void;
  onOpenQuiz: () => void;
  onExport: () => void;
  onStartProjector: () => void;
  slideCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQuiz,
  onExport,
  onStartProjector,
  slideCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">DFA Module 1 Studio</h1>
              <p className="text-xs text-slate-500 font-medium">Automata PPT & Animated State Machine</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('presentation')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'presentation'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Slides Deck ({slideCount})</span>
            </button>

            <button
              onClick={() => setCurrentTab('simulator')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'simulator'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>DFA Animator</span>
            </button>

            <button
              onClick={() => setCurrentTab('ai-generator')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'ai-generator'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI PPT Generator</span>
            </button>

            <button
              onClick={() => setCurrentTab('editor')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'editor'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Slide Editor</span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onStartProjector}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all animate-pulse"
              title="Start Fullscreen Projector Slide Show (F5)"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">Projector Mode (F5)</span>
            </button>

            <button
              onClick={onOpenQuiz}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Practice Quiz"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Quiz</span>
            </button>

            <button
              onClick={onExport}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              title="Export Presentation / Slides"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PPT</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => setCurrentTab('presentation')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg ${currentTab === 'presentation' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600'}`}
          >
            Slides
          </button>
          <button
            onClick={onStartProjector}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 flex items-center gap-1"
          >
            <Tv className="w-3 h-3" /> Projector
          </button>
          <button
            onClick={() => setCurrentTab('simulator')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg ${currentTab === 'simulator' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600'}`}
          >
            Animator
          </button>
          <button
            onClick={() => setCurrentTab('ai-generator')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg ${currentTab === 'ai-generator' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600'}`}
          >
            AI PPT
          </button>
        </div>
      </div>
    </header>
  );
};
