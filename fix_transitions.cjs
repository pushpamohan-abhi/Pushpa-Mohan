const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

const drawTransitionsRegex = /\{\/\* Draw Transitions \*\/\}.*?(?=\{\/\* Draw States \*\/\})/s;

const newTransitionsLogic = `\{/* Draw Transitions */}
            {(() => {
              const groupedTransitions: {from: string, to: string, symbols: string[], isBidirectional?: boolean}[] = [];
              dfa.transitions.forEach(t => {
                const existing = groupedTransitions.find(gt => gt.from === t.from && gt.to === t.to);
                if (existing) {
                  if (!existing.symbols.includes(t.symbol)) {
                    existing.symbols.push(t.symbol);
                  }
                } else {
                  groupedTransitions.push({ from: t.from, to: t.to, symbols: [t.symbol] });
                }
              });

              groupedTransitions.forEach(gt => {
                 gt.isBidirectional = groupedTransitions.some(other => other.from === gt.to && other.to === gt.from);
              });

              return groupedTransitions.map((gt, i) => {
                const fromCoord = stateCoordinates[gt.from] || { x: 50, y: 50 };
                const toCoord = stateCoordinates[gt.to] || { x: 150, y: 150 };
                
                // Active if any of the grouped symbols match the current input symbol
                const activeSymbol = gt.symbols.find(sym => currentState === gt.from && currentIndex !== -1 && inputString[currentIndex] === sym);
                const isActiveTransition = !!activeSymbol;
                
                // Color based on active symbol or first symbol
                const primarySymbol = activeSymbol || gt.symbols[0];
                const symColor = getSymbolColor(primarySymbol);
                const displayLabel = gt.symbols.join(',');

                // Self loop
                if (gt.from === gt.to) {
                  const labelWidth = Math.max(20, displayLabel.length * 8 + 12);
                  return (
                    <g key={i}>
                      <path
                        d={\`M \${fromCoord.x - 10} \${fromCoord.y - 20} C \${fromCoord.x - 40} \${fromCoord.y - 60}, \${fromCoord.x + 40} \${fromCoord.y - 60}, \${fromCoord.x + 10} \${fromCoord.y - 20}\`}
                        fill="none"
                        stroke={isActiveTransition ? symColor.text : symColor.stroke}
                        strokeWidth={isActiveTransition ? "3" : "2"}
                        markerEnd={isActiveTransition ? \`url(#arrow-active-\${primarySymbol})\` : \`url(#arrow-\${primarySymbol})\`}
                      />
                      <rect
                        x={fromCoord.x - labelWidth/2}
                        y={fromCoord.y - 52}
                        width={labelWidth}
                        height="20"
                        rx="4"
                        fill={symColor.box}
                        stroke={isActiveTransition ? symColor.text : symColor.stroke}
                      />
                      <text
                        x={fromCoord.x}
                        y={fromCoord.y - 38}
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

                // Standard directed edge
                const dx = toCoord.x - fromCoord.x;
                const dy = toCoord.y - fromCoord.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const angle = Math.atan2(dy, dx);
                
                let pathD = \`M \${fromCoord.x} \${fromCoord.y} L \${toCoord.x} \${toCoord.y}\`;
                let midX = (fromCoord.x + toCoord.x) / 2;
                let midY = (fromCoord.y + toCoord.y) / 2;
                
                if (gt.isBidirectional) {
                  // Curve the line slightly so it doesn't overlap the reverse direction
                  const curveOffset = 25;
                  const cx = midX - curveOffset * Math.sin(angle);
                  const cy = midY + curveOffset * Math.cos(angle);
                  pathD = \`M \${fromCoord.x} \${fromCoord.y} Q \${cx} \${cy} \${toCoord.x} \${toCoord.y}\`;
                  // Midpoint of quadratic bezier is roughly halfway between the control point and the direct midpoint
                  midX = (midX + cx) / 2;
                  midY = (midY + cy) / 2;
                } else {
                  // Push labels off the exact center line just slightly
                  midX -= 15 * Math.sin(angle);
                  midY += 15 * Math.cos(angle);
                }

                const labelWidth = Math.max(20, displayLabel.length * 8 + 12);

                return (
                  <g key={i}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isActiveTransition ? symColor.text : symColor.stroke}
                      strokeWidth={isActiveTransition ? '3' : '2'}
                      markerEnd={isActiveTransition ? \`url(#arrow-active-\${primarySymbol})\` : \`url(#arrow-\${primarySymbol})\`}
                    />
                    <rect
                      x={midX - labelWidth/2}
                      y={midY - 10}
                      width={labelWidth}
                      height="20"
                      rx="4"
                      fill={symColor.box}
                      stroke={isActiveTransition ? symColor.text : symColor.stroke}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
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
              });
            })()}

            `;

code = code.replace(drawTransitionsRegex, newTransitionsLogic);
fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
