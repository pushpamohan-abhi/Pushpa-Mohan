export interface Transition {
  from: string;
  symbol: string;
  to: string;
}

export interface DfaDefinition {
  title: string;
  description?: string;
  states: string[];
  alphabet: string[];
  startState: string;
  acceptStates: string[];
  transitions: Transition[];
  testString?: string;
  convertedDfa?: DfaDefinition;
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  explanation?: string;
  codeSnippet?: string;
  dfaExample?: DfaDefinition;
  interactiveType?: 'dfa-runner' | 'alphabet-explorer' | 'transition-table' | 'quiz' | 'none';
}

export interface PresentationDeck {
  title: string;
  description: string;
  slides: Slide[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
