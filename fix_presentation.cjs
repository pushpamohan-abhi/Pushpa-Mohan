const fs = require('fs');
let code = fs.readFileSync('src/components/PresentationView.tsx', 'utf8');

// Fix the useMemo dependency and forEach reference
code = code.replace(
  "processedSlides.forEach(slide => {",
  "deck.slides.forEach(slide => {"
);
code = code.replace(
  "}, [processedSlides]);",
  "}, [deck.slides]);"
);

fs.writeFileSync('src/components/PresentationView.tsx', code);
