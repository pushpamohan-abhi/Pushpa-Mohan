import { PresentationDeck, QuizQuestion } from '../types';

export const module1Deck: PresentationDeck = {
  title: "Theory of Computation: Module 1 Master Notes",
  description: "Comprehensive curriculum covering set theory foundations, alphabets, strings, languages, formal DFA/NFA definitions, subset construction, DFA minimization, and language hierarchies based on your uploaded notes.",
  slides: [
    {
      id: "slide-1",
      title: "Set Theory Foundations: Cardinality & Power Set",
      subtitle: "Module 0 - Mathematical Preliminaries",
      bullets: [
        "Set Definition: A set is an unordered collection of distinct, well-defined objects or elements.",
        "• Example: Let A = {red, blue, green}. Here A is a set containing 3 distinct color elements.",
        "Cardinality (|A|): The exact count of elements in set A.",
        "• Example: If A = {10, 20, 30, 40}, then cardinality |A| = 4.",
        "Power Set (2^A): The collection of ALL possible subsets of A.",
        "• Formula: If a set A has n elements (|A| = n), its power set 2^A has exactly 2^n subsets.",
        "• Concrete Example: Let A = {a, b}. Power set 2^A = { ∅, {a}, {b}, {a, b} } (Total 2^2 = 4 subsets)."
      ],
      explanation: "Set theory forms the foundational language of discrete mathematics and automata theory, defining how states, alphabets, and languages are structured.",
      codeSnippet: "Set A = {1, 2}  |  Cardinality |A| = 2  |  Power Set 2^A = { ∅, {1}, {2}, {1,2} } (2^2 = 4 subsets)",
      interactiveType: "none"
    },
    {
      id: "slide-2",
      title: "Cartesian Product & Set Operations",
      subtitle: "Module 0.2 - Set Algebra & Examples",
      bullets: [
        "Cartesian Product (A × B): The set of all ordered pairs (a, b) where a ∈ A and b ∈ B.",
        "• Concrete Example: Let A = {1, 2} and B = {x, y}.",
        "• Result: A × B = { (1,x), (1,y), (2,x), (2,y) } (Total pairs = |A| × |B| = 2 × 2 = 4).",
        "Set Operations with Examples:",
        "• Union (A ∪ B): Elements in A, B, or both. Ex: {1, 2} ∪ {2, 3} = {1, 2, 3}.",
        "• Intersection (A ∩ B): Elements common to both. Ex: {1, 2} ∩ {2, 3} = {2}.",
        "• Difference (A - B): Elements in A not in B. Ex: {1, 2} - {2, 3} = {1}.",
        "• Complement (Ā): Elements in Universal set U not in A. Ex: If U = {1, 2, 3, 4} and A = {1, 2}, then Ā = U - A = {3, 4}."
      ],
      explanation: "Cartesian products are fundamental when defining transition functions like δ: Q × Σ → Q (mapping state and symbol pairs to next states).",
      codeSnippet: "A = {1, 2}, B = {x, y} ⇒ A × B = {(1,x), (1,y), (2,x), (2,y)}",
      interactiveType: "none"
    },
    {
      id: "slide-3",
      title: "Foundations: Alphabets, Strings & Languages",
      subtitle: "Module 1.1 - Basic Terminologies",
      bullets: [
        "Alphabet (Σ): A finite, non-empty set of symbols. e.g., Σ = {0, 1} (Binary), Σ = {a, b, c...} (English).",
        "String (w): A finite sequence of symbols derived from an alphabet Σ. Length denoted as |w|.",
        "Empty String (ε): The special string of length 0 (|ε| = 0).",
        "Power of an Alphabet (Σ*): Set of all possible strings of any length derived from Σ (Kleene Star).",
        "Kleene Plus (Σ+): Set of all strings of length ≥ 1 (Σ+ = Σ* - {ε})."
      ],
      explanation: "Alphabets and strings are the atomic units of computation. Σ* includes every possible combination including the empty string ε.",
      codeSnippet: "Σ = {0, 1}  |  Σ* = {ε, 0, 1, 00, 01, 10, 11, ...}  |  Σ+ = {0, 1, 00, ...}",
      interactiveType: "none"
    },
    {
      id: "slide-4",
      title: "String Operations & Relations",
      subtitle: "Module 1.2 - Manipulation & Properties",
      bullets: [
        "Concatenation: Appending string t to s (st). If x = 'ab' and y = 'c', then xy = 'abc'.",
        "Reversal (wR): Reversing symbol order. e.g., (abc)R = cba. Basis: εR = ε, (xa)R = a(xR).",
        "Substring, Prefix & Suffix:",
        "• Substring: T continuously occurs in S.",
        "• Prefix: Leading symbols of W (e.g., for 'abc', prefixes are ε, a, ab, abc).",
        "• Suffix: Trailing symbols of W (e.g., suffixes are ε, c, bc, abc)."
      ],
      explanation: "String relations define structural boundaries within formal languages, crucial for pattern matching and compiler parsing.",
      codeSnippet: "x = '1101', y = '0011' => xy = '11010011'  |  |w| = length of w",
      interactiveType: "none"
    },
    {
      id: "slide-5",
      title: "Languages & Set Operations",
      subtitle: "Module 1.3 - Language Algebra",
      bullets: [
        "Language (L): A set of strings chosen from Σ* (L ⊆ Σ*).",
        "Set Operations on Languages:",
        "• Union (L1 ∪ L2): Strings belonging to L1 or L2.",
        "• Intersection (L1 ∩ L2): Strings common to both.",
        "• Difference (L1 - L2): Strings in L1 but not L2.",
        "• Complement (L̄ or ~L): All strings in Σ* not in L (Σ* - L). Ex: If Σ = {a, b} and L = {strings starting with 'a'}, then L̄ = {ε, strings starting with 'b'}.",
        "• Concatenation (L1L2): {xy | x ∈ L1, y ∈ L2}."
      ],
      explanation: "Languages form an algebra under set operations. Recognizing how languages combine is essential for building complex automata.",
      codeSnippet: "L1 = {aa, ab}, L2 = {xx, yy} => L1L2 = {aaxx, aayy, abxx, abyy}",
      interactiveType: "none"
    },
    {
      id: "slide-6",
      title: "Language Classes Hierarchy",
      subtitle: "Module 1.4 - Chomsky & Automata Hierarchy",
      bullets: [
        "Hierarchy of Language Classes in Automata Theory:",
        "1. Regular Language (FSM / DFA / NFA)",
        "2. Context-Free Language (PDA - Pushdown Automata)",
        "3. Decidable Language (TM - Turing Machine)",
        "4. Semi-Decidable Language (Turing Recognizable)",
        "Key Evaluation Criteria:",
        "• Computational Efficiency: FSM grows linearly, PDA cubic, TM exponential.",
        "• Decidability: FSM & PDA problems are decidable; some TM problems are undecidable."
      ],
      explanation: "The automata hierarchy classifies problems by computational power and resource constraints, governing what computers can efficiently solve.",
      codeSnippet: "Regular ⊂ Context-Free ⊂ Context-Sensitive ⊂ Recursively Enumerable",
      interactiveType: "none"
    },
    {
      id: "fa-intro-switch",
      title: "Introduction to Finite Automata: The Switch Model",
      subtitle: "Section 2.1 - Informal Intuition & Real-World State Machines (Ullman Textbook)",
      bullets: [
        "Finite Automaton (FA): An abstract mathematical model of a system that transitions between a finite set of internal states in response to external input events.",
        "Real-World Example: The On/Off Push-Button Switch (or Automatic Door Controller):",
        "• States Q = { OFF, ON } where OFF is the initial state (q₀ = OFF).",
        "• Input Alphabet Σ = { PUSH } (pressing the power button).",
        "• Transition Function δ: Pressing PUSH while OFF moves to ON. Pressing PUSH while ON moves back to OFF.",
        "• Formal Transition Rules: δ(OFF, PUSH) = ON, δ(ON, PUSH) = OFF.",
        "Key Takeaway: Finite memory — the automaton only needs to store its CURRENT state, not the infinite sequence of past inputs!"
      ],
      explanation: "The switch example demonstrates the core property of a finite automaton: maintaining a finite set of memory states that change predictably based on input events.",
      codeSnippet: "Q = {OFF, ON}, Σ = {PUSH}, q0 = OFF  |  δ(OFF, PUSH) = ON, δ(ON, PUSH) = OFF",
      interactiveType: "none"
    },
    {
      id: "fa-structural-rep",
      title: "Structural Representations of Finite Automata",
      subtitle: "Section 2.1.1 - Transition Graphs, Tables & Grammars with Worked Examples",
      bullets: [
        "Hopcroft, Motwani, & Ullman outline 3 primary structural notations for finite state machines:",
        "1. Transition Diagram (Graph): Directed graph where nodes represent states Q and arcs labeled with a ∈ Σ represent transitions δ(q, a).",
        "   • Start State (q₀): Indicated by an unlabelled arrow pointing into q₀ from nowhere (→q₀).",
        "   • Accepting/Final States (F): Indicated by double concentric circles ((q_f)).",
        "2. Transition Table: Tabular representation where rows are states and columns are input symbols.",
        "   • Row header →q₀ denotes start state, *q_f denotes accepting state.",
        "   • Entry at row q and column a contains the target next state δ(q, a).",
        "3. Grammars / Regular Expressions: Formal production rules specifying generated language.",
        "Example (Switch Machine Table): Rows: OFF, ON. Column: PUSH. Entry for OFF is ON; entry for ON is OFF."
      ],
      explanation: "Transition diagrams offer visual clarity, while transition tables provide O(1) direct array lookup for software runtime execution.",
      codeSnippet: "Table Matrix: Row = Current State | Column = Input Symbol | Cell = δ(Current, Input)",
      interactiveType: "none"
    },
    {
      id: "dfa-def-delta-hat",
      title: "Deterministic Finite Automata (DFA) & Extended Transition Function (δ̂)",
      subtitle: "Section 2.2 - Formal 5-Tuple & Inductive Definition of δ̂ (Ullman Textbook)",
      bullets: [
        "Formal DFA 5-Tuple Definition: M = (Q, Σ, δ, q₀, F)",
        "• Q: Finite, non-empty set of states.",
        "• Σ: Finite input alphabet.",
        "• q₀ ∈ Q: Single initial / start state.",
        "• F ⊆ Q: Set of final / accepting states.",
        "• δ: Transition function mapping Q × Σ → Q (Exactly ONE next state per symbol).",
        "Extended Transition Function δ̂ (Delta-Hat) on Strings (δ̂: Q × Σ* → Q):",
        "• BASIS: δ̂(q, ε) = q  (Reading the empty string leaves the state unchanged).",
        "• INDUCTION STEP: For any string w = xa (where x ∈ Σ* and a ∈ Σ):",
        "  δ̂(q, xa) = δ( δ̂(q, x), a )",
        "Language Accepted by DFA M: L(M) = { w ∈ Σ* | δ̂(q₀, w) ∈ F }."
      ],
      explanation: "The extended transition function δ̂ mathematically formalizes string processing step-by-step by decomposing string w into prefix x and final character a.",
      codeSnippet: "Basis: δ̂(q, ε) = q  |  Induction: δ̂(q, xa) = δ(δ̂(q, x), a)",
      interactiveType: "transition-table"
    },
    {
      id: "dfa-proc-even-length",
      title: "DFA Processing Example 1: Strings of Even Length",
      subtitle: "Section 2.2.1 - Complete Transition Table, Diagram & δ̂ Evaluation",
      bullets: [
        "Problem: Construct a DFA accepting all binary strings of even length over Σ = {0, 1}.",
        "Formal 5-Tuple: Q = {q_even, q_odd}, Σ = {0, 1}, q₀ = q_even, F = {q_even}.",
        "Transition Table:",
        "   State    |   0    |   1",
        "  →*q_even  | q_odd  | q_odd",
        "    q_odd   | q_even | q_even",
        "Step-by-Step String Processing for w = '1011' using Extended Transition Function δ̂:",
        "• δ̂(q_even, ε) = q_even  [Basis]",
        "• δ̂(q_even, '1') = δ(q_even, '1') = q_odd",
        "• δ̂(q_even, '10') = δ(q_odd, '0') = q_even",
        "• δ̂(q_even, '101') = δ(q_even, '1') = q_odd",
        "• δ̂(q_even, '1011') = δ(q_odd, '1') = q_even ∈ F  ⇒ ACCEPTED! (|1011| = 4, which is even)."
      ],
      explanation: "The state flips between q_even and q_odd on every symbol. Since 4 is even, processing '1011' terminates in accepting state q_even.",
      dfaExample: {
        title: "DFA: Even Length Strings",
        states: ["q_even", "q_odd"],
        alphabet: ["0", "1"],
        startState: "q_even",
        acceptStates: ["q_even"],
        transitions: [
          { from: "q_even", symbol: "0", to: "q_odd" },
          { from: "q_even", symbol: "1", to: "q_odd" },
          { from: "q_odd", symbol: "0", to: "q_even" },
          { from: "q_odd", symbol: "1", to: "q_even" }
        ],
        testString: "1011"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "dfa-proc-begins-01",
      title: "DFA Processing Example 2: Strings Beginning with '01'",
      subtitle: "Section 2.2.2 - Complete Transition Table, Diagram & δ̂ Proof",
      bullets: [
        "Problem: Construct a DFA over Σ = {0, 1} accepting strings that begin with prefix '01'.",
        "Formal 5-Tuple: Q = {q0, q1, q2, q3}, Σ = {0, 1}, Start = q0, F = {q2}.",
        "State Meaning: q0 (saw nothing), q1 (saw '0'), q2 (saw '01' - ACCEPT), q3 (trap state - invalid prefix).",
        "Transition Table:",
        "   State |  0  |  1",
        "   → q0  | q1  | q3",
        "     q1  | q3  | q2",
        "    *q2  | q2  | q2",
        "     q3  | q3  | q3  (Trap State)",
        "Processing Test String w = '0101' using δ̂:",
        "• δ̂(q0, ε) = q0 → δ̂(q0, '0') = q1 → δ̂(q0, '01') = q2 → δ̂(q0, '010') = q2 → δ̂(q0, '0101') = q2 ∈ F ⇒ ACCEPTED!",
        "Processing Rejected String w = '1010' using δ̂:",
        "• δ̂(q0, '1') = q3 (Trap state) → δ̂(q0, '1010') = q3 ∉ F ⇒ REJECTED!"
      ],
      explanation: "If the first character is '1', the DFA moves directly to dead state q3 and stays there forever. If the prefix is '01', it enters accepting state q2 and loops for all remaining symbols.",
      dfaExample: {
        title: "DFA: Begins with '01'",
        states: ["q0", "q1", "q2", "q3"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
          { from: "q0", symbol: "0", to: "q1" },
          { from: "q0", symbol: "1", to: "q3" },
          { from: "q1", symbol: "0", to: "q3" },
          { from: "q1", symbol: "1", to: "q2" },
          { from: "q2", symbol: "0", to: "q2" },
          { from: "q2", symbol: "1", to: "q2" },
          { from: "q3", symbol: "0", to: "q3" },
          { from: "q3", symbol: "1", to: "q3" }
        ],
        testString: "0101"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "nfa-def-extended-delta",
      title: "Nondeterministic Finite Automata (NFA) & Extended Transition Function",
      subtitle: "Section 2.3 - Formal 5-Tuple, Powerset Codomain & Language of NFA",
      bullets: [
        "Formal NFA 5-Tuple Definition: N = (Q, Σ, δ, q₀, F)",
        "• Q, Σ, q₀, F match DFA definitions.",
        "• δ: Q × Σ → 2^Q  (Transition function maps to a SUBSET of Q, allowed to be ∅ or multiple states).",
        "Extended Transition Function δ̂ for NFA (δ̂: Q × Σ* → 2^Q):",
        "• BASIS: δ̂(q, ε) = {q}",
        "• INDUCTION STEP: For string w = xa (where x ∈ Σ* and a ∈ Σ):",
        "  δ̂(q, xa) = ⋃_{p ∈ δ̂(q, x)} δ(p, a)",
        "Language Accepted by NFA N: L(N) = { w ∈ Σ* | δ̂(q₀, w) ∩ F ≠ ∅ }.",
        "Key Intuition: An NFA accepts string w if AT LEAST ONE computational path from q₀ on input w terminates in an accepting state in F."
      ],
      explanation: "While DFAs follow a single deterministic trajectory, NFAs explore multiple computational paths simultaneously in parallel.",
      codeSnippet: "NFA δ: Q × Σ → 2^Q  |  Acceptance condition: δ̂(q0, w) ∩ F ≠ ∅",
      interactiveType: "none"
    },
    {
      id: "nfa-dfa-subset-construction",
      title: "Equivalence of DFA and NFA: Subset Construction Algorithm",
      subtitle: "Section 2.3.1 & 2.3.2 - Lazy Reachable Subset Construction Method",
      bullets: [
        "Theorem 2.11 (Hopcroft & Ullman): A language L is accepted by an NFA if and only if L is accepted by some DFA.",
        "Subset Construction Algorithm (NFA N = (Q_N, Σ, δ_N, q₀_N, F_N) → DFA D = (Q_D, Σ, δ_D, q₀_D, F_D)):",
        "1. DFA Start State: q₀_D = {q₀_N}.",
        "2. DFA State Set Q_D: Subsets of Q_N reachable from q₀_D.",
        "3. DFA Transition Function: For composite state S ⊆ Q_N and a ∈ Σ:",
        "   δ_D(S, a) = ⋃_{p ∈ S} δ_N(p, a).",
        "4. DFA Final States: F_D = { S ⊆ Q_N | S ∩ F_N ≠ ∅ } (Any subset containing at least one NFA final state).",
        "Worked Example: Converting NFA accepting strings ending in '01' to DFA."
      ],
      explanation: "Subset construction maps the non-deterministic set of active NFA states into single composite DFA states.",
      dfaExample: {
        title: "NFA: Ends with '01'",
        states: ["q0", "q1", "q2"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q0" },
          { from: "q0", symbol: "0", to: "q1" },
          { from: "q1", symbol: "1", to: "q2" }
        ],
        testString: "1001",
        convertedDfa: {
          title: "Converted DFA via Subset Construction",
          states: ["{q0}", "{q0,q1}", "{q0,q2}"],
          alphabet: ["0", "1"],
          startState: "{q0}",
          acceptStates: ["{q0,q2}"],
          transitions: [
            { from: "{q0}", symbol: "0", to: "{q0,q1}" },
            { from: "{q0}", symbol: "1", to: "{q0}" },
            { from: "{q0,q1}", symbol: "0", to: "{q0,q1}" },
            { from: "{q0,q1}", symbol: "1", to: "{q0,q2}" },
            { from: "{q0,q2}", symbol: "0", to: "{q0,q1}" },
            { from: "{q0,q2}", symbol: "1", to: "{q0}" }
          ],
          testString: "1001"
        }
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "nfa-subset-worst-case",
      title: "Worst Case for Subset Construction: Exponential State Explosion",
      subtitle: "Sections 2.3.1, 2.3.2 & 2.3.3 - The n-th Symbol from the End (Ullman Textbook)",
      bullets: [
        "Problem Statement: Consider the language L_n over Σ = {0, 1} where the n-th character from the right (end) is '1'.",
        "NFA State Complexity: Requires only n + 1 states!",
        "• States: q0 (looping start state), q1, q2, ..., qn (final state).",
        "• Transition: δ(q0, 1) = {q0, q1}; δ(qi, 0) = δ(qi, 1) = {q_{i+1}} for i ≥ 1.",
        "DFA State Complexity: REQUIRES EXACTLY 2^n STATES!",
        "• Why 2^n States? To decide whether the symbol n steps ago was a '1', a deterministic automaton MUST memorize every possible binary string of length n.",
        "• For n = 3 (3rd symbol from end is '1'): NFA needs 4 states, but DFA requires 2^3 = 8 states ({000}, {001}, {010}, ..., {111}).",
        "• For n = 10: NFA needs 11 states, while DFA requires 2^10 = 1,024 states!",
        "Conclusion: Demonstrates that the worst-case space bound |Q_D| = 2^|Q_N| is strictly tight!"
      ],
      explanation: "This classic example from Hopcroft & Ullman proves that NFAs can be exponentially more succinct than DFAs for certain languages.",
      codeSnippet: "Language Ln: n-th symbol from right is 1  ⇒  NFA: n+1 states  |  DFA: 2^n states!",
      interactiveType: "none"
    },
    {
      id: "enfa-closure-delta",
      title: "ε-NFA: Formal Definition, ε-Closure & Extended Transition Function",
      subtitle: "Section 2.4 - Inductive Basis & Conversion to DFA (Ullman Textbook)",
      bullets: [
        "Formal ε-NFA Definition: E = (Q, Σ, δ, q₀, F) where δ: Q × (Σ ∪ {ε}) → 2^Q.",
        "ε-Closure Definition (ECLOSE(q)): The set of all states reachable from q taking ZERO or more ε-transitions.",
        "• BASIS: q ∈ ECLOSE(q)  (Every state is in its own ε-closure).",
        "• INDUCTION STEP: If p ∈ ECLOSE(q) and r ∈ δ(p, ε), then r ∈ ECLOSE(q).",
        "Extended Transition Function δ̂ for ε-NFA:",
        "• BASIS: δ̂(q, ε) = ECLOSE(q)",
        "• INDUCTION STEP: For w = xa (x ∈ Σ*, a ∈ Σ):",
        "  δ̂(q, xa) = ECLOSE( ⋃_{p ∈ δ̂(q, x)} δ(p, a) )",
        "Converting ε-NFA to DFA:",
        "1. DFA Start state: q₀_D = ECLOSE(q₀_N).",
        "2. For composite state S and a ∈ Σ: δ_D(S, a) = ECLOSE( ⋃_{p ∈ S} δ_N(p, a) ).",
        "3. Final States F_D: Any composite state S where S ∩ F_N ≠ ∅."
      ],
      explanation: "Epsilon closures group states that are reachable instantaneously without consuming input symbols.",
      codeSnippet: "ECLOSE(q): Basis q ∈ ECLOSE(q)  |  Induction: p ∈ ECLOSE(q), r ∈ δ(p, ε) ⇒ r ∈ ECLOSE(q)",
      interactiveType: "none"
    },
    {
      id: "fa-app-text-search",
      title: "Applications of FA: Section 2.5.1 Text Searching",
      subtitle: "Keyword Matching, Pattern Recognition & Aho-Corasick Algorithm",
      bullets: [
        "Text Searching Problem: Find all occurrences of a keyword (or set of keywords) K within a large text document T of length m.",
        "DFA Approach: Construct a pattern matching DFA for keyword K (e.g., K = 'web' or 'ebay').",
        "• States: Represent longest matching prefix of K seen so far.",
        "• Execution: Scan document text character by character in linear time O(m).",
        "• Performance: Processing requires only 1 state transition per text character — independent of keyword length!",
        "Aho-Corasick Algorithm: Multi-pattern text searching DFA used in Unix `grep`, antivirus scanning, and web search engines to search millions of strings simultaneously."
      ],
      explanation: "DFA-based text search achieves optimal O(m) execution speed by compiling search patterns into deterministic lookup tables.",
      codeSnippet: "Pattern DFA: State = Matched Prefix  |  Text Scan Time = O(|Text|) linear efficiency",
      interactiveType: "none"
    },
    {
      id: "fa-app-web-crawlers",
      title: "Applications of FA: Section 2.5.2 Web Crawlers & HTML Parsing",
      subtitle: "URL Pipeline Modeling & HTTP Status Code State Machines",
      bullets: [
        "Web Crawler URL Pipeline as a Finite State Machine:",
        "1. Discovered State: URL added to frontier queue.",
        "2. Fetching State: Issuing HTTP GET request.",
        "3. Processing State: Parsing HTML DOM and extracting new hyperlinks.",
        "4. Indexed / Dead State: Document stored, URL marked visited.",
        "HTTP Response Code Finite State Classifier:",
        "• State 2xx (Success): Parse document body.",
        "• State 3xx (Redirect): Follow Location header to new URL state.",
        "• State 4xx/5xx (Client/Server Error): Log error and transition to Retry or Dead state."
      ],
      explanation: "Web crawlers use state machine architectures to robustly manage millions of asynchronous web requests and error recovery paths.",
      codeSnippet: "URL States: Discovered ➔ Fetching ➔ Parsing ➔ Indexed  |  HTTP 2xx/3xx/4xx Handlers",
      interactiveType: "none"
    },
    {
      id: "fa-app-regex-automata",
      title: "Applications of FA: Section 2.5.3 Regular Expressions to Automata",
      subtitle: "Thompson's Construction Algorithm (Regex ➔ ε-NFA ➔ DFA)",
      bullets: [
        "Thompson's Structural Construction: Inductively converts any Regular Expression into an equivalent ε-NFA:",
        "1. Symbol a ∈ Σ: Two states (q0 ──a──> q1).",
        "2. Empty String ε: Two states (q0 ──ε──> q1).",
        "3. Union (r1 + r2): New start state with ε-branches to r1 and r2; ε-branches to single new final state.",
        "4. Concatenation (r1 r2): Connect r1 final state to r2 start state via ε.",
        "5. Kleene Star (r*): Add ε feedback loop from r final state to r start state, plus ε bypass path.",
        "Pipeline in Regex Engines: Regular Expression ──[Thompson]──> ε-NFA ──[Subset Const.]──> DFA ──[Minimization]──> Optimized Code."
      ],
      explanation: "Thompson's algorithm guarantees that every regular expression can be automatically compiled into an executable state machine.",
      codeSnippet: "Regex (r1 + r2)* ➔ Thompson ε-NFA ➔ Subset Construction DFA ➔ Fast Execution Engine",
      interactiveType: "none"
    },
    {
      id: "fa-app-moore-mealy",
      title: "Applications of FA: Section 2.5.4 Moore and Mealy Machines",
      subtitle: "Finite State Transducers with Output (Ullman Textbook)",
      bullets: [
        "Finite State Transducers: State machines that produce an output string over output alphabet Γ.",
        "1. Moore Machine: Output function λ: Q → Γ is associated DIRECTLY with states.",
        "   • Formal 6-Tuple: M = (Q, Σ, Γ, δ, λ, q₀).",
        "   • Example: Modulo 3 residue classifier (State q0 outputs '0', q1 outputs '1', q2 outputs '2').",
        "2. Mealy Machine: Output function λ: Q × Σ → Γ is associated with TRANSITIONS.",
        "   • Formal 6-Tuple: M = (Q, Σ, Γ, δ, λ, q₀).",
        "   • Example: 2's complement serial binary adder / Edge detector.",
        "Equivalence: Every Moore machine can be converted to an equivalent Mealy machine and vice-versa!"
      ],
      explanation: "Moore outputs depend solely on the current state, whereas Mealy outputs react immediately to input transitions.",
      codeSnippet: "Moore λ(q) ∈ Γ (State-bound output)  |  Mealy λ(q, a) ∈ Γ (Transition-bound output)",
      interactiveType: "none"
    },
    {
      id: "fa-app-lexical-protocols",
      title: "Applications of FA: Section 2.5.5 Lexical Analysis & Protocol Verification",
      subtitle: "Compiler Tokenizers (Lex/Flex) & Network Protocol Safety",
      bullets: [
        "Lexical Analysis in Compilers (Lex / Flex):",
        "• First phase of a compiler converts source code text into token streams (Keywords `if`, `while`, Identifiers `varX`, Numbers `42`).",
        "• Lex specifies token patterns using Regular Expressions, which are compiled into parallel DFAs for max tokenization speed.",
        "Network Protocol Verification (TCP & Security Protocols):",
        "• Modeling protocols as Finite State Machines (e.g., TCP States: CLOSED, LISTEN, SYN_SENT, SYN_RCVD, ESTABLISHED, FIN_WAIT).",
        "• Formal Verification: Graph traversal algorithms verify that the protocol CANNOT reach invalid states, deadlock states, or unauthorized security states."
      ],
      explanation: "DFAs power both compiler frontends for rapid programming language tokenization and formal safety verification of network protocols.",
      codeSnippet: "Source Code ➔ Lexer DFA ➔ Token Stream (IF, IDENT, NUMBER)  |  TCP Protocol FSM Verification",
      interactiveType: "none"
    },
    {
      id: "slide-7",
      title: "Structural Representations for Finite Automata Summary",
      subtitle: "Module 1.4.1 - Summary Comparison",
      bullets: [
        "As outlined by Hopcroft, Motwani, & Ullman, finite automata can be represented in 3 major structural forms:",
        "1. Transition Graphs (Diagrams): Visual nodes representing states (q₀ initial, double circles for final F) and directed edges labeled with alphabet symbols.",
        "2. Transition Tables: 2D tabular matrices mapping current states (rows) and input symbols (columns) to next states (cells). Ideal for algorithmic lookup.",
        "3. Grammars / Regular Expressions: Algebraic production rules (e.g., A → aB, A → ε) specifying how valid strings are syntactically generated."
      ],
      explanation: "Structural representations allow automata to be studied visually, implemented efficiently in software tables, or analyzed algebraically via grammars.",
      codeSnippet: "Graph (Visual) ⟷ Table (Algorithmic) ⟷ Grammar (Algebraic)",
      interactiveType: "none"
    },
    {
      id: "slide-8",
      title: "Deterministic Finite Automata (DFA)",
      subtitle: "Module 1.5 - Formal Definition",
      bullets: [
        "Deterministic Finite Automaton (DFA / DFSM): Exactly one transition per symbol from each state.",
        "Formal 5-Tuple M = (Q, Σ, δ, q₀, F):",
        "• Q: Finite set of states",
        "• Σ: Input alphabet",
        "• q₀ ∈ Q: Initial state",
        "• F ⊆ Q: Final / accepting states",
        "• δ: Transition function Q × Σ → Q"
      ],
      explanation: "DFAs represent state machines with absolute determinism: given a current state and input symbol, the next state is uniquely determined.",
      codeSnippet: "δ: Q × Σ → Q  (Every state has exactly |Σ| outgoing transitions)",
      interactiveType: "transition-table"
    },
    {
      id: "slide-9",
      title: "DFA Design: Ends with 'ab'",
      subtitle: "Interactive DFA Execution",
      bullets: [
        "Problem: Design a DFA over Σ = {a, b} accepting strings ending with 'ab'.",
        "• q0: Initial state (waiting for 'a')",
        "• q1: Saw 'a' (waiting for 'b')",
        "• q2: Accepting state (ended with 'ab')",
        "Test this state machine with sample strings below!"
      ],
      explanation: "State q1 memorizes that the last read symbol was 'a'. If 'b' follows, we transition to accepting state q2.",
      dfaExample: {
        title: "DFA: Ends with 'ab'",
        states: ["q0", "q1", "q2"],
        alphabet: ["a", "b"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
          { from: "q0", symbol: "a", to: "q1" },
          { from: "q0", symbol: "b", to: "q0" },
          { from: "q1", symbol: "a", to: "q1" },
          { from: "q1", symbol: "b", to: "q2" },
          { from: "q2", symbol: "a", to: "q1" },
          { from: "q2", symbol: "b", to: "q0" }
        ],
        testString: "abab"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "slide-10",
      title: "DFA Design: Even vs Odd Number of 1s",
      subtitle: "Parity Checker State Machine",
      bullets: [
        "Problem 1: DFA over Σ = {0, 1} accepting even number of 1s (q0 accepting).",
        "Problem 2: DFA over Σ = {0, 1} accepting odd number of 1s:",
        "• q0: Even count of 1s (Non-accepting)",
        "• q1: Odd count of 1s (Accepting state F = {q1})",
        "• Transition on '0': Stay in current parity. Transition on '1': Flip parity."
      ],
      explanation: "Parity checking switches between even and odd states upon encountering each '1'.",
      dfaExample: {
        title: "DFA: Odd Number of 1s",
        states: ["q0", "q1"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q1"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" },
          { from: "q1", symbol: "0", to: "q1" },
          { from: "q1", symbol: "1", to: "q0" }
        ],
        testString: "1011"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "slide-11",
      title: "DFA Design: Ends with '101'",
      subtitle: "Suffix Pattern Matching",
      bullets: [
        "Problem: Design a DFA over Σ = {0, 1} accepting strings ending with '101'.",
        "• q0: Start state (saw nothing or last was '0')",
        "• q1: Saw '1'",
        "• q2: Saw '10'",
        "• q3: Accepting state (saw '101') - ends with target suffix!"
      ],
      explanation: "Suffix DFAs keep track of the exact matching prefix suffix window of length 3.",
      dfaExample: {
        title: "DFA: Ends with '101'",
        states: ["q0", "q1", "q2", "q3"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q3"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" },
          { from: "q1", symbol: "0", to: "q2" },
          { from: "q1", symbol: "1", to: "q1" },
          { from: "q2", symbol: "0", to: "q0" },
          { from: "q2", symbol: "1", to: "q3" },
          { from: "q3", symbol: "0", to: "q2" },
          { from: "q3", symbol: "1", to: "q1" }
        ],
        testString: "110101"
      },
      interactiveType: "dfa-runner"
    },
    {
    "id": "dfa-prob-sub101",
    "title": "Problem: Substring '101'",
    "subtitle": "Pattern Matching Automaton",
    "bullets": [
        "Requirement: Accept strings containing the sequence '101'.",
        "States track progress: q0 (none), q1 (saw '1'), q2 (saw '10').",
        "Trap state: q3 is permanently accepting once '101' is seen."
    ],
    "explanation": "Overlapping sequences must be carefully tracked. In q1 (saw '1'), seeing another '1' keeps the machine in q1 because it could be the start of a new '101'.",
    "dfaExample": {
        "title": "DFA: Substring '101'",
        "states": [
            "q0",
            "q1",
            "q2",
            "q3"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "q0",
        "acceptStates": [
            "q3"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q1"
            },
            {
                "from": "q2",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q2",
                "symbol": "1",
                "to": "q3"
            },
            {
                "from": "q3",
                "symbol": "0",
                "to": "q3"
            },
            {
                "from": "q3",
                "symbol": "1",
                "to": "q3"
            }
        ],
        "testString": "000011100"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-odd0",
    "title": "Problem: Odd Number of 0s",
    "subtitle": "DFA Tracking Parity",
    "bullets": [
        "Requirement: The string must contain an odd number of '0's.",
        "State q0 (Even 0s) is the start state.",
        "State q1 (Odd 0s) is the accept state. Input '0' toggles states, '1' loops."
    ],
    "explanation": "Parity problems require remembering whether a count is odd or even. A single transition back and forth acts like a toggle.",
    "dfaExample": {
        "title": "DFA: Odd number of 0s",
        "states": [
            "q0",
            "q1"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "q0",
        "acceptStates": [
            "q1"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q1"
            }
        ],
        "testString": "0101011000"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-even0",
    "title": "Problem: Even Number of 0s",
    "subtitle": "DFA Tracking Parity",
    "bullets": [
        "Requirement: The string must contain an even number of '0's.",
        "State q0 (Even 0s) is the start and accept state.",
        "Input '0' toggles states, '1' loops."
    ],
    "explanation": "This is identical to the Odd 0s DFA, except the accepting state is swapped back to the initial state (q0).",
    "dfaExample": {
        "title": "DFA: Even number of 0s",
        "states": [
            "q0",
            "q1"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "q0",
        "acceptStates": [
            "q0"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q1"
            }
        ],
        "testString": "010101100"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-odd1",
    "title": "Problem: Odd Number of 1s",
    "subtitle": "DFA Tracking Parity",
    "bullets": [
        "Requirement: The string must contain an odd number of '1's.",
        "State q0 (Even 1s) is the start state.",
        "State q1 (Odd 1s) is the accept state. Input '1' toggles states, '0' loops."
    ],
    "explanation": "A parity checker for '1's. The machine toggles its state every time a '1' is encountered.",
    "dfaExample": {
        "title": "DFA: Odd number of 1s",
        "states": [
            "q0",
            "q1"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "q0",
        "acceptStates": [
            "q1"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q0"
            }
        ],
        "testString": "01100111"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-even1",
    "title": "Problem: Even Number of 1s",
    "subtitle": "DFA Tracking Parity",
    "bullets": [
        "Requirement: The string must contain an even number of '1's.",
        "State q0 (Even 1s) is the start and accept state.",
        "Input '1' toggles states, '0' loops."
    ],
    "explanation": "This is identical to the Odd 1s DFA, except the accepting state is swapped back to the initial state (q0).",
    "dfaExample": {
        "title": "DFA: Even number of 1s",
        "states": [
            "q0",
            "q1"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "q0",
        "acceptStates": [
            "q0"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q0"
            }
        ],
        "testString": "1111"
    },
    "interactiveType": "dfa-runner"
},
{
      id: "slide-12",
      title: "DFA Design: Divisible by 5 (Binary)",
      subtitle: "Modular Arithmetic Automaton",
      bullets: [
        "Requirement: The binary value must be a multiple of 5.",
        "Formula for next state: New Remainder = (2 × r + b) mod 5. (Radix = 2 since alphabet is binary).",
        "States represent remainders (I = 0,1,2,3,4):",
        "• q0 → remainder 0 → Start and Final state",
        "• q1 → remainder 1, q2 → remainder 2, q3 → remainder 3, q4 → remainder 4",
        "Start q0: 2×0+0 mod 5 = 0 → q0 | 2×0+1 mod 5 = 1 → q1",
        "Next q1: 2×1+0 mod 5 = 2 → q2 | 2×1+1 mod 5 = 3 → q3",
        "Next q2: 2×2+0 mod 5 = 4 → q4 | 2×2+1 mod 5 = 0 → q0",
        "Next q3: 2×3+0 mod 5 = 1 → q1 | 2×3+1 mod 5 = 2 → q2",
        "Next q4: 2×4+0 mod 5 = 3 → q3 | 2×4+1 mod 5 = 4 → q4"
      ],
      explanation: "This state machine effectively calculates the remainder of a binary number modulo 5 as it reads it from left to right. Since 5 states cover all possible remainders (0-4), the machine successfully tracks the exact modulo value at each step.",
      dfaExample: {
        title: "DFA: Binary Divisible by 5",
        states: ["q0", "q1", "q2", "q3", "q4"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q0"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" },
          { from: "q1", symbol: "0", to: "q2" },
          { from: "q1", symbol: "1", to: "q3" },
          { from: "q2", symbol: "0", to: "q4" },
          { from: "q2", symbol: "1", to: "q0" },
          { from: "q3", symbol: "0", to: "q1" },
          { from: "q3", symbol: "1", to: "q2" },
          { from: "q4", symbol: "0", to: "q3" },
          { from: "q4", symbol: "1", to: "q4" }
        ],
        testString: "1010"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "slide-13",
      title: "DFA Design: Ends with '10'",
      subtitle: "Binary Suffix Recognizer",
      bullets: [
        "Problem: Design a DFA over Σ = {0, 1} accepting binary strings ending with '10'.",
        "• q0: Initial state (last bit was 0 or empty)",
        "• q1: Saw '1' (waiting for '0')",
        "• q2: Accepting state (ended with '10')"
      ],
      explanation: "Simple 3-state machine recognizing the binary suffix '10'.",
      dfaExample: {
        title: "DFA: Ends with '10'",
        states: ["q0", "q1", "q2"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" },
          { from: "q1", symbol: "0", to: "q2" },
          { from: "q1", symbol: "1", to: "q1" },
          { from: "q2", symbol: "0", to: "q0" },
          { from: "q2", symbol: "1", to: "q1" }
        ],
        testString: "11010"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "slide-14",
      title: "DFA Design: Divisible by 3 (Binary)",
      subtitle: "Remainder Automaton for Binary Value Mod 3",
      bullets: [
        "Requirement: The binary value must be a multiple of 3.",
        "Formula for next state: New Remainder = (2 × r + b) mod 3. (Radix = 2 since alphabet is binary).",
        "States represent remainders (I = 0,1,2):",
        "• q0 → remainder 0 → Start and Final state",
        "• q1 → remainder 1, q2 → remainder 2",
        "Start q0: 2×0+0 mod 3 = 0 → q0 | 2×0+1 mod 3 = 1 → q1",
        "Next q1: 2×1+0 mod 3 = 2 → q2 | 2×1+1 mod 3 = 0 → q0",
        "Next q2: 2×2+0 mod 3 = 1 → q1 | 2×2+1 mod 3 = 2 → q2"
      ],
      explanation: "Arithmetic state machines compute numeric properties directly from bit streams. With exactly 3 states representing all possible remainders, it correctly determines divisibility by 3.",
      dfaExample: {
        title: "DFA: Binary Divisible by 3",
        states: ["q0", "q1", "q2"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q0"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" },
          { from: "q1", symbol: "0", to: "q2" },
          { from: "q1", symbol: "1", to: "q0" },
          { from: "q2", symbol: "0", to: "q1" },
          { from: "q2", symbol: "1", to: "q2" }
        ],
        testString: "110" // 6 in decimal is divisible by 3
      },
      interactiveType: "dfa-runner"
    },
    {
    "id": "dfa-prob-sub-aa",
    "title": "Problem: Substring 'aa'",
    "subtitle": "Pattern Matching",
    "bullets": [
        "Requirement: Accept strings over {a,b} containing the sequence 'aa'.",
        "q0: Start state (no 'a' seen yet).",
        "q1: Saw one 'a'. If 'b' is seen, reset to q0.",
        "q2: Trap accepting state. Once 'aa' is seen, stay here forever."
    ],
    "explanation": "Simple substring match. Since we only care if 'aa' appears anywhere, we use a trap state (q2) to accept the string regardless of what follows.",
    "dfaExample": {
        "title": "DFA: Substring 'aa'",
        "states": [
            "q0",
            "q1",
            "q2"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q2"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q2",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q2",
                "symbol": "b",
                "to": "q2"
            }
        ],
        "testString": "ababaabb"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-theory-complement",
    "title": "Complement of a Language & DFA Construction",
    "subtitle": "Closure Properties & Inverting Final States",
    "bullets": [
        "Language Complement (L̄): For a language L ⊆ Σ*, its complement L̄ = Σ* - L consists of all strings over Σ NOT in L.",
        "Closure Under Complementation: Regular languages are closed under complementation. If L is regular, L̄ is also regular.",
        "Complement DFA Construction Algorithm:",
        "1. Ensure Complete DFA: The original DFA M = (Q, Σ, δ, q₀, F) must be complete (every state has a defined transition for every symbol a ∈ Σ).",
        "2. Swap Accepting & Non-Accepting States: Define new final states F' = Q \\ F.",
        "3. Preserve Machine Structure: States Q, start state q₀, and transition function δ remain completely unchanged!"
    ],
    "explanation": "Because a complete DFA is strictly deterministic, a string w lands on a unique state q. If q ∈ F in M, w ∈ L. In M', q ∉ F', so w ∉ L̄. Conversely, if q ∉ F in M, w ∉ L, but q ∈ F' in M', so w ∈ L̄. Thus M' accepts exactly L̄.",
    "codeSnippet": "Original DFA M = (Q, Σ, δ, q0, F) ⇒ Complement DFA M' = (Q, Σ, δ, q0, Q \\ F)",
    "interactiveType": "none"
},
{
    "id": "dfa-prob-comp-aa",
    "title": "Problem: Complement DFA (NOT Containing 'aa')",
    "subtitle": "Inverting 'Substring aa' Automaton",
    "bullets": [
        "Requirement: Accept all strings over Σ = {a, b} that DO NOT contain 'aa' as a substring.",
        "Step 1: Start with complete DFA for 'Contains aa' (q0: no 'a', q1: saw 'a', q2: saw 'aa' trap).",
        "Step 2: Invert Accepting States F = {q2} ⇒ New Accepting States F' = {q0, q1}.",
        "State Roles in Complement Machine M':",
        "• q0 (Accepting): Safe state (no trailing 'a'). Accepts ε, 'b', 'ab', 'bab'.",
        "• q1 (Accepting): Safe state (saw single 'a'). Accepts 'a', 'ba', 'aba'.",
        "• q2 (Non-accepting): Trap state! Entered upon seeing 'aa' — permanently rejects!"
    ],
    "explanation": "Notice how swapping accepting and non-accepting states instantly transforms a pattern recognizer (contains 'aa') into a constraint validator (does NOT contain 'aa'). Try testing strings like 'ababa' (accepted) vs 'aab' (rejected).",
    "dfaExample": {
        "title": "Complement DFA: NOT containing 'aa'",
        "states": [
            "q0",
            "q1",
            "q2"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q0",
            "q1"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q2",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q2",
                "symbol": "b",
                "to": "q2"
            }
        ],
        "testString": "ababa"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-exact-aa",
    "title": "Problem: Exactly 'aa'",
    "subtitle": "Strict Length and Pattern Matching",
    "bullets": [
        "Requirement: Accept exactly the string 'aa' and nothing else.",
        "q0 -> q1 -> q2 forms the exact path for 'aa'.",
        "q3 is a dead/trap state. Any 'b' or any character after 'aa' sends the machine to q3."
    ],
    "explanation": "When matching exactly one specific string, all deviations from the intended path must lead to a dead state (q3) from which the machine can never escape.",
    "dfaExample": {
        "title": "DFA: Exactly 'aa'",
        "states": [
            "q0",
            "q1",
            "q2",
            "q3"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q2"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q3"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q3"
            },
            {
                "from": "q2",
                "symbol": "a",
                "to": "q3"
            },
            {
                "from": "q2",
                "symbol": "b",
                "to": "q3"
            },
            {
                "from": "q3",
                "symbol": "a",
                "to": "q3"
            },
            {
                "from": "q3",
                "symbol": "b",
                "to": "q3"
            }
        ],
        "testString": "abaa"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-div5-nozero",
    "title": "Problem: Divisible by 5 (No Leading Zeros)",
    "subtitle": "Modulo Arithmetic with Prefix Constraints",
    "bullets": [
        "Requirement: Binary string divisible by 5 AND must not start with '0'.",
        "We use a new initial state 'qs'.",
        "If '0' is read first, it goes to 'qtrap' (rejected).",
        "If '1' is read first, it goes to 'q1' (value 1) and resumes standard modulo 5 tracking."
    ],
    "explanation": "This combines a prefix requirement ('must start with 1') with a modulo requirement ('divisible by 5'). By decoupling the start state (qs) from the remainder 0 state (q0), we can uniquely handle the first character.",
    "dfaExample": {
        "title": "DFA: Div 5, Starts with '1'",
        "states": [
            "qs",
            "q0",
            "q1",
            "q2",
            "q3",
            "q4",
            "qtrap"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "qs",
        "acceptStates": [
            "q0"
        ],
        "transitions": [
            {
                "from": "qs",
                "symbol": "0",
                "to": "qtrap"
            },
            {
                "from": "qs",
                "symbol": "1",
                "to": "q1"
            },
            {
                "from": "qtrap",
                "symbol": "0",
                "to": "qtrap"
            },
            {
                "from": "qtrap",
                "symbol": "1",
                "to": "qtrap"
            },
            {
                "from": "q0",
                "symbol": "0",
                "to": "q0"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q3"
            },
            {
                "from": "q2",
                "symbol": "0",
                "to": "q4"
            },
            {
                "from": "q2",
                "symbol": "1",
                "to": "q0"
            },
            {
                "from": "q3",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q3",
                "symbol": "1",
                "to": "q2"
            },
            {
                "from": "q4",
                "symbol": "0",
                "to": "q3"
            },
            {
                "from": "q4",
                "symbol": "1",
                "to": "q4"
            }
        ],
        "testString": "101"
    },
    "interactiveType": "dfa-runner"
},
{
    "id": "dfa-prob-1-2",
    "title": "Problem 2: Ends with '011'",
    "subtitle": "DFA tracking progress towards a suffix",
    "bullets": [
        "Requirement: The string must end with the sequence '011'.",
        "States represent how much of the suffix we have currently matched.",
        "q0: nothing matched. q1: matched '0'. q2: matched '01'. q3: matched '011'."
    ],
    "explanation": "When matching a suffix, any mismatch must send us back to the appropriate partial match state. For example, if we are in q2 (matched '01') and see a '0', we go to q1 (matched '0'), not q0.",
    "dfaExample": {
        "title": "DFA: Ends with '011'",
        "states": [
            "q0",
            "q1",
            "q2",
            "q3"
        ],
        "alphabet": [
            "0",
            "1"
        ],
        "startState": "q0",
        "acceptStates": [
            "q3"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "1",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "1",
                "to": "q2"
            },
            {
                "from": "q2",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q2",
                "symbol": "1",
                "to": "q3"
            },
            {
                "from": "q3",
                "symbol": "0",
                "to": "q1"
            },
            {
                "from": "q3",
                "symbol": "1",
                "to": "q0"
            }
        ],
        "testString": "10011"
    }
},
{
    "id": "dfa-prob-1-3",
    "title": "Problem 3: Substring 'aa'",
    "subtitle": "DFA trapping on a substring match",
    "bullets": [
        "Requirement: The string must contain 'aa' somewhere.",
        "States: q0 (start), q1 (saw one 'a'), q2 (saw 'aa' - trap/accept state)."
    ],
    "explanation": "Once the machine sees 'aa', it enters q2. Since the condition 'contains aa' is now permanently satisfied, q2 loops to itself on all inputs (a trap state).",
    "dfaExample": {
        "title": "DFA: Substring 'aa'",
        "states": [
            "q0",
            "q1",
            "q2"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q2"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q2",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q2",
                "symbol": "b",
                "to": "q2"
            }
        ],
        "testString": "bbaab"
    }
},
{
    "id": "dfa-prob-1-4",
    "title": "Problem 4: At least one 'a'",
    "subtitle": "DFA ensuring minimum occurrence",
    "bullets": [
        "Requirement: The string must contain the character 'a' at least once.",
        "States: q0 (haven't seen 'a'), q1 (have seen 'a')."
    ],
    "explanation": "This is a simpler version of the substring problem. Once an 'a' is encountered, it transitions to the accepting state and stays there forever.",
    "dfaExample": {
        "title": "DFA: At least one 'a'",
        "states": [
            "q0",
            "q1"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q1"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q1"
            }
        ],
        "testString": "bbbba"
    }
},
{
    "id": "dfa-prob-1-5",
    "title": "Problem 5: Not more than 3 'a's",
    "subtitle": "DFA counting occurrences and dead states",
    "bullets": [
        "Requirement: The string can have 0, 1, 2, or 3 'a's, but no more.",
        "States: q0, q1, q2, q3 track the count of 'a's.",
        "State q4 is a Dead State (or Trap State) for strings that violate the condition."
    ],
    "explanation": "Counting up to a finite number N requires N+2 states (0 through N, plus a dead state for >N). Once in the dead state, the string can never be accepted.",
    "dfaExample": {
        "title": "DFA: Not more than 3 'a's",
        "states": [
            "q0",
            "q1",
            "q2",
            "q3",
            "q4"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q0",
            "q1",
            "q2",
            "q3"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q1"
            },
            {
                "from": "q2",
                "symbol": "a",
                "to": "q3"
            },
            {
                "from": "q2",
                "symbol": "b",
                "to": "q2"
            },
            {
                "from": "q3",
                "symbol": "a",
                "to": "q4"
            },
            {
                "from": "q3",
                "symbol": "b",
                "to": "q3"
            },
            {
                "from": "q4",
                "symbol": "a",
                "to": "q4"
            },
            {
                "from": "q4",
                "symbol": "b",
                "to": "q4"
            }
        ],
        "testString": "baabaaba"
    }
},
{
    "id": "dfa-prob-sub111",
    "title": "Problem 8: Substring '111'",
    "subtitle": "Consecutive Matches",
    "bullets": [
        "Requirement: Accept strings with three consecutive '1's.",
        "Progress states: q0, q1, q2.",
        "Trap state: q3 is permanently accepting once '111' is seen."
    ],
    "explanation": "Unlike '101', any '0' immediately breaks the sequence of '1's, forcing the DFA to completely reset to q0 from any non-accepting state.",
    "dfaExample": {
        "title": "DFA: Substring '111'",
        "states": ["q0", "q1", "q2", "q3"],
        "alphabet": ["0", "1"],
        "startState": "q0",
        "acceptStates": ["q3"],
        "transitions": [
            {"from": "q0", "symbol": "0", "to": "q0"},
            {"from": "q0", "symbol": "1", "to": "q1"},
            {"from": "q1", "symbol": "0", "to": "q0"},
            {"from": "q1", "symbol": "1", "to": "q2"},
            {"from": "q2", "symbol": "0", "to": "q0"},
            {"from": "q2", "symbol": "1", "to": "q3"},
            {"from": "q3", "symbol": "0", "to": "q3"},
            {"from": "q3", "symbol": "1", "to": "q3"}
        ],
        "testString": "000110111"
    },
    "interactiveType": "dfa-runner"
},
    {
    "id": "dfa-prob-2",
    "title": "DFA Design Problems (Set 2)",
    "subtitle": "Module 1 - Modulo & Start/End Constraints",
    "bullets": [
        "Problem 6: DFA containing 3 consecutive 0's ('000').",
        "Problem 7: DFA for strings over {0,1} beginning with '0' and ending with '1'. (Needs states to enforce both conditions).",
        "Problem 8: DFA for |w| mod 3 = 0 over {a,b}. (3 states representing remainders 0, 1, 2).",
        "Problem 8(ii): DFA for |w| mod 5 = 0. (5 states tracking length modulo 5)."
    ],
    "explanation": "Length constraints modulo N require exactly N states in a ring. Start/End conditions require combining prefixes and suffixes.",
    "codeSnippet": "Modulo N length: Q = {q0, q1, ... qN-1}, δ(qi, c) = q_{(i+1) mod N}, F = {q0}."
},
    {
    "id": "dfa-prob-3",
    "title": "DFA Design Problems (Set 3)",
    "subtitle": "Module 1 - Multiple Conditions",
    "bullets": [
        "Problem 9: DFA for strings with even number of 'a's AND odd number of 'b's. (4 states forming a grid).",
        "Problem 10: DFA for even number of 'a's and even number of 'b's. (4 states).",
        "Problem 11 & 12: DFA ending with 'abb' or ending with 'ab' or 'ba'.",
        "Problem 13: DFA for even length AND begins with '01'."
    ],
    "explanation": "Combining properties (like Even A AND Odd B) uses the Cartesian product of two smaller DFAs, resulting in states like (Even, Odd).",
    "dfaExample": {
        "title": "DFA: Even a's and Even b's (Problem 10)",
        "states": [
            "q0",
            "q1",
            "q2",
            "q3"
        ],
        "alphabet": [
            "a",
            "b"
        ],
        "startState": "q0",
        "acceptStates": [
            "q0"
        ],
        "transitions": [
            {
                "from": "q0",
                "symbol": "a",
                "to": "q1"
            },
            {
                "from": "q0",
                "symbol": "b",
                "to": "q2"
            },
            {
                "from": "q1",
                "symbol": "a",
                "to": "q0"
            },
            {
                "from": "q1",
                "symbol": "b",
                "to": "q3"
            },
            {
                "from": "q2",
                "symbol": "a",
                "to": "q3"
            },
            {
                "from": "q2",
                "symbol": "b",
                "to": "q0"
            },
            {
                "from": "q3",
                "symbol": "a",
                "to": "q2"
            },
            {
                "from": "q3",
                "symbol": "b",
                "to": "q1"
            }
        ],
        "testString": "abaabb"
    }
},
    {
      id: "slide-15",
      title: "DFA Design: Contains Substring '110'",
      subtitle: "Substring Pattern Search Automaton",
      bullets: [
        "Problem: Design a DFA over Σ = {0, 1} accepting strings containing substring '110'.",
        "• q0: Initial state (no part of '110' matched)",
        "• q1: Saw '1'",
        "• q2: Saw '11'",
        "• q3: Accepting trap state (saw '110' - stays in q3 for any subsequent symbol)."
      ],
      explanation: "Once the target substring '110' is found, the machine enters an accepting trap state.",
      dfaExample: {
        title: "DFA: Contains Substring '110'",
        states: ["q0", "q1", "q2", "q3"],
        alphabet: ["0", "1"],
        startState: "q0",
        acceptStates: ["q3"],
        transitions: [
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q0", symbol: "1", to: "q1" },
          { from: "q1", symbol: "0", to: "q0" },
          { from: "q1", symbol: "1", to: "q2" },
          { from: "q2", symbol: "0", to: "q3" },
          { from: "q2", symbol: "1", to: "q2" },
          { from: "q3", symbol: "0", to: "q3" },
          { from: "q3", symbol: "1", to: "q3" }
        ],
        testString: "011101"
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "slide-16",
      title: "ε-NFA (Epsilon Transition) Example",
      subtitle: "Module 1.6 - NFAs with ε-Transitions",
      bullets: [
        "ε-NFA Definition: Allows state transitions on empty input ε without consuming any characters from the input string.",
        "• State q0 transitions to q1 on ε (spontaneous move).",
        "• State q1 recognizes binary strings ending in '1'.",
        "• Transition Function: δ: Q × (Σ ∪ {ε}) → 2^Q.",
        "• Test this ε-NFA with sample strings below!"
      ],
      explanation: "Epsilon transitions enable machines to switch states instantly without reading input symbols, simplifying regex-to-NFA (Thompson's Construction) designs.",
      codeSnippet: "δ(q0, ε) = {q1}  |  δ(q1, 1) = {q1}",
      dfaExample: {
        title: "ε-NFA: Optional Prefix ending with '1'",
        states: ["q0", "q1", "q2"],
        alphabet: ["0", "1", "ε"],
        startState: "q0",
        acceptStates: ["q2"],
        transitions: [
          { from: "q0", symbol: "ε", to: "q1" }, // Epsilon transition
          { from: "q0", symbol: "0", to: "q0" },
          { from: "q1", symbol: "0", to: "q1" },
          { from: "q1", symbol: "1", to: "q1" },
          { from: "q1", symbol: "1", to: "q2" }
        ],
        testString: "01"
      },
      interactiveType: "dfa-runner"
    },
    
    
    
    


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
    },
{
      id: "slide-17",
      title: "NFA to DFA Conversion (Subset Construction)",
      subtitle: "Module 1.7 - Eliminating Non-Determinism",
      bullets: [
        "Steps in Subset Construction:",
        "1. Step 1: Compute ε-closure for all NFA states.",
        "2. Step 2: Find start state of DFA as ε-closure(q₀).",
        "3. Step 3: For each new composite state and each input symbol, compute union of transitions.",
        "4. Step 4: Identify all composite states containing NFA final states as DFA final states.",
        "5. Step 5: Construct final DFA transition table."
      ],
      explanation: "Subset construction systematically converts non-deterministic branching into deterministic composite states {q0, q1}.",
      codeSnippet: "DFA State = Set of NFA States  |  F_DFA = { S ⊆ Q_NFA | S ∩ F_NFA ≠ ∅ }",
      dfaExample: {
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
      },
      interactiveType: "dfa-runner"
    },
    
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
    },{
      id: "slide-18",
      title: "DFA Minimization (Table Filling Method)",
      subtitle: "Module 1.8 - Optimizing State Machines",
      bullets: [
        "Goal: Reduce the number of states in a DFA while preserving its accepted language.",
        "Steps for Minimization:",
        "1. Remove all states unreachable from the start state.",
        "2. Create a table of all state pairs (p, q).",
        "3. Mark all pairs (Final, Non-Final) as distinguishable (X).",
        "4. For remaining pairs, check transitions on each symbol. If they lead to a marked pair, mark current pair.",
        "5. Merge indistinguishable states into single equivalence classes."
      ],
      explanation: "Minimized DFAs have the theoretical minimum number of states, achieving maximum hardware and software execution efficiency.",
      codeSnippet: "Equivalence Classes: e.g., states C and D merged into [C, D]",
      dfaExample: {
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
      },
      interactiveType: "dfa-runner"
    },
    {
      id: "slide-19",
      title: "Regular Expressions & Grammars",
      subtitle: "Module 1.9 - Algebraic Pattern Matching",
      bullets: [
        "Regular Expressions (RE): Algebraic notation to describe regular languages.",
        "• Operators: Union (+), Concatenation (.), Kleene Star (*).",
        "• Example: [A-Z][a-z]* represents capitalized words.",
        "Grammars: Production rules generating strings of a language.",
        "• Chomsky Type-3 Grammars generate Regular Languages."
      ],
      explanation: "Regular expressions are widely used in text editors, compilers, and search engines for pattern recognition.",
      codeSnippet: "RE for binary strings ending in 1: (0 + 1)*1",
      interactiveType: "none"
    },
    {
      id: "slide-20",
      title: "Module 1 Mastery Quiz",
      subtitle: "Test Your Knowledge across All Topics",
      bullets: [
        "Review your understanding of Alphabets, DFAs, NFAs, Subset Construction, and Minimization.",
        "Take the interactive quiz below to test your exam readiness!"
      ],
      explanation: "Complete this quiz to verify your mastery of Module 1 Theory of Computation concepts.",
      interactiveType: "quiz"
    }
  ]
};

export const module1Quiz: QuizQuestion[] = [
  {
    id: "q0",
    question: "Consider a DFA over Σ = {0, 1} with start state q0 (accepting) and transition: δ(q0, 0) = q0, δ(q0, 1) = q1; δ(q1, 0) = q1, δ(q1, 1) = q0. Which string is accepted?",
    options: [
      "110",
      "101",
      "000",
      "1111"
    ],
    correctAnswer: 0,
    explanation: "q0 accepts even number of 1s (and odd 0s). String '110' has two 1s (even) and one 0, ending in q0 (accepting). '101' has two 1s but ends in q1 (odd)."
  },
  {
    id: "q1",
    question: "A DFA has states {q0, q1, q2} with start state q0 and accepting state q2. Transitions: q0 on 'a' goes to q1, q1 on 'b' goes to q2, q2 on 'a'/'b' loops to q2. Any 'a' before q0 loops. Which string is accepted?",
    options: [
      "ab",
      "ba",
      "aab",
      "aba"
    ],
    correctAnswer: 2,
    explanation: "State sequence for 'aab': q0 --a--> q1 --a--> q1 --b--> q2 (Accepting state q2 reached!)."
  },
  {
    id: "q2",
    question: "Consider a DFA recognizing binary strings ending with '10'. States: q0 (start), q1 (saw 1), q2 (accepting, saw 10). On input '110', what is the final state and is it accepted?",
    options: [
      "q0 (Rejected)",
      "q1 (Rejected)",
      "q2 (Accepted)",
      "Trap state (Rejected)"
    ],
    correctAnswer: 2,
    explanation: "Tracing '110': q0 --1--> q1 --1--> q1 --0--> q2 (Accepting state q2). Thus '110' is accepted."
  },
  {
    id: "q3",
    question: "In a DFA designed to accept binary strings divisible by 3 (states q0, q1, q2 with q0 accepting), which of the following binary strings lands on q0 (remainder 0)?",
    options: [
      "10 (Decimal 2)",
      "11 (Decimal 3)",
      "101 (Decimal 5)",
      "111 (Decimal 7)"
    ],
    correctAnswer: 1,
    explanation: "Binary '11' is decimal 3. 3 mod 3 = 0, which transitions to the accepting state q0."
  },
  {
    id: "q4",
    question: "Consider a DFA where state q3 is an accepting trap state for substring '110'. If the input string is '01101', does the machine accept?",
    options: [
      "Yes, because it contains '110' as a substring.",
      "No, because it ends in '1'.",
      "No, because '110' is not present.",
      "Yes, because the first bit is 0."
    ],
    correctAnswer: 0,
    explanation: "Once substring '110' is encountered, the DFA enters the accepting trap state q3 and stays there for all subsequent symbols ('1'). Hence '01101' is accepted."
  },
  {
    id: "q5",
    question: "What is the power set cardinality |2^A| of a set A = {a, b, c}?",
    options: [
      "3",
      "6",
      "8",
      "9"
    ],
    correctAnswer: 2,
    explanation: "|2^A| = 2^|A|. Since A has 3 elements (|A| = 3), the power set 2^A has 2^3 = 8 subsets (including ∅ and A itself)."
  },
  {
    id: "q6",
    question: "Given alphabet Σ = {a, b}, what is the length of the string w = 'aaba'?",
    options: [
      "3",
      "4",
      "5",
      "0"
    ],
    correctAnswer: 1,
    explanation: "The string length |w| is the total count of symbols in the string. 'aaba' contains 4 symbols."
  },
  {
    id: "q7",
    question: "In formal language theory, what is Kleene Star (Σ*) defined as?",
    options: [
      "The set of all finite-length strings over Σ including the empty string ε",
      "The set of all strings of length ≥ 1 over Σ",
      "The set of infinite-length strings over Σ",
      "The complement of set Σ"
    ],
    correctAnswer: 0,
    explanation: "Kleene Star Σ* represents the set of ALL finite strings formed by repeating symbols of Σ zero or more times, including ε."
  },
  {
    id: "q8",
    question: "How does Kleene Plus (Σ+) mathematically relate to Kleene Star (Σ*)?",
    options: [
      "Σ+ = Σ* ∪ {ε}",
      "Σ+ = Σ* - {ε}",
      "Σ+ = Σ* × Σ*",
      "Σ+ = 2^(Σ*)"
    ],
    correctAnswer: 1,
    explanation: "Kleene Plus contains strings of length 1 or more (Σ+ = Σ1 ∪ Σ2 ∪ ...), which is exactly Kleene Star excluding the empty string ε (Σ+ = Σ* - {ε})."
  },
  {
    id: "q9",
    question: "A Deterministic Finite Automaton (DFA) is formally defined as a 5-tuple M = (Q, Σ, δ, q₀, F). What is the domain and codomain of the transition function δ?",
    options: [
      "Q × Σ → 2^Q",
      "Q × Σ → Q",
      "Q × Q → Σ",
      "2^Q × Σ → Q"
    ],
    correctAnswer: 1,
    explanation: "In a DFA, δ maps a current state in Q and an input symbol in Σ to exactly one next state in Q (δ: Q × Σ → Q)."
  },
  {
    id: "q10",
    question: "What is the primary structural difference between a DFA and an Non-Deterministic Finite Automaton (NFA)?",
    options: [
      "A DFA allows multiple transitions on the same symbol, whereas an NFA allows only one.",
      "An NFA allows multiple next states (and ε-transitions) for a given state-symbol pair, whereas a DFA has exactly one deterministic next state.",
      "An NFA has an infinite number of states, whereas a DFA has a finite number.",
      "A DFA cannot accept the empty string ε."
    ],
    correctAnswer: 1,
    explanation: "NFAs permit transition function δ: Q × (Σ ∪ {ε}) → 2^Q, allowing multiple possible target states or spontaneous ε transitions."
  },
  {
    id: "q11",
    question: "Given set A = {1, 2} and set B = {x, y, z}, what is the total number of elements in the Cartesian product A × B?",
    options: [
      "5",
      "6",
      "8",
      "9"
    ],
    correctAnswer: 1,
    explanation: "|A × B| = |A| × |B|. Here |A| = 2 and |B| = 3, so total ordered pairs = 2 × 3 = 6."
  },
  {
    id: "q12",
    question: "In Subset Construction (converting an NFA to a DFA), if the NFA has n states, what is the maximum theoretical number of states in the resulting DFA?",
    options: [
      "n^2",
      "2^n",
      "2n",
      "n!"
    ],
    correctAnswer: 1,
    explanation: "Each DFA state represents a subset of the NFA's states. A set of n elements has 2^n total subsets in its power set."
  },
  {
    id: "q13",
    question: "What is an 'epsilon transition' (ε-transition) in an ε-NFA?",
    options: [
      "A state transition that occurs spontaneously without consuming any character from the input string",
      "A transition that resets the entire machine back to the initial state q0",
      "A transition that reads the entire string in a single step",
      "A transition that occurs only when reaching the end of the input string"
    ],
    correctAnswer: 0,
    explanation: "ε-transitions allow an NFA to move to a new state without consuming any input character from the input tape."
  },
  {
    id: "q14",
    question: "In DFA Minimization using the Table Filling Method (Myhill-Nerode Theorem), two states p and q are initially marked as distinguishable if:",
    options: [
      "Both p and q are accepting states",
      "Neither p nor q is an accepting state",
      "One state is an accepting state (p ∈ F) and the other is a non-accepting state (q ∉ F)",
      "Both p and q have transitions to the start state"
    ],
    correctAnswer: 2,
    explanation: "Basis step: Any pair consisting of one accepting state and one non-accepting state is immediately distinguishable because ε separates them."
  },
  {
    id: "q15",
    question: "What is a 'dead state' (or 'trap state') in a DFA?",
    options: [
      "A state that has no outgoing transitions",
      "A non-accepting state from which all transitions lead back to itself on every input symbol",
      "The initial state q0 when it has no incoming transitions",
      "A state that causes an immediate runtime error"
    ],
    correctAnswer: 1,
    explanation: "A dead/trap state is a non-accepting state that loops to itself on all input symbols (δ(d, a) = d for all a ∈ Σ), making acceptance impossible once entered."
  },
  {
    id: "q16",
    question: "Which of the following Regular Expressions represents all binary strings over Σ = {0, 1} that end with '1'?",
    options: [
      "1(0 + 1)*",
      "(0 + 1)*1",
      "(0 + 1)1*",
      "0*1*"
    ],
    correctAnswer: 1,
    explanation: "(0 + 1)* represents any arbitrary binary string prefix, and appending '1' ensures the string ends with '1'."
  },
  {
    id: "q17",
    question: "If a language L over Σ = {a, b} consists of all strings with an even length, which language class in the Chomsky hierarchy does L belong to?",
    options: [
      "Regular Language",
      "Context-Free but not Regular",
      "Context-Sensitive but not Context-Free",
      "Recursively Enumerable only"
    ],
    correctAnswer: 0,
    explanation: "Even length can be recognized by a simple 2-state DFA toggling between Even and Odd states, making it a Regular Language."
  },
  {
    id: "q18",
    question: "For a binary stream read left-to-right, how many states are required in a standard modulo DFA to test if the decimal value is divisible by integer k?",
    options: [
      "k states",
      "2^k states",
      "k + 1 states",
      "2k states"
    ],
    correctAnswer: 0,
    explanation: "A number mod k can produce exactly k remainders: 0, 1, 2, ..., k-1. Each state represents one remainder value, requiring k states."
  },
  {
    id: "q19",
    question: "What is the ε-closure of a state q in an ε-NFA?",
    options: [
      "The set of all states reachable from q by taking zero or more ε-transitions",
      "The set of states reachable from q by consuming symbol 'a' followed by ε",
      "A set containing only the initial state q0",
      "The set of states with no outgoing ε-transitions"
    ],
    correctAnswer: 0,
    explanation: "ε-closure(q) is the set of all states reachable from state q using only ε-transitions (including q itself)."
  },
  {
    id: "q20",
    question: "Given string w = 'automata', what are its prefix of length 3 and suffix of length 3 respectively?",
    options: [
      "Prefix: 'aut', Suffix: 'ata'",
      "Prefix: 'aut', Suffix: 'mat'",
      "Prefix: 'tom', Suffix: 'ata'",
      "Prefix: 'a', Suffix: 'a'"
    ],
    correctAnswer: 0,
    explanation: "The first 3 characters of 'automata' are 'aut' (prefix), and the last 3 characters are 'ata' (suffix)."
  },
  {
    id: "q21",
    question: "Is the language L = {a^n b^n | n ≥ 0} a Regular Language?",
    options: [
      "Yes, because it can be recognized by a 3-state DFA.",
      "No, because a Finite Automaton has finite memory and cannot count arbitrary n.",
      "Yes, because it uses a finite alphabet {a, b}.",
      "No, because it contains the empty string ε."
    ],
    correctAnswer: 1,
    explanation: "By the Pumping Lemma for Regular Languages, L = {a^n b^n | n ≥ 0} requires unbounded memory to count 'a's and match with 'b's, so it is Context-Free, not Regular."
  },
  {
    id: "q22",
    question: "In the Chomsky Hierarchy, which theoretical machine recognizes Context-Free Languages (CFLs)?",
    options: [
      "Finite Automaton (FA)",
      "Pushdown Automaton (PDA)",
      "Linear Bounded Automaton (LBA)",
      "Turing Machine (TM)"
    ],
    correctAnswer: 1,
    explanation: "Context-Free Languages are recognized by Pushdown Automata (PDA), which equip a finite state control with a stack memory."
  },
  {
    id: "q23",
    question: "Given language L1 = {ab} and L2 = {c, d}, what is the language concatenation L1L2?",
    options: [
      "{abc, abd}",
      "{cab, dab}",
      "{a, b, c, d}",
      "{abcd}"
    ],
    correctAnswer: 0,
    explanation: "L1L2 = {xy | x ∈ L1, y ∈ L2}. Concatenating 'ab' with 'c' gives 'abc', and with 'd' gives 'abd'."
  },
  {
    id: "q24",
    question: "What is the total number of entries/transitions required in a complete transition table for a DFA with 4 states and an alphabet Σ = {a, b, c}?",
    options: [
      "4",
      "7",
      "12",
      "64"
    ],
    correctAnswer: 2,
    explanation: "A complete DFA must specify exactly one transition for each (state, symbol) pair. 4 states × 3 input symbols = 12 total transitions."
  },
  {
    id: "q25",
    question: "How do you construct a DFA M' that accepts the complement language L̄ = Σ* - L of a complete DFA M = (Q, Σ, δ, q₀, F)?",
    options: [
      "Reverse the direction of all directed edges in transition function δ.",
      "Invert the set of accepting and non-accepting states: define new final states F' = Q \\ F.",
      "Add a new start state with spontaneous ε-transitions to all states in F.",
      "Square the total number of states |Q|."
    ],
    correctAnswer: 1,
    explanation: "Because a complete DFA is deterministic, swapping accepting states (F) and non-accepting states (Q \\ F) accepts all strings originally rejected and rejects all strings originally accepted, recognizing the complement language L̄."
  }
];
