const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const anchorIndex = code.indexOf('"id": "dfa-prob-1-2"');
if (anchorIndex === -1) {
    console.error("Could not find dfa-prob-1-2");
    process.exit(1);
}

const startIndex = code.lastIndexOf('{', anchorIndex);

const slideSubAA = {
    id: "dfa-prob-sub-aa",
    title: "Problem: Substring 'aa'",
    subtitle: "Pattern Matching",
    bullets: [
        "Requirement: Accept strings over {a,b} containing the sequence 'aa'.",
        "q0: Start state (no 'a' seen yet).",
        "q1: Saw one 'a'. If 'b' is seen, reset to q0.",
        "q2: Trap accepting state. Once 'aa' is seen, stay here forever."
    ],
    explanation: "Simple substring match. Since we only care if 'aa' appears anywhere, we use a trap state (q2) to accept the string regardless of what follows.",
    dfaExample: {
        title: "DFA: Substring 'aa'",
        states: ["q0", "q1", "q2"],
        alphabet: ["a", "b"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
            {from: "q0", symbol: "a", to: "q1"},
            {from: "q0", symbol: "b", to: "q0"},
            {from: "q1", symbol: "a", to: "q2"},
            {from: "q1", symbol: "b", to: "q0"},
            {from: "q2", symbol: "a", to: "q2"},
            {from: "q2", symbol: "b", to: "q2"}
        ],
        testString: "ababaabb"
    },
    interactiveType: "dfa-runner"
};

const slideExactAA = {
    id: "dfa-prob-exact-aa",
    title: "Problem: Exactly 'aa'",
    subtitle: "Strict Length and Pattern Matching",
    bullets: [
        "Requirement: Accept exactly the string 'aa' and nothing else.",
        "q0 -> q1 -> q2 forms the exact path for 'aa'.",
        "q3 is a dead/trap state. Any 'b' or any character after 'aa' sends the machine to q3."
    ],
    explanation: "When matching exactly one specific string, all deviations from the intended path must lead to a dead state (q3) from which the machine can never escape.",
    dfaExample: {
        title: "DFA: Exactly 'aa'",
        states: ["q0", "q1", "q2", "q3"],
        alphabet: ["a", "b"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
            {from: "q0", symbol: "a", to: "q1"},
            {from: "q0", symbol: "b", to: "q3"},
            {from: "q1", symbol: "a", to: "q2"},
            {from: "q1", symbol: "b", to: "q3"},
            {from: "q2", symbol: "a", to: "q3"},
            {from: "q2", symbol: "b", to: "q3"},
            {from: "q3", symbol: "a", to: "q3"},
            {from: "q3", symbol: "b", to: "q3"}
        ],
        testString: "abaa"
    },
    interactiveType: "dfa-runner"
};

const slideDiv5NoLeading0 = {
    id: "dfa-prob-div5-nozero",
    title: "Problem: Divisible by 5 (No Leading Zeros)",
    subtitle: "Modulo Arithmetic with Prefix Constraints",
    bullets: [
        "Requirement: Binary string divisible by 5 AND must not start with '0'.",
        "We use a new initial state 'qs'.",
        "If '0' is read first, it goes to 'qtrap' (rejected).",
        "If '1' is read first, it goes to 'q1' (value 1) and resumes standard modulo 5 tracking."
    ],
    explanation: "This combines a prefix requirement ('must start with 1') with a modulo requirement ('divisible by 5'). By decoupling the start state (qs) from the remainder 0 state (q0), we can uniquely handle the first character.",
    dfaExample: {
        title: "DFA: Div 5, Starts with '1'",
        states: ["qs", "q0", "q1", "q2", "q3", "q4", "qtrap"],
        alphabet: ["0", "1"],
        startState: "qs",
        acceptStates: ["q0"],
        transitions: [
            {from: "qs", symbol: "0", to: "qtrap"},
            {from: "qs", symbol: "1", to: "q1"},
            {from: "qtrap", symbol: "0", to: "qtrap"},
            {from: "qtrap", symbol: "1", to: "qtrap"},
            {from: "q0", symbol: "0", to: "q0"},
            {from: "q0", symbol: "1", to: "q1"},
            {from: "q1", symbol: "0", to: "q2"},
            {from: "q1", symbol: "1", to: "q3"},
            {from: "q2", symbol: "0", to: "q4"},
            {from: "q2", symbol: "1", to: "q0"},
            {from: "q3", symbol: "0", to: "q1"},
            {from: "q3", symbol: "1", to: "q2"},
            {from: "q4", symbol: "0", to: "q3"},
            {from: "q4", symbol: "1", to: "q4"}
        ],
        testString: "101"
    },
    interactiveType: "dfa-runner"
};

const inserts = JSON.stringify(slideSubAA, null, 4) + ',\n' + 
                JSON.stringify(slideExactAA, null, 4) + ',\n' + 
                JSON.stringify(slideDiv5NoLeading0, null, 4) + ',\n';

code = code.substring(0, startIndex) + inserts + code.substring(startIndex);
fs.writeFileSync('src/data/module1Data.ts', code);
console.log('Successfully injected final 3 slides!');
