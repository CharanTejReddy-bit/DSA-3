/**
 * Naive Linear Scan Fuzzy Search Engine
 * Performs exhaustive O(N * m * n) comparison across the entire dictionary
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */

import { calculateLevenshteinDistance, calculateSimilarityScore } from './levenshtein';
import { SearchMatch } from './bktree';

export interface NaiveSearchResult {
  matches: SearchMatch[];
  comparisonsCount: number;
  searchTimeMs: number;
  totalWords: number;
}

export function naiveLinearSearch(
  words: string[],
  query: string,
  maxTolerance: number = 2
): NaiveSearchResult {
  const startTime = performance.now();
  const cleanQuery = query.trim();

  if (!cleanQuery || words.length === 0) {
    return {
      matches: [],
      comparisonsCount: 0,
      searchTimeMs: 0,
      totalWords: words.length,
    };
  }

  const matches: SearchMatch[] = [];
  let comparisonsCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    comparisonsCount++;
    const dist = calculateLevenshteinDistance(word, cleanQuery);

    if (dist <= maxTolerance) {
      const score = calculateSimilarityScore(dist, cleanQuery.length, word.length);
      matches.push({
        word,
        distance: dist,
        similarityScore: score,
        nodeId: `naive-${i}`,
        depth: 0,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    if (b.similarityScore !== a.similarityScore) return b.similarityScore - a.similarityScore;
    return a.word.localeCompare(b.word);
  });

  const endTime = performance.now();

  return {
    matches,
    comparisonsCount,
    searchTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
    totalWords: words.length,
  };
}
