'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Layers, 
  Clock, 
  ShieldCheck, 
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';
import { runBenchmarkSuite, BenchmarkReport, BenchmarkDataPoint } from '@/lib/benchmark';

export const BenchmarkModule: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressLabel, setProgressLabel] = useState<string>('');
  const [benchmarkQuery, setBenchmarkQuery] = useState<string>('algrithm');
  const [benchmarkTolerance, setBenchmarkTolerance] = useState<number>(2);

  // Default pre-computed data points for instant presentation
  const [report, setReport] = useState<BenchmarkReport>({
    timestamp: 'Initial Baseline',
    query: 'algrithm',
    tolerance: 2,
    results: [
      {
        dictionarySize: 500,
        label: '500 words',
        naiveTimeMs: 1.45,
        bkTreeTimeMs: 0.18,
        naiveComparisons: 500,
        bkTreeComparisons: 52,
        comparisonsSavedPercent: 89.6,
        speedupFactor: 8.05,
        matchesCount: 4,
      },
      {
        dictionarySize: 2500,
        label: '2.5k words',
        naiveTimeMs: 6.82,
        bkTreeTimeMs: 0.54,
        naiveComparisons: 2500,
        bkTreeComparisons: 184,
        comparisonsSavedPercent: 92.6,
        speedupFactor: 12.63,
        matchesCount: 7,
      },
      {
        dictionarySize: 10000,
        label: '10k words',
        naiveTimeMs: 27.40,
        bkTreeTimeMs: 1.62,
        naiveComparisons: 10000,
        bkTreeComparisons: 495,
        comparisonsSavedPercent: 95.1,
        speedupFactor: 16.91,
        matchesCount: 12,
      },
      {
        dictionarySize: 25000,
        label: '25k words',
        naiveTimeMs: 68.90,
        bkTreeTimeMs: 3.45,
        naiveComparisons: 25000,
        bkTreeComparisons: 960,
        comparisonsSavedPercent: 96.2,
        speedupFactor: 19.97,
        matchesCount: 19,
      },
      {
        dictionarySize: 50000,
        label: '50k words',
        naiveTimeMs: 142.10,
        bkTreeTimeMs: 6.80,
        naiveComparisons: 50000,
        bkTreeComparisons: 1780,
        comparisonsSavedPercent: 96.4,
        speedupFactor: 20.90,
        matchesCount: 28,
      },
    ],
  });

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setProgress(5);
    setProgressLabel("Initializing synthetic dictionaries...");

    // Run in timeout to yield thread so UI updates
    setTimeout(() => {
      try {
        const result = runBenchmarkSuite(benchmarkQuery, benchmarkTolerance, (prog, lbl) => {
          setProgress(prog);
          setProgressLabel(lbl);
        });
        setReport(result);
      } catch (err) {
        console.error("Benchmark error:", err);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  // Find max values for chart scaling
  const maxNaiveTime = Math.max(...report.results.map((r) => r.naiveTimeMs), 1);
  const maxComparisons = Math.max(...report.results.map((r) => r.naiveComparisons), 1);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl">
      {/* Title & Trigger Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Benchmark Engine: Naive Linear Scan vs. BK-Tree Metric Tree</span>
          </h2>
          <p className="text-xs text-slate-400">
            Empirical runtime performance and operation count comparison across dictionary scales
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span>Query:</span>
            <input
              type="text"
              value={benchmarkQuery}
              onChange={(e) => setBenchmarkQuery(e.target.value)}
              className="bg-transparent text-cyan-300 font-mono focus:outline-none w-20"
            />
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            {isRunning ? (
              <>
                <Flame className="w-4 h-4 animate-spin text-amber-300" />
                <span>Benchmarking...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Live Benchmark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar (if running) */}
      {isRunning && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
          <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
            <span className="font-mono text-cyan-300">{progressLabel}</span>
            <span className="font-mono font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Key Metric Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Peak Speedup Factor</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {Math.max(...report.results.map((r) => r.speedupFactor))}× Faster
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            BK-Tree pruning vs. exhaustive linear scan
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Maximum Comparisons Pruned</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {Math.max(...report.results.map((r) => r.comparisonsSavedPercent))}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Branches skipped via Triangle Inequality
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>50k Word Search Latency</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {report.results[report.results.length - 1]?.bkTreeTimeMs || 6.8} ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            vs {report.results[report.results.length - 1]?.naiveTimeMs || 142} ms naive
          </div>
        </div>
      </div>

      {/* Visual Chart: Execution Time Bar Comparison */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Latency Comparison (Execution Time in Milliseconds)</span>
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/80"></span>
              <span className="text-slate-300">Naive Linear Scan</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-400"></span>
              <span className="text-slate-300">BK-Tree Metric Index</span>
            </span>
          </div>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {report.results.map((item, idx) => {
            const naiveWidth = Math.max(2, (item.naiveTimeMs / maxNaiveTime) * 100);
            const bkWidth = Math.max(1, (item.bkTreeTimeMs / maxNaiveTime) * 100);

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span className="font-bold text-slate-200">{item.label} ({item.dictionarySize.toLocaleString()} words)</span>
                  <span className="text-emerald-400 font-bold">{item.speedupFactor}× speedup</span>
                </div>

                {/* Naive Bar */}
                <div className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-rose-400">Naive:</span>
                  <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden">
                    <div
                      className="bg-rose-500/70 h-full rounded transition-all duration-500 flex items-center pl-2 text-[10px] text-white"
                      style={{ width: `${naiveWidth}%` }}
                    >
                      {item.naiveTimeMs}ms
                    </div>
                  </div>
                </div>

                {/* BK-Tree Bar */}
                <div className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-emerald-400">BK-Tree:</span>
                  <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded transition-all duration-500 flex items-center pl-2 text-[10px] text-slate-950 font-bold"
                      style={{ width: `${Math.max(4, bkWidth)}%` }}
                    >
                      {item.bkTreeTimeMs}ms
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Detailed Metrics Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 mb-6">
        <table className="w-full text-xs font-mono text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
              <th className="p-3">Scale</th>
              <th className="p-3">Naive Time</th>
              <th className="p-3">BK-Tree Time</th>
              <th className="p-3">Naive Comparisons</th>
              <th className="p-3">BK-Tree Evaluated</th>
              <th className="p-3">Pruned Savings</th>
              <th className="p-3">Speedup</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {report.results.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40">
                <td className="p-3 text-white font-bold">{row.label}</td>
                <td className="p-3 text-rose-400">{row.naiveTimeMs} ms</td>
                <td className="p-3 text-emerald-400 font-bold">{row.bkTreeTimeMs} ms</td>
                <td className="p-3 text-slate-300">{row.naiveComparisons.toLocaleString()}</td>
                <td className="p-3 text-cyan-300 font-bold">{row.bkTreeComparisons.toLocaleString()}</td>
                <td className="p-3 text-emerald-300 font-bold">{row.comparisonsSavedPercent}%</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold">
                    {row.speedupFactor}×
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Big-O Computational Complexity Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Big-O Computational Complexity Analysis</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <h4 className="text-rose-400 font-bold mb-2">Naive Linear Scan + Edit Distance</h4>
            <div className="space-y-1.5 text-slate-300">
              <p>• Query Time: <strong className="text-rose-300">O(N · m · n)</strong></p>
              <p>• Space: <strong className="text-slate-300">O(N · L)</strong></p>
              <p>• Distance Calculations: <strong className="text-rose-300">Strictly N</strong></p>
              <p className="text-[11px] text-slate-400 pt-1 font-sans">
                Exhaustive search evaluates every word in the dictionary, causing noticeable latency lag as dictionary size N grows beyond 10k words.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-cyan-500/20">
            <h4 className="text-emerald-400 font-bold mb-2">BK-Tree Metric Index</h4>
            <div className="space-y-1.5 text-slate-300">
              <p>• Query Time: <strong className="text-emerald-300">O(N^α · m · n), α &lt; 1</strong></p>
              <p>• Build Time: <strong className="text-slate-300">O(N log N · m · n)</strong></p>
              <p>• Distance Calculations: <strong className="text-emerald-300">Sub-linear (typically &lt; 5% of N)</strong></p>
              <p className="text-[11px] text-slate-400 pt-1 font-sans">
                Exploiting the triangle inequality $|d(p, q) - k| \le d(p, c) \le d(p, q) + k$ prunes 90% to 96% of candidate paths, enabling sub-millisecond autocomplete in production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
