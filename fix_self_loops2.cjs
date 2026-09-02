const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

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

                  if (len === 1 && nx === 0 && ny === 0) {
                    ny = -1;
                  }

                  // Control points
                  const cpDist = 80;
                  const cpSpread = 50;
                  
                  // To make the arrow land perfectly with refX=22, we start and end exactly at fromCoord
                  // SVG markers align with the derivative of the path at the end point.
                  // By making the curve start/end at fromCoord, the arrow will sit exactly 22px out.
                  const cp1X = fromCoord.x + nx * cpDist - ny * cpSpread;
                  const cp1Y = fromCoord.y + ny * cpDist + nx * cpSpread;
                  
                  const cp2X = fromCoord.x + nx * cpDist + ny * cpSpread;
                  const cp2Y = fromCoord.y + ny * cpDist - nx * cpSpread;
                  
                  // Text and label peak
                  const peakX = fromCoord.x + nx * 65;
                  const peakY = fromCoord.y + ny * 65;

                  return (
                    <g key={i}>
                      <path
                        d={\`M \${fromCoord.x} \${fromCoord.y} C \${cp1X} \${cp1Y}, \${cp2X} \${cp2Y}, \${fromCoord.x} \${fromCoord.y}\`}
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
