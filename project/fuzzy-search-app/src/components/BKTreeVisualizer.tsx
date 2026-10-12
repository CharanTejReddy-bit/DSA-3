'use client';

import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Search, 
  Sliders, 
  Info, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Eye, 
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { BKTree, VisualTreeNode, TraversalStep } from '@/lib/bktree';

interface BKTreeVisualizerProps {
  tree: BKTree;
  query: string;
  tolerance: number;
  traversalTrace: TraversalStep[];
}

interface FlattenedNode {
  node: VisualTreeNode;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

export const BKTreeVisualizer: React.FC<BKTreeVisualizerProps> = ({
  tree,
  query,
  tolerance,
  traversalTrace,
}) => {
  const [treeQuery, setTreeQuery] = useState(query || 'algrithm');
  const [treeTolerance, setTreeTolerance] = useState(tolerance || 2);
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [maxNodes, setMaxNodes] = useState<number>(45);
  const [selectedNode, setSelectedNode] = useState<VisualTreeNode | null>(null);

  // Sync with prop when query changes
  React.useEffect(() => {
    if (query) setTreeQuery(query);
    if (tolerance) setTreeTolerance(tolerance);
  }, [query, tolerance]);

  // Generate visual tree hierarchy from BKTree
  const visualRoot = useMemo(() => {
    return tree.getVisualTree(treeQuery, treeTolerance, maxNodes);
  }, [tree, treeQuery, treeTolerance, maxNodes]);

  // Layout the tree in 2D coordinates (x, y)
  const { nodesList, linksList, treeWidth, treeHeight } = useMemo(() => {
    if (!visualRoot) return { nodesList: [], linksList: [], treeWidth: 800, treeHeight: 500 };

    const nodes: FlattenedNode[] = [];
    const links: {
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
      distance: number;
      isPruned?: boolean;
    }[] = [];

    // Group nodes by depth up to maxDepth
    const levels: VisualTreeNode[][] = [];
    function assignLevels(node: VisualTreeNode, depth: number) {
      if (depth > maxDepth) return;
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);

      for (const child of node.children) {
        assignLevels(child, depth + 1);
      }
    }
    assignLevels(visualRoot, 0);

    const actualMaxDepth = Math.min(levels.length - 1, maxDepth);
    const canvasWidth = Math.max(800, (levels[actualMaxDepth]?.length || 1) * 120);
    const canvasHeight = Math.max(500, (actualMaxDepth + 1) * 130 + 60);

    // Position nodes per depth
    const coordMap = new Map<string, { x: number; y: number }>();

    levels.forEach((nodesAtDepth, depth) => {
      const y = 60 + depth * 125;
      const totalInLevel = nodesAtDepth.length;
      const spacing = canvasWidth / (totalInLevel + 1);

      nodesAtDepth.forEach((node, index) => {
        const x = spacing * (index + 1);
        coordMap.set(node.id, { x, y });
        node.x = x;
        node.y = y;

        const parentCoord = node.parentId ? coordMap.get(node.parentId) : undefined;
        nodes.push({
          node,
          x,
          y,
          parentX: parentCoord?.x,
          parentY: parentCoord?.y,
        });

        if (parentCoord && node.distanceToParent !== undefined) {
          links.push({
            sourceX: parentCoord.x,
            sourceY: parentCoord.y,
            targetX: x,
            targetY: y,
            distance: node.distanceToParent,
            isPruned: node.isPruned,
          });
        }
      });
    });

    return { nodesList: nodes, linksList: links, treeWidth: canvasWidth, treeHeight: canvasHeight };
  }, [visualRoot, maxDepth]);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl">
      {/* Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span>Burkhard-Keller Metric Tree (BK-Tree) Pruning Explorer</span>
          </h2>
          <p className="text-xs text-slate-400">
            Visualizing metric branch pruning via triangle inequality: <span className="text-cyan-300 font-mono">|d(p, q) - d(p, c)| ≤ k</span>
          </p>
        </div>

        {/* Query Input in Tree Visualizer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              value={treeQuery}
              onChange={(e) => setTreeQuery(e.target.value)}
              placeholder="Query word..."
              className="bg-transparent text-white font-mono focus:outline-none w-24 sm:w-32"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span>k:</span>
            <input
              type="number"
              min={1}
              max={4}
              value={treeTolerance}
              onChange={(e) => setTreeTolerance(Number(e.target.value))}
              className="w-10 bg-slate-800 rounded px-1.5 py-0.5 text-center font-mono text-cyan-300 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Visual Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Max Depth:</span>
            <input
              type="range"
              min={1}
              max={5}
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-20 sm:w-24 h-1 bg-slate-800 rounded accent-cyan-400"
            />
            <span className="font-mono text-slate-200">{maxDepth}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Max Nodes:</span>
            <input
              type="range"
              min={15}
              max={80}
              step={5}
              value={maxNodes}
              onChange={(e) => setMaxNodes(Number(e.target.value))}
              className="w-20 sm:w-24 h-1 bg-slate-800 rounded accent-cyan-400"
            />
            <span className="font-mono text-slate-200">{maxNodes}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-emerald-300">Match (d ≤ k)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50"></span>
            <span className="text-cyan-300">Traversed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/50 border border-dashed border-rose-400"></span>
            <span className="text-rose-400">Pruned Subtree</span>
          </span>
        </div>
      </div>

      {/* Main Grid: SVG Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left 3 Cols: SVG Interactive Canvas */}
        <div className="lg:col-span-3 overflow-auto bg-slate-950/70 rounded-xl border border-slate-800 max-h-[560px] p-2 relative">
          <svg
            width={treeWidth}
            height={treeHeight}
            className="w-full h-full min-w-[700px] select-none"
          >
            {/* Draw edge branches */}
            {linksList.map((link, idx) => {
              const isPruned = link.isPruned;
              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={link.sourceX}
                    y1={link.sourceY}
                    x2={link.targetX}
                    y2={link.targetY}
                    stroke={isPruned ? 'rgba(244, 63, 94, 0.4)' : 'rgba(6, 182, 212, 0.45)'}
                    strokeWidth={isPruned ? 1.5 : 2}
                    strokeDasharray={isPruned ? '4 3' : 'none'}
                  />
                  {/* Edge distance badge */}
                  <g
                    transform={`translate(${(link.sourceX + link.targetX) / 2}, ${(link.sourceY + link.targetY) / 2})`}
                  >
                    <rect
                      x="-12"
                      y="-9"
                      width="24"
                      height="18"
                      rx="4"
                      fill="#020617"
                      stroke={isPruned ? '#f43f5e' : '#06b6d4'}
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={isPruned ? '#f87171' : '#38bdf8'}
                    >
                      {link.distance}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Draw nodes */}
            {nodesList.map(({ node, x, y }) => {
              const isMatch = node.isMatch;
              const isPruned = node.isPruned;
              const isSelected = selectedNode?.id === node.id;
              const isRoot = !node.parentId;

              return (
                <g
                  key={node.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer glow ring if selected or match */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="20"
                    fill={
                      isMatch
                        ? '#064e3b'
                        : isPruned
                        ? '#3f121e'
                        : isRoot
                        ? '#1e1b4b'
                        : '#082f49'
                    }
                    stroke={
                      isMatch
                        ? '#10b981'
                        : isPruned
                        ? '#f43f5e'
                        : isRoot
                        ? '#818cf8'
                        : '#0ea5e9'
                    }
                    strokeWidth={isMatch ? 3 : 2}
                    strokeDasharray={isPruned ? '3 2' : 'none'}
                    className="transition-all duration-200 group-hover:scale-110"
                  />

                  {/* Node Text Label (Truncated if long) */}
                  <text
                    textAnchor="middle"
                    dy="-26"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill={isMatch ? '#34d399' : isPruned ? '#fca5a5' : '#e0f2fe'}
                    className="pointer-events-none drop-shadow"
                  >
                    {node.word.length > 12 ? `${node.word.substring(0, 10)}…` : node.word}
                  </text>

                  {/* Distance to query badge inside circle */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill={isMatch ? '#6ee7b7' : isPruned ? '#fda4af' : '#7dd3fc'}
                    className="pointer-events-none"
                  >
                    {node.distanceToQuery !== undefined ? `d=${node.distanceToQuery}` : 'Root'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Col: Node Inspector & Pruning Proof */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <h4 className="font-semibold text-white flex items-center gap-1.5 mb-3 text-cyan-400">
              <Info className="w-4 h-4" />
              <span>Node Inspector</span>
            </h4>

            {selectedNode ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 mb-0.5">Word:</div>
                  <div className="text-base font-bold font-mono text-white break-all">
                    "{selectedNode.word}"
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                      Depth: {selectedNode.depth}
                    </span>
                    {selectedNode.distanceToParent !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                        Edge dist: {selectedNode.distanceToParent}
                      </span>
                    )}
                  </div>
                </div>

                {/* Distance to current query */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-slate-400">Distance to Query "{treeQuery}":</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {selectedNode.distanceToQuery}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800">
                    {selectedNode.isMatch ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Valid Match (d ≤ {treeTolerance})</span>
                      </div>
                    ) : selectedNode.isPruned ? (
                      <div className="flex items-start gap-1.5 text-rose-400">
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">
                          {selectedNode.pruneReason || `Subtree pruned by triangle inequality`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <ArrowRight className="w-4 h-4" />
                        <span>Explored Parent Node</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Children breakdown */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                  <span>Subtree Branches: </span>
                  <strong className="text-slate-200">{selectedNode.children.length}</strong>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs">
                Click any node in the tree to inspect its edit distance, edge weight, and triangle pruning verdict.
              </p>
            )}
          </div>

          {/* Theoretical Pruning Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h5 className="font-semibold text-purple-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Triangle Pruning Bound</span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono bg-slate-900 p-2.5 rounded border border-purple-500/20">
              Valid range: [d(p, q) - k, d(p, q) + k]
              <br />
              Any child with edge &lt; {treeTolerance} from bound is pruned.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
