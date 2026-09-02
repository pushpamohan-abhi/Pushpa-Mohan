const fs = require('fs');
let code = fs.readFileSync('src/components/DfaAnimatorWidget.tsx', 'utf8');

// We need to rewrite the SVG drawing section from `<svg className="w-full h-[220px]" viewBox="0 0 320 240">` down to `</svg>`
const startIdx = code.indexOf('<svg className="w-full h-[220px]" viewBox="0 0 320 240">');
const endIdx = code.indexOf('</svg>', startIdx) + 6;

const svgReplacement = `
<svg className="w-full h-[220px]" viewBox="0 0 320 240">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
              </marker>
              {Array.from(new Set(dfa.transitions.map(t => t.symbol))).map(sym => {
                const color = getSymbolColor(sym);
                return (
                  <React.Fragment key={sym}>
                    <marker id={\`arrow-\${sym}\`} viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={color.stroke} />
                    </marker>
                    <marker id={\`arrow-active-\${sym}\`} viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={color.text} />
                    </marker>
                  </React.Fragment>
                );
              })}
            </defs>

            {/* Draw Transitions */}
            {dfa.transitions.map((t, i) => {
              const fromCoord = stateCoordinates[t.from] || { x: 50, y: 50 };
              const toCoord = stateCoordinates[t.to] || { x: 150, y: 150 };
              const isActiveTransition = currentState === t.from && currentIndex !== -1 && inputString[currentIndex] === t.symbol;
              const symColor = getSymbolColor(t.symbol);

              // Self loop
              if (t.from === t.to) {
                return (
                  <g key={i}>
                    <path
                      d={\`M \${fromCoord.x - 10} \${fromCoord.y - 20} C \${fromCoord.x - 40} \${fromCoord.y - 60}, \${fromCoord.x + 40} \${fromCoord.y - 60}, \${fromCoord.x + 10} \${fromCoord.y - 20}\`}
                      fill="none"
                      stroke={isActiveTransition ? symColor.text : symColor.stroke}
                      strokeWidth={isActiveTransition ? "3" : "2"}
                      markerEnd={isActiveTransition ? \`url(#arrow-active-\${t.symbol})\` : \`url(#arrow-\${t.symbol})\`}
                    />
                    <rect
                      x={fromCoord.x - 10}
                      y={fromCoord.y - 52}
                      width="20"
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
                      {t.symbol}
                    </text>
                  </g>
                );
              }

              // Standard directed edge
              const dx = toCoord.x - fromCoord.x;
              const dy = toCoord.y - fromCoord.y;
              const angle = Math.atan2(dy, dx);
              const midX = (fromCoord.x + toCoord.x) / 2 - 15 * Math.sin(angle);
              const midY = (fromCoord.y + toCoord.y) / 2 + 15 * Math.cos(angle);

              return (
                <g key={i}>
                  <line
                    x1={fromCoord.x}
                    y1={fromCoord.y}
                    x2={toCoord.x}
                    y2={toCoord.y}
                    stroke={isActiveTransition ? symColor.text : symColor.stroke}
                    strokeWidth={isActiveTransition ? '3' : '2'}
                    markerEnd={isActiveTransition ? \`url(#arrow-active-\${t.symbol})\` : \`url(#arrow-\${t.symbol})\`}
                  />
                  <rect
                    x={midX - 10}
                    y={midY - 10}
                    width="20"
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
                    {t.symbol}
                  </text>
                </g>
              );
            })}

            {/* Draw States */}
            {dfa.states.map((st) => {
              const coord = stateCoordinates[st] || { x: 50, y: 50 };
              const isCurrent = activeStates.includes(st);
              const isAccept = dfa.acceptStates.includes(st);
              const isStart = st === dfa.startState;
              const stColor = getStateColor(st);

              return (
                <g key={st} transform={\`translate(\${coord.x}, \${coord.y})\`}>
                  {/* Start State Arrow */}
                  {isStart && (
                    <g>
                      <line x1="-38" y1="0" x2="-22" y2="0" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
                    </g>
                  )}

                  {/* Accept State Outer Ring */}
                  {isAccept && (
                    <circle
                      r="22"
                      fill="none"
                      stroke={isCurrent ? stColor.activeStroke : stColor.stroke}
                      strokeWidth="2"
                      className={isCurrent ? 'animate-pulse' : ''}
                    />
                  )}

                  {/* Main State Circle */}
                  <circle
                    r="18"
                    fill={isCurrent ? stColor.activeFill : stColor.fill}
                    stroke={isCurrent ? stColor.activeStroke : stColor.stroke}
                    strokeWidth={isCurrent ? '3' : '2'}
                    className="transition-all duration-300 shadow-lg"
                  />

                  <text
                    y="4"
                    fill="#ffffff"
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {st}
                  </text>
                </g>
              );
            })}
          </svg>
`.trim();

code = code.substring(0, startIdx) + svgReplacement + code.substring(endIdx);
fs.writeFileSync('src/components/DfaAnimatorWidget.tsx', code);
console.log('Successfully patched SVG drawing!');
