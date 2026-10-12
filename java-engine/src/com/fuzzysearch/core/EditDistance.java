package com.fuzzysearch.core;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Edit Distance (Levenshtein Metric) Dynamic Programming Engine
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * Team: CharanTej Reddy (2520030422), Chandrakanth Reddy (2520030290), Teja (2520030379)
 * University: KLH University, Bachupally
 */
public class EditDistance {

    public enum OperationType {
        MATCH, SUBSTITUTE, INSERT, DELETE
    }

    public static class AlignmentStep {
        private final OperationType operation;
        private final String sourceChar;
        private final String targetChar;
        private final int sourceIndex;
        private final int targetIndex;
        private final int cost;

        public AlignmentStep(OperationType operation, String sourceChar, String targetChar,
                             int sourceIndex, int targetIndex, int cost) {
            this.operation = operation;
            this.sourceChar = sourceChar;
            this.targetChar = targetChar;
            this.sourceIndex = sourceIndex;
            this.targetIndex = targetIndex;
            this.cost = cost;
        }

        public OperationType getOperation() { return operation; }
        public String getSourceChar() { return sourceChar; }
        public String getTargetChar() { return targetChar; }
        public int getSourceIndex() { return sourceIndex; }
        public int getTargetIndex() { return targetIndex; }
        public int getCost() { return cost; }

        @Override
        public String toString() {
            switch (operation) {
                case MATCH:
                    return "[" + sourceChar + " == " + targetChar + "]";
                case SUBSTITUTE:
                    return "[" + sourceChar + " -> " + targetChar + "]";
                case INSERT:
                    return "[+" + targetChar + "]";
                case DELETE:
                    return "[-" + sourceChar + "]";
                default:
                    return "";
            }
        }
    }

    public static class DPMatrixResult {
        private final int[][] matrix;
        private final int distance;
        private final List<String> sourceTokens;
        private final List<String> targetTokens;
        private final List<AlignmentStep> alignment;
        private final double similarityScore;
        private final int matchCount;
        private final int substitutionCount;
        private final int insertionCount;
        private final int deletionCount;

        public DPMatrixResult(int[][] matrix, int distance, List<String> sourceTokens,
                              List<String> targetTokens, List<AlignmentStep> alignment,
                              double similarityScore, int matchCount, int substitutionCount,
                              int insertionCount, int deletionCount) {
            this.matrix = matrix;
            this.distance = distance;
            this.sourceTokens = sourceTokens;
            this.targetTokens = targetTokens;
            this.alignment = alignment;
            this.similarityScore = similarityScore;
            this.matchCount = matchCount;
            this.substitutionCount = substitutionCount;
            this.insertionCount = insertionCount;
            this.deletionCount = deletionCount;
        }

        public int[][] getMatrix() { return matrix; }
        public int getDistance() { return distance; }
        public List<String> getSourceTokens() { return sourceTokens; }
        public List<String> getTargetTokens() { return targetTokens; }
        public List<AlignmentStep> getAlignment() { return alignment; }
        public double getSimilarityScore() { return similarityScore; }
        public int getMatchCount() { return matchCount; }
        public int getSubstitutionCount() { return substitutionCount; }
        public int getInsertionCount() { return insertionCount; }
        public int getDeletionCount() { return deletionCount; }
    }

    /**
     * Splits string into Unicode code points (safe for multilingual scripts e.g. Hindi, Telugu, Spanish)
     */
    public static List<String> tokenize(String str) {
        List<String> tokens = new ArrayList<>();
        if (str == null || str.isEmpty()) return tokens;

        int length = str.length();
        int offset = 0;
        while (offset < length) {
            int codePoint = str.codePointAt(offset);
            tokens.add(new String(Character.toChars(codePoint)));
            offset += Character.charCount(codePoint);
        }
        return tokens;
    }

