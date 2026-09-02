const fs = require('fs');

const tsCode = fs.readFileSync('src/data/module1Data.ts', 'utf8');

// Just print the IDs to see the order
const ids = [...tsCode.matchAll(/"?id"?: "([^"]+)"/g)].map(m => m[1]);
console.log(ids);
