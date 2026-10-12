package com.fuzzysearch.tree;

import com.fuzzysearch.core.EditDistance;

import java.util.*;

/**
 * Burkhard-Keller Metric Tree (BK-Tree) Implementation
 * Harnesses the Triangle Inequality property of discrete metric spaces:
 * |d(p, q) - d(p, c)| <= d(c, q) <= k  ==>  d(p, q) - k <= d(p, c) <= d(p, q) + k
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */
public class BKTree {

    public static class BKNode {
        private final String word;
        private final Map<Integer, BKNode> children;
        private final int depth;
        private final int distanceToParent;

        public BKNode(String word, int depth, int distanceToParent) {
            this.word = word;
            this.depth = depth;
            this.distanceToParent = distanceToParent;
            this.children = new TreeMap<>(); // Sorted by distance for consistent traversal
        }

        public String getWord() { return word; }
        public Map<Integer, BKNode> getChildren() { return children; }
        public int getDepth() { return depth; }
        public int getDistanceToParent() { return distanceToParent; }
    }

    public static class SearchMatch implements Comparable<SearchMatch> {
        private final String word;
        private final int distance;
        private final double similarityScore;
        private final int depth;

        public SearchMatch(String word, int distance, double similarityScore, int depth) {
            this.word = word;
            this.distance = distance;
            this.similarityScore = similarityScore;
            this.depth = depth;
        }

        public String getWord() { return word; }
        public int getDistance() { return distance; }
        public double getSimilarityScore() { return similarityScore; }
        public int getDepth() { return depth; }

        @Override
        public int compareTo(SearchMatch other) {
            if (this.distance != other.distance) {
                return Integer.compare(this.distance, other.distance);
            }
            if (Double.compare(other.similarityScore, this.similarityScore) != 0) {
                return Double.compare(other.similarityScore, this.similarityScore);
            }
            return this.word.compareTo(other.word);
        }
    }

    public static class TraversalStep {
        private final String word;
        private final int distanceToQuery;
        private final boolean isMatch;
        private final int minEdge;
        private final int maxEdge;
        private final List<Integer> exploredEdges;
        private final List<Integer> prunedEdges;

        public TraversalStep(String word, int distanceToQuery, boolean isMatch,
                             int minEdge, int maxEdge, List<Integer> exploredEdges, List<Integer> prunedEdges) {
            this.word = word;
            this.distanceToQuery = distanceToQuery;
            this.isMatch = isMatch;
            this.minEdge = minEdge;
            this.maxEdge = maxEdge;
            this.exploredEdges = exploredEdges;
            this.prunedEdges = prunedEdges;
        }

        public String getWord() { return word; }
        public int getDistanceToQuery() { return distanceToQuery; }
        public boolean isMatch() { return isMatch; }
        public int getMinEdge() { return minEdge; }
        public int getMaxEdge() { return maxEdge; }
        public List<Integer> getExploredEdges() { return exploredEdges; }
        public List<Integer> getPrunedEdges() { return prunedEdges; }
    }

    public static class SearchResult {
        private final List<SearchMatch> matches;
        private final int visitedNodesCount;
        private final int prunedBranchesCount;
        private final int totalNodesInTree;
        private final double searchTimeMs;
        private final List<TraversalStep> traversalTrace;

        public SearchResult(List<SearchMatch> matches, int visitedNodesCount, int prunedBranchesCount,
                            int totalNodesInTree, double searchTimeMs, List<TraversalStep> traversalTrace) {
            this.matches = matches;
            this.visitedNodesCount = visitedNodesCount;
            this.prunedBranchesCount = prunedBranchesCount;
            this.totalNodesInTree = totalNodesInTree;
            this.searchTimeMs = searchTimeMs;
            this.traversalTrace = traversalTrace;
        }

