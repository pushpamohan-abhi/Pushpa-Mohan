import { PresentationDeck, QuizQuestion } from '../types';

export const module2Deck: PresentationDeck = {
  title: "Module 2: Regular Expressions, Pumping Lemma & Automata Minimization",
  description: "Comprehensive Hopcroft, Motwani & Ullman (Sections 3.1, 3.2, 3.3, 4.1, 4.2, 4.4) + Padma Reddy Textbook Coverage with Interactive Simulators",
  slides: [
    {
      "id": "m2-intro",
      "title": "Module 2 Overview: Regular Expressions & Language Properties",
      "subtitle": "Theory of Computation - Sections 3.1, 3.2, 3.3, 4.1, 4.2 & 4.4",
      "bullets": [
        "1. Section 3.1: Regular Expressions (Formal Definition, Operators +, ·, *, Precedence, Algebraic Laws).",
        "2. Section 3.2: Finite Automata & Regular Expressions (Converting RE to ε-NFA via Thompson's Construction, DFA to RE via State Elimination & Arden's Theorem).",
        "3. Section 3.3: Applications of Regular Expressions (Lexical Analyzers, UNIX grep, Pattern Matching, Input Validators).",
        "4. Section 4.1: Proving Languages Not to be Regular (The Pumping Lemma for Regular Languages & Game-Theoretic Adversary Step-by-Step Proofs).",
        "5. Section 4.2: Closure Properties of Regular Languages (Union, Intersection, Complement, Difference, Reversal, Kleene Star, Homomorphisms).",
        "6. Section 4.4: Equivalence & Minimization of Automata (Distinguishable Pairs, Table-Filling Algorithm / Myhill-Nerode, Partitioning Method)."
      ],
      "explanation": "Module 2 bridges declarative language representations (Regular Expressions) with operational state machines, non-regular language proofs, and optimization algorithms.",
      "codeSnippet": "RE ➔ Thompson ε-NFA ➔ Subset DFA ➔ Table-Filling Minimal DFA",
      "interactiveType": "none"
    },

    // SECTION 3.1: REGULAR EXPRESSIONS
    {
      "id": "re-formal-definition",
      "title": "3.1 Regular Expressions: Formal Definition & Operators",
      "subtitle": "Hopcroft & Ullman Section 3.1 - Inductive Basis & Operators (+, ·, *)",
      "bullets": [
        "Formal Definition of Regular Expression (RE) over Alphabet Σ:",
        "• BASIS (Atomic Expressions):",
        "  1. ∅ is a Regular Expression denoting empty language L(∅) = ∅.",
        "  2. ε is a Regular Expression denoting empty string language L(ε) = {ε}.",
        "  3. For symbol a ∈ Σ, 'a' is an RE denoting single-symbol language L(a) = {a}.",
        "• INDUCTION STEP (Operators with Examples):",
        "  1. Union (+ or ∪): L(E + F) = L(E) ∪ L(F)  (Choice between E or F).",
        "     • Concrete Example: Let E = 'a', F = 'b'. L(a + b) = L(a) ∪ L(b) = {'a', 'b'}.",
        "  2. Concatenation (·): L(E · F) = L(E)L(F) = { uv : u ∈ L(E), v ∈ L(F) }.",
        "     • Concrete Example: Let E = 'a', F = 'b'. L(a · b) = {'ab'} ('a' followed by 'b').",
        "  3. Kleene Star (*): L(E*) = L(E)⁰ ∪ L(E)¹ ∪ L(E)² ∪ ... (Zero or more repetitions).",
        "     • Concrete Example: Let E = 'a'. L(a*) = {ε, 'a', 'aa', 'aaa', 'aaaa', ...}.",
        "  4. Parentheses (E): Enforces priority over default operator precedence.",
        "     • Concrete Example: (a + b)c = {'ac', 'bc'}, whereas a + bc = {'a', 'bc'}.",
        "• Operator Precedence Order: Kleene Star (*) > Concatenation (·) > Union (+).",
        "  • Precedence Example: In 'a + bc*', first 'c*' is evaluated, then 'b · c*', and lastly 'a + (bc*)'."
      ],
      "explanation": "Regular expressions provide a declarative notation for specifying formal languages. Every RE recursively defines a set of strings over Σ.",
      "codeSnippet": "Basis: ∅, ε, a  |  Induction: E+F, E·F, E*, (E)",
      "interactiveType": "none"
    },
    {
      "id": "re-algebraic-laws",
      "title": "Algebraic Laws for Regular Expressions with Examples",
      "subtitle": "Hopcroft Section 3.1.4 & Padma Reddy Textbook Identities",
      "bullets": [
        "1. Commutativity of Union: L + M = M + L",
        "   • Example: Let L = 'a', M = 'b'. 'a + b' = {'a', 'b'} = 'b + a'. Order of choices does not matter.",
        "2. Associativity: (L + M) + N = L + (M + N)  and  (LM)N = L(MN)",
        "   • Example: (a + b) + c = a + (b + c) = {'a', 'b', 'c'};  (ab)c = a(bc) = {'abc'}.",
        "3. Distributivity: L(M + N) = LM + LN  and  (M + N)L = ML + NL",
        "   • Example: a(b + c) = ab + ac = {'ab', 'ac'};  (a + b)c = ac + bc = {'ac', 'bc'}.",
        "4. Identity Elements:",
        "   • L + ∅ = L  (∅ is union identity)  ⇒ Example: 'a + ∅' = {'a'} ∪ ∅ = {'a'}.",
        "   • L · ε = ε · L = L  (ε is concatenation identity)  ⇒ Example: 'a · ε' = {'a'}.",
        "5. Annihilator Element: L · ∅ = ∅ · L = ∅",
        "   • Example: 'a · ∅' = ∅ (Concatenating anything with empty set yields no valid strings).",
        "6. Idempotence: L + L = L",
        "   • Example: 'a + a' = {'a'} ∪ {'a'} = {'a'} (Duplicate choices are redundant).",
        "7. Kleene Star Identities:",
        "   • (L*)* = L*  ⇒ Example: ((a*)*) = a* = {ε, 'a', 'aa', 'aaa', ...}.",
        "   • ∅* = ε  ⇒ Example: Repeating empty set zero times yields {ε}.",
        "   • ε* = ε  ⇒ Example: Repeating empty string zero or more times yields {ε}.",
        "   • L* = ε + LL* = ε + L*L  ⇒ Example: a* = ε + a(a*) (Unrolling Kleene star).",
        "   • (L + M)* = (L*M*)* = (L* + M*)*  ⇒ Example: (a + b)* matches any binary string."
      ],
      "explanation": "Algebraic laws allow simplifying complex regular expressions before generating state machines.",
      "codeSnippet": "Identities: L+∅=L | L·ε=L | L·∅=∅ | (L*)*=L* | (L+M)*=(L*M*)*",
      "interactiveType": "none"
    },
    {
      "id": "padma-reddy-re-table",
      "title": "Padma Reddy Section 3.1: Standard Regular Expression Reference Table",
      "subtitle": "Master Reference Table of Standard Language Descriptions & Exact Regular Expressions",
      "bullets": [
        "1. Language Description: Strings over {a, b} starting with 'a'",
        "   • Regular Expression: a(a + b)*  | Example: 'a', 'ab', 'aab', 'abb'",
        "2. Language Description: Strings over {a, b} ending with 'a'",
        "   • Regular Expression: (a + b)*a  | Example: 'a', 'ba', 'aba', 'bba'",
        "3. Language Description: Strings over {a, b} starting with 'a' and ending with 'b'",
        "   • Regular Expression: a(a + b)*b  | Example: 'ab', 'aab', 'abb', 'abab'",
        "4. Language Description: Strings over {a, b} starting and ending with SAME symbol",
        "   • Regular Expression: a(a + b)*a + b(a + b)*b + a + b  | Example: 'a', 'b', 'aba', 'bab'",
        "5. Language Description: Strings over {a, b} containing substring 'ab'",
        "   • Regular Expression: (a + b)*ab(a + b)*  | Example: 'ab', 'aab', 'baba', 'bbab'",
        "6. Language Description: Strings over {0, 1} containing substring '011'",
        "   • Regular Expression: (0 + 1)*011(0 + 1)*  | Example: '011', '0011', '10110'",
        "7. Language Description: Strings over {0, 1} with EVEN number of '0's",
        "   • Regular Expression: (1 + 01*0)*  | Example: ε, '1', '00', '010', '1001'",
        "8. Language Description: Strings over {0, 1} with ODD number of '0's",
        "   • Regular Expression: 1*0(1 + 01*0)*  | Example: '0', '01', '10', '000'",
        "9. Language Description: Strings over {a, b} containing AT MOST TWO 'a's",
        "   • Regular Expression: b*(a + ε)b*(a + ε)b*  | Example: ε, 'b', 'ab', 'aab'",
        "10. Language Description: Strings over {a, b} containing AT LEAST TWO 'a's",
        "   • Regular Expression: (a + b)*a(a + b)*a(a + b)*  | Example: 'aa', 'aab', 'baba'",
        "11. Language Description: Strings over {0, 1} with length divisible by 3",
        "   • Regular Expression: ((0 + 1)(0 + 1)(0 + 1))*  | Example: ε, '000', '101', '110011'",
        "12. Language Description: Binary strings containing NO consecutive '1's",
        "   • Regular Expression: (0 + 10)*(1 + ε)  | Example: ε, '0', '1', '010', '1010'",
        "13. Language Description: Binary strings where every '0' is followed by '11'",
        "   • Regular Expression: (1 + 011)*  | Example: ε, '1', '011', '10111'"
      ],
      "explanation": "This master Padma Reddy reference table serves as an invaluable cheatsheet for converting verbal language specifications into exact Regular Expressions for exam problems.",
      "codeSnippet": "Padma Reddy RE Reference: Starts 'a': a(a+b)* | Ends 'a': (a+b)*a | Substring 'ab': (a+b)*ab(a+b)* | Even 0s: (1+01*0)*",
      "interactiveType": "none"
    },
    {
      "id": "padma-reddy-obtain-re-examples",
      "title": "Padma Reddy Step-by-Step Solved Problems: Obtaining Regular Expressions",
      "subtitle": "Padma Reddy Section 3.1 Worked Exam Exercises - Deriving REs for Verbal Language Specifications",
      "bullets": [
        "Problem 1: Obtain RE for strings over {a, b} of length 2 or 3.",
        "   • Step 1: Strings of length 2 = (a + b)(a + b).",
        "   • Step 2: Strings of length 3 = (a + b)(a + b)(a + b).",
        "   • Step 3: Combine via Union & Factor: RE = (a + b)(a + b)(ε + a + b).",
        "Problem 2: Obtain RE for binary strings where every '0' is followed by AT LEAST TWO '1's.",
        "   • Analysis: Free '1's can occur anywhere (1*). Every '0' MUST be followed by '11' plus optional extra '1's (0111*).",
        "   • Combined RE = (1 + 0111*)*.",
        "Problem 3: Obtain RE for strings over {a, b} ending with 'ab' or 'ba'.",
        "   • Analysis: Prefix can be any arbitrary string (a + b)*, followed by suffix (ab + ba).",
        "   • Combined RE = (a + b)*(ab + ba).",
        "Problem 4: Obtain RE for strings over {0, 1} where 3rd symbol from right end is always '1'.",
        "   • Analysis: Arbitrary prefix (0 + 1)*, followed by 3rd symbol '1', followed by any 2 remaining symbols (0 + 1)(0 + 1).",
        "   • Combined RE = (0 + 1)* 1 (0 + 1)(0 + 1).",
        "Problem 5: Obtain RE for L = { aⁿ bᵐ | n ≥ 1, m ≥ 1, (n + m) is EVEN }.",
        "   • Case 1 (Both n and m are EVEN): (aa)⁺ (bb)⁺ = aa(aa)* bb(bb)*.",
        "   • Case 2 (Both n and m are ODD): a(aa)* b(bb)*.",
        "   • Combined RE = aa(aa)* bb(bb)* + a(aa)* b(bb)*.",
        "Problem 6: Obtain RE for binary strings NOT containing consecutive '0's ('00').",
        "   • Analysis: Every '0' must be followed by a '1' (01). Any number of standalone '1's can occur (1). Optional trailing '0' at end (0 + ε).",
        "   • Combined RE = (1 + 01)*(0 + ε)."
      ],
      "explanation": "To obtain regular expressions for verbal descriptions, break down strings into base cases (even/odd parity, fixed suffixes/prefixes, positional constraints) and combine using +, ·, and *.",
      "codeSnippet": "Padma Reddy Solved REs: Length 2 or 3: (a+b)²(ε+a+b) | 3rd from right '1': (0+1)*1(0+1)² | No '00': (1+01)*(0+ε)",
      "interactiveType": "regex-simulator"
    },

    // SECTION 3.2: FINITE AUTOMATA AND REGULAR EXPRESSIONS
    {
      "id": "thompson-construction",
      "title": "3.2 Thompson's Construction: Converting RE to ε-NFA",
      "subtitle": "Hopcroft Section 3.2.3 - Structural Inductive Construction Rules",
      "bullets": [
        "Algorithm (Thompson's Structural Induction):",
        "1. Basis Moves:",
        "   • RE 'ε': q₀ --ε--> q_f*",
        "   • RE 'a': q₀ --a--> q_f*",
        "   • RE '∅': q₀ (no transitions) q_f*",
        "2. Union (E + F):",
        "   • Create new start state q₀ with ε-arcs to start states of E and F.",
        "   • Add ε-arcs from final states of E and F to a new single final state q_f.",
        "3. Concatenation (E · F):",
        "   • Connect final state of E directly to start state of F via an ε-transition.",
        "4. Kleene Star (E*):",
        "   • Add ε-arc from final state of E back to start state of E (looping).",
        "   • Add ε-arc from new start q₀ directly to new final q_f (bypassing for zero repetitions)."
      ],
      "explanation": "Thompson's algorithm guarantees that any Regular Expression with N operators converts into an equivalent ε-NFA with at most 2N states in O(N) time.",
      "codeSnippet": "Thompson RE ➔ ε-NFA: Union (fork/join ε), Concat (serial ε), Star (feedback ε & bypass ε)",
      "interactiveType": "regex-simulator"
    },
    {
      "id": "thompson-example-worked",
      "title": "Padma Reddy Step-by-Step Example: RE r = (a + b)*ab to ε-NFA",
      "subtitle": "Padma Reddy Ex 3.2 & Hopcroft Section 3.2.3 - Detailed Thompson Construction Walkthrough",
      "bullets": [
        "Problem: Convert Regular Expression r = (a + b)*ab into an equivalent ε-NFA using Thompson's Construction.",
        "Interactive Visual Transition Diagram (Rendered Below):",
        "  • Interactive 10-state SVG transition graph (q₆ to q₉) with start arrow, double-ring accept state, and toggleable ε-moves.",
        "Step 1: Construct Atomic Machines for symbols 'a' and 'b':",
        "  • Machine N_a: q₁ --a--> q₂",
        "  • Machine N_b: q₃ --b--> q₄",
        "Step 2: Apply Union Construction for (a + b):",
        "  • Add new start state q₀ with ε-arcs: q₀ --ε--> q₁ and q₀ --ε--> q₃.",
        "  • Add new final state q₅ with ε-arcs: q₂ --ε--> q₅ and q₄ --ε--> q₅.",
        "Step 3: Apply Kleene Star Construction for (a + b)*:",
        "  • Add new start state q₆ with ε-arcs: q₆ --ε--> q₀ (to start) and q₆ --ε--> q₇ (bypass).",
        "  • Add feedback ε-arc: q₅ --ε--> q₀ (looping) and forward ε-arc: q₅ --ε--> q₇.",
        "Step 4: Concatenate with 'a' and 'b' (· a · b):",
        "  • Connect q₇ --a--> q₈ and q₈ --b--> q₉* (Final Accepting State).",
        "Complete Transition Table for Resulting ε-NFA:",
        "Transition Table:",
        "State | a | b | ε",
        "→ q₆ | ∅ | ∅ | {q₀, q₇}",
        "q₀ | ∅ | ∅ | {q₁, q₃}",
        "q₁ | {q₂} | ∅ | ∅",
        "q₂ | ∅ | ∅ | {q₅}",
        "q₃ | ∅ | {q₄} | ∅",
        "q₄ | ∅ | ∅ | {q₅}",
        "q₅ | ∅ | ∅ | {q₀, q₇}",
        "q₇ | {q₈} | ∅ | ∅",
        "q₈ | ∅ | {q₉} | ∅",
        "*q₉ | ∅ | ∅ | ∅"
      ],
      "explanation": "This complete 10-state machine demonstrates Thompson's structural construction step-by-step for the regular expression (a + b)*ab.",
      "codeSnippet": "RE: (a+b)*ab ➔ Thompson ε-NFA with 10 states (q₀ to q₉)",
      "interactiveType": "regex-simulator"
    },
    {
      "id": "padma-reddy-re-to-enfa-all-examples",
      "title": "Padma Reddy Section 3.2: Master Collection of RE to ε-NFA Worked Examples",
      "subtitle": "Complete Exam Solutions for Converting REs r = a + bc*, r = (0 + 1)*011, r = 0(0 + 1)*1, and r = (a*b*)* to ε-NFA",
      "bullets": [
        "Example 1: Convert RE r = a + bc* into an equivalent ε-NFA",
        "   • Step 1: Base atomic machines: N_a (q₁ --a--> q₂), N_b (q₃ --b--> q₄), N_c (q₅ --c--> q₆).",
        "   • Step 2: Construct c* machine with loop q₆ --ε--> q₅ and bypass q₇ --ε--> q₈.",
        "   • Step 3: Concatenate b and c*: Connect q₄ --ε--> q₇.",
        "   • Step 4: Union a + bc*: Add start q₀ --ε--> {q₁, q₃} and join {q₂, q₈} --ε--> q_f*.",
        "Example 2: Convert RE r = (0 + 1)*011 into an equivalent ε-NFA",
        "   • Step 1: Construct (0 + 1)* star machine over 8 states (q₆ --ε--> {q₀, q₇}).",
        "   • Step 2: Concatenate with '0', '1', '1': q₇ --0--> q₈ --1--> q₉ --1--> q₁₀*.",
        "   • Result: 11-state ε-NFA matching any binary string terminating with substring '011'.",
        "Example 3: Convert RE r = 0(0 + 1)*1 into an equivalent ε-NFA",
        "   • Step 1: Initial '0' move: q₀ --0--> q₁.",
        "   • Step 2: Middle (0 + 1)* star union loop between q₁ and q₅.",
        "   • Step 3: Final '1' move: q₅ --1--> q_f* (Accepting State).",
        "Example 4: Convert RE r = (a*b*)* into an equivalent ε-NFA (Nested Kleene Star)",
        "   • Step 1: Inner star N_a*: loop q₂ --ε--> q₁; Inner star N_b*: loop q₄ --ε--> q₃.",
        "   • Step 2: Serial concatenation: q₂ --ε--> q₃.",
        "   • Step 3: Outer Kleene star: Add outer loop q_out_end --ε--> q_out_start and bypass arc."
      ],
      "explanation": "To convert any Regular Expression to an ε-NFA, recursively apply Thompson's 4 building blocks: Atomic base moves, Union forks, Serial concatenations, and Kleene star feedback/bypass arcs.",
      "codeSnippet": "RE ➔ ε-NFA Rules: Union = fork/join ε | Concat = serial ε | Star = feedback/bypass ε",
      "interactiveType": "regex-simulator"
    },
    {
      "id": "state-elimination-ardens-law",
      "title": "DFA to RE Conversion: State Elimination & Arden's Theorem",
      "subtitle": "Hopcroft Section 3.2.2 & Padma Reddy Method - Arden's Law: R = Q + RP ⇒ R = QP*",
      "bullets": [
        "Arden's Theorem Statement:",
        "• Let P and Q be two regular expressions over Σ. If P does NOT contain ε, then the algebraic equation R = Q + RP has a UNIQUE solution given by R = QP*.",
        "State Elimination Method Steps:",
        "1. Formulate transition equations for each state q_i:",
        "   • q_i = (sum of all transitions entering q_i) + (ε if q_i is start state).",
        "2. Systematically eliminate intermediate non-accepting states by substitution.",
        "3. Apply Arden's Law R = Q + RP ⇒ R = QP* whenever self-loops appear.",
        "4. Solve for final accepting states q_f to yield the final Regular Expression R!"
      ],
      "explanation": "State elimination converts any NFA/DFA with K states into a single regular expression edge connecting start state q0 to final state qf.",
      "codeSnippet": "Arden's Law: R = Q + RP ⇒ R = QP* (Padma Reddy Textbook Elimination Method)",
      "interactiveType": "regex-simulator"
    },

    // SECTION 3.3: APPLICATIONS OF REGULAR EXPRESSIONS
    {
      "id": "re-applications",
      "title": "3.3 Applications of Regular Expressions",
      "subtitle": "Hopcroft Section 3.3 - Lexical Analysis, UNIX grep & Input Validation",
      "bullets": [
        "1. Lexical Analyzers in Compilers (Lex / Flex):",
        "   • Compilers use regular expressions to define token patterns (Identifiers, Keywords, Floating-Point Literals).",
        "   • Example: Identifier RE = [a-zA-Z_][a-zA-Z0-9_]*",
        "2. UNIX Text Search Utilities (grep, egrep, sed):",
        "   • Utility compiles search pattern into a pattern-matching DFA for O(M) linear time text scanning.",
        "3. Web Form & Email Input Validation:",
        "   • Email Validator RE = [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
        "4. DNA & Bioinformatics Pattern Matching:",
        "   • Matching genetic sequence motifs over alphabet Σ = {A, C, G, T}."
      ],
      "explanation": "Regular expressions power compiler tokenizers, text editors, search engines, and input validation frameworks world-wide.",
      "codeSnippet": "Applications: Lexical Tokens ([a-zA-Z_][a-zA-Z0-9_]*), grep O(M) scanning, Email Validation",
      "interactiveType": "none"
    },

    // SECTION 4.1: PROVING LANGUAGES NOT TO BE REGULAR (PUMPING LEMMA)
    {
      "id": "pumping-lemma-statement",
      "title": "4.1 The Pumping Lemma for Regular Languages",
      "subtitle": "Hopcroft Section 4.1 - Theorem 4.1 Statement & Adversary Game",
      "bullets": [
        "Theorem 4.1 (Pumping Lemma for Regular Languages):",
        "• Let L be a regular language. Then there exists a constant integer p ≥ 1 (pumping length) depending only on L, such that for any string z ∈ L with length |z| ≥ p, z can be split into 3 substrings z = xyz satisfying 3 conditions:",
        "  1. |xy| ≤ p  (The prefix xy lies within the first p characters).",
        "  2. |y| ≥ 1   (Subsegment y is non-empty).",
        "  3. For ALL integers i ≥ 0: xyⁱz ∈ L  (Pumping condition).",
        "4-Step Adversary Game Proof Strategy (Proving L is NOT regular):",
        "• Step 1 (Adversary): Gives pumping constant p.",
        "• Step 2 (We choose): Pick a specific string z ∈ L with |z| ≥ p expressed in terms of p.",
        "• Step 3 (Adversary): Gives a split z = xyz satisfying |xy| ≤ p and |y| ≥ 1.",
        "• Step 4 (We choose): Pick an integer i (e.g. i=0 or i=2) such that xyⁱz ∉ L, producing a contradiction! ∎"
      ],
      "explanation": "Because a DFA has a finite number of states p, scanning any string of length ≥ p must revisit at least one state, creating a loop (y) that can be pumped.",
      "codeSnippet": "Pumping Lemma: |xy| ≤ p, |y| ≥ 1, xyⁱz ∈ L for all i ≥ 0",
      "interactiveType": "pumping-lemma-game"
    },
    {
      "id": "pumping-lemma-an-bn-proof",
      "title": "Padma Reddy Proof 1: L = { aⁿ bⁿ | n ≥ 0 } is Non-Regular",
      "subtitle": "Classic Counter-Example - Unbounded Counting Memory",
      "bullets": [
        "Problem: Prove that language L = { aⁿ bⁿ | n ≥ 0 } is NOT regular.",
        "Proof by Contradiction (Using Pumping Lemma):",
        "1. Assume L is regular. Let p be the pumping length.",
        "2. Choose string z = aᵖ bᵖ ∈ L. Note that |z| = 2p ≥ p.",
        "3. By Pumping Lemma, z can be written as z = xyz with |xy| ≤ p and |y| ≥ 1.",
        "4. Since |xy| ≤ p, the substring xy lies entirely within the first p 'a's. Thus y = aᵏ for some k ≥ 1.",
        "5. Choose pumping factor i = 0:",
        "   • x y⁰ z = x z = aᵖ⁻ᵏ bᵖ.",
        "   • Since k ≥ 1, p - k ≠ p, so the number of 'a's does NOT equal the number of 'b's!",
        "   • Therefore x y⁰ z ∉ L.",
        "6. Contradiction! Consequently, L = { aⁿ bⁿ | n ≥ 0 } is NOT regular. ∎"
      ],
      "explanation": "Finite automata cannot recognize L = {aⁿ bⁿ} because tracking an arbitrary number of 'a's to compare against 'b's requires infinite states.",
      "codeSnippet": "z = aᵖbᵖ  ⇒  y = aᵏ (k≥1)  ⇒  xy⁰z = aᵖ⁻ᵏbᵖ ∉ L  (Contradiction!)",
      "interactiveType": "pumping-lemma-game"
    },
    {
      "id": "pumping-lemma-wwR-proof",
      "title": "Padma Reddy Proof 2: L = { w wᴿ | w ∈ {0,1}* } (Palindromes)",
      "subtitle": "Palindromes & Perfect Square Non-Regular Proofs",
      "bullets": [
        "Problem 1: Prove L_wwR = { w wᴿ | w ∈ {0,1}* } is NOT regular.",
        "• Choose z = 0ᵖ 11 0ᵖ ∈ L. Note |z| = 2p + 2 ≥ p.",
        "• By Pumping Lemma, |xy| ≤ p ⇒ y = 0ᵏ (k ≥ 1).",
        "• Pump i = 0: x y⁰ z = 0ᵖ⁻ᵏ 11 0ᵖ.",
        "• Left side has p - k zeros while right side has p zeros. Left side ≠ Right side!",
        "• Therefore x y⁰ z ∉ L. Contradiction! ∎",
        "Problem 2: Prove L_sq = { aⁿ² | n ≥ 1 } (Perfect Squares) is NOT regular.",
        "• Choose z = a^(p²) ∈ L with length |z| = p².",
        "• Split z = xyz with 1 ≤ |y| ≤ p.",
        "• Pump i = 2: |xy²z| = p² + |y|.",
        "• Since 1 ≤ |y| ≤ p, we have p² < |xy²z| ≤ p² + p < (p + 1)².",
        "• Length strictly lies between consecutive squares p² and (p+1)², so it CANNOT be a perfect square! ∎"
      ],
      "explanation": "Non-regular languages lack fixed period memory structures, violating the Pumping Lemma's loop condition.",
      "codeSnippet": "Palindromes (0ᵖ110ᵖ) & Perfect Squares (aᵖ²) fail the Pumping Lemma!",
      "interactiveType": "pumping-lemma-game"
    },

    // SECTION 4.2: CLOSURE PROPERTIES OF REGULAR LANGUAGES
    {
      "id": "closure-properties-overview",
      "title": "4.2 Closure Properties of Regular Languages",
      "subtitle": "Hopcroft Section 4.2 - Proof Constructions for Operations on Regular Languages",
      "bullets": [
        "Definition: A class of languages is CLOSED under an operation if applying the operation to regular language(s) always yields a regular language.",
        "Summary of Closure Theorems:",
        "1. Closure under Union (L₁ ∪ L₂): Regular (Construct Thompson NFA or Product DFA).",
        "2. Closure under Concatenation (L₁ L₂): Regular (Connect final states of L₁ to start of L₂).",
        "3. Closure under Kleene Star (L*): Regular (Feedback ε-transitions).",
        "4. Closure under Complement (L̄ = Σ* \\ L): Regular (Swap accepting and non-accepting states in complete DFA: F' = Q \\ F).",
        "5. Closure under Intersection (L₁ ∩ L₂): Regular (Product DFA Construction: Q = Q₁ × Q₂ and F = F₁ × F₂).",
        "6. Closure under Difference (L₁ \\ L₂ = L₁ ∩ L̄₂): Regular (Intersection with complement).",
        "7. Closure under Reversal (Lᴿ): Regular (Reverse all transition arrows, swap start/final states).",
        "8. Closure under Homomorphism h(L) & Inverse Homomorphism h⁻¹(L): Regular."
      ],
      "explanation": "Closure properties allow proving new languages regular by expressing them as algebraic combinations of known regular languages.",
      "codeSnippet": "Closed under: Union, Intersection (Product DFA), Complement (F'=Q\\F), Difference, Reversal, Homomorphism",
      "interactiveType": "none"
    },

    // SECTION 4.4: EQUIVALENCE AND MINIMIZATION OF AUTOMATA
    {
      "id": "minimization-table-filling",
      "title": "4.4 Minimization of Automata & Table Filling Algorithm",
      "subtitle": "Hopcroft Section 4.4 & Padma Reddy Method - Myhill-Nerode Distinguishability",
      "bullets": [
        "Definitions:",
        "• Distinguishable States: Two states p and q are distinguishable if there exists a string w ∈ Σ* such that δ̂(p, w) ∈ F and δ̂(q, w) ∉ F (or vice versa).",
        "• Equivalent States (p ≡ q): States that are NOT distinguishable.",
        "Table Filling Algorithm (Hopcroft / Myhill-Nerode $O(N^2)$):",
        "1. Construct a lower-triangular matrix table for all state pairs (p, q).",
        "2. BASIS STEP (Pass 0): Mark 'X' in pair (p, q) if one state is accepting (p ∈ F) and the other is non-accepting (q ∉ F).",
        "3. INDUCTION STEP (Pass 1..N): For every unmarked pair (p, q) and symbol a ∈ Σ, look up pair (δ(p, a), δ(q, a)). If (δ(p, a), δ(q, a)) is already marked 'X', then mark (p, q) as 'X'.",
        "4. Repeat until a full pass makes NO new marks.",
        "5. Combine all unmarked pairs (p ≡ q) into composite equivalence class states in the minimal DFA!"
      ],
      "explanation": "DFA minimization eliminates redundant equivalent states, guaranteeing a unique minimal DFA for any regular language.",
      "codeSnippet": "Basis: Mark (p,q) if p∈F, q∉F  |  Induction: Mark (p,q) if (δ(p,a), δ(q,a)) is marked",
      "interactiveType": "table-filling-minimization"
    },
    {
      "id": "minimization-padma-reddy-example",
      "title": "Worked Example: Padma Reddy DFA Minimization (8-State Machine)",
      "subtitle": "Section 4.4 - Complete Step-by-Step Table Filling Walkthrough",
      "bullets": [
        "Problem: Minimize 8-State DFA Q = {A, B, C, D, E, F, G, H} with F = {C, D, E}.",
        "Step 1: Basis (Pass 0): Mark 'X' for all pairs where one state ∈ F and other ∉ F.",
        "  • Pairs marked: (A,C), (A,D), (A,E), (B,C), (B,D), (B,E), (F,C), (F,D), (F,E), (G,C), (G,D), (G,E), (H,C), (H,D), (H,E).",
        "Step 2: Pass 1 Propagation:",
        "  • Pair (A, B) on '1' → (F, C) which is marked 'X' ⇒ Mark (A, B) 'X'!",
        "  • Pair (A, F) on '0' → (B, C) which is marked 'X' ⇒ Mark (A, F) 'X'!",
        "  • Pair (B, G) on '1' → (C, E) which is marked 'X' ⇒ Mark (B, G) 'X'!",
        "Step 3: Convergence & Remaining Unmarked Pairs:",
        "  • Unmarked pairs remaining: (B, H) and (D, E).",
        "Step 4: Form Equivalence Classes:",
        "  • B ≡ H  ⇒  Composite State [B, H]",
        "  • D ≡ E  ⇒  Composite State [D, E]",
        "  • Minimal DFA States: {[A], [B,H], [C], [D,E], [F], [G]}  (8 states reduced to 6 minimal states!)."
      ],
      "explanation": "This classic Padma Reddy textbook example demonstrates how table filling systematically reduces redundant states into minimal equivalence classes.",
      "codeSnippet": "8 States {A,B,C,D,E,F,G,H} ➔ Unmarked (B,H) & (D,E) ➔ 6 Minimal States {[A], [B,H], [C], [D,E], [F], [G]}",
      "interactiveType": "table-filling-minimization"
    },

    // MODULE 2 MASTERY QUIZ SLIDE
    {
      "id": "m2-quiz-slide",
      "title": "Module 2 Mastery Quiz",
      "subtitle": "Test Your Knowledge across Regular Expressions, Pumping Lemma & Minimization",
      "bullets": [
        "Review your understanding of Regular Expressions, Arden's Law, Thompson Construction, Pumping Lemma, Closure Properties, and Table Filling Minimization.",
        "Take the interactive quiz below to test your exam readiness!"
      ],
      "explanation": "Complete this quiz to verify your mastery of Module 2 concepts.",
      "interactiveType": "quiz"
    }
  ]
};

