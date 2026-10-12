package com.fuzzysearch.search;

import com.fuzzysearch.core.EditDistance;
import com.fuzzysearch.tree.BKTree.SearchMatch;

import java.util.*;

/**
 * Naive Linear Scan Baseline: O(N * m * n)
 * Evaluates every single word in the dictionary for comparative Big-O analysis
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */
public class NaiveSearch {

    public static class NaiveResult {
        private final List<SearchMatch> matches;
        private final int comparisonsCount;
        private final double searchTimeMs;
        private final int totalWords;

        public NaiveResult(List<SearchMatch> matches, int comparisonsCount, double searchTimeMs, int totalWords) {
            this.matches = matches;
            this.comparisonsCount = comparisonsCount;
            this.searchTimeMs = searchTimeMs;
            this.totalWords = totalWords;
        }

        public List<SearchMatch> getMatches() { return matches; }
        public int getComparisonsCount() { return comparisonsCount; }
        public double getSearchTimeMs() { return searchTimeMs; }
        public int getTotalWords() { return totalWords; }
    }

    public static NaiveResult search(List<String> words, String query, int maxTolerance) {
        long startNanos = System.nanoTime();
        if (query == null || query.trim().isEmpty() || words == null || words.isEmpty()) {
            return new NaiveResult(Collections.emptyList(), 0, 0.0, words != null ? words.size() : 0);
        }

        String cleanQuery = query.trim();
        List<SearchMatch> matches = new ArrayList<>();
        int comparisons = 0;

        for (String word : words) {
            comparisons++;
            int dist = EditDistance.calculateDistance(word, cleanQuery);
            if (dist <= maxTolerance) {
                double score = EditDistance.calculateSimilarityScore(dist, cleanQuery.length(), word.length());
                matches.add(new SearchMatch(word, dist, score, 0));
            }
        }

        Collections.sort(matches);
        long endNanos = System.nanoTime();
        double timeMs = (endNanos - startNanos) / 1_000_000.0;

        return new NaiveResult(matches, comparisons, timeMs, words.size());
    }
}
