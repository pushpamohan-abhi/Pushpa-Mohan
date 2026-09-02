const fs = require('fs');
let content = fs.readFileSync('src/data/module1Data.ts', 'utf8');

// The messed up area 1:
//     {
//       
//     {
//     "id": "dfa-prob-1",
content = content.replace(/\{\s*\{\s*"id": "dfa-prob-1",/g, '{\n    "id": "dfa-prob-1",');

// The messed up area 2:
//     }
// },
// id: "slide-15",
content = content.replace(/\}\s*,\s*id: "slide-15"/g, '}\n    },\n    {\n      id: "slide-15"');

// The messed up area 3 for NFA inserts
content = content.replace(/\{\s*\{\s*"id": "nfa-prob-1",/g, '{\n    "id": "nfa-prob-1",');
content = content.replace(/\}\s*,\s*title: "NFA to DFA Conversion/g, '}\n    },\n    {\n      title: "NFA to DFA Conversion');

fs.writeFileSync('src/data/module1Data.ts', content);
console.log('Fixed');
