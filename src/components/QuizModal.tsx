import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ArrowLeft, ExternalLink, Share2, Loader2, Copy, Check } from 'lucide-react';
import { signInWithGoogle, getCachedAccessToken } from '../utils/googleAuth';
import { createGoogleFormQuiz, FormExportResult } from '../utils/googleFormsExport';

interface QuizModalProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ questions, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Google Forms Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<FormExportResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentQ = questions[currentIdx];
  const selectedOption = selectedAnswers[currentIdx];
  const isAnswered = selectedOption !== undefined;

  const handleExportToGoogleForms = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      let token = getCachedAccessToken();
      if (!token) {
        const authRes = await signInWithGoogle();
        token = authRes.accessToken;
      }

      const res = await createGoogleFormQuiz(
        token,
        'Formal Languages & Automata Theory - Quiz Assignment',
        questions
      );
      setExportResult(res);
    } catch (err: any) {
      console.error('Export to Google Forms failed:', err);
      setExportError(err.message || 'Failed to export quiz to Google Forms. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return; // already answered
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: optIdx });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Module 1 Mastery Quiz ({questions.length} Questions)</h3>
              <p className="text-xs text-slate-500">Test your understanding or create an online student assignment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportToGoogleForms}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-sm transition-all disabled:opacity-50 shrink-0"
              title="Convert this quiz into an online Google Forms assignment for your students"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Form...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-200" />
                  <span>Assign via Google Forms</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Google Forms Export Success / Error Banner */}
        {exportResult && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col gap-3 text-slate-900 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Google Forms Quiz Created Successfully!</span>
              </div>
              <button
                onClick={() => setExportResult(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              All {questions.length} questions, answer choices, and automated answer key grading rules have been uploaded to Google Forms.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={exportResult.responderUri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs"
              >
                <span>Student Link (Submit Quiz)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleCopyLink(exportResult.responderUri)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition-all border border-emerald-300"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Student Link'}</span>
              </button>

              <a
                href={exportResult.editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs ml-auto"
              >
                <span>View Responses & Edit Form</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
              </a>
            </div>
          </div>
        )}

        {exportError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-900">
            <span>⚠️ {exportError}</span>
            <button onClick={() => setExportError(null)} className="font-bold underline ml-2">Dismiss</button>
          </div>
        )}

        {!showResults ? (
          <div className="flex flex-col gap-6">
            {/* Question Jump Pills */}
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
              {questions.map((q, idx) => {
                const ans = selectedAnswers[idx];
                let pillBg = "bg-slate-200 text-slate-600 hover:bg-slate-300";
                
                if (ans !== undefined) {
                  if (ans === q.correctAnswer) {
                    pillBg = "bg-emerald-500 text-white font-bold";
                  } else {
                    pillBg = "bg-rose-500 text-white font-bold";
                  }
                }
                
                if (idx === currentIdx) {
                  pillBg += " ring-2 ring-indigo-600 ring-offset-1 font-bold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs transition-all flex items-center justify-center ${pillBg}`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>{totalAnswered} / {questions.length} Answered ({Math.round((totalAnswered / questions.length) * 100)}%)</span>
            </div>

            {/* Question Text */}
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentIdx + 1}. {currentQ.question}
            </h4>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {currentQ.options.map((option, optIdx) => {
                let btnStyle = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800";
                if (isAnswered) {
                  if (optIdx === currentQ.correctAnswer) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                  } else if (optIdx === selectedOption) {
                    btnStyle = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                  } else {
                    btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between text-sm ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && optIdx === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col gap-1 animate-fade-in">
                <span className="text-xs font-bold text-indigo-900 uppercase">Explanation</span>
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-40"
              >
                <span>{currentIdx === questions.length - 1 ? 'View Summary' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="flex flex-col items-center justify-center py-6 text-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h4>
              <p className="text-base text-slate-600 mt-2">
                You scored <span className="font-extrabold text-indigo-600 text-lg">{calculateScore()}</span> out of <span className="font-bold text-lg">{questions.length}</span> ({Math.round((calculateScore() / questions.length) * 100)}%)
              </p>
              <div className="mt-3">
                {calculateScore() / questions.length >= 0.8 ? (
                  <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold tracking-wide uppercase">
                    🏆 Excellent Mastery! (Pass)
                  </span>
                ) : calculateScore() / questions.length >= 0.5 ? (
                  <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-extrabold tracking-wide uppercase">
                    👍 Good Effort! Review missed concepts.
                  </span>
                ) : (
                  <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-800 rounded-full text-xs font-extrabold tracking-wide uppercase">
                    📚 Keep Practicing the Slide Deck!
                  </span>
                )}
              </div>
            </div>

            {/* Answer Summary Pills */}
            <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-3">Question Results Overview</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setShowResults(false);
                        setCurrentIdx(idx);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={restartQuiz}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                Return to Slides
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

