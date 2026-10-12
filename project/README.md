# Fuzzy Search System — Project Codebase

This folder contains all the source code implementations for the **Fuzzy Search System Using Edit Distance & Metric Trees** project (DSA-3, KLH University).

## Subprojects:

1. **`java-engine/` (Core Java Project):**
   - Pure Java 17 implementation of Edit Distance Dynamic Programming and Burkhard-Keller (BK-Tree) metric tree.
   - Includes:
     - Swing Desktop GUI (`com.fuzzysearch.gui.FuzzySearchGUI`)
     - Terminal Interactive CLI (`com.fuzzysearch.cli.FuzzySearchCLI`)
     - Live Benchmark Suite (`com.fuzzysearch.benchmark.BenchmarkRunner`)
     - REST API Server (`com.fuzzysearch.server.FuzzySearchServer`)
   - How to run:
     ```cmd
     cd java-engine
     run.bat          (Launches Desktop GUI)
     run.bat --cli    (Launches Terminal CLI)
     run.bat --benchmark (Runs Big-O benchmark)
     ```

2. **`fuzzy-search-app/` (Interactive Full-Stack Web App):**
   - Built with Next.js 16, TypeScript, Tailwind CSS, and Lucide Icons.
   - Features real-time typeahead fuzzy search, 2D Wagner-Fischer DP matrix visualizer with cell derivations, and interactive SVG BK-Tree pruning explorer.
   - How to run:
     ```cmd
     cd fuzzy-search-app
     npm install
     npm run dev
     ```
