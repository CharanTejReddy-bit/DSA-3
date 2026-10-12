# Fuzzy Search System Using Edit Distance & Metric Trees (Java Engine)

**Course:** Data Structures and Algorithms - 3 (`25CS2103E`) • A.Y. 2026–2027  
**Institution:** KLH (Deemed to be University), Bachupally, Hyderabad  
**Team 2 (Section 4):**
- CharanTej Reddy (2520030422)
- Chandrakanth Reddy (2520030290)
- Teja (2520030379)  
**Supervisor / Faculty Guide:** Mrs. J. Yamini Devi, Assistant Professor

---

## 1. Project Architecture

The Java engine is organized into clean, modular packages:

```
src/com/fuzzysearch/
├── core/
│   └── EditDistance.java       # Wagner-Fischer 2D Dynamic Programming & Backtracking
├── tree/
│   └── BKTree.java             # Burkhard-Keller Metric Tree with Triangle Inequality Pruning
├── search/
│   └── NaiveSearch.java        # Exhaustive O(N * m * n) Linear Baseline
├── data/
│   └── DictionaryLoader.java   # CS, English, Medical, and Multilingual Unicode sets
├── benchmark/
│   └── BenchmarkRunner.java    # Big-O comparative benchmark suite
├── server/
│   └── FuzzySearchServer.java  # Lightweight REST API server (zero dependencies)
├── cli/
│   └── FuzzySearchCLI.java     # Interactive terminal command line interface
├── gui/
│   └── FuzzySearchGUI.java     # Modern Java Swing Desktop UI
└── Main.java                   # Master application entrypoint
```

---

## 2. Quick Start & Execution

### Compile:
Run the compilation batch script:
```cmd
compile.bat
```
or manually:
```cmd
javac -d bin -encoding UTF-8 src\com\fuzzysearch\core\*.java src\com\fuzzysearch\tree\*.java src\com\fuzzysearch\search\*.java src\com\fuzzysearch\data\*.java src\com\fuzzysearch\benchmark\*.java src\com\fuzzysearch\server\*.java src\com\fuzzysearch\cli\*.java src\com\fuzzysearch\gui\*.java src\com\fuzzysearch\Main.java
```

### Run Options:

1. **Launch Desktop GUI:**
   ```cmd
   run.bat
   ```
   *(Launches the interactive Swing desktop application with search playground, 2D DP matrix visualizer, and benchmark runner)*

2. **Launch Terminal CLI:**
   ```cmd
   run.bat --cli
   ```
   *(Interactive command line interface for quick word queries, tolerance tuning, and matrix display)*

3. **Run Big-O Benchmark Suite:**
   ```cmd
   run.bat --benchmark
   ```
   *(Compares Naive Linear Scan vs. BK-Tree across dictionary scales from 500 to 50k words)*

4. **Launch Built-in REST API Server:**
   ```cmd
   run.bat --server 8080
   ```
   *(Serves JSON endpoints at `http://localhost:8080/api/search`, `/api/matrix`, `/api/benchmark`)*

---

## 3. Algorithmic Formulations

### Dynamic Programming (Edit Distance)
$$D[i, j] = \min \begin{cases} 
D[i - 1, j] + 1 & \text{(Deletion)} \\
D[i, j - 1] + 1 & \text{(Insertion)} \\
D[i - 1, j - 1] + \text{cost} & \text{(Match / Substitution)} 
\end{cases}$$

### Triangle Inequality Metric Pruning
Given query $q$ and tolerance radius $k$, at node $p$, for every child branch with edge distance $d(p, c)$:
$$|d(p, q) - d(p, c)| \le k \iff d(p, q) - k \le d(p, c) \le d(p, q) + k$$
Any branch outside this window is mathematically guaranteed to violate $d(c, q) \le k$ and is pruned.
