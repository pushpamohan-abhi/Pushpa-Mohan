const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

code = code.replace(
  '<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">',
  '<div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">'
);

// Tweak controls styling so they all align perfectly in the 3-col layout
// The third div is the action buttons... wait, there is String Token Visualizer, Status Badge, Action Buttons, and Explanation...
// Wait, action buttons is nested under the same div? Let's check.
