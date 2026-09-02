const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

code = code.replace(
  /const labelWidth = Math.max\(20, displayLabel.length \* 8 \+ 12\);/g,
  'const labelWidth = Math.max(24, displayLabel.length * 8 + 16);'
);

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
