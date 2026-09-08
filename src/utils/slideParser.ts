export interface ParsedBullet {
  type: 'bullet';
  text: string;
  bulletNumber: number;
}

export interface ParsedTableRow {
  isStart: boolean;
  isAccept: boolean;
  state: string;
  cells: string[];
}

export interface ParsedTableBlock {
  type: 'table';
  title: string;
  headers: string[];
  rows: ParsedTableRow[];
  bulletNumber: number;
}

export type ParsedSlideContent = ParsedBullet | ParsedTableBlock;

/**
 * Checks if a string represents a table row (contains at least one pipe character
 * separating columns).
 */
function isPipeRow(str: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  // Avoid matching mathematical code comments like "Basis: ... | Induction: ..."
  if (trimmed.toLowerCase().includes('basis:') || trimmed.toLowerCase().includes('induction:')) {
    return false;
  }
  if (!trimmed.includes('|')) return false;
  const parts = trimmed.split('|').map((s) => s.trim());
  return parts.length >= 2;
}

/**
 * Parses slide bullets and groups pipe-delimited transition table rows into
 * a single structured table object.
 */
export function parseSlideBullets(bullets: string[] = []): ParsedSlideContent[] {
  const result: ParsedSlideContent[] = [];
  let i = 0;
  let bulletCounter = 1;

  while (i < bullets.length) {
    const rawLine = bullets[i];
    const trimmed = rawLine ? rawLine.trim() : '';

    const isTableMarker =
      trimmed.toLowerCase() === 'transition table:' ||
      trimmed.toLowerCase() === 'transition table' ||
      trimmed.toLowerCase().startsWith('transition table:');

    const currentIsPipe = isPipeRow(trimmed);
    const nextIsPipe = i + 1 < bullets.length ? isPipeRow(bullets[i + 1].trim()) : false;

    // Trigger table grouping if explicitly marked OR if 2+ consecutive pipe rows occur
    if (isTableMarker || (currentIsPipe && nextIsPipe)) {
      let title = 'Transition Table';
      let startIdx = i;

      if (isTableMarker) {
        if (trimmed.includes(':')) {
          const parts = trimmed.split(':');
          if (parts[0].trim()) title = parts[0].trim();
        }
        startIdx = i + 1;
      }

      // Collect consecutive table lines
      const tableLines: string[] = [];
      let j = startIdx;
      while (j < bullets.length && isPipeRow(bullets[j])) {
        tableLines.push(bullets[j].trim());
        j++;
      }

      if (tableLines.length >= 2) {
        // Line 0 is header row
        const headerParts = tableLines[0].split('|').map((s) => s.trim()).filter((s) => s.length > 0);
        const headers = headerParts.length > 0 ? headerParts : ['State', '0', '1'];

        // Lines 1..N are data rows
        const rows: ParsedTableRow[] = tableLines.slice(1).map((line) => {
          const parts = line.split('|').map((s) => s.trim());
          const stateRaw = parts[0] || '';

          const isStart = stateRaw.includes('→') || stateRaw.includes('->');
          const isAccept = stateRaw.includes('*') || stateRaw.includes('★');

          let cleanState = stateRaw.replace(/[→\->\*★]/g, '').trim();
          if (!cleanState) cleanState = stateRaw;

          const cells = parts.slice(1);

          return {
            isStart,
            isAccept,
            state: cleanState,
            cells,
          };
        });

        result.push({
          type: 'table',
          title,
          headers,
          rows,
          bulletNumber: bulletCounter++,
        });

        i = j; // Advance index beyond the processed table block
        continue;
      }
    }

    // Standard Bullet Line
    result.push({
      type: 'bullet',
      text: rawLine,
      bulletNumber: bulletCounter++,
    });

    i++;
  }

  return result;
}
