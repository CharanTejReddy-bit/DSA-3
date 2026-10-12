'use client';

import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  GitBranch, 
  GraduationCap, 
  Layers, 
  Cpu
} from 'lucide-react';

interface HeaderProps {
  onOpenAbstract: () => void;
  onOpenTheory: () => void;
  activeTab: 'search' | 'matrix' | 'tree' | 'benchmark';
  setActiveTab: (tab: 'search' | 'matrix' | 'tree' | 'benchmark') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAbstract,
  onOpenTheory,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/15 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Academic Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/30">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>FuzzySearch</span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                    BK-Tree + Edit Distance
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
                <span>KLH University</span>
                <span className="text-slate-600">•</span>
                <span>DSA-3 (25CS2103E)</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400/90 font-medium">Team 2 (Sec 4)</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Search Playground</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'matrix'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>DP Matrix 2D</span>
            </button>

            <button
              onClick={() => setActiveTab('tree')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tree'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>BK-Tree Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'benchmark'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Benchmarks & Big-O</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenTheory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
              title="View Algorithm Theory & Mathematical Proofs"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Theory & Proofs</span>
            </button>

            <button
              onClick={onOpenAbstract}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
              title="View KLH University DSA-3 Project Abstract"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">KLH Abstract</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'search'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400'
            }`}
          >
            DP Matrix
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'tree'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400'
            }`}
          >
            BK-Tree
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
              activeTab === 'benchmark'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400'
            }`}
          >
            Benchmarks
          </button>
        </div>
      </div>
    </header>
  );
};
