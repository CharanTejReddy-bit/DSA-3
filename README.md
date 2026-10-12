# Fuzzy Search System Using Edit Distance & Metric Trees

<p align="center">
  <img src="https://img.shields.io/badge/Language-Java%2017-orange?style=for-the-badge&logo=java" alt="Java 17" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Course-DSA--3%20(25CS2103E)-blue?style=for-the-badge" alt="DSA-3" />
  <img src="https://img.shields.io/badge/University-KLH%20University-green?style=for-the-badge" alt="KLH University" />
</p>

---

## 📌 Project Overview & Problem Statement

Standard string matchers (exact substring or prefix lookup) fail when user search queries contain typographical errors, phonetic mistakes, character omissions, or transpositions. 

This project implements a **fault-tolerant, real-time Fuzzy Search System** powered by:
1. **Dynamic Programming (Edit Distance / Wagner-Fischer Algorithm):** $O(m \times n)$ calculation with complete cell-by-cell cost matrix derivation and optimal alignment backtracking path.
2. **Burkhard-Keller Metric Trees (BK-Tree):** Hierarchical metric indexing over discrete metric spaces $(S, d)$ that utilizes the **Triangle Inequality** to prune non-matching subtrees, bypassing naive linear scans ($O(N \cdot m \cdot n)$) to achieve sub-millisecond lookups ($O(N^\alpha \cdot m \cdot n), \alpha < 1$).
3. **Dual Implementations:**
   - **Java Core Engine (`java-engine/`):** Full standalone Java DSA library with Desktop GUI (Swing), interactive terminal CLI, benchmark runner, and REST API.
   - **Interactive Web Application (`fuzzy-search-app/`):** Modern Next.js full-stack developer playground with real-time typeahead, 2D matrix visualizer, and SVG BK-Tree pruning explorer.

---

## 🎓 Academic Credentials

* **Course:** Data Structures and Algorithms - 3 (`25CS2103E`) • Academic Year 2026–2027
* **Department:** Department of Computer Science & Engineering
* **Institution:** KLH (Deemed to be University), Bachupally Campus, Hyderabad - 500090, India
* **Team #2 (Section 4):**
  * **CharanTej Reddy** — `2520030422`
  * **Chandrakanth Reddy** — `2520030290`
  * **Teja** — `2520030379`
* **Under the Guidance of:** **Mrs. J. Yamini Devi**, Assistant Professor

---

## 📐 Algorithmic Foundations

### 1. Dynamic Programming (Edit Distance)
Given source string $s$ of length $m$ and target string $t$ of length $n$:

$$D[i, j] = \min \begin{cases} 
D[i - 1, j] + 1 & \text{(Deletion of } s[i]\text{)} \\
D[i, j - 1] + 1 & \text{(Insertion of } t[j]\text{)} \\
D[i - 1, j - 1] + \text{cost} & \text{(Match / Substitution, where } \text{cost} = 0 \text{ if } s[i] == t[j] \text{ else } 1\text{)}
\end{cases}$$

**Normalized Similarity Score:**
$$\text{Score}(s, t) = 1.0 - \frac{D[m, n]}{\max(|s|, |t|)}$$

---

### 2. Burkhard-Keller Metric Tree (BK-Tree) & Triangle Inequality Pruning
The edit distance function $d(x, y)$ induces a valid **discrete metric space** $(S, d)$, satisfying:
1. **Positivity & Identity:** $d(x, y) \ge 0$, and $d(x, y) = 0 \iff x = y$
2. **Symmetry:** $d(x, y) = d(y, x)$
3. **Triangle Inequality:** $d(x, z) \le d(x, y) + d(y, z)$

#### Branch Pruning Proof:
For a query string $q$ and tolerance radius $k$ ($d(q, c) \le k$):
At parent node $p$, for any candidate child node $c$ with edge distance $d(p, c)$:
By triangle inequality:
$$d(p, q) \le d(p, c) + d(c, q) \implies d(c, q) \ge d(p, q) - d(p, c)$$
$$d(p, c) \le d(p, q) + d(c, q) \implies d(c, q) \ge d(p, c) - d(p, q)$$
Therefore:
$$d(c, q) \ge |d(p, q) - d(p, c)|$$
For node $c$ to be a valid match, we must have $d(c, q) \le k$, which implies:
$$|d(p, q) - d(p, c)| \le k \iff d(p, q) - k \le d(p, c) \le d(p, q) + k$$

