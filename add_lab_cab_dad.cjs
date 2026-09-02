const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const newProblem = `
    {
      id: "nfa-sol-lab-cab-dad",
      title: "Problem: NFA for {lab, cab, dad}",
      subtitle: "NFA Design & Conversion",
      bullets: [
        "Requirement: Recognize exactly the strings 'lab', 'cab', and 'dad'.",
        "Alphabet: Σ = {a, b, c, d, l}",
        "NFA Design: We use ε-transitions from the start state (q0) to branch into three parallel paths, one for each valid word.",
        "Subset Construction: The converted DFA computes the ε-closures and removes non-determinism, merging the parallel paths into a deterministic structure."
      ],
      explanation: "By combining paths with ε-transitions, we easily represent the union of strings. The DFA conversion mathematically merges these paths into deterministic composite states.",
      dfaExample: {
        title: "ε-NFA: {lab, cab, dad}",
        states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"],
        alphabet: ["a", "b", "c", "d", "l", "ε"],
        startState: "q0",
        acceptStates: ["q10"],
        transitions: [
          { from: "q0", symbol: "ε", to: "q1" },
          { from: "q0", symbol: "ε", to: "q4" },
          { from: "q0", symbol: "ε", to: "q7" },
          { from: "q1", symbol: "l", to: "q2" },
          { from: "q2", symbol: "a", to: "q3" },
          { from: "q3", symbol: "b", to: "q10" },
          { from: "q4", symbol: "c", to: "q5" },
          { from: "q5", symbol: "a", to: "q6" },
          { from: "q6", symbol: "b", to: "q10" },
          { from: "q7", symbol: "d", to: "q8" },
          { from: "q8", symbol: "a", to: "q9" },
          { from: "q9", symbol: "d", to: "q10" }
        ],
        testString: "cab",
        convertedDfa: {
          title: "Converted DFA (Subset Construction)",
          states: ["{q0,1,4,7}", "{q2}", "{q5}", "{q8}", "{q3}", "{q6}", "{q9}", "{q10}"],
          alphabet: ["a", "b", "c", "d", "l"],
          startState: "{q0,1,4,7}",
          acceptStates: ["{q10}"],
          transitions: [
            { from: "{q0,1,4,7}", symbol: "l", to: "{q2}" },
            { from: "{q0,1,4,7}", symbol: "c", to: "{q5}" },
            { from: "{q0,1,4,7}", symbol: "d", to: "{q8}" },
            { from: "{q2}", symbol: "a", to: "{q3}" },
            { from: "{q5}", symbol: "a", to: "{q6}" },
            { from: "{q8}", symbol: "a", to: "{q9}" },
            { from: "{q3}", symbol: "b", to: "{q10}" },
            { from: "{q6}", symbol: "b", to: "{q10}" },
            { from: "{q9}", symbol: "d", to: "{q10}" }
          ],
          testString: "cab"
        }
      },
      interactiveType: "dfa-runner"
    },`;

// Insert it right before slide-18 (DFA Minimization)
const searchStr = '      id: "slide-18",';
const index = code.indexOf(searchStr);
if (index !== -1) {
  const blockStart = code.lastIndexOf('{', index);
  code = code.substring(0, blockStart) + newProblem + '\\n' + code.substring(blockStart);
  fs.writeFileSync('src/data/module1Data.ts', code);
  console.log("Successfully added new NFA for lab/cab/dad");
} else {
  console.log("Could not find slide-18");
}
