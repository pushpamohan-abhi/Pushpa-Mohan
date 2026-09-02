const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

const replacement = `
export const DfaAnimatorWidget: React.FC<DfaAnimatorWidgetProps> = ({ dfa: initialDfa, onAskAI }) => {
  const [showConverted, setShowConverted] = useState(false);
  const dfa = showConverted && initialDfa.convertedDfa ? initialDfa.convertedDfa : initialDfa;
`;

code = code.replace(
  "export const DfaAnimatorWidget: React.FC<DfaAnimatorWidgetProps> = ({ dfa, onAskAI }) => {",
  replacement
);

// We need to reset the state when switching between NFA and DFA.
const useEffectReplacement = `
  useEffect(() => {
    reset();
  }, [dfa]);
`;

code = code.replace(
  "const reset = () => {",
  useEffectReplacement + "\n  const reset = () => {"
);

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
