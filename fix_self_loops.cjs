const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

// Fix viewBox
code = code.replace('viewBox="0 0 320 240"', 'viewBox="-50 -50 420 340"');

// Fix self loop geometry
const selfLoopRegex = /\/\/ Self loop\s+if \(gt\.from === gt\.to\) \{[\s\S]*?(?=\/\/ Standard directed edge)/;

const newSelfLoop = `// Self loop
                if (gt.from === gt.to) {
                  const labelWidth = Math.max(20, displayLabel.length * 8 + 12);
                  
                  // Compute outward normal vector from center
                  let nx = fromCoord.x - 160;
                  let ny = fromCoord.y - 120;
                  const len = Math.sqrt(nx*nx + ny*ny) || 1;
                  nx = nx / len;
                  ny = ny / len;

                  // If exactly at center, default to pointing straight up
                  if (len === 1 && nx === 0 && ny === 0) {
                    ny = -1;
                  }

                  // Base points of the loop on the state circle
                  const sr = 18; // radius of the state circle roughly
                  const base1X = fromCoord.x + nx * sr - ny * 10;
                  const base1Y = fromCoord.y + ny * sr + nx * 10;
                  
                  const base2X = fromCoord.x + nx * sr + ny * 10;
                  const base2Y = fromCoord.y + ny * sr - nx * 10;
                  
                  // Control points
                  const cpDist = 65;
                  const cpSpread = 35;
                  const cp1X = fromCoord.x + nx * cpDist - ny * cpSpread;
                  const cp1Y = fromCoord.y + ny * cpDist + nx * cpSpread;
                  
                  const cp2X = fromCoord.x + nx * cpDist + ny * cpSpread;
                  const cp2Y = fromCoord.y + ny * cpDist - nx * cpSpread;
                  
                  // Text and label peak
                  const peakX = fromCoord.x + nx * 52;
                  const peakY = fromCoord.y + ny * 52;

                  return (
                    <g key={i}>
                      <path
                        d={\`M \${base1X} \${base1Y} C \${cp1X} \${cp1Y}, \${cp2X} \${cp2Y}, \${base2X} \${base2Y}\`}
                        fill="none"
                        stroke={isActiveTransition ? symColor.text : symColor.stroke}
                        strokeWidth={isActiveTransition ? "3" : "2"}
                        markerEnd={isActiveTransition ? \`url(#arrow-active-\${primarySymbol})\` : \`url(#arrow-\${primarySymbol})\`}
                      />
                      <rect
                        x={peakX - labelWidth/2}
                        y={peakY - 10}
                        width={labelWidth}
                        height="20"
                        rx="4"
                        fill={symColor.box}
                        stroke={isActiveTransition ? symColor.text : symColor.stroke}
                      />
                      <text
                        x={peakX}
                        y={peakY + 4}
                        fill={isActiveTransition ? '#ffffff' : symColor.text}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {displayLabel}
                      </text>
                    </g>
                  );
                }

                `;

code = code.replace(selfLoopRegex, newSelfLoop);

fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