    /**
     * Space-optimized O(m * n) time and O(min(m, n)) space Edit Distance with early termination
     */
    public static int calculateDistance(String s1, String s2, int maxTolerance) {
        if (s1.equals(s2)) return 0;
        if (s1.isEmpty()) return s2.length();
        if (s2.isEmpty()) return s1.length();

        List<String> s = tokenize(s1);
        List<String> t = tokenize(s2);
        int m = s.size();
        int n = t.size();

        if (Math.abs(m - n) > maxTolerance) {
            return maxTolerance + 1;
        }

        // Ensure t is the shorter sequence to minimize row memory
        if (m < n) {
            List<String> tempTokens = s;
            s = t;
            t = tempTokens;
            int tempLen = m;
            m = n;
            n = tempLen;
        }

        int[] prevRow = new int[n + 1];
        int[] currRow = new int[n + 1];

        for (int j = 0; j <= n; j++) {
            prevRow[j] = j;
        }

        for (int i = 1; i <= m; i++) {
            currRow[0] = i;
            int minInRow = currRow[0];

            for (int j = 1; j <= n; j++) {
                int cost = s.get(i - 1).equals(t.get(j - 1)) ? 0 : 1;
                int deletion = prevRow[j] + 1;
                int insertion = currRow[j - 1] + 1;
                int substitution = prevRow[j - 1] + cost;

                int minVal = Math.min(deletion, Math.min(insertion, substitution));
                currRow[j] = minVal;
                if (minVal < minInRow) {
                    minInRow = minVal;
                }
            }

            if (minInRow > maxTolerance) {
                return maxTolerance + 1;
            }

            System.arraycopy(currRow, 0, prevRow, 0, n + 1);
        }

        return prevRow[n];
    }

    public static int calculateDistance(String s1, String s2) {
        return calculateDistance(s1, s2, Integer.MAX_VALUE);
    }

    /**
     * Normalized Similarity Score: 1.0 - (distance / max(len1, len2))
     */
    public static double calculateSimilarityScore(int distance, int len1, int len2) {
        int maxLen = Math.max(len1, len2);
        if (maxLen == 0) return 1.0;
        return Math.max(0.0, 1.0 - ((double) distance / maxLen));
    }

    /**
     * Computes full 2D Dynamic Programming cost matrix and backtracks optimal alignment
     */
    public static DPMatrixResult computeDetailedMatrix(String s1, String s2) {
        List<String> s = tokenize(s1);
        List<String> t = tokenize(s2);
        int m = s.size();
        int n = t.size();

        int[][] matrix = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) matrix[i][0] = i;
        for (int j = 0; j <= n; j++) matrix[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int cost = s.get(i - 1).equals(t.get(j - 1)) ? 0 : 1;
                int del = matrix[i - 1][j] + 1;
                int ins = matrix[i][j - 1] + 1;
                int sub = matrix[i - 1][j - 1] + cost;
                matrix[i][j] = Math.min(del, Math.min(ins, sub));
            }
        }

        // Backtrack optimal alignment path
        List<AlignmentStep> alignment = new ArrayList<>();
        int currI = m;
        int currJ = n;
        int matches = 0, substitutions = 0, insertions = 0, deletions = 0;

        while (currI > 0 || currJ > 0) {
            if (currI > 0 && currJ > 0) {
                int cost = s.get(currI - 1).equals(t.get(currJ - 1)) ? 0 : 1;
                int subCost = matrix[currI - 1][currJ - 1] + cost;
                int delCost = matrix[currI - 1][currJ] + 1;
                int insCost = matrix[currI][currJ - 1] + 1;

                if (matrix[currI][currJ] == subCost) {
                    OperationType op = (cost == 0) ? OperationType.MATCH : OperationType.SUBSTITUTE;
                    alignment.add(new AlignmentStep(op, s.get(currI - 1), t.get(currJ - 1), currI - 1, currJ - 1, cost));
                    if (cost == 0) matches++; else substitutions++;
                    currI--;
                    currJ--;
                    continue;
                } else if (matrix[currI][currJ] == delCost) {
                    alignment.add(new AlignmentStep(OperationType.DELETE, s.get(currI - 1), "", currI - 1, -1, 1));
                    deletions++;
                    currI--;
                    continue;
                } else if (matrix[currI][currJ] == insCost) {
                    alignment.add(new AlignmentStep(OperationType.INSERT, "", t.get(currJ - 1), -1, currJ - 1, 1));
                    insertions++;
                    currJ--;
                    continue;
                }
            }

            if (currI > 0) {
                alignment.add(new AlignmentStep(OperationType.DELETE, s.get(currI - 1), "", currI - 1, -1, 1));
                deletions++;
                currI--;
            } else if (currJ > 0) {
                alignment.add(new AlignmentStep(OperationType.INSERT, "", t.get(currJ - 1), -1, currJ - 1, 1));
                insertions++;
                currJ--;
            }
        }

        Collections.reverse(alignment);
        int distance = matrix[m][n];
        double score = calculateSimilarityScore(distance, m, n);

        return new DPMatrixResult(matrix, distance, s, t, alignment, score, matches, substitutions, insertions, deletions);
    }
}
