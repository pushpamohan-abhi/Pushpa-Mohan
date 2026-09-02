const fs = require('fs');

let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const oldSlide18Str = `      dfaExample: {
        title: "Minimized DFA (3 States)",
        states: ["A", "B", "[C,D]"],
        alphabet: ["0", "1"],
        startState: "A",
        acceptStates: ["[C,D]"],
        transitions: [
          { from: "A", symbol: "0", to: "B" },
          { from: "A", symbol: "1", to: "[C,D]" },
          { from: "B", symbol: "0", to: "A" },
          { from: "B", symbol: "1", to: "[C,D]" },
          { from: "[C,D]", symbol: "0", to: "[C,D]" },
          { from: "[C,D]", symbol: "1", to: "[C,D]" }
        ],
        testString: "0110"
      },`;

const newSlide18Str = `      dfaExample: {
        title: "Original DFA (Unminimized)",
        states: ["A", "B", "C", "D", "E"],
        alphabet: ["0", "1"],
        startState: "A",
        acceptStates: ["C", "D"],
        transitions: [
          { from: "A", symbol: "0", to: "B" },
          { from: "A", symbol: "1", to: "C" },
          { from: "B", symbol: "0", to: "A" },
          { from: "B", symbol: "1", to: "D" },
          { from: "C", symbol: "0", to: "C" },
          { from: "C", symbol: "1", to: "D" },
          { from: "D", symbol: "0", to: "D" },
          { from: "D", symbol: "1", to: "C" },
          { from: "E", symbol: "0", to: "A" },
          { from: "E", symbol: "1", to: "C" }
        ],
        testString: "0110",
        convertedDfa: {
          title: "Minimized DFA (3 States)",
          states: ["A", "B", "[C,D]"],
          alphabet: ["0", "1"],
          startState: "A",
          acceptStates: ["[C,D]"],
          transitions: [
            { from: "A", symbol: "0", to: "B" },
            { from: "A", symbol: "1", to: "[C,D]" },
            { from: "B", symbol: "0", to: "A" },
            { from: "B", symbol: "1", to: "[C,D]" },
            { from: "[C,D]", symbol: "0", to: "[C,D]" },
            { from: "[C,D]", symbol: "1", to: "[C,D]" }
          ],
          testString: "0110"
        }
      },`;

if (code.includes(oldSlide18Str)) {
  code = code.replace(oldSlide18Str, newSlide18Str);
  fs.writeFileSync('src/data/module1Data.ts', code);
  console.log("Patched slide 18 successfully.");
} else {
  console.log("Could not find slide 18 string.");
}

