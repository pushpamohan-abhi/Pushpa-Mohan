const nfaProblems = [
  {
    id: "nfa-sol-1",
    title: "Problem 1: Exactly Length 2",
    subtitle: "NFA Design - Set 1",
    bullets: [
      "Requirement: Accept all strings of length exactly 2 over {a, b}.",
      "The machine takes exactly 2 transitions to reach the accepting state.",
      "No loops are needed; any path of length 2 reaches q2."
    ],
    explanation: "q0 is start. Any input goes to q1. Any input from q1 goes to q2.",
    dfaExample: {
      title: "NFA: Length exactly 2",
      states: ["q0", "q1", "q2"],
      alphabet: ["a", "b"],
      startState: "q0",
      acceptStates: ["q2"],
      transitions: [
        { from: "q0", symbol: "a", to: "q1" }, { from: "q0", symbol: "b", to: "q1" },
        { from: "q1", symbol: "a", to: "q2" }, { from: "q1", symbol: "b", to: "q2" }
      ],
      testString: "ab"
    },
    interactiveType: "dfa-runner"
  },
  {
    id: "nfa-sol-2",
    title: "Problem 2: Substring '101'",
    subtitle: "NFA Design - Set 1",
    bullets: [
      "Requirement: Accept strings containing the sequence '101'.",
      "q0 acts as a non-deterministic 'waiting' state, looping on all inputs.",
      "At any time, it can guess the start of '101' and transition to q1 on '1'."
    ],
    explanation: "Non-determinism makes substring matching trivial. We just loop at the start and branch when we guess the pattern begins.",
    dfaExample: {
      title: "NFA: Substring 101",
      states: ["q0", "q1", "q2", "q3"],
      alphabet: ["0", "1"],
      startState: "q0",
      acceptStates: ["q3"],
      transitions: [
        { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q0" },
        { from: "q0", symbol: "1", to: "q1" },
        { from: "q1", symbol: "0", to: "q2" },
        { from: "q2", symbol: "1", to: "q3" },
        { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" }
      ],
      testString: "01010"
    },
    interactiveType: "dfa-runner"
  },
  {
    id: "nfa-sol-3",
    title: "Problem 3 & 4: Ends with '0' or '00'",
    subtitle: "NFA Design - Set 1",
    bullets: [
      "Requirement: Accept strings ending in '00'.",
      "q0 loops on all inputs, acting as the non-deterministic guesser.",
      "It branches to q1 when it expects the first '0' of the suffix."
    ],
    explanation: "This highlights the power of NFAs for suffix checking compared to DFAs.",
    dfaExample: {
      title: "NFA: Ends with 00",
      states: ["q0", "q1", "q2"],
      alphabet: ["0", "1"],
      startState: "q0",
      acceptStates: ["q2"],
      transitions: [
        { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q0" },
        { from: "q0", symbol: "0", to: "q1" },
        { from: "q1", symbol: "0", to: "q2" }
      ],
      testString: "10100"
    },
    interactiveType: "dfa-runner"
  },
  {
    id: "nfa-sol-5",
    title: "Problem 5: Ends with 'ab' or 'ba'",
    subtitle: "NFA Design - Set 1",
    bullets: [
      "Requirement: The string must end in either 'ab' or 'ba'.",
      "From the looping start state (q0), we branch to two separate paths.",
      "One path checks for 'ab', the other checks for 'ba'."
    ],
    explanation: "An NFA can simultaneously explore multiple valid suffixes.",
    dfaExample: {
      title: "NFA: Ends with ab or ba",
      states: ["q0", "q1", "q2", "q3", "q4"],
      alphabet: ["a", "b"],
      startState: "q0",
      acceptStates: ["q2", "q4"],
      transitions: [
        { from: "q0", symbol: "a", to: "q0" }, { from: "q0", symbol: "b", to: "q0" },
        { from: "q0", symbol: "a", to: "q1" }, { from: "q1", symbol: "b", to: "q2" },
        { from: "q0", symbol: "b", to: "q3" }, { from: "q3", symbol: "a", to: "q4" }
      ],
      testString: "aabab"
    },
    interactiveType: "dfa-runner"
  },
  {
    id: "nfa-sol-7",
    title: "Problem 7: Substring '101' OR '110'",
    subtitle: "NFA Design - Set 2",
    bullets: [
      "Requirement: Contains '101' or '110'.",
      "Like a standard substring NFA, q0 loops on all inputs.",
      "From q0, it branches into two separate sub-machines to check for either pattern."
    ],
    explanation: "Union (OR) operations are simple in NFAs: just branch the transitions.",
    dfaExample: {
      title: "NFA: Substring 101 or 110",
      states: ["q0", "q1", "q2", "q3", "q4", "q5", "q6"],
      alphabet: ["0", "1"],
      startState: "q0",
      acceptStates: ["q3", "q6"],
      transitions: [
        { from: "q0", symbol: "0", to: "q0" }, { from: "q0", symbol: "1", to: "q0" },
        { from: "q0", symbol: "1", to: "q1" }, { from: "q1", symbol: "0", to: "q2" }, { from: "q2", symbol: "1", to: "q3" },
        { from: "q0", symbol: "1", to: "q4" }, { from: "q4", symbol: "1", to: "q5" }, { from: "q5", symbol: "0", to: "q6" },
        { from: "q3", symbol: "0", to: "q3" }, { from: "q3", symbol: "1", to: "q3" },
        { from: "q6", symbol: "0", to: "q6" }, { from: "q6", symbol: "1", to: "q6" }
      ],
      testString: "001100"
    },
    interactiveType: "dfa-runner"
  },
  {
    id: "nfa-sol-9",
    title: "Problem 9: 3rd Character from Right is 'a'",
    subtitle: "NFA Design - Set 3",
    bullets: [
      "Requirement: The 3rd character from the end of the string must be 'a'.",
      "q0 loops and waits. When it guesses the end is near, it transitions on 'a' to q1.",
      "It then strictly reads exactly 2 more characters (of any kind) to reach q3."
    ],
    explanation: "This NFA only requires 4 states. A DFA for this requires 2^3 = 8 states, proving NFA's efficiency in state count for positional suffix problems.",
    dfaExample: {
      title: "NFA: 3rd from right is 'a'",
      states: ["q0", "q1", "q2", "q3"],
      alphabet: ["a", "b"],
      startState: "q0",
      acceptStates: ["q3"],
      transitions: [
        { from: "q0", symbol: "a", to: "q0" }, { from: "q0", symbol: "b", to: "q0" },
        { from: "q0", symbol: "a", to: "q1" },
        { from: "q1", symbol: "a", to: "q2" }, { from: "q1", symbol: "b", to: "q2" },
        { from: "q2", symbol: "a", to: "q3" }, { from: "q2", symbol: "b", to: "q3" }
      ],
      testString: "bbaab"
    },
    interactiveType: "dfa-runner"
  }
];

const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

// I will insert these objects right before the NFA-to-DFA slide.
const target = 'id: "slide-17",';
const index = code.indexOf(target);
if (index === -1) {
  console.log("Could not find slide-17");
  process.exit(1);
}

// Find the start of the object containing slide-17
const blockStart = code.lastIndexOf('{', index);

// Remove the old NFA problem text slides (nfa-prob-1, 2, 3, eps-prob-19)
// It's easier to just splice the new ones right before slide-17, and then manually run a replace for the old ones.

const insertedCode = nfaProblems.map(obj => JSON.stringify(obj, null, 2)).join(',\\n') + ',\\n';
let newCode = code.substring(0, blockStart) + insertedCode + code.substring(blockStart);

// We need to unescape the \n that I just wrote incorrectly in JS string literal
// So I will write a better regex replace.
