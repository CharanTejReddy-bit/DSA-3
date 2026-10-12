/**
 * Levenshtein Distance & Optimal Alignment Engine
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * Team: CharanTej Reddy (2520030422), Chandrakanth Reddy (2520030290), Teja (2520030379)
 */

export type EditOperationType = 'match' | 'insert' | 'delete' | 'substitute';

export interface AlignmentStep {
  operation: EditOperationType;
  sourceChar: string;
  targetChar: string;
  sourceIndex: number;
  targetIndex: number;
  cost: number;
}

export interface DPCell {
  i: number;
  j: number;
  cost: number;
  operation: EditOperationType;
  sourceChar: string;
  targetChar: string;
  formula: string;
  from?: { i: number; j: number };
}

export interface DPMatrixResult {
  matrix: number[][];
  cells: DPCell[][];
  distance: number;
  sourceTokens: string[];
  targetTokens: string[];
  alignment: AlignmentStep[];
  similarityScore: number;
  totalOperations: {
    matches: number;
    substitutions: number;
    insertions: number;
    deletions: number;
  };
}

/**
 * Unicode-safe string tokenization that properly handles multi-byte characters,
 * combining characters, Devanagari, Telugu matras, and emojis.
 */
export function tokenizeString(str: string): string[] {
  if (!str) return [];
  // Use Intl.Segmenter if available in modern JS environments
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(str), (seg) => seg.segment);
  }
  // Fallback to Array.from for code-point splitting
  return Array.from(str);
}

/**
 * Computes simple Levenshtein Distance between two strings with early exit optimization.
 * O(m * n) time and O(min(m, n)) space.
 */
export function calculateLevenshteinDistance(
  source: string,
  target: string,
  maxTolerance: number = Infinity
): number {
  if (source === target) return 0;
  if (!source) return target.length;
  if (!target) return source.length;

  const s = tokenizeString(source);
  const t = tokenizeString(target);
  const m = s.length;
  const n = t.length;

  if (Math.abs(m - n) > maxTolerance) {
    return maxTolerance + 1;
  }

  // Optimize space to single row
  let prevRow = new Array(n + 1);
  let currRow = new Array(n + 1);

  for (let j = 0; j <= n; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    let minInRow = currRow[0];

    for (let j = 1; j <= n; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      const deletion = prevRow[j] + 1;
      const insertion = currRow[j - 1] + 1;
      const substitution = prevRow[j - 1] + cost;

      currRow[j] = Math.min(deletion, insertion, substitution);
      if (currRow[j] < minInRow) {
        minInRow = currRow[j];
      }
    }

    // Early exit if the best possible score in this row exceeds tolerance
    if (minInRow > maxTolerance) {
      return maxTolerance + 1;
    }

    // Swap rows
    for (let j = 0; j <= n; j++) {
      prevRow[j] = currRow[j];
    }
  }

  return prevRow[n];
}

/**
 * Computes full Dynamic Programming Matrix and optimal alignment backtracking path
 * for visual representation in the UI.
 */
