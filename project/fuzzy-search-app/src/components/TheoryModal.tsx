'use client';

import React from 'react';
import { X, BookOpen, GitFork, Calculator, Network, CheckCircle2, ArrowRight } from 'lucide-react';

interface TheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-700/50 text-xs font-mono mb-2">
            <BookOpen className="w-4 h-4" />
            <span>ALGORITHM DESIGN & COMPUTATIONAL COMPLEXITY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Edit Distance & Burkhard-Keller Metric Trees
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Formal mathematical foundations, recurrence relations, and triangle inequality proofs.
          </p>
        </div>

        {/* Content Tabs / Sections */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          
          {/* Section 1: Edit Distance & DP */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-base font-semibold text-cyan-300 flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>1. Dynamic Programming Formulation (Edit Distance)</span>
            </h3>
            <p className="mb-3 text-xs sm:text-sm">
              Given two strings <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">s</code> of length <code className="text-cyan-300 font-mono">m</code> and <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">t</code> of length <code className="text-cyan-300 font-mono">n</code>, the edit distance is the minimum number of single-character operations (insertions, deletions, substitutions) required to transform <code className="text-cyan-300 font-mono">s</code> into <code className="text-cyan-300 font-mono">t</code>.
            </p>
            <div className="p-4 rounded-lg bg-slate-900/90 border border-cyan-500/20 font-mono text-xs text-cyan-200 overflow-x-auto space-y-2">
              <div className="text-slate-400">// Base Cases</div>
              <div>D[i, 0] = i   (∀ 0 ≤ i ≤ m: i deletions)</div>
              <div>D[0, j] = j   (∀ 0 ≤ j ≤ n: j insertions)</div>
              <div className="text-slate-400 pt-2">// Recurrence Relation (Wagner–Fischer Algorithm)</div>
              <div className="text-white font-bold">
                D[i, j] = min &#123;
              </div>
              <div className="pl-6 text-emerald-300">D[i - 1, j] + 1                     (Deletion of s[i])</div>
              <div className="pl-6 text-cyan-300">D[i, j - 1] + 1                     (Insertion of t[j])</div>
              <div className="pl-6 text-amber-300">D[i - 1, j - 1] + cost(s[i], t[j])   (Match or Substitution)</div>
              <div className="text-white font-bold">&#125;</div>
              <div className="text-slate-400 text-[11px] pt-1">
                where cost(s[i], t[j]) = 0 if s[i] == t[j], else 1.
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="text-cyan-400">Time Complexity: O(m · n)</span>
              <span>•</span>
              <span className="text-emerald-400">Space Complexity: O(min(m, n)) [1D row optimization]</span>
            </div>
          </div>

          {/* Section 2: Metric Space & BK-Tree */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-base font-semibold text-emerald-300 flex items-center gap-2 mb-3">
              <Network className="w-4 h-4 text-emerald-400" />
              <span>2. Metric Space Axioms & Burkhard-Keller Metric Tree</span>
            </h3>
            <p className="mb-3 text-xs sm:text-sm">
              The Levenshtein edit distance function <code className="text-emerald-300 font-mono">d(x, y)</code> induces a valid <strong>Discrete Metric Space</strong> <code className="text-emerald-300 font-mono">(S, d)</code> over strings, satisfying:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono mb-4">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">1. Positivity & Identity:</span>
                <p className="text-slate-300 mt-0.5">d(x, y) ≥ 0, and d(x, y) = 0 ⇔ x = y</p>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">2. Symmetry:</span>
                <p className="text-slate-300 mt-0.5">d(x, y) = d(y, x) ∀ x, y ∈ S</p>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 sm:col-span-2">
                <span className="text-emerald-400 font-bold">3. Triangle Inequality:</span>
                <p className="text-slate-300 mt-0.5">d(x, z) ≤ d(x, y) + d(y, z) ∀ x, y, z ∈ S</p>
              </div>
            </div>
          </div>

          {/* Section 3: Triangle Inequality Pruning Proof */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-base font-semibold text-purple-300 flex items-center gap-2 mb-3">
              <GitFork className="w-4 h-4 text-purple-400" />
              <span>3. Mathematical Proof of Branch Pruning</span>
            </h3>
            <p className="text-xs sm:text-sm mb-3">
              Let <code className="text-purple-300 font-mono">q</code> be the query, <code className="text-purple-300 font-mono">p</code> be the current BK-tree parent node, <code className="text-purple-300 font-mono">c</code> be a candidate child node with edge distance <code className="text-purple-300 font-mono">d(p, c)</code>, and <code className="text-purple-300 font-mono">k</code> be the maximum error tolerance ($d(q, c) \le k$).
            </p>
            <div className="p-4 rounded-lg bg-slate-900/90 border border-purple-500/20 text-xs font-mono text-purple-200 space-y-2">
              <p>1. By Triangle Inequality on triangle (p, q, c):</p>
              <div className="pl-4 text-slate-300">d(p, q) ≤ d(p, c) + d(c, q)  ⟹  d(c, q) ≥ d(p, q) - d(p, c)</div>
              <div className="pl-4 text-slate-300">d(p, c) ≤ d(p, q) + d(c, q)  ⟹  d(c, q) ≥ d(p, c) - d(p, q)</div>
              <p className="pt-1">2. Combining both bounds gives the lower bound:</p>
              <div className="pl-4 text-amber-300 font-bold">d(c, q) ≥ |d(p, q) - d(p, c)|</div>
              <p className="pt-1">3. For node c (or any descendant in its subtree) to satisfy d(c, q) ≤ k, we must have:</p>
              <div className="pl-4 text-emerald-300 font-bold">|d(p, q) - d(p, c)| ≤ k</div>
              <p className="pt-1">4. Expanding the absolute value inequality:</p>
              <div className="pl-4 text-cyan-300 font-bold text-sm bg-slate-950/80 p-2 rounded border border-cyan-500/30">
                d(p, q) - k ≤ d(p, c) ≤ d(p, q) + k
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              <strong>Pruning Rule:</strong> When traversing from node <code className="text-cyan-300 font-mono">p</code>, we only visit children whose edge weight <code className="text-cyan-300 font-mono">d(p, c)</code> falls within the window <code className="text-cyan-300 font-mono">[d(p, q) - k, d(p, q) + k]</code>. All branches outside this window are mathematically guaranteed to have distance &gt; <code className="text-cyan-300 font-mono">k</code>, allowing the search algorithm to prune entire subtrees without calculating a single edit distance for them.
            </p>
          </div>

          {/* Section 4: Complexity Table */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h3 className="text-base font-semibold text-amber-300 flex items-center gap-2 mb-3">
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>4. Asymptotic Computational Complexity Comparison</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-left text-slate-400">
                    <th className="p-2.5">Search Strategy</th>
                    <th className="p-2.5">Build Time</th>
                    <th className="p-2.5">Query Time</th>
                    <th className="p-2.5">Space Complexity</th>
                    <th className="p-2.5">Distance Evaluations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-2.5 text-white font-semibold">Naive Exhaustive Scan</td>
                    <td className="p-2.5 text-emerald-400">O(1) [No Index]</td>
                    <td className="p-2.5 text-rose-400">O(N · m · n)</td>
                    <td className="p-2.5 text-emerald-400">O(N · L)</td>
                    <td className="p-2.5 text-rose-400">Strictly N comparisons</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50">
                    <td className="p-2.5 text-cyan-300 font-semibold">BK-Tree Metric Index</td>
                    <td className="p-2.5 text-amber-400">O(N log N · m · n)</td>
                    <td className="p-2.5 text-emerald-300 font-bold">O(N^α · m · n), α &lt; 1</td>
                    <td className="p-2.5 text-cyan-400">O(N) [Tree nodes]</td>
                    <td className="p-2.5 text-emerald-300 font-bold">O(N^α) [typically &lt; 5% of N]</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              * Note: N = total dictionary words, m, n = string lengths, α = metric dimension exponent (typically 0.3 to 0.6 for low edit distance tolerance k ∈ [1, 2]).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
          >
            Close Theory
          </button>
        </div>
      </div>
    </div>
  );
};
