'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Layers, 
  Calculator, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { computeDPMatrixDetailed, DPMatrixResult, DPCell } from '@/lib/levenshtein';

interface DPMatrixVisualizerProps {
  sourceWord: string;
  targetWord: string;
  onUpdateWords?: (src: string, tgt: string) => void;
}

export const DPMatrixVisualizer: React.FC<DPMatrixVisualizerProps> = ({
  sourceWord: initialSource,
  targetWord: initialTarget,
  onUpdateWords,
}) => {
  const [sourceInput, setSourceInput] = useState(initialSource || 'algrithm');
  const [targetInput, setTargetInput] = useState(initialTarget || 'algorithm');
  const [dpData, setDpData] = useState<DPMatrixResult | null>(null);

  // Animation / step state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(150); // ms per cell
  const [selectedCell, setSelectedCell] = useState<DPCell | null>(null);

  // Sync inputs if props change
  useEffect(() => {
    if (initialSource) setSourceInput(initialSource);
    if (initialTarget) setTargetInput(initialTarget);
  }, [initialSource, initialTarget]);

  // Recalculate DP matrix whenever inputs change
  useEffect(() => {
    const s = sourceInput.trim() || 'a';
    const t = targetInput.trim() || 'a';
    const result = computeDPMatrixDetailed(s, t);
    setDpData(result);
    // Default to fully revealed
    const totalCells = (result.sourceTokens.length + 1) * (result.targetTokens.length + 1);
    setCurrentStep(totalCells);
    setSelectedCell(result.cells[result.sourceTokens.length][result.targetTokens.length]);
    setIsPlaying(false);
  }, [sourceInput, targetInput]);

  // Playback timer loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && dpData) {
      const totalCells = (dpData.sourceTokens.length + 1) * (dpData.targetTokens.length + 1);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalCells) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, dpData, playbackSpeed]);

  if (!dpData) return null;

  const m = dpData.sourceTokens.length;
  const n = dpData.targetTokens.length;
  const totalCells = (m + 1) * (n + 1);

  // Check if cell (i, j) is revealed at current step
  const isCellRevealed = (i: number, j: number): boolean => {
    const cellLinearIndex = i * (n + 1) + j + 1;
    return cellLinearIndex <= currentStep;
  };

  // Build a set of coordinates that belong to the optimal backtracking path
  const pathSet = new Set<string>();
  if (dpData.alignment) {
    let curI = m;
    let curJ = n;
    pathSet.add(`${curI},${curJ}`);
    for (let k = dpData.alignment.length - 1; k >= 0; k--) {
      const step = dpData.alignment[k];
      if (step.operation === 'match' || step.operation === 'substitute') {
        curI--;
        curJ--;
      } else if (step.operation === 'delete') {
        curI--;
      } else if (step.operation === 'insert') {
        curJ--;
      }
      pathSet.add(`${curI},${curJ}`);
    }
  }

  const handleCellClick = (cell: DPCell) => {
    setSelectedCell(cell);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl">
      {/* Title & Interactive Word Input */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>2D Edit Distance Cost Matrix Visualizer (Dynamic Programming)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Interactive step-by-step O(m × n) dynamic programming breakdown and backtracking path
          </p>
        </div>

        {/* Word Inputs */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-mono">Source (s):</span>
            <input
              type="text"
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold font-mono focus:outline-none w-24 sm:w-28"
            />
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-mono">Target (t):</span>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="bg-transparent text-emerald-300 font-bold font-mono focus:outline-none w-24 sm:w-28"
            />
          </div>
        </div>
      </div>

      {/* Playback Controls & Progress Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Reset to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Step Back"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (currentStep >= totalCells) setCurrentStep(0);
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{currentStep >= totalCells ? "Replay DP" : "Auto Fill"}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(totalCells, prev + 1))}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Speed:</span>
          <input
            type="range"
            min={40}
            max={500}
            step={20}
            value={540 - playbackSpeed}
            onChange={(e) => setPlaybackSpeed(540 - Number(e.target.value))}
            className="w-20 sm:w-28 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="font-mono text-cyan-300 w-12 text-right">{playbackSpeed}ms</span>
        </div>

        {/* Step Counter */}
        <div className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
          Step <span className="text-cyan-400 font-bold">{currentStep}</span> / {totalCells}
        </div>
      </div>

      {/* Main Grid & Inspector Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: 2D Matrix Table */}
        <div className="lg:col-span-2 overflow-x-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <table className="border-collapse font-mono text-xs w-full select-none">
            <thead>
              <tr>
                {/* Top-left corner */}
                <th className="p-2 border border-slate-800/80 bg-slate-900/90 text-slate-400 text-center w-12 h-10">
                  D[i,j]
                </th>
                {/* Empty string col 0 */}
                <th className="p-2 border border-slate-800/80 bg-slate-900/90 text-slate-400 text-center w-12 h-10">
                  ε
                </th>
                {/* Target characters */}
                {dpData.targetTokens.map((char, j) => (
                  <th
                    key={j}
                    className="p-2 border border-slate-800/80 bg-slate-900/90 text-emerald-400 font-bold text-center w-12 h-10 text-sm"
                  >
                    {char}
                    <div className="text-[10px] text-slate-400 font-normal">j={j + 1}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row 0 for empty source string */}
              <tr>
                <td className="p-2 border border-slate-800/80 bg-slate-900/90 text-slate-400 font-bold text-center h-10">
                  ε
                </td>
                {dpData.cells[0].map((cell, j) => {
                  const revealed = isCellRevealed(0, j);
                  const isSelected = selectedCell?.i === 0 && selectedCell?.j === j;
                  const isPath = pathSet.has(`0,${j}`);

                  return (
                    <td
                      key={j}
                      onClick={() => handleCellClick(cell)}
                      className={`p-2 border text-center font-bold cursor-pointer transition-all h-10 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-900/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                          : isPath && revealed
                          ? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-300'
                          : revealed
                          ? 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
                          : 'border-slate-850 bg-slate-950/20 text-transparent'
                      }`}
                    >
                      {revealed ? cell.cost : '·'}
                    </td>
                  );
                })}
              </tr>

              {/* Rows 1..m for source characters */}
              {dpData.sourceTokens.map((char, i) => (
                <tr key={i}>
                  <td className="p-2 border border-slate-800/80 bg-slate-900/90 text-cyan-400 font-bold text-center h-10 text-sm">
                    {char}
                    <div className="text-[10px] text-slate-400 font-normal">i={i + 1}</div>
                  </td>

                  {dpData.cells[i + 1].map((cell, j) => {
                    const revealed = isCellRevealed(i + 1, j);
                    const isSelected = selectedCell?.i === i + 1 && selectedCell?.j === j;
                    const isPath = pathSet.has(`${i + 1},${j}`);

                    return (
                      <td
                        key={j}
                        onClick={() => handleCellClick(cell)}
                        className={`p-2 border text-center font-bold cursor-pointer transition-all h-10 ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-900/70 text-white shadow-lg ring-2 ring-cyan-400/50'
                            : isPath && revealed
                            ? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-300'
                            : revealed
                            ? 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
                            : 'border-slate-850 bg-slate-950/20 text-transparent'
                        }`}
                      >
                        {revealed ? cell.cost : '·'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 mt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500/60"></span>
              <span>Optimal Alignment Path</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-cyan-900 border border-cyan-400"></span>
              <span>Selected Cell</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800"></span>
              <span>Calculated DP State</span>
            </span>
          </div>
        </div>

        {/* Right Col: Cell Inspector & Mathematical Formula Breakdown */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                <span>Cell Inspection</span>
              </span>
              {selectedCell && (
                <span className="font-mono text-slate-300">
                  [{selectedCell.i}, {selectedCell.j}]
                </span>
              )}
            </div>

            {selectedCell ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[11px] mb-1">State Value:</div>
                  <div className="text-xl font-bold font-mono text-white flex items-center justify-between">
                    <span>D[{selectedCell.i}, {selectedCell.j}] = {selectedCell.cost}</span>
                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-medium ${
                      selectedCell.operation === 'match'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : selectedCell.operation === 'substitute'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : selectedCell.operation === 'insert'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {selectedCell.operation}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
                  <div className="text-slate-400 mb-1">Wagner-Fischer Derivation:</div>
                  <div className="text-cyan-200 leading-relaxed font-semibold">
                    {selectedCell.formula}
                  </div>
                </div>

                {selectedCell.i > 0 && selectedCell.j > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <div>Chars compared: s[{selectedCell.i}] = '{selectedCell.sourceChar}' vs t[{selectedCell.j}] = '{selectedCell.targetChar}'</div>
                    <div>Substitution cost = {selectedCell.sourceChar === selectedCell.targetChar ? "0 (Match)" : "1 (Mismatch)"}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click any matrix cell to view its recurrence derivation.</p>
            )}
          </div>

          {/* Metric Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Alignment Metrics</span>
            </h4>

            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Final Edit Distance (d):</span>
              <span className="font-mono font-bold text-cyan-300">{dpData.distance}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Normalized Similarity:</span>
              <span className="font-mono font-bold text-emerald-400">
                {(dpData.similarityScore * 100).toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Exact Matches:</span>
              <span className="font-mono text-emerald-300">{dpData.totalOperations.matches}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Substitutions:</span>
              <span className="font-mono text-amber-300">{dpData.totalOperations.substitutions}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Insertions:</span>
              <span className="font-mono text-cyan-300">{dpData.totalOperations.insertions}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-400">Deletions:</span>
              <span className="font-mono text-rose-300">{dpData.totalOperations.deletions}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
