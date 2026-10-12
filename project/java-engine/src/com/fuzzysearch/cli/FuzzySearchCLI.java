package com.fuzzysearch.cli;

import com.fuzzysearch.benchmark.BenchmarkRunner;
import com.fuzzysearch.core.EditDistance;
import com.fuzzysearch.data.DictionaryLoader;
import com.fuzzysearch.tree.BKTree;

import java.util.*;

/**
 * Interactive Command Line Interface for Fuzzy Search
 * Allows terminal testing, demonstrations, and grading
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */
public class FuzzySearchCLI {

    private final Map<String, BKTree> trees = new HashMap<>();
    private String activeDict = "tech-cs";
    private int tolerance = 2;

    public FuzzySearchCLI() {
        trees.put("tech-cs", new BKTree(DictionaryLoader.TECH_CS_WORDS));
        trees.put("common-english", new BKTree(DictionaryLoader.COMMON_ENGLISH));
        trees.put("medical", new BKTree(DictionaryLoader.MEDICAL_WORDS));
        trees.put("multilingual", new BKTree(DictionaryLoader.MULTILINGUAL_WORDS));
    }

    public void start() {
        Scanner scanner = new Scanner(System.in);
        printBanner();

        while (true) {
            System.out.print("\n[FuzzySearch:" + activeDict + " (k=" + tolerance + ")]> ");
            if (!scanner.hasNextLine()) break;
            String line = scanner.nextLine().trim();

            if (line.equalsIgnoreCase("exit") || line.equalsIgnoreCase("quit")) {
                System.out.println("Exiting Fuzzy Search System. Goodbye!");
                break;
            } else if (line.equalsIgnoreCase("help")) {
                printHelp();
            } else if (line.startsWith("dict ")) {
                handleDict(line.substring(5).trim());
            } else if (line.startsWith("k ")) {
                handleTolerance(line.substring(2).trim());
            } else if (line.startsWith("matrix ")) {
                handleMatrix(line.substring(7).trim());
            } else if (line.startsWith("benchmark")) {
                handleBenchmark(line);
            } else if (!line.isEmpty()) {
                handleSearch(line);
            }
        }
    }

    private void handleSearch(String query) {
        BKTree tree = trees.get(activeDict);
        BKTree.SearchResult res = tree.search(query, tolerance);

        System.out.printf("Search results for \"%s\" (k=%d):%n", query, tolerance);
        System.out.printf("-> Latency: %.3f ms | Nodes Evaluated: %d / %d | Pruned Savings: %.1f%%%n",
                res.getSearchTimeMs(), res.getVisitedNodesCount(), res.getTotalNodesInTree(), res.getPrunedPercentage());

        List<BKTree.SearchMatch> matches = res.getMatches();
        if (matches.isEmpty()) {
            System.out.println("   No matching candidates found within edit distance k = " + tolerance);
        } else {
            System.out.printf("   %-4s | %-24s | %-9s | %-12s%n", "Rank", "Candidate Word", "Distance", "Similarity");
            System.out.println("   --------------------------------------------------------");
            int rank = 1;
            for (BKTree.SearchMatch m : matches) {
                System.out.printf("   #%-3d | %-24s | d = %-5d | %6.1f %%%n",
                        rank++, m.getWord(), m.getDistance(), m.getSimilarityScore() * 100);
                if (rank > 15) {
                    System.out.printf("   ... and %d more candidate matches.%n", matches.size() - 15);
                    break;
                }
            }
        }
    }

    private void handleMatrix(String args) {
        String[] parts = args.split("\\s+");
        if (parts.length < 2) {
            System.out.println("Usage: matrix <source_word> <target_word>");
            return;
        }
        String s = parts[0];
        String t = parts[1];

        EditDistance.DPMatrixResult res = EditDistance.computeDetailedMatrix(s, t);
        int[][] mat = res.getMatrix();
        List<String> sTokens = res.getSourceTokens();
        List<String> tTokens = res.getTargetTokens();

        System.out.println("\n2D Edit Distance Cost Matrix: \"" + s + "\" -> \"" + t + "\"");
        System.out.print("      ε");
        for (String c : tTokens) System.out.printf("  %s", c);
        System.out.println();

        for (int i = 0; i <= sTokens.size(); i++) {
            if (i == 0) System.out.print("  ε ");
            else System.out.printf("  %s ", sTokens.get(i - 1));

            for (int j = 0; j <= tTokens.size(); j++) {
                System.out.printf("%3d", mat[i][j]);
            }
            System.out.println();
        }

        System.out.printf("%nDistance: %d | Similarity: %.1f%%%n", res.getDistance(), res.getSimilarityScore() * 100);
        System.out.println("Alignment Operations: " + res.getAlignment());
    }

    private void handleBenchmark(String line) {
        String query = "algrithm";
        String[] parts = line.split("\\s+");
        if (parts.length > 1) query = parts[1];
        BenchmarkRunner.printReport(query, tolerance);
    }

    private void handleDict(String name) {
        if (trees.containsKey(name)) {
            activeDict = name;
            System.out.println("Active dictionary set to: " + name + " (" + trees.get(name).getSize() + " words)");
        } else {
            System.out.println("Unknown dictionary. Available: " + trees.keySet());
        }
    }

    private void handleTolerance(String val) {
        try {
            int k = Integer.parseInt(val);
            if (k >= 0 && k <= 10) {
                tolerance = k;
                System.out.println("Edit distance tolerance set to k = " + tolerance);
            } else {
                System.out.println("Tolerance k must be between 0 and 10.");
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid number.");
        }
    }

    private void printBanner() {
        System.out.println("==================================================================");
        System.out.println("   FUZZY SEARCH SYSTEM USING EDIT DISTANCE & BK-TREES (JAVA)");
        System.out.println("   Course: Data Structures and Algorithms - 3 (25CS2103E)");
        System.out.println("   KLH University, Bachupally | Team #2, Section 4");
        System.out.println("   CharanTej Reddy • Chandrakanth Reddy • Teja");
        System.out.println("   Guide: Mrs. J. Yamini Devi, Assistant Professor");
        System.out.println("==================================================================");
        System.out.println("Type any word to perform fuzzy search, or 'help' for commands.");
    }

    private void printHelp() {
        System.out.println("\nCommands:");
        System.out.println("  <word>               Search word in BK-tree with current tolerance");
        System.out.println("  k <number>           Change maximum edit distance tolerance (e.g. k 2)");
        System.out.println("  dict <name>          Switch dictionary (tech-cs, common-english, medical, multilingual)");
        System.out.println("  matrix <w1> <w2>     Print full 2D Edit Distance Dynamic Programming matrix");
        System.out.println("  benchmark [query]    Run side-by-side benchmark comparing Naive vs BK-Tree");
        System.out.println("  exit / quit          Exit application");
    }
}
