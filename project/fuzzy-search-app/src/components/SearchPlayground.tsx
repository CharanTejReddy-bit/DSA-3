'use client';

import React from 'react';
import { 
  Search, 
  X, 
  Sliders, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  CheckCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';

export type SearchMode = 'fuzzy' | 'exact' | 'hybrid';

interface SearchPlaygroundProps {
  query: string;
  setQuery: (q: string) => void;
  tolerance: number;
  setTolerance: (k: number) => void;
  searchMode: SearchMode;
  setSearchMode: (m: SearchMode) => void;
  sampleQueries: { query: string; expected: string; typoType: string }[];
  searchTimeMs: number;
  visitedNodesCount: number;
  totalVocabularySize: number;
  matchesCount: number;
  prunedBranchesCount: number;
}

export const SearchPlayground: React.FC<SearchPlaygroundProps> = ({
  query,
  setQuery,
  tolerance,
  setTolerance,
  searchMode,
  setSearchMode,
  sampleQueries,
  searchTimeMs,
  visitedNodesCount,
  totalVocabularySize,
  matchesCount,
  prunedBranchesCount,
}) => {
  const comparisonsSaved = totalVocabularySize > 0
    ? Math.max(0, ((totalVocabularySize - visitedNodesCount) / totalVocabularySize) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="flex items-center relative">
          <div className="absolute left-4 pointer-events-none text-cyan-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any word or intentional typo (e.g. 'algrithm', 'pnumonia', 'नमस्त', 'కంపుటర్')..."
            className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 shadow-inner transition-all"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Control Strip: Tolerance Slider & Search Mode Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-5">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mode:</span>
          </span>
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSearchMode('fuzzy')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                searchMode === 'fuzzy'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fuzzy Match
            </button>
            <button
              onClick={() => setSearchMode('hybrid')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                searchMode === 'hybrid'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Prioritizes prefix matches, followed by fuzzy edit distance matches"
            >
              Hybrid
            </button>
            <button
              onClick={() => setSearchMode('exact')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                searchMode === 'exact'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Exact (k=0)
            </button>
          </div>
        </div>

        {/* Tolerance Slider */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300">
              Max Distance (k):
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              disabled={searchMode === 'exact'}
              value={searchMode === 'exact' ? 0 : tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-40"
            />
            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
              {searchMode === 'exact' ? 0 : tolerance}
            </span>
          </div>
        </div>
      </div>

      {/* Preset Typo Quick-Chips */}
      {sampleQueries.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Click to test intentional typographical errors:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(sample.query)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  query === sample.query
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white'
                }`}
              >
                <span className="font-bold text-cyan-300">"{sample.query}"</span>
                <span className="text-slate-400 text-[10px]">➔ {sample.expected}</span>
                <span className="px-1 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 hidden sm:inline">
                  {sample.typoType}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Performance & Pruning Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Query Latency</span>
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-cyan-300" suppressHydrationWarning>
            {searchTimeMs < 0.1 ? "<0.1 ms" : `${searchTimeMs} ms`}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sub-millisecond response</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Nodes Evaluated</span>
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {visitedNodesCount} <span className="text-xs text-slate-400 font-normal">/ {totalVocabularySize}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">BK-Tree metric traversal</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Pruned Savings</span>
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {comparisonsSaved}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {prunedBranchesCount} branch subtrees skipped
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Ranked Results</span>
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-amber-300">
            {matchesCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Bounded within radius k</div>
        </div>
      </div>
    </div>
  );
};
