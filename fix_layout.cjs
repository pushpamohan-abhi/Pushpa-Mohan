const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

// Change from grid-cols-12 to flex-col to stack them
code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">',
  '<div className="flex flex-col gap-6">'
);

// Remove the col-span restrictions
code = code.replace(
  '<div className="lg:col-span-7 bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center relative min-h-[240px]">',
  '<div className="w-full bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center relative min-h-[240px]">'
);

code = code.replace(
  '<div className="lg:col-span-5 flex flex-col gap-4">',
  '<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">'
);

code = code.replace(
  '<svg className="w-full h-auto min-h-[650px]" viewBox="-120 -120 880 720">',
  '<svg className="w-full h-[650px] md:h-[800px]" viewBox="-150 -150 940 780">'
);

// Increase radius further
const layoutOld = `  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.max(200, numStates * 28);
    stateCoordinates[st] = {
      x: 320 + radius * Math.cos(angle),
      y: 240 + radius * Math.sin(angle),
    };
  });`;

const layoutNew = `  const numStates = dfa.states.length;
  dfa.states.forEach((st, idx) => {
    const angle = (idx / numStates) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.max(240, numStates * 34);
    stateCoordinates[st] = {
      x: 320 + radius * Math.cos(angle),
      y: 240 + radius * Math.sin(angle),
    };
  });`;

code = code.replace(layoutOld, layoutNew);

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
