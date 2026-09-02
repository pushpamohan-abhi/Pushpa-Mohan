import React, { useState } from 'react';
import { PresentationDeck, Slide } from '../types';
import { Edit3, Plus, Trash2, Save, Layers, ArrowUp, ArrowDown } from 'lucide-react';

interface SlideEditorViewProps {
  deck: PresentationDeck;
  onUpdateDeck: (newDeck: PresentationDeck) => void;
}

export const SlideEditorView: React.FC<SlideEditorViewProps> = ({ deck, onUpdateDeck }) => {
  const [editableDeck, setEditableDeck] = useState<PresentationDeck>(JSON.parse(JSON.stringify(deck)));
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [successMsg, setSuccessMsg] = useState(false);

  const currentSlide = editableDeck.slides[selectedIdx] || editableDeck.slides[0];

  const handleUpdateField = (field: keyof Slide, val: any) => {
    const updatedSlides = [...editableDeck.slides];
    updatedSlides[selectedIdx] = {
      ...updatedSlides[selectedIdx],
      [field]: val,
    };
    setEditableDeck({ ...editableDeck, slides: updatedSlides });
  };

  const handleBulletChange = (bulletIdx: number, val: string) => {
    const updatedBullets = [...currentSlide.bullets];
    updatedBullets[bulletIdx] = val;
    handleUpdateField('bullets', updatedBullets);
  };

  const addBullet = () => {
    handleUpdateField('bullets', [...currentSlide.bullets, 'New bullet point item']);
  };

  const removeBullet = (bulletIdx: number) => {
    const updatedBullets = currentSlide.bullets.filter((_, i) => i !== bulletIdx);
    handleUpdateField('bullets', updatedBullets);
  };

  const addNewSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: "New Presentation Slide",
      subtitle: "Custom Section",
      bullets: ["First key concept point", "Second key concept point"],
      explanation: "Add professor notes or detailed conceptual explanations here.",
      interactiveType: "none",
    };
    setEditableDeck({
      ...editableDeck,
      slides: [...editableDeck.slides, newSlide],
    });
    setSelectedIdx(editableDeck.slides.length);
  };

  const deleteCurrentSlide = () => {
    if (editableDeck.slides.length <= 1) return;
    const updatedSlides = editableDeck.slides.filter((_, i) => i !== selectedIdx);
    setEditableDeck({ ...editableDeck, slides: updatedSlides });
    setSelectedIdx(Math.max(0, selectedIdx - 1));
  };

  const handleSave = () => {
    onUpdateDeck(editableDeck);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Edit3 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Slide Customizer</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Presentation Editor & Content Manager</h2>
          <p className="text-sm text-slate-500 mt-1">Customize slide titles, bullets, notes, and curriculum structure.</p>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
              ✓ Saved Successfully!
            </span>
          )}
          <button
            onClick={addNewSlide}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Deck</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Slide Selector & Editor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left List of Slides */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-2 max-h-[600px] overflow-y-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">Slides List</span>
          {editableDeck.slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between ${
                selectedIdx === idx
                  ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-900 shadow-xs font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${selectedIdx === idx ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {idx + 1}
                </span>
                <span className="text-xs truncate">{slide.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Editor Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Editing Slide {selectedIdx + 1}</h3>
            <button
              onClick={deleteCurrentSlide}
              disabled={editableDeck.slides.length <= 1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Slide</span>
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Slide Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Slide Title</label>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => handleUpdateField('title', e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Subtitle / Section Tag</label>
              <input
                type="text"
                value={currentSlide.subtitle || ''}
                onChange={(e) => handleUpdateField('subtitle', e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Bullet Points */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase">Bullet Points</label>
                <button
                  type="button"
                  onClick={addBullet}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bullet
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {currentSlide.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet(bIdx)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Professor Explanation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase">Professor Explanation Note</label>
              <textarea
                rows={3}
                value={currentSlide.explanation || ''}
                onChange={(e) => handleUpdateField('explanation', e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-indigo-600 resize-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