export function computeDPMatrixDetailed(
  sourceStr: string,
  targetStr: string
): DPMatrixResult {
  const s = tokenizeString(sourceStr);
  const t = tokenizeString(targetStr);
  const m = s.length;
  const n = t.length;

  const matrix: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const cells: DPCell[][] = Array.from({ length: m + 1 }, () => new Array(n + 1));

  // Initialize base cases
  for (let i = 0; i <= m; i++) {
    matrix[i][0] = i;
    cells[i][0] = {
      i,
      j: 0,
      cost: i,
      operation: i === 0 ? 'match' : 'delete',
      sourceChar: i > 0 ? s[i - 1] : '',
      targetChar: '',
      formula: i === 0 ? 'D[0,0] = 0' : `Delete '${s[i - 1]}': D[${i},0] = ${i}`,
      from: i > 0 ? { i: i - 1, j: 0 } : undefined,
    };
  }

  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j;
    cells[0][j] = {
      i: 0,
      j,
      cost: j,
      operation: j === 0 ? 'match' : 'insert',
      sourceChar: '',
      targetChar: j > 0 ? t[j - 1] : '',
      formula: j === 0 ? 'D[0,0] = 0' : `Insert '${t[j - 1]}': D[0,${j}] = ${j}`,
      from: j > 0 ? { i: 0, j: j - 1 } : undefined,
    };
  }

  // Populate DP matrix cell by cell
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const isMatch = s[i - 1] === t[j - 1];
      const matchCost = isMatch ? 0 : 1;

      const delCost = matrix[i - 1][j] + 1; // deletion from source (move down)
      const insCost = matrix[i][j - 1] + 1; // insertion into source (move right)
      const subCost = matrix[i - 1][j - 1] + matchCost; // match or substitution (move diag)

      const minVal = Math.min(delCost, insCost, subCost);
      matrix[i][j] = minVal;

      let operation: EditOperationType = 'match';
      let prevCell = { i: i - 1, j: j - 1 };
      let formula = '';

      if (minVal === subCost) {
        if (isMatch) {
          operation = 'match';
          formula = `Match '${s[i - 1]}': D[${i - 1},${j - 1}] + 0 = ${minVal}`;
        } else {
          operation = 'substitute';
          formula = `Substitute '${s[i - 1]}' ➔ '${t[j - 1]}': D[${i - 1},${j - 1}] + 1 = ${minVal}`;
        }
        prevCell = { i: i - 1, j: j - 1 };
      } else if (minVal === delCost) {
        operation = 'delete';
        formula = `Delete '${s[i - 1]}': D[${i - 1},${j}] + 1 = ${minVal}`;
        prevCell = { i: i - 1, j };
      } else {
        operation = 'insert';
        formula = `Insert '${t[j - 1]}': D[${i},${j - 1}] + 1 = ${minVal}`;
        prevCell = { i, j: j - 1 };
      }

      cells[i][j] = {
        i,
        j,
        cost: minVal,
        operation,
        sourceChar: s[i - 1],
        targetChar: t[j - 1],
        formula,
        from: prevCell,
      };
    }
  }

  // Backtrack to find optimal alignment path
  const alignment: AlignmentStep[] = [];
  let currI = m;
  let currJ = n;

  const totalOps = {
    matches: 0,
    substitutions: 0,
    insertions: 0,
    deletions: 0,
  };

  while (currI > 0 || currJ > 0) {
    if (currI > 0 && currJ > 0) {
      const isMatch = s[currI - 1] === t[currJ - 1];
      const matchCost = isMatch ? 0 : 1;

      const subCost = matrix[currI - 1][currJ - 1] + matchCost;
      const delCost = matrix[currI - 1][currJ] + 1;
      const insCost = matrix[currI][currJ - 1] + 1;

      if (matrix[currI][currJ] === subCost) {
        const op: EditOperationType = isMatch ? 'match' : 'substitute';
        alignment.unshift({
          operation: op,
          sourceChar: s[currI - 1],
          targetChar: t[currJ - 1],
          sourceIndex: currI - 1,
          targetIndex: currJ - 1,
          cost: matchCost,
        });
        if (isMatch) totalOps.matches++;
        else totalOps.substitutions++;
        currI--;
        currJ--;
        continue;
      } else if (matrix[currI][currJ] === delCost) {
        alignment.unshift({
          operation: 'delete',
          sourceChar: s[currI - 1],
          targetChar: '',
          sourceIndex: currI - 1,
          targetIndex: -1,
          cost: 1,
        });
        totalOps.deletions++;
        currI--;
        continue;
      } else if (matrix[currI][currJ] === insCost) {
        alignment.unshift({
          operation: 'insert',
          sourceChar: '',
          targetChar: t[currJ - 1],
          sourceIndex: -1,
          targetIndex: currJ - 1,
          cost: 1,
        });
        totalOps.insertions++;
        currJ--;
        continue;
      }
    }

    if (currI > 0) {
      alignment.unshift({
        operation: 'delete',
        sourceChar: s[currI - 1],
        targetChar: '',
        sourceIndex: currI - 1,
        targetIndex: -1,
        cost: 1,
      });
      totalOps.deletions++;
      currI--;
    } else if (currJ > 0) {
      alignment.unshift({
        operation: 'insert',
        sourceChar: '',
        targetChar: t[currJ - 1],
        sourceIndex: -1,
        targetIndex: currJ - 1,
        cost: 1,
      });
      totalOps.insertions++;
      currJ--;
    }
  }

  const distance = matrix[m][n];
  const maxLen = Math.max(m, n);
  const similarityScore = maxLen === 0 ? 1 : Math.max(0, 1 - distance / maxLen);

  return {
    matrix,
    cells,
    distance,
    sourceTokens: s,
    targetTokens: t,
    alignment,
    similarityScore,
    totalOperations: totalOps,
  };
}

/**
 * Calculates normalized similarity score: 1 - (distance / max(len1, len2))
 */
export function calculateSimilarityScore(distance: number, len1: number, len2: number): number {
  const maxLen = Math.max(len1, len2);
  if (maxLen === 0) return 1.0;
  return Math.max(0, 1.0 - distance / maxLen);
}
