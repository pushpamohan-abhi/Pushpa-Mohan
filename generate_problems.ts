import fs from 'fs';

const dfaProblems1 = {
  id: "dfa-prob-1",
  title: "DFA Design Problems (Set 1)",
  subtitle: "Module 1 - Substrings & Constraints",
  bullets: [
    "Problem 2: DFA for strings over {0,1} ending with '011'. (States track progress towards suffix).",
    "Problem 3: DFA for strings over {a,b} having substring 'aa'. (3 states: start, saw-a, saw-aa).",
    "Problem 4: DFA for strings over {a,b} having at least one 'a'. (2 states: no-a, seen-a).",
    "Problem 5: DFA for strings having not more than 3 'a's. (5 states: 0, 1, 2, 3 'a's, and a dead state for >3)."
  ],
  explanation: "These problems illustrate pattern matching for suffixes, substrings, and occurrence counting using DFAs.",
  codeSnippet: "For 'at least one a', F = {q1}, start = q0. δ(q0, a) = q1, δ(q0, b) = q0, δ(q1, a|b) = q1."
};

const dfaProblems2 = {
  id: "dfa-prob-2",
  title: "DFA Design Problems (Set 2)",
  subtitle: "Module 1 - Modulo & Start/End Constraints",
  bullets: [
    "Problem 6: DFA containing 3 consecutive 0's ('000').",
    "Problem 7: DFA for strings over {0,1} beginning with '0' and ending with '1'. (Needs states to enforce both conditions).",
    "Problem 8: DFA for |w| mod 3 = 0 over {a,b}. (3 states representing remainders 0, 1, 2).",
    "Problem 8(ii): DFA for |w| mod 5 = 0. (5 states tracking length modulo 5)."
  ],
  explanation: "Length constraints modulo N require exactly N states in a ring. Start/End conditions require combining prefixes and suffixes.",
  codeSnippet: "Modulo N length: Q = {q0, q1, ... qN-1}, δ(qi, c) = q_{(i+1) mod N}, F = {q0}."
};

const dfaProblems3 = {
  id: "dfa-prob-3",
  title: "DFA Design Problems (Set 3)",
  subtitle: "Module 1 - Multiple Conditions",
  bullets: [
    "Problem 9: DFA for strings with even number of 'a's AND odd number of 'b's. (4 states forming a grid).",
    "Problem 10: DFA for even number of 'a's and even number of 'b's. (4 states).",
    "Problem 11 & 12: DFA ending with 'abb' or ending with 'ab' or 'ba'.",
    "Problem 13: DFA for even length AND begins with '01'."
  ],
  explanation: "Combining properties (like Even A AND Odd B) uses the Cartesian product of two smaller DFAs, resulting in states like (Even, Odd).",
  dfaExample: {
    title: "DFA: Even a's and Even b's (Problem 10)",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q0"],
    transitions: [
      { from: "q0", symbol: "a", to: "q1" },
      { from: "q0", symbol: "b", to: "q2" },
      { from: "q1", symbol: "a", to: "q0" },
      { from: "q1", symbol: "b", to: "q3" },
      { from: "q2", symbol: "a", to: "q3" },
      { from: "q2", symbol: "b", to: "q0" },
      { from: "q3", symbol: "a", to: "q2" },
      { from: "q3", symbol: "b", to: "q1" }
    ],
    testString: "abaabb"
  }
};

