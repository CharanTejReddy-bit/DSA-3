'use client';

import React from 'react';
import { 
  Sparkles, 
  Layers, 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { SearchMatch } from '@/lib/bktree';
import { computeDPMatrixDetailed } from '@/lib/levenshtein';

interface ResultsPanelProps {
  query: string;
  results: SearchMatch[];
  onInspectDP: (word: string) => void;
  onTraceTree: (word: string) => void;
  tolerance: number;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  query,
  results,
  onInspectDP,
  onTraceTree,
  tolerance,
}) => {
  if (!query.trim()) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-950/50">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Awaiting Query Input</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Type any query or select an intentional typo above to execute fast metric-pruned fuzzy search.
        </p>
        <div className="text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Pruning window: [d(p, q) - {tolerance}, d(p, q) + {tolerance}]
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
        <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/50">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Matches Found within k = {tolerance}</h3>
        <p className="text-xs text-slate-400 max-w-md mb-4">
          No vocabulary term is within edit distance <code className="text-cyan-400 font-mono">{tolerance}</code> of <span className="text-white font-bold">"{query}"</span>. Try increasing the tolerance slider or switching the active dictionary.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Ranked Suggestions ({results.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by normalized similarity score: <span className="font-mono text-cyan-400">1 - (d / max(len₁, len₂))</span>
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          Top {Math.min(results.length, 25)} displayed
        </span>
      </div>

      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
        {results.slice(0, 25).map((match, idx) => {
          const scorePercent = Math.round(match.similarityScore * 100);
          
          // Get character diff preview for top items
          let diffAlignment = null;
          if (idx < 10) {
            try {
              const dpData = computeDPMatrixDetailed(query, match.word);
              diffAlignment = dpData.alignment;
            } catch (e) {
              // fallback
            }
          }

          const isExact = match.distance === 0;

          return (
            <div
              key={`${match.word}-${idx}`}
              className={`p-3.5 rounded-xl border transition-all ${
                isExact
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-sm shadow-emerald-950/20'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                
                {/* Word & Badge */}
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center text-xs font-mono text-slate-400">
                    #{idx + 1}
                  </span>
                  
                  <span className="text-base font-bold text-white font-mono tracking-wide">
                    {match.word}
                  </span>

                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      isExact
                        ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600/50'
                        : match.distance === 1
                        ? 'bg-cyan-900/60 text-cyan-300 border-cyan-600/50'
                        : 'bg-amber-900/60 text-amber-300 border-amber-600/50'
                    }`}
                  >
                    {isExact ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Exact Match</span>
                      </>
                    ) : (
                      <span>Edit Dist: {match.distance}</span>
                    )}
                  </span>
                </div>

                {/* Similarity Score Indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        scorePercent >= 80
                          ? 'bg-emerald-400'
                          : scorePercent >= 60
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${scorePercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 min-w-[45px] text-right">
                    {scorePercent}%
                  </span>
                </div>
              </div>

              {/* Character Diff Visualization (Alignments) */}
              {diffAlignment && diffAlignment.length > 0 && (
                <div className="mb-2.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800/60 flex flex-wrap items-center gap-1 text-xs font-mono">
                  <span className="text-[10px] text-slate-400 uppercase mr-1">Diff:</span>
                  {diffAlignment.map((step, sIdx) => {
                    if (step.operation === 'match') {
                      return (
                        <span key={sIdx} className="px-1 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                          {step.targetChar}
                        </span>
                      );
                    } else if (step.operation === 'substitute') {
                      return (
                        <span key={sIdx} className="px-1 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40" title={`Substituted '${step.sourceChar}' for '${step.targetChar}'`}>
                          <span className="line-through text-slate-400 text-[10px]">{step.sourceChar}</span>
                          <span className="mx-0.5">➔</span>
                          <span className="font-bold">{step.targetChar}</span>
                        </span>
                      );
                    } else if (step.operation === 'insert') {
                      return (
                        <span key={sIdx} className="px-1 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40" title={`Inserted '${step.targetChar}'`}>
                          +{step.targetChar}
                        </span>
                      );
                    } else {
                      return (
                        <span key={sIdx} className="px-1 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40 line-through" title={`Deleted '${step.sourceChar}'`}>
                          -{step.sourceChar}
                        </span>
                      );
                    }
                  })}
                </div>
              )}

              {/* Action Buttons: Visualizer Link */}
              <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                <button
                  onClick={() => onInspectDP(match.word)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700/80 hover:border-cyan-500/40 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect DP Matrix</span>
                </button>

                <button
                  onClick={() => onTraceTree(match.word)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 border border-slate-700/80 hover:border-emerald-500/40 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Trace BK-Tree</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
