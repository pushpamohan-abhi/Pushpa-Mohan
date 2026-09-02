const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const anchorIndex = code.indexOf('id: "slide-12"');
if (anchorIndex === -1) {
    console.error("Could not find slide-12");
    process.exit(1);
}

const startIndex = code.lastIndexOf('{', anchorIndex);

const slideSub101 = {
    id: "dfa-prob-sub101",
    title: "Problem: Substring '101'",
    subtitle: "Pattern Matching Automaton",
    bullets: [
        "Requirement: Accept strings containing the sequence '101'.",
        "States track progress: q0 (none), q1 (saw '1'), q2 (saw '10').",
        "Trap state: q3 is permanently accepting once '101' is seen."
    ],
    explanation: "Overlapping sequences must be carefully tracked. In q1 (saw '1'), seeing another '1' keeps the machine in q1 because it could be the start of a new '101'.",
    dfaExample: {
        title: "DFA: Substring '101'",
        states: ["q0", "q1", "q2", "q3"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q3"],
        transitions: [
            {from: "q0", symbol: "0", to: "q0"},
            {from: "q0", symbol: "1", to: "q1"},
            {from: "q1", symbol: "0", to: "q2"},
            {from: "q1", symbol: "1", to: "q1"},
            {from: "q2", symbol: "0", to: "q0"},
            {from: "q2", symbol: "1", to: "q3"},
            {from: "q3", symbol: "0", to: "q3"},
            {from: "q3", symbol: "1", to: "q3"}
        ],
        testString: "000011100"
    },
    interactiveType: "dfa-runner"
};

const slideOdd0 = {
    id: "dfa-prob-odd0",
    title: "Problem: Odd Number of 0s",
    subtitle: "DFA Tracking Parity",
    bullets: [
        "Requirement: The string must contain an odd number of '0's.",
        "State q0 (Even 0s) is the start state.",
        "State q1 (Odd 0s) is the accept state. Input '0' toggles states, '1' loops."
    ],
    explanation: "Parity problems require remembering whether a count is odd or even. A single transition back and forth acts like a toggle.",
    dfaExample: {
        title: "DFA: Odd number of 0s",
        states: ["q0", "q1"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q1"],
        transitions: [
            {from: "q0", symbol: "0", to: "q1"},
            {from: "q0", symbol: "1", to: "q0"},
            {from: "q1", symbol: "0", to: "q0"},
            {from: "q1", symbol: "1", to: "q1"}
        ],
        testString: "0101011000"
    },
    interactiveType: "dfa-runner"
};

const slideEven0 = {
    id: "dfa-prob-even0",
    title: "Problem: Even Number of 0s",
    subtitle: "DFA Tracking Parity",
    bullets: [
        "Requirement: The string must contain an even number of '0's.",
        "State q0 (Even 0s) is the start and accept state.",
        "Input '0' toggles states, '1' loops."
    ],
    explanation: "This is identical to the Odd 0s DFA, except the accepting state is swapped back to the initial state (q0).",
    dfaExample: {
        title: "DFA: Even number of 0s",
        states: ["q0", "q1"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q0"],
        transitions: [
            {from: "q0", symbol: "0", to: "q1"},
            {from: "q0", symbol: "1", to: "q0"},
            {from: "q1", symbol: "0", to: "q0"},
            {from: "q1", symbol: "1", to: "q1"}
        ],
        testString: "010101100"
    },
    interactiveType: "dfa-runner"
};

const slideOdd1 = {
    id: "dfa-prob-odd1",
    title: "Problem: Odd Number of 1s",
    subtitle: "DFA Tracking Parity",
    bullets: [
        "Requirement: The string must contain an odd number of '1's.",
        "State q0 (Even 1s) is the start state.",
        "State q1 (Odd 1s) is the accept state. Input '1' toggles states, '0' loops."
    ],
    explanation: "A parity checker for '1's. The machine toggles its state every time a '1' is encountered.",
    dfaExample: {
        title: "DFA: Odd number of 1s",
        states: ["q0", "q1"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q1"],
        transitions: [
            {from: "q0", symbol: "0", to: "q0"},
            {from: "q0", symbol: "1", to: "q1"},
            {from: "q1", symbol: "0", to: "q1"},
            {from: "q1", symbol: "1", to: "q0"}
        ],
        testString: "01100111"
    },
    interactiveType: "dfa-runner"
};

const slideEven1 = {
    id: "dfa-prob-even1",
    title: "Problem: Even Number of 1s",
    subtitle: "DFA Tracking Parity",
    bullets: [
        "Requirement: The string must contain an even number of '1's.",
        "State q0 (Even 1s) is the start and accept state.",
        "Input '1' toggles states, '0' loops."
    ],
    explanation: "This is identical to the Odd 1s DFA, except the accepting state is swapped back to the initial state (q0).",
    dfaExample: {
        title: "DFA: Even number of 1s",
        states: ["q0", "q1"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q0"],
        transitions: [
            {from: "q0", symbol: "0", to: "q0"},
            {from: "q0", symbol: "1", to: "q1"},
            {from: "q1", symbol: "0", to: "q1"},
            {from: "q1", symbol: "1", to: "q0"}
        ],
        testString: "1111"
    },
    interactiveType: "dfa-runner"
};

const inserts = JSON.stringify(slideSub101, null, 4) + ',\n' + 
                JSON.stringify(slideOdd0, null, 4) + ',\n' + 
                JSON.stringify(slideEven0, null, 4) + ',\n' + 
                JSON.stringify(slideOdd1, null, 4) + ',\n' + 
                JSON.stringify(slideEven1, null, 4) + ',\n';

code = code.substring(0, startIndex) + inserts + code.substring(startIndex);
fs.writeFileSync('src/data/module1Data.ts', code);
console.log('Successfully injected 5 slides!');
