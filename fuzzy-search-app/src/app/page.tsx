'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { AbstractModal } from '@/components/AbstractModal';
import { TheoryModal } from '@/components/TheoryModal';
import { DictionarySelector } from '@/components/DictionarySelector';
import { SearchPlayground, SearchMode } from '@/components/SearchPlayground';
import { ResultsPanel } from '@/components/ResultsPanel';
import { DPMatrixVisualizer } from '@/components/DPMatrixVisualizer';
import { BKTreeVisualizer } from '@/components/BKTreeVisualizer';
import { BenchmarkModule } from '@/components/BenchmarkModule';
import { BKTree, BKSearchResult } from '@/lib/bktree';
import { PRESET_DICTIONARIES, DictionaryPreset } from '@/lib/dictionaries';
import { Sparkles, Layers, GitBranch, Cpu, GraduationCap, ArrowUpRight } from 'lucide-react';

export default function Home() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'search' | 'matrix' | 'tree' | 'benchmark'>('search');
  const [isAbstractOpen, setIsAbstractOpen] = useState<boolean>(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Active Dictionary State
  const [currentPresetId, setCurrentPresetId] = useState<string>('tech-cs');
  const [customPresetName, setCustomPresetName] = useState<string>('');
  const [customWords, setCustomWords] = useState<string[]>([]);

  // Query & Fuzzy Search Controls
  const [query, setQuery] = useState<string>('algrithm');
  const [tolerance, setTolerance] = useState<number>(2);
  const [searchMode, setSearchMode] = useState<SearchMode>('fuzzy');

  // Interactive Target for DP Matrix and BK-Tree
  const [matrixSource, setMatrixSource] = useState<string>('algrithm');
  const [matrixTarget, setMatrixTarget] = useState<string>('algorithm');

  // Determine active words
  const currentPreset = useMemo(() => {
    return PRESET_DICTIONARIES.find((p) => p.id === currentPresetId);
  }, [currentPresetId]);

  const activeWords = useMemo(() => {
    if (currentPresetId === 'custom' && customWords.length > 0) {
      return customWords;
    }
    return currentPreset ? currentPreset.words : [];
  }, [currentPresetId, customWords, currentPreset]);

  // Construct and cache the BK-Tree index
  const bkTree = useMemo(() => {
    return new BKTree(activeWords);
  }, [activeWords]);

  // Execute Search with pruning
  const searchResults: BKSearchResult = useMemo(() => {
    if (!query.trim()) {
      return {
        matches: [],
        visitedNodesCount: 0,
        prunedBranchesCount: 0,
        totalNodesInTree: bkTree.size,
        searchTimeMs: 0,
        traversalTrace: [],
      };
    }

    if (searchMode === 'exact') {
      return bkTree.search(query, 0);
    } else if (searchMode === 'hybrid') {
      // First exact prefix, then fuzzy
      const fuzzyRes = bkTree.search(query, tolerance);
      const cleanQ = query.trim().toLowerCase();
      // Boost words starting with query
      fuzzyRes.matches.sort((a, b) => {
        const aPrefix = a.word.toLowerCase().startsWith(cleanQ);
        const bPrefix = b.word.toLowerCase().startsWith(cleanQ);
        if (aPrefix && !bPrefix) return -1;
        if (!aPrefix && bPrefix) return 1;
        return a.distance - b.distance;
      });
      return fuzzyRes;
    } else {
      return bkTree.search(query, tolerance);
    }
  }, [bkTree, query, tolerance, searchMode]);

  // Preset switch handler
  const handleSelectPreset = (presetId: string) => {
    setCurrentPresetId(presetId);
    const target = PRESET_DICTIONARIES.find((p) => p.id === presetId);
    if (target && target.sampleQueries.length > 0) {
      setQuery(target.sampleQueries[0].query);
      setMatrixSource(target.sampleQueries[0].query);
      setMatrixTarget(target.sampleQueries[0].expected);
    }
  };

  // Custom dictionary upload handler
  const handleCustomDictionaryLoaded = (name: string, words: string[]) => {
    setCustomPresetName(name);
    setCustomWords(words);
    setCurrentPresetId('custom');
    if (words.length > 0) {
      setQuery(words[0].substring(0, Math.min(5, words[0].length)));
    }
  };

  // Cross-panel visualizer inspector triggers
  const handleInspectDP = (targetWord: string) => {
    setMatrixSource(query || 'query');
    setMatrixTarget(targetWord);
    setActiveTab('matrix');
  };

  const handleTraceTree = (targetWord: string) => {
    setMatrixTarget(targetWord);
    setActiveTab('tree');
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header */}
      <Header
        onOpenAbstract={() => setIsAbstractOpen(true)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Academic Project Banner */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/20 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  KLH UNIVERSITY • 25CS2103E
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  A.Y. 2026–2027
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                Fuzzy Search System Using Edit Distance & Metric Trees (Burkhard-Keller BK-Tree)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Submitted by <strong className="text-slate-200">Team 2 (Sec 4)</strong>: CharanTej Reddy, Chandrakanth Reddy, Teja • Under the guidance of <strong className="text-slate-200">Mrs. J. Yamini Devi</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setIsAbstractOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              <span>View Abstract</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Active Dictionary Selector */}
        <DictionarySelector
          currentPresetId={currentPresetId}
          onSelectPreset={handleSelectPreset}
          onCustomDictionaryLoaded={handleCustomDictionaryLoaded}
          totalWords={activeWords.length}
          isMultilingual={currentPresetId === 'multilingual'}
        />

        {/* TAB 1: SEARCH PLAYGROUND & MAIN DASHBOARD */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <SearchPlayground
              query={query}
              setQuery={setQuery}
              tolerance={tolerance}
              setTolerance={setTolerance}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              sampleQueries={currentPreset ? currentPreset.sampleQueries : []}
              searchTimeMs={searchResults.searchTimeMs}
              visitedNodesCount={searchResults.visitedNodesCount}
              totalVocabularySize={searchResults.totalNodesInTree}
              matchesCount={searchResults.matches.length}
              prunedBranchesCount={searchResults.prunedBranchesCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Ranked Suggestions & Character Diffs */}
              <ResultsPanel
                query={query}
                results={searchResults.matches}
                onInspectDP={handleInspectDP}
                onTraceTree={handleTraceTree}
                tolerance={tolerance}
              />

              {/* Right Column: Mini Interactive DP Matrix Preview */}
              <div className="space-y-4">
                <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Live 2D Edit Distance Matrix Alignment</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('matrix')}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Open Full Visualizer</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <DPMatrixVisualizer
                    sourceWord={query || 'algrithm'}
                    targetWord={searchResults.matches[0]?.word || matrixTarget || 'algorithm'}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDICATED FULL-SCREEN 2D DP MATRIX VISUALIZER */}
        {activeTab === 'matrix' && (
          <DPMatrixVisualizer
            sourceWord={matrixSource}
            targetWord={matrixTarget}
          />
        )}

        {/* TAB 3: DEDICATED FULL-SCREEN BK-TREE METRIC EXPLORER */}
        {activeTab === 'tree' && (
          <BKTreeVisualizer
            tree={bkTree}
            query={query}
            tolerance={tolerance}
            traversalTrace={searchResults.traversalTrace}
          />
        )}

        {/* TAB 4: BENCHMARK MODULE & BIG-O COMPLEXITY */}
        {activeTab === 'benchmark' && (
          <BenchmarkModule />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © A.Y. 2026–2027 • Data Structures and Algorithms 3 (25CS2103E) • KLH University Bachupally
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>CharanTej Reddy (2520030422)</span>
            <span>•</span>
            <span>Chandrakanth Reddy (2520030290)</span>
            <span>•</span>
            <span>Teja (2520030379)</span>
          </div>
        </div>
      </footer>

      {/* Abstract Modal */}
      <AbstractModal
        isOpen={isAbstractOpen}
        onClose={() => setIsAbstractOpen(false)}
      />

      {/* Theory & Math Proofs Modal */}
      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
}
