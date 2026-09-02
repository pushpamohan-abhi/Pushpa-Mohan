const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

// 1. Update min-h and viewBox
code = code.replace(
  '<svg className="w-full h-auto min-h-[500px]" viewBox="-80 -80 660 560">',
  '<svg className="w-full h-auto min-h-[650px]" viewBox="-120 -120 880 720">'
);

// 2. Update the layout logic
const layoutOld = `  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.max(140, numStates * 15);
    stateCoordinates[st] = {
      x: 250 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  });`;

const layoutNew = `  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.max(200, numStates * 28);
    stateCoordinates[st] = {
      x: 320 + radius * Math.cos(angle),
      y: 240 + radius * Math.sin(angle),
    };
  });`;

code = code.replace(layoutOld, layoutNew);

// 3. Update the self loop center reference and geometry
code = code.replace(
  'let nx = fromCoord.x - 250;',
  'let nx = fromCoord.x - 320;'
);
code = code.replace(
  'let ny = fromCoord.y - 200;',
  'let ny = fromCoord.y - 240;'
);
code = code.replace('const cpDist = 80;', 'const cpDist = 110;');
code = code.replace('const cpSpread = 50;', 'const cpSpread = 70;');
code = code.replace('const peakX = fromCoord.x + nx * 65;', 'const peakX = fromCoord.x + nx * 85;');
code = code.replace('const peakY = fromCoord.y + ny * 65;', 'const peakY = fromCoord.y + ny * 85;');

// 4. Update the standard edge offsets
code = code.replace('const curveOffset = 25;', 'const curveOffset = 45;');
code = code.replace('midX -= 15 * Math.sin(angle);', 'midX -= 25 * Math.sin(angle);');
code = code.replace('midY += 15 * Math.cos(angle);', 'midY += 25 * Math.cos(angle);');

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