export const module2Quiz: QuizQuestion[] = [
  {
    "id": "m2_q1",
    "question": "What is the correct operator precedence order for Regular Expression operations?",
    "options": [
      "Kleene Star (*) > Concatenation (·) > Union (+)",
      "Union (+) > Concatenation (·) > Kleene Star (*)",
      "Concatenation (·) > Kleene Star (*) > Union (+)",
      "All operators have equal precedence"
    ],
    "correctAnswer": 0,
    "explanation": "In regular expression evaluation, Kleene Star (*) has highest precedence, followed by concatenation (·), and lastly union (+)."
  },
  {
    "id": "m2_q2",
    "question": "According to Arden's Theorem, if P and Q are regular expressions and ε ∉ P, what is the unique algebraic solution to R = Q + RP?",
    "options": [
      "R = QP*",
      "R = P*Q",
      "R = Q + P*",
      "R = (Q + P)*"
    ],
    "correctAnswer": 0,
    "explanation": "Arden's Law states that R = Q + RP has the unique solution R = QP* provided P does not contain ε."
  },
  {
    "id": "m2_q3",
    "question": "In Thompson's Construction algorithm for RE to ε-NFA conversion, how many states does an RE with N operators create?",
    "options": [
      "At most 2N states",
      "2^N states",
      "N^2 states",
      "N! states"
    ],
    "correctAnswer": 0,
    "explanation": "Thompson's structural induction creates at most 2 states per operator, yielding at most 2N total states in linear O(N) time."
  },
  {
    "id": "m2_q4",
    "question": "In the Pumping Lemma for Regular Languages, what is the constraint on the prefix substring xy in z = xyz?",
    "options": [
      "|xy| ≤ p (where p is the pumping constant)",
      "|xy| ≥ p",
      "|xy| = 0",
      "|xy| = |z|"
    ],
    "correctAnswer": 0,
    "explanation": "Condition 1 of the Pumping Lemma requires |xy| ≤ p, ensuring that substring y lies entirely within the first p characters."
  },
  {
    "id": "m2_q5",
    "question": "Why is language L = { aⁿ bⁿ | n ≥ 0 } non-regular?",
    "options": [
      "Finite automata cannot store arbitrary unbounded counts of 'a's to compare against 'b's",
      "The alphabet Σ is infinite",
      "It contains no accepting states",
      "It cannot be written in binary"
    ],
    "correctAnswer": 0,
    "explanation": "Matching an arbitrary count n of 'a's requires infinite memory states, which violates the finite state property of finite automata."
  },
  {
    "id": "m2_q6",
    "question": "Which closure property construction is used to prove that Regular Languages are closed under Complement (L̄ = Σ* \\ L)?",
    "options": [
      "Swapping accepting and non-accepting states in a complete DFA: F' = Q \\ F",
      "Reversing all transition arrows",
      "Adding ε-transitions to all states",
      "Deleting all start states"
    ],
    "correctAnswer": 0,
    "explanation": "Because a complete DFA is deterministic, swapping final and non-final states (F' = Q \\ F) accepts the exact complement language L̄."
  },
  {
    "id": "m2_q7",
    "question": "Which algorithm is used to prove that Regular Languages are closed under Intersection (L₁ ∩ L₂)?",
    "options": [
      "Product DFA Construction (Q = Q₁ × Q₂ and F = F₁ × F₂)",
      "Thompson's ε-NFA construction",
      "Arden's Law substitution",
      "Pumping Lemma splitting"
    ],
    "correctAnswer": 0,
    "explanation": "Product DFA construction runs two DFAs in parallel on state pairs (q₁, q₂), accepting when both DFAs reach final states (F₁ × F₂)."
  },
  {
    "id": "m2_q8",
    "question": "In the Table Filling Algorithm for DFA Minimization (Section 4.4), when is a state pair (p, q) marked 'X' in the initial Basis step (Pass 0)?",
    "options": [
      "When one state is accepting (p ∈ F) and the other is non-accepting (q ∉ F)",
      "When both states have identical self-loops",
      "When both states are start states",
      "When p = q"
    ],
    "correctAnswer": 0,
    "explanation": "The basis step marks pair (p, q) distinguishable immediately if p ∈ F and q ∉ F (or vice versa), because empty string ε distinguishes them."
  },
  {
    "id": "m2_q9",
    "question": "What is the result of applying the Table Filling Algorithm to a DFA?",
    "options": [
      "A unique minimal DFA with all equivalent states merged into composite equivalence classes",
      "An ε-NFA with infinite states",
      "A Context-Free Grammar",
      "A Turing Machine"
    ],
    "correctAnswer": 0,
    "explanation": "The Table Filling Algorithm identifies all equivalent state pairs (p ≡ q) and merges them to produce the unique minimal DFA."
  },
  {
    "id": "m2_q10",
    "question": "What is the algebraic identity for (L + M)* in regular expression algebra?",
    "options": [
      "(L*M*)* = (L* + M*)*",
      "L* + M*",
      "L*M*",
      "L + M*"
    ],
    "correctAnswer": 0,
    "explanation": "By RE algebraic star laws, (L + M)* is identical to (L*M*)* and (L* + M*)*."
  }
];