const nfaProblems1 = {
  id: "nfa-prob-1",
  title: "NFA Design Problems (Set 1)",
  subtitle: "Module 1 - Non-Determinism Basics",
  bullets: [
    "Problem 1: NFA for language of all strings of length exactly 2. (States: q0 -> q1 -> q2).",
    "Problem 2: NFA containing substring '101'. (Loops at q0, guesses start of '101').",
    "Problem 3 & 4: NFA ending with '0' / ending with '00'.",
    "Problem 5: NFA ending with 'ab' or 'ba'."
  ],
  explanation: "NFAs simplify design by allowing multiple paths. For 'ends with 00', state q0 loops on all inputs and non-deterministically transitions to q1 on '0' when the suffix begins.",
  dfaExample: {
    title: "NFA: Ends with 'ab' or 'ba' (Problem 5)",
    states: ["q0", "q1", "q2", "q3", "q4"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q2", "q4"],
    transitions: [
      { from: "q0", symbol: "a", to: "q0" },
      { from: "q0", symbol: "b", to: "q0" },
      { from: "q0", symbol: "a", to: "q1" }, // branch for 'ab'
      { from: "q1", symbol: "b", to: "q2" },
      { from: "q0", symbol: "b", to: "q3" }, // branch for 'ba'
      { from: "q3", symbol: "a", to: "q4" }
    ],
    testString: "aabab"
  }
};

const nfaProblems2 = {
  id: "nfa-prob-2",
  title: "NFA Design Problems (Set 2)",
  subtitle: "Module 1 - Advanced NFA Patterns",
  bullets: [
    "Problem 6: NFA recognizing specific words {abc, abd, aacd}.",
    "Problem 7(i): NFA containing '101' OR '110' as substring.",
    "Problem 7(ii): NFA where every '1' is followed by '00'.",
    "Problem 8: NFA containing substring 'ab'."
  ],
  explanation: "NFAs handle union (OR) naturally by branching from the start state on ε (or branching directly) to independent sub-machines."
};

const nfaProblems3 = {
  id: "nfa-prob-3",
  title: "NFA Design Problems (Set 3)",
  subtitle: "Module 1 - Positional Constraints",
  bullets: [
    "Problem 9: NFA where 3rd character from right is 'a'. (q0 loops, transitions to q1 on 'a', then exactly two more transitions).",
    "Problem 10: NFA for optional 'a', followed by 'aa', zero or more 'b's. (Can use ε-transitions).",
    "Problem 11 & 12: NFA containing complex substrings like 'abcabb' or ('abbaay' OR 'babay')."
  ],
  explanation: "The 'Nth from the end' problem is famously easy for an NFA (N+1 states) but requires an exponentially larger DFA (2^N states).",
  dfaExample: {
    title: "NFA: 3rd from right is 'a' (Problem 9)",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q3"],
    transitions: [
      { from: "q0", symbol: "a", to: "q0" },
      { from: "q0", symbol: "b", to: "q0" },
      { from: "q0", symbol: "a", to: "q1" }, // Non-deterministic guess
      { from: "q1", symbol: "a", to: "q2" },
      { from: "q1", symbol: "b", to: "q2" },
      { from: "q2", symbol: "a", to: "q3" },
      { from: "q2", symbol: "b", to: "q3" }
    ],
    testString: "bbaab"
  }
};


// Read existing file
let content = fs.readFileSync('src/data/module1Data.ts', 'utf8');

// Find insertion point for DFA problems (after slide 14, before 15)
const slide15Match = content.indexOf('id: "slide-15"');

// Insert DFA problems
const dfaInserts = `
    ${JSON.stringify(dfaProblems1, null, 4)},
    ${JSON.stringify(dfaProblems2, null, 4)},
    ${JSON.stringify(dfaProblems3, null, 4)},
`;

content = content.slice(0, slide15Match) + dfaInserts + content.slice(slide15Match);

// Find insertion point for NFA problems (after slide 15 - ε-NFA Example, before Subset Construction)
// We need to re-find slide-15 (now it's shifted)
const subsetMatch = content.indexOf('title: "NFA to DFA Conversion (Subset Construction)"');
const nfaInserts = `
    ${JSON.stringify(nfaProblems1, null, 4)},
    ${JSON.stringify(nfaProblems2, null, 4)},
    ${JSON.stringify(nfaProblems3, null, 4)},
`;

// Looking for the start of the subset slide object to prepend
const subsetSlideStart = content.lastIndexOf('{', subsetMatch);

content = content.slice(0, subsetSlideStart) + nfaInserts + content.slice(subsetSlideStart);

fs.writeFileSync('src/data/module1Data.ts', content);
console.log('Successfully injected problems');
