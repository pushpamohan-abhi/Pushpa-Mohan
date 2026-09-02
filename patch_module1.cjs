const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const oldSlide17 = `      dfaExample: {
        title: "Converted DFA (Subset Construction)",
        states: ["{q0}", "{q0,q1}"],
        alphabet: ["0", "1"],
        startState: "{q0}",
        acceptStates: ["{q0,q1}"],
        transitions: [
          { from: "{q0}", symbol: "0", to: "{q0}" },
          { from: "{q0}", symbol: "1", to: "{q0,q1}" },
          { from: "{q0,q1}", symbol: "0", to: "{q0}" },
          { from: "{q0,q1}", symbol: "1", to: "{q0,q1}" }
        ],
        testString: "0101"
      }`;

const newSlide17 = `      dfaExample: {
        title: "NFA (Ends with '1')",
        states: ["q0", "q1"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q1"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" }
        ],
        testString: "0101",
        convertedDfa: {
          title: "Converted DFA (Subset Construction)",
          states: ["{q0}", "{q0,q1}"],
          alphabet: ["0", "1"],
          startState: "{q0}",
          acceptStates: ["{q0,q1}"],
          transitions: [
            { from: "{q0}", symbol: "0", to: "{q0}" },
            { from: "{q0}", symbol: "1", to: "{q0,q1}" },
            { from: "{q0,q1}", symbol: "0", to: "{q0}" },
            { from: "{q0,q1}", symbol: "1", to: "{q0,q1}" }
          ],
          testString: "0101"
        }
      }`;

if (code.includes(oldSlide17)) {
  code = code.replace(oldSlide17, newSlide17);
  fs.writeFileSync('src/data/module1Data.ts', code);
  console.log('Successfully patched slide-17');
} else {
  console.log('Failed to find oldSlide17');
}
