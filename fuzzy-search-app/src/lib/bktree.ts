/**
 * Burkhard-Keller Metric Tree (BK-Tree) Engine
 * Designed for discrete metric spaces using Levenshtein Distance
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * Team: CharanTej Reddy (2520030422), Chandrakanth Reddy (2520030290), Teja (2520030379)
 */

import { calculateLevenshteinDistance, calculateSimilarityScore } from './levenshtein';

export interface BKNode {
  id: string;
  word: string;
  children: Map<number, BKNode>; // distance -> child node
  depth: number;
  parentId?: string;
  distanceToParent?: number;
}

export interface SearchMatch {
  word: string;
  distance: number;
  similarityScore: number;
  nodeId: string;
  depth: number;
}

export interface TraversalStep {
  stepIndex: number;
  nodeId: string;
  word: string;
  distanceToQuery: number;
  isMatch: boolean;
  minAllowedDistance: number;
  maxAllowedDistance: number;
  exploredEdges: number[];
  prunedEdges: { distance: number; childWord: string; reason: string }[];
  explanation: string;
}

export interface BKSearchResult {
  matches: SearchMatch[];
  visitedNodesCount: number;
  prunedBranchesCount: number;
  totalNodesInTree: number;
  searchTimeMs: number;
  traversalTrace: TraversalStep[];
}

export interface VisualTreeNode {
  id: string;
  word: string;
  parentId?: string;
  distanceToParent?: number;
  depth: number;
  x?: number;
  y?: number;
  isVisited?: boolean;
  isMatch?: boolean;
  isPruned?: boolean;
  pruneReason?: string;
  distanceToQuery?: number;
  children: VisualTreeNode[];
}

export class BKTree {
  public root: BKNode | null = null;
  public size: number = 0;
  private idCounter: number = 0;

  constructor(words?: string[]) {
    if (words && words.length > 0) {
      this.build(words);
    }
  }

  /**
   * Resets and populates the BK-Tree with an array of words
   */
  public build(words: string[]): void {
    this.root = null;
    this.size = 0;
    this.idCounter = 0;

    // Filter duplicates and empty strings
    const uniqueWords = Array.from(new Set(words.filter(w => w && w.trim().length > 0)));

    for (const word of uniqueWords) {
      this.insert(word);
    }
  }

  /**
   * Inserts a word into the BK-Tree
   */
  public insert(word: string): void {
    const cleanWord = word.trim();
    if (!cleanWord) return;

    if (!this.root) {
      this.root = {
        id: `node-${++this.idCounter}`,
        word: cleanWord,
        children: new Map(),
        depth: 0,
      };
      this.size = 1;
      return;
    }

    let currentNode = this.root;
    let depth = 0;

    while (true) {
      depth++;
      const distance = calculateLevenshteinDistance(currentNode.word, cleanWord);

      if (distance === 0) {
        // Word already exists
        return;
      }

      const child = currentNode.children.get(distance);
      if (child) {
        currentNode = child;
      } else {
        const newNode: BKNode = {
          id: `node-${++this.idCounter}`,
          word: cleanWord,
          children: new Map(),
          depth,
          parentId: currentNode.id,
          distanceToParent: distance,
        };
        currentNode.children.set(distance, newNode);
        this.size++;
        return;
      }
    }
  }