        public List<SearchMatch> getMatches() { return matches; }
        public int getVisitedNodesCount() { return visitedNodesCount; }
        public int getPrunedBranchesCount() { return prunedBranchesCount; }
        public int getTotalNodesInTree() { return totalNodesInTree; }
        public double getSearchTimeMs() { return searchTimeMs; }
        public List<TraversalStep> getTraversalTrace() { return traversalTrace; }
        public double getPrunedPercentage() {
            if (totalNodesInTree == 0) return 0.0;
            return Math.max(0.0, ((double) (totalNodesInTree - visitedNodesCount) / totalNodesInTree) * 100.0);
        }
    }

    private BKNode root;
    private int size;
    private int maxDepth;

    public BKTree() {
        this.root = null;
        this.size = 0;
        this.maxDepth = 0;
    }

    public BKTree(Collection<String> words) {
        this();
        build(words);
    }

    public void build(Collection<String> words) {
        this.root = null;
        this.size = 0;
        this.maxDepth = 0;

        Set<String> uniqueWords = new LinkedHashSet<>();
        for (String w : words) {
            if (w != null && !w.trim().isEmpty()) {
                uniqueWords.add(w.trim());
            }
        }

        for (String word : uniqueWords) {
            insert(word);
        }
    }

    public void insert(String word) {
        if (word == null || word.trim().isEmpty()) return;
        String clean = word.trim();

        if (root == null) {
            root = new BKNode(clean, 0, 0);
            size = 1;
            maxDepth = 0;
            return;
        }

        BKNode current = root;
        int depth = 0;

        while (true) {
            depth++;
            int dist = EditDistance.calculateDistance(current.getWord(), clean);

            if (dist == 0) {
                // Word already in tree
                return;
            }

            BKNode child = current.getChildren().get(dist);
            if (child != null) {
                current = child;
            } else {
                BKNode newNode = new BKNode(clean, depth, dist);
                current.getChildren().put(dist, newNode);
                size++;
                if (depth > maxDepth) {
                    maxDepth = depth;
                }
                return;
            }
        }
    }

    public SearchResult search(String query, int maxTolerance) {
        long startNanos = System.nanoTime();
        if (query == null || query.trim().isEmpty() || root == null) {
            return new SearchResult(Collections.emptyList(), 0, 0, size, 0.0, Collections.emptyList());
        }

        String cleanQuery = query.trim();
        List<SearchMatch> matches = new ArrayList<>();
        List<TraversalStep> trace = new ArrayList<>();
        int visitedCount = 0;
        int prunedCount = 0;

        Queue<BKNode> queue = new ArrayDeque<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            BKNode node = queue.poll();
            visitedCount++;

            int dist = EditDistance.calculateDistance(node.getWord(), cleanQuery);
            boolean isMatch = (dist <= maxTolerance);

            if (isMatch) {
                double score = EditDistance.calculateSimilarityScore(dist, cleanQuery.length(), node.getWord().length());
                matches.add(new SearchMatch(node.getWord(), dist, score, node.getDepth()));
            }

            // Triangle inequality bounds: [dist - k, dist + k]
            int minEdge = Math.max(1, dist - maxTolerance);
            int maxEdge = dist + maxTolerance;

            List<Integer> explored = new ArrayList<>();
            List<Integer> pruned = new ArrayList<>();

            for (Map.Entry<Integer, BKNode> entry : node.getChildren().entrySet()) {
                int edge = entry.getKey();
                if (edge >= minEdge && edge <= maxEdge) {
                    explored.add(edge);
                    queue.add(entry.getValue());
                } else {
                    prunedCount++;
                    pruned.add(edge);
                }
            }

            trace.add(new TraversalStep(node.getWord(), dist, isMatch, minEdge, maxEdge, explored, pruned));
        }

        Collections.sort(matches);
        long endNanos = System.nanoTime();
        double timeMs = (endNanos - startNanos) / 1_000_000.0;

        return new SearchResult(matches, visitedCount, prunedCount, size, timeMs, trace);
    }

    public BKNode getRoot() { return root; }
    public int getSize() { return size; }
    public int getMaxDepth() { return maxDepth; }
}
