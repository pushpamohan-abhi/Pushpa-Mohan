import React, { useState, useEffect } from 'react';
import { PresentationDeck } from './types';
import { module1Deck, module1Quiz } from './data/module1Data';
import { module2Deck, module2Quiz } from './data/module2Data';
import { Navbar } from './components/Navbar';
import { PresentationView } from './components/PresentationView';
import { DfaSimulatorView } from './components/DfaSimulatorView';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { SlideEditorView } from './components/SlideEditorView';
import { QuizModal } from './components/QuizModal';
import { SaveGitExportModal } from './components/SaveGitExportModal';
import { generateDfaDiagramImage } from './utils/exportUtils';
import pptxgen from 'pptxgenjs';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'presentation' | 'simulator' | 'ai-generator' | 'editor'>('presentation');
  const [activeModule, setActiveModule] = useState<'module1' | 'module2'>('module1');

  // Load deck for the active module from localStorage with source auto-merge
  const loadModuleDeck = (mod: 'module1' | 'module2'): PresentationDeck => {
    const sourceDeck = mod === 'module1' ? module1Deck : module2Deck;
    const storageKey = mod === 'module1' ? 'toc_module1_deck' : 'toc_module2_deck';
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          const savedSlideIds = new Set(parsed.slides.map((s: any) => s.id));
          const missingSlides = sourceDeck.slides.filter(s => !savedSlideIds.has(s.id));

          if (missingSlides.length === 0 && parsed.slides.length === sourceDeck.slides.length) {
            return parsed;
          }

          const updatedSlides = [...parsed.slides];
          sourceDeck.slides.forEach((sourceSlide, idx) => {
            if (!savedSlideIds.has(sourceSlide.id)) {
              updatedSlides.splice(idx, 0, sourceSlide);
            }
          });
          const mergedDeck = { ...sourceDeck, slides: updatedSlides };
          localStorage.setItem(storageKey, JSON.stringify(mergedDeck));
          return mergedDeck;
        }
      }
    } catch (e) {
      console.warn('Could not read saved deck from localStorage:', e);
    }
    return sourceDeck;
  };

  const [deck, setDeck] = useState<PresentationDeck>(() => loadModuleDeck('module1'));

  // Switch deck state whenever activeModule changes
  useEffect(() => {
    setDeck(loadModuleDeck(activeModule));
  }, [activeModule]);

  const handleResetDeck = () => {
    const storageKey = activeModule === 'module1' ? 'toc_module1_deck' : 'toc_module2_deck';
    const sourceDeck = activeModule === 'module1' ? module1Deck : module2Deck;
    localStorage.removeItem(storageKey);
    setDeck(sourceDeck);
  };

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSaveGitOpen, setIsSaveGitOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [projectorKey, setProjectorKey] = useState(0);

  // Synchronize deck state to localStorage
  const handleUpdateDeck = (updatedDeck: PresentationDeck) => {
    setDeck(updatedDeck);
    const storageKey = activeModule === 'module1' ? 'toc_module1_deck' : 'toc_module2_deck';
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedDeck));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  };

  const handleStartProjector = () => {
    setCurrentTab('presentation');
    setProjectorKey((prev) => prev + 1);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const pptx = new pptxgen();
      pptx.layout = 'LAYOUT_16x9';

      for (const slide of deck.slides) {
        const s = pptx.addSlide();
        s.background = { color: '0F172A' }; // Dark slate/blue theme

        if (slide.subtitle) {
          s.addText(slide.subtitle.toUpperCase(), {
            x: 0.8,
            y: 0.4,
            w: '85%',
            h: 0.3,
            fontSize: 10,
            bold: true,
            color: '38BDF8', // Cyan-400
            charSpacing: 2,
          });
        }

        s.addText(slide.title, {
          x: 0.8,
          y: 0.6,
          w: '85%',
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: 'FFFFFF',
        });

        const bulletTexts = slide.bullets.map((b) => ({
          text: b,
          options: {
            bullet: true,
            fontSize: slide.dfaExample ? 13 : 15,
            color: 'E2E8F0',
            spaceAfter: 8,
          },
        }));

        if (slide.dfaExample) {
          const dfa = slide.dfaExample;
          bulletTexts.push({
            text: `DFA Formal 5-Tuple: Q={${dfa.states.join(', ')}}, Σ={${dfa.alphabet.join(', ')}}, q₀=${dfa.startState}, F={${dfa.acceptStates.join(', ')}}`,
            options: {
              bullet: true,
              fontSize: 11,
              color: '38BDF8',
              spaceAfter: 4,
            },
          });
          const transStr = dfa.transitions
            .map((t) => `δ(${t.from}, ${t.symbol})→${t.to}`)
            .join(', ');
          bulletTexts.push({
            text: `Transition Function (δ): ${transStr}`,
            options: {
              bullet: true,
              fontSize: 10,
              color: '22D3EE',
              spaceAfter: 4,
            },
          });

          // Generate and embed transition diagram image
          try {
            const dataUrl = await generateDfaDiagramImage(dfa);
            if (dataUrl) {
              s.addImage({
                data: dataUrl,
                x: 5.1,
                y: 1.3,
                w: 4.6,
                h: 4.0,
              });
            }
          } catch (imgErr) {
            console.error('Failed to generate diagram image for PPT:', imgErr);
          }
        }

        s.addText(bulletTexts, {
          x: 0.8,
          y: 1.3,
          w: slide.dfaExample ? '41%' : '85%',
          h: 4.0,
          valign: 'top',
        });

        if (slide.codeSnippet) {
          s.addText(`Example: ${slide.codeSnippet}`, {
            x: 0.8,
            y: 5.2,
            w: '85%',
            h: 0.5,
            fontSize: 14,
            color: '22D3EE',
            fill: { color: '020617' },
            bold: true,
          });
        }

        if (slide.explanation) {
          s.addText(`Key Takeaway: ${slide.explanation}`, {
            x: 0.8,
            y: 5.8,
            w: '85%',
            h: 0.7,
            fontSize: 12,
            color: '93C5FD',
            italic: true,
          });
        }
      }

      await pptx.writeFile({
        fileName: `${deck.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`,
      });
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export PowerPoint presentation.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeckGenerated = (newDeck: PresentationDeck) => {
    handleUpdateDeck(newDeck);
    setCurrentTab('presentation');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onExport={handleExport}
        onStartProjector={handleStartProjector}
        onOpenSaveGit={() => setIsSaveGitOpen(true)}
        onResetDeck={handleResetDeck}
        slideCount={deck.slides.length}
      />

      <main className="flex-1 flex flex-col">
        {currentTab === 'presentation' && (
          <PresentationView
            key={projectorKey}
            deck={deck}
            onOpenQuiz={() => setIsQuizOpen(true)}
            initialProjectorMode={projectorKey > 0}
            onUpdateDeck={handleUpdateDeck}
          />
        )}

        {currentTab === 'simulator' && <DfaSimulatorView />}

        {currentTab === 'ai-generator' && (
          <AiGeneratorModal
            onDeckGenerated={handleDeckGenerated}
            onClose={() => setCurrentTab('presentation')}
          />
        )}

        {currentTab === 'editor' && (
          <SlideEditorView
            deck={deck}
            onUpdateDeck={handleUpdateDeck}
          />
        )}
      </main>

      {isQuizOpen && (
        <QuizModal
          questions={activeModule === 'module1' ? module1Quiz : module2Quiz}
          onClose={() => setIsQuizOpen(false)}
        />
      )}

      {isSaveGitOpen && (
        <SaveGitExportModal
          deck={deck}
          onClose={() => setIsSaveGitOpen(false)}
          onDeckUpdated={handleUpdateDeck}
        />
      )}
    </div>
  );
}
