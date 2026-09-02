const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

const titleSection = `
          <h3 className="text-lg font-bold text-white mt-1">{dfa.title}</h3>
        </div>
`;

const toggleButton = `
        {initialDfa.convertedDfa && (
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setShowConverted(false)}
              className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all \${!showConverted ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}\`}
            >
              NFA View
            </button>
            <button
              onClick={() => setShowConverted(true)}
              className={\`px-4 py-1.5 rounded-lg text-xs font-bold transition-all \${showConverted ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}\`}
            >
              Converted DFA
            </button>
          </div>
        )}
`;

code = code.replace(titleSection, titleSection + toggleButton);

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
