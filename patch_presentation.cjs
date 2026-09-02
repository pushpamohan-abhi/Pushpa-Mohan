const fs = require('fs');
let code = fs.readFileSync('src/components/PresentationView.tsx', 'utf8');

// Update imports to include useMemo if not already there
if (!code.includes('useMemo')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState, useMemo } from 'react';");
}

// Inject processedSlides
const useMemoLogic = `
  const processedSlides = useMemo(() => {
    const newSlides: Slide[] = [];
    deck.slides.forEach(slide => {
      if (slide.dfaExample && slide.bullets && slide.bullets.length > 0) {
        const s1 = { ...slide, dfaExample: undefined, interactiveType: 'none' as const };
        const s2 = { ...slide, id: slide.id + '-dfa', bullets: [], explanation: undefined, title: slide.title + ' (Simulator)' };
        newSlides.push(s1);
        newSlides.push(s2);
      } else {
        newSlides.push(slide);
      }
    });
    return newSlides;
  }, [deck.slides]);
`;

code = code.replace(
  "export const PresentationView: React.FC<PresentationViewProps> = ({ deck, onOpenQuiz }) => {",
  "export const PresentationView: React.FC<PresentationViewProps> = ({ deck, onOpenQuiz }) => {\n" + useMemoLogic
);

// Replace deck.slides with processedSlides
code = code.replace(/deck\.slides/g, "processedSlides");

// Replace currentSlide.bullets.map with currentSlide.bullets?.map or currentSlide.bullets && currentSlide.bullets.map
code = code.replace("currentSlide.bullets.map(", "(currentSlide.bullets || []).map(");

// We need to fix the grid to span full width (12 columns) for the DFA example
code = code.replace(
  `{currentSlide.dfaExample && (
                  <div className="md:col-span-6">
                    <DfaAnimatorWidget dfa={currentSlide.dfaExample} onAskAI={handleAskAI} />
                  </div>
                )}`,
  `{currentSlide.dfaExample && (
                  <div className="md:col-span-12">
                    <DfaAnimatorWidget dfa={currentSlide.dfaExample} onAskAI={handleAskAI} />
                  </div>
                )}`
);

fs.writeFileSync('src/components/PresentationView.tsx', code);