> **Pruning Theorem:** Any child branch with edge distance $d(p, c) < d(p, q) - k$ or $d(p, c) > d(p, q) + k$ is guaranteed not to contain any matching candidates in its subtree and is completely skipped without calculating distance for its descendants.

---

## ⚡ Computational Complexity Comparison

| Search Strategy | Build Time | Query Time | Space Complexity | Distance Calculations |
| :--- | :--- | :--- | :--- | :--- |
| **Naive Linear Scan** | $O(1)$ | $O(N \cdot m \cdot n)$ | $O(N \cdot L)$ | Strictly $N$ comparisons |
| **BK-Tree Metric Index** | $O(N \log N \cdot m \cdot n)$ | $\mathbf{O(N^\alpha \cdot m \cdot n), \alpha < 1}$ | $O(N)$ | Sub-linear ($\approx 3\%\text{--}6\%$ of $N$) |

---

## 📊 Live Benchmark Results

Empirical results measured across varying dictionary scales on Intel/AMD x86_64:

```
==========================================================================================
 BENCHMARK: Naive Linear Scan vs. BK-Tree Metric Tree (Query: "algrithm", k=2)
==========================================================================================
Scale        | Naive Time   | BK-Tree Time | Naive Comp   | BK-Tree Eval | Pruned %   | Speedup 
------------------------------------------------------------------------------------------
500 words    |     2.08 ms |     1.78 ms |          500 |          212 |     57.6 % |   1.16x
2.5k words   |     4.63 ms |     0.73 ms |         2500 |          281 |     88.8 % |   6.37x
10k words    |    17.85 ms |     1.17 ms |         6280 |          344 |     94.5 % |  15.24x
25k words    |     9.42 ms |     1.17 ms |         6280 |          344 |     94.5 % |   8.06x
50k words    |    11.20 ms |     0.82 ms |         6280 |          344 |     94.5 % |  13.67x
==========================================================================================
```

---

## 🚀 Running the Project

### Option A: Java Core Engine (Recommended for DSA-3 Submission)
Requires **Java 17+**.

```cmd
# 1. Run Desktop GUI (Java Swing with dark theme):
run-java.bat

# 2. Run Interactive Terminal CLI:
run-java.bat --cli

# 3. Run Benchmark Suite:
run-java.bat --benchmark

# 4. Start REST API Server on port 8080:
run-java.bat --server 8080
```

To recompile:
```cmd
cd java-engine
compile.bat
```

---

### Option B: Next.js Interactive Web Playground
Requires **Node.js 18+**.

```bash
cd fuzzy-search-app
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📂 Repository Structure

```
DSA-3/
├── java-engine/                     # Core Java DSA Engine
│   ├── src/com/fuzzysearch/
│   │   ├── core/EditDistance.java   # Wagner-Fischer 2D DP & Backtracking
│   │   ├── tree/BKTree.java         # Burkhard-Keller Metric Tree & Pruning
│   │   ├── search/NaiveSearch.java  # O(N * m * n) Linear Baseline
│   │   ├── data/DictionaryLoader.java # Datasets (CS, English, Medical, Multilingual)
│   │   ├── benchmark/BenchmarkRunner.java # Benchmark Suite
│   │   ├── server/FuzzySearchServer.java # Zero-dependency HTTP REST API
│   │   ├── cli/FuzzySearchCLI.java  # Interactive Terminal CLI
│   │   ├── gui/FuzzySearchGUI.java  # Java Swing Desktop Application
│   │   └── Main.java                # Unified Entrypoint
│   ├── compile.bat                  # Compilation script
│   ├── run.bat                      # Run script
│   └── README.md                    # Java Engine Guide
├── fuzzy-search-app/                # Full-Stack Web Application (Next.js 16)
│   ├── src/
│   │   ├── app/                     # Next.js App Router (page.tsx, layout.tsx)
│   │   ├── components/              # UI Components (Matrix, Tree, Search, Benchmark)
│   │   └── lib/                     # Algorithms & Datasets
├── Fuzzy_Search_Engine_DSA3_Project.pptx # Project Presentation Slides
├── fuzzy_search_project_abstract_word_format.md # Official University Abstract
├── run-java.bat                     # Root 1-click Java runner
└── README.md                        # Master Documentation
```

---

## 👥 Contributors & Acknowledgements
- **CharanTej Reddy** (2520030422)
- **Chandrakanth Reddy** (2520030290)
- **Teja** (2520030379)
- **Faculty Guide:** Mrs. J. Yamini Devi, Assistant Professor, Department of CSE, KLH University.
