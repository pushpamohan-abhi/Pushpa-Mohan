const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

code = code.replace('NFA View', '{initialDfa.title.includes("NFA") ? "NFA View" : "Original DFA"}');
code = code.replace('Converted DFA', '{initialDfa.convertedDfa?.title?.includes("Minim") ? "Minimized DFA" : "Converted DFA"}');

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
