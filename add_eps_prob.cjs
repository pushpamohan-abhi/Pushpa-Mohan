const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const anchorIndex = code.indexOf('id: "slide-17"');
if (anchorIndex === -1) {
    console.error("Could not find slide-17");
    process.exit(1);
}

const startIndex = code.lastIndexOf('{', anchorIndex);

const epsSlide = {
  id: "eps-prob-19",
  title: "ε-NFA Problem (from notes page 19)",
  subtitle: "Strings ending in '0' OR containing only '1's",
  bullets: [
    "Requirement: Draw an ε-NFA that accepts all binary strings where the last symbol is '0' OR that contain only '1's.",
    "Branching with ε: State q0 uses ε-transitions to instantly branch into two parallel paths: q1 and q2.",
    "Path 1 (q1): Loops on '1' and is an accepting state. Accepts strings of only '1's.",
    "Path 2 (q2): Loops on '0,1' and transitions to q3 (accepting) on '0'. Accepts strings ending in '0'.",
    "ε-Closures: ε-closure(q0) = {q0, q1, q2}, ε-closure(q1) = {q1}, ε-closure(q2) = {q2}, ε-closure(q3) = {q3}."
  ],
  explanation: "By utilizing ε-transitions from the start state, we easily combine two separate simple machines (one for 'only 1s', one for 'ends with 0') into a single ε-NFA without complex state merging.",
  dfaExample: {
    title: "ε-NFA Simulator (Page 19 Solution)",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1", "ε"],
    startState: "q0",
    acceptStates: ["q1", "q3"],
    transitions: [
      { from: "q0", symbol: "ε", to: "q1" },
      { from: "q0", symbol: "ε", to: "q2" },
      { from: "q1", symbol: "1", to: "q1" },
      { from: "q2", symbol: "0", to: "q2" },
      { from: "q2", symbol: "1", to: "q2" },
      { from: "q2", symbol: "0", to: "q3" }
    ],
    testString: "111"
  }
};

const inserts = JSON.stringify(epsSlide, null, 4) + ',\n';

code = code.substring(0, startIndex) + inserts + code.substring(startIndex);

fs.writeFileSync('src/data/module1Data.ts', code);
console.log('Successfully injected Page 19 problem!');
