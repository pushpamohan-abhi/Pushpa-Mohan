const fs = require('fs');
let code = fs.readFileSync('src/data/module1Data.ts', 'utf8');

const slide1IdIndex = code.indexOf('"id": "dfa-prob-1"');
if (slide1IdIndex === -1) {
    console.error("Could not find dfa-prob-1");
    process.exit(1);
}

const startIndex = code.lastIndexOf('{', slide1IdIndex);

let braceCount = 0;
let endIndex = -1;
for (let i = startIndex; i < code.length; i++) {
  if (code[i] === '{') braceCount++;
  if (code[i] === '}') braceCount--;
  if (braceCount === 0) {
    endIndex = i;
    break;
  }
}

const slide2 = {
  id: "dfa-prob-1-2",
  title: "Problem 2: Ends with '011'",
  subtitle: "DFA tracking progress towards a suffix",
  bullets: [
    "Requirement: The string must end with the sequence '011'.",
    "States represent how much of the suffix we have currently matched.",
    "q0: nothing matched. q1: matched '0'. q2: matched '01'. q3: matched '011'."
  ],
  explanation: "When matching a suffix, any mismatch must send us back to the appropriate partial match state. For example, if we are in q2 (matched '01') and see a '0', we go to q1 (matched '0'), not q0.",
  dfaExample: {
    title: "DFA: Ends with '011'",
    states: ["q0", "q1", "q2", "q3"],
    alphabet: ["0", "1"],
    startState: "q0",
    acceptStates: ["q3"],
    transitions: [
      {from: "q0", symbol: "0", to: "q1"}, {from: "q0", symbol: "1", to: "q0"},
      {from: "q1", symbol: "0", to: "q1"}, {from: "q1", symbol: "1", to: "q2"},
      {from: "q2", symbol: "0", to: "q1"}, {from: "q2", symbol: "1", to: "q3"},
      {from: "q3", symbol: "0", to: "q1"}, {from: "q3", symbol: "1", to: "q0"}
    ],
    testString: "10011"
  }
};

const slide3 = {
  id: "dfa-prob-1-3",
  title: "Problem 3: Substring 'aa'",
  subtitle: "DFA trapping on a substring match",
  bullets: [
    "Requirement: The string must contain 'aa' somewhere.",
    "States: q0 (start), q1 (saw one 'a'), q2 (saw 'aa' - trap/accept state)."
  ],
  explanation: "Once the machine sees 'aa', it enters q2. Since the condition 'contains aa' is now permanently satisfied, q2 loops to itself on all inputs (a trap state).",
  dfaExample: {
    title: "DFA: Substring 'aa'",
    states: ["q0", "q1", "q2"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q2"],
    transitions: [
      {from: "q0", symbol: "a", to: "q1"}, {from: "q0", symbol: "b", to: "q0"},
      {from: "q1", symbol: "a", to: "q2"}, {from: "q1", symbol: "b", to: "q0"},
      {from: "q2", symbol: "a", to: "q2"}, {from: "q2", symbol: "b", to: "q2"}
    ],
    testString: "bbaab"
  }
};

const slide4 = {
  id: "dfa-prob-1-4",
  title: "Problem 4: At least one 'a'",
  subtitle: "DFA ensuring minimum occurrence",
  bullets: [
    "Requirement: The string must contain the character 'a' at least once.",
    "States: q0 (haven't seen 'a'), q1 (have seen 'a')."
  ],
  explanation: "This is a simpler version of the substring problem. Once an 'a' is encountered, it transitions to the accepting state and stays there forever.",
  dfaExample: {
    title: "DFA: At least one 'a'",
    states: ["q0", "q1"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q1"],
    transitions: [
      {from: "q0", symbol: "a", to: "q1"}, {from: "q0", symbol: "b", to: "q0"},
      {from: "q1", symbol: "a", to: "q1"}, {from: "q1", symbol: "b", to: "q1"}
    ],
    testString: "bbbba"
  }
};

const slide5 = {
  id: "dfa-prob-1-5",
  title: "Problem 5: Not more than 3 'a's",
  subtitle: "DFA counting occurrences and dead states",
  bullets: [
    "Requirement: The string can have 0, 1, 2, or 3 'a's, but no more.",
    "States: q0, q1, q2, q3 track the count of 'a's.",
    "State q4 is a Dead State (or Trap State) for strings that violate the condition."
  ],
  explanation: "Counting up to a finite number N requires N+2 states (0 through N, plus a dead state for >N). Once in the dead state, the string can never be accepted.",
  dfaExample: {
    title: "DFA: Not more than 3 'a's",
    states: ["q0", "q1", "q2", "q3", "q4"],
    alphabet: ["a", "b"],
    startState: "q0",
    acceptStates: ["q0", "q1", "q2", "q3"],
    transitions: [
      {from: "q0", symbol: "a", to: "q1"}, {from: "q0", symbol: "b", to: "q0"},
      {from: "q1", symbol: "a", to: "q2"}, {from: "q1", symbol: "b", to: "q1"},
      {from: "q2", symbol: "a", to: "q3"}, {from: "q2", symbol: "b", to: "q2"},
      {from: "q3", symbol: "a", to: "q4"}, {from: "q3", symbol: "b", to: "q3"},
      {from: "q4", symbol: "a", to: "q4"}, {from: "q4", symbol: "b", to: "q4"}
    ],
    testString: "baabaaba"
  }
};

const replacement = JSON.stringify(slide2, null, 4) + ',\n' + 
                    JSON.stringify(slide3, null, 4) + ',\n' + 
                    JSON.stringify(slide4, null, 4) + ',\n' + 
                    JSON.stringify(slide5, null, 4);

code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 1);

fs.writeFileSync('src/data/module1Data.ts', code);
console.log('Successfully injected 4 individual slides with simulators!');