  /**
   * Query the BK-Tree with maximum edit distance tolerance k.
   * Leverages the triangle inequality:
   * Only subtrees with edge weight d(parent, child) in [d(parent, query) - k, d(parent, query) + k]
   * are traversed; all other branches are pruned.
   */
  public search(query: string, maxTolerance: number = 2): BKSearchResult {
    const startTime = performance.now();
    const cleanQuery = query.trim();

    if (!this.root || !cleanQuery) {
      return {
        matches: [],
        visitedNodesCount: 0,
        prunedBranchesCount: 0,
        totalNodesInTree: this.size,
        searchTimeMs: 0,
        traversalTrace: [],
      };
    }

    const matches: SearchMatch[] = [];
    const traversalTrace: TraversalStep[] = [];
    let visitedCount = 0;
    let prunedCount = 0;

    const queue: BKNode[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      visitedCount++;

      const dist = calculateLevenshteinDistance(node.word, cleanQuery);
      const isMatch = dist <= maxTolerance;

      if (isMatch) {
        const score = calculateSimilarityScore(dist, cleanQuery.length, node.word.length);
        matches.push({
          word: node.word,
          distance: dist,
          similarityScore: score,
          nodeId: node.id,
          depth: node.depth,
        });
      }

      // Triangle inequality bounds: [dist - k, dist + k]
      const minEdge = Math.max(1, dist - maxTolerance);
      const maxEdge = dist + maxTolerance;

      const exploredEdges: number[] = [];
      const prunedEdges: { distance: number; childWord: string; reason: string }[] = [];

      for (const [edgeDist, childNode] of node.children.entries()) {
        if (edgeDist >= minEdge && edgeDist <= maxEdge) {
          exploredEdges.push(edgeDist);
          queue.push(childNode);
        } else {
          prunedCount++;
          prunedEdges.push({
            distance: edgeDist,
            childWord: childNode.word,
            reason: `Edge distance ${edgeDist} is outside pruning window [${minEdge}, ${maxEdge}]`,
          });
        }
      }

      // Record this trace step for the visualizer
      traversalTrace.push({
        stepIndex: visitedCount,
        nodeId: node.id,
        word: node.word,
        distanceToQuery: dist,
        isMatch,
        minAllowedDistance: minEdge,
        maxAllowedDistance: maxEdge,
        exploredEdges,
        prunedEdges,
        explanation: isMatch
          ? `d("${node.word}", "${cleanQuery}") = ${dist} ≤ ${maxTolerance} (MATCH!). Checking branches in [${minEdge}, ${maxEdge}].`
          : `d("${node.word}", "${cleanQuery}") = ${dist} > ${maxTolerance}. Triangle inequality bounds: [${minEdge}, ${maxEdge}]. Pruned ${prunedEdges.length} branch(es).`,
      });
    }

    // Sort matches: primary by distance asc, secondary by length difference asc, then alphabetically
    matches.sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      if (b.similarityScore !== a.similarityScore) return b.similarityScore - a.similarityScore;
      return a.word.localeCompare(b.word);
    });

    const endTime = performance.now();

    return {
      matches,
      visitedNodesCount: visitedCount,
      prunedBranchesCount: prunedCount,
      totalNodesInTree: this.size,
      searchTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
      traversalTrace,
    };
  }

  /**
   * Generates a hierarchical visual node tree for rendering in an interactive SVG canvas.
   * Can limit max nodes to prevent DOM congestion for giant dictionaries.
   */
  public getVisualTree(
    query?: string,
    maxTolerance: number = 2,
    maxDisplayNodes: number = 60
  ): VisualTreeNode | null {
    if (!this.root) return null;

    let nodeCount = 0;
    const cleanQuery = query ? query.trim() : '';

    function buildVisualNode(node: BKNode, parentDist?: number): VisualTreeNode {
      nodeCount++;
      const vNode: VisualTreeNode = {
        id: node.id,
        word: node.word,
        parentId: node.parentId,
        distanceToParent: parentDist,
        depth: node.depth,
        children: [],
      };

      if (cleanQuery) {
        const d = calculateLevenshteinDistance(node.word, cleanQuery);
        vNode.distanceToQuery = d;
        vNode.isMatch = d <= maxTolerance;
        vNode.isVisited = true;
      }

      // Sort children by edge distance for clean visualization
      const sortedEntries = Array.from(node.children.entries()).sort((a, b) => a[0] - b[0]);

      for (const [edgeDist, child] of sortedEntries) {
        if (nodeCount >= maxDisplayNodes) break;

        const childVNode = buildVisualNode(child, edgeDist);

        if (cleanQuery && vNode.distanceToQuery !== undefined) {
          const minEdge = Math.max(1, vNode.distanceToQuery - maxTolerance);
          const maxEdge = vNode.distanceToQuery + maxTolerance;
          if (edgeDist < minEdge || edgeDist > maxEdge) {
            childVNode.isPruned = true;
            childVNode.pruneReason = `Pruned: edge ${edgeDist} ∉ [${minEdge}, ${maxEdge}]`;
          }
        }

        vNode.children.push(childVNode);
      }

      return vNode;
    }

    return buildVisualNode(this.root);
  }
}
