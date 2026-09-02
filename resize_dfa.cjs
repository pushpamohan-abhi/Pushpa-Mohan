const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

// 1. Update min-h and viewBox
code = code.replace(
  '<svg className="w-full h-auto min-h-[300px]" viewBox="-50 -50 420 340">',
  '<svg className="w-full h-auto min-h-[450px]" viewBox="-50 -50 600 500">'
);

// 2. Update the layout logic
const layoutOld = `  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = 90;
    stateCoordinates[st] = {
      x: 160 + radius * Math.cos(angle),
      y: 120 + radius * Math.sin(angle),
    };
  });`;

const layoutNew = `  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.max(140, numStates * 15);
    stateCoordinates[st] = {
      x: 250 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  });`;

code = code.replace(layoutOld, layoutNew);

// 3. Update the self loop center reference
code = code.replace(
  'let nx = fromCoord.x - 160;',
  'let nx = fromCoord.x - 250;'
);
code = code.replace(
  'let ny = fromCoord.y - 120;',
  'let ny = fromCoord.y - 200;'
);

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
