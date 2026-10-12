package com.fuzzysearch.benchmark;

import com.fuzzysearch.data.DictionaryLoader;
import com.fuzzysearch.search.NaiveSearch;
import com.fuzzysearch.tree.BKTree;

import java.util.ArrayList;
import java.util.List;

/**
 * Benchmark Harness: Naive Linear Scan vs. BK-Tree Metric Tree
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 */
public class BenchmarkRunner {

    public static class BenchmarkRow {
        public final int size;
        public final String label;
        public final double naiveTimeMs;
        public final double bkTreeTimeMs;
        public final int naiveComparisons;
        public final int bkTreeVisited;
        public final double comparisonsSavedPercent;
        public final double speedupFactor;

        public BenchmarkRow(int size, String label, double naiveTimeMs, double bkTreeTimeMs,
                            int naiveComparisons, int bkTreeVisited,
                            double comparisonsSavedPercent, double speedupFactor) {
            this.size = size;
            this.label = label;
            this.naiveTimeMs = naiveTimeMs;
            this.bkTreeTimeMs = bkTreeTimeMs;
            this.naiveComparisons = naiveComparisons;
            this.bkTreeVisited = bkTreeVisited;
            this.comparisonsSavedPercent = comparisonsSavedPercent;
            this.speedupFactor = speedupFactor;
        }
    }

    public static List<BenchmarkRow> runSuite(String testQuery, int tolerance) {
        int[] sizes = {500, 2500, 10000, 25000, 50000};
        String[] labels = {"500 words", "2.5k words", "10k words", "25k words", "50k words"};
        List<BenchmarkRow> rows = new ArrayList<>();

        List<String> base = new ArrayList<>(DictionaryLoader.TECH_CS_WORDS);
        base.addAll(DictionaryLoader.COMMON_ENGLISH);

        for (int i = 0; i < sizes.length; i++) {
            int size = sizes[i];
            String label = labels[i];
            List<String> dict = DictionaryLoader.generateSynthetic(base, size);

            // Warm up
            NaiveSearch.search(dict, testQuery, tolerance);
            BKTree tree = new BKTree(dict);
            tree.search(testQuery, tolerance);

            // Benchmark Naive (average of 3 runs)
            double naiveTotal = 0;
            int naiveComp = 0;
            for (int r = 0; r < 3; r++) {
                NaiveSearch.NaiveResult nRes = NaiveSearch.search(dict, testQuery, tolerance);
                naiveTotal += nRes.getSearchTimeMs();
                naiveComp = nRes.getComparisonsCount();
            }
            double naiveAvg = naiveTotal / 3.0;

            // Benchmark BK-Tree (average of 5 runs)
            double bkTotal = 0;
            int bkVisited = 0;
            for (int r = 0; r < 5; r++) {
                BKTree.SearchResult bRes = tree.search(testQuery, tolerance);
                bkTotal += bRes.getSearchTimeMs();
                bkVisited = bRes.getVisitedNodesCount();
            }
            double bkAvg = bkTotal / 5.0;

            double saved = Math.max(0.0, ((double)(naiveComp - bkVisited) / naiveComp) * 100.0);
            double speedup = bkAvg > 0.0001 ? (naiveAvg / bkAvg) : 1.0;

            rows.add(new BenchmarkRow(size, label, naiveAvg, bkAvg, naiveComp, bkVisited, saved, speedup));
        }

        return rows;
    }

    public static void printReport(String testQuery, int tolerance) {
        System.out.println("==========================================================================================");
        System.out.println(" BENCHMARK: Naive Linear Scan vs. BK-Tree Metric Tree (Query: \"" + testQuery + "\", k=" + tolerance + ")");
        System.out.println("==========================================================================================");
        System.out.printf("%-12s | %-12s | %-12s | %-12s | %-12s | %-10s | %-8s%n",
                "Scale", "Naive Time", "BK-Tree Time", "Naive Comp", "BK-Tree Eval", "Pruned %", "Speedup");
        System.out.println("------------------------------------------------------------------------------------------");

        List<BenchmarkRow> rows = runSuite(testQuery, tolerance);
        for (BenchmarkRow r : rows) {
            System.out.printf("%-12s | %8.2f ms | %8.2f ms | %12d | %12d | %8.1f %% | %6.2fx%n",
                    r.label, r.naiveTimeMs, r.bkTreeTimeMs, r.naiveComparisons, r.bkTreeVisited,
                    r.comparisonsSavedPercent, r.speedupFactor);
        }
        System.out.println("==========================================================================================");
    }
}
