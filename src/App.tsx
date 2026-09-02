import React, { useState } from 'react';
import { PresentationDeck } from './types';
import { module1Deck, module1Quiz } from './data/module1Data';
import { Navbar } from './components/Navbar';
import { PresentationView } from './components/PresentationView';
import { DfaSimulatorView } from './components/DfaSimulatorView';
import { AiGeneratorModal } from './components/AiGeneratorModal';
import { SlideEditorView } from './components/SlideEditorView';
import { QuizModal } from './components/QuizModal';
import { generateDfaDiagramImage } from './utils/exportUtils';
import pptxgen from 'pptxgenjs';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'presentation' | 'simulator' | 'ai-generator' | 'editor'>('presentation');
  const [deck, setDeck] = useState<PresentationDeck>(module1Deck);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [projectorKey, setProjectorKey] = useState(0);

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
    setDeck(newDeck);
    setCurrentTab('presentation');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onExport={handleExport}
        onStartProjector={handleStartProjector}
        slideCount={deck.slides.length}
      />

      <main className="flex-1 flex flex-col">
        {currentTab === 'presentation' && (
          <PresentationView
            key={projectorKey}
            deck={deck}
            onOpenQuiz={() => setIsQuizOpen(true)}
            initialProjectorMode={projectorKey > 0}
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
            onUpdateDeck={(updated) => setDeck(updated)}
          />
        )}
      </main>

      {isQuizOpen && (
        <QuizModal
          questions={module1Quiz}
          onClose={() => setIsQuizOpen(false)}
        />
      )}
    </div>
  );
}
