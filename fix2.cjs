const fs = require('fs');
let content = fs.readFileSync('src/data/module1Data.ts', 'utf8');

content = content.replace(/        "testString": "abaabb"\n    \}\n\}\n    \},\n    \{/g, '        "testString": "abaabb"\n    }\n},\n    {');

content = content.replace(/        "testString": "bbaab"\n    \}\n\}\n    \},\n    \{\n      title: "NFA to DFA Conversion/g, '        "testString": "bbaab"\n    }\n},\n    {\n      title: "NFA to DFA Conversion');

fs.writeFileSync('src/data/module1Data.ts', content);
console.log('Fixed again');
