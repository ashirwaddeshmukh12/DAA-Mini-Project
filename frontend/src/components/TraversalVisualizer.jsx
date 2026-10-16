import React from 'react';
import {
  Layers,
  Binary,
  ArrowRight,
  Database,
  Clock,
  HardDrive,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function TraversalVisualizer({
  algorithm = 'BFS',
  currentStep = null,
  allUsers = [],
  traversalOrder = [],
  totalVisited = 0,
  distances = {},
  timeComplexity = 'O(V + E)',
  spaceComplexity = 'O(V)',
}) {
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const queueOrStack = algorithm === 'BFS' ? (currentStep?.queue || []) : (currentStep?.stack || []);
  const visited = currentStep?.visited || [];
  const currentNode = currentStep ? userMap.get(currentStep.current_node) : null;

  return (
    <div className="bg-[#070c1e] border border-cyber-border rounded-2xl p-4 shadow-xl space-y-4 select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center gap-2">
          {algorithm === 'BFS' ? (
            <Layers className="w-4 h-4 text-cyan-400" />
          ) : (
            <Binary className="w-4 h-4 text-purple-400" />
          )}
          <span className="text-sm font-bold text-white tracking-wide">
            {algorithm === 'BFS' ? 'Breadth-First Search (Level-by-Level)' : 'Depth-First Search (Backtracking)'}
          </span>
        </div>

        {/* Complexity Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Time: {timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
            <HardDrive className="w-3 h-3 text-purple-400" />
            <span>Space: {spaceComplexity}</span>
          </div>
        </div>
      </div>

      {/* Current Step Action Banner */}
      {currentStep ? (
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#0b142d] to-[#080e22] border border-cyber-border">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Action: {currentStep.action}
              </span>
              {currentStep.level !== undefined && (
                <span className="text-[10px] font-mono text-slate-400">
                  Level / Distance: <strong className="text-cyan-400">{currentStep.level}</strong>
                </span>
              )}
              {currentStep.depth !== undefined && (
                <span className="text-[10px] font-mono text-slate-400">
                  Call Stack Depth: <strong className="text-purple-400">{currentStep.depth}</strong>
                </span>
              )}
            </div>
            {currentNode && (
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>{currentNode.avatar || '👤'}</span>
                <span className="text-cyan-300">{currentNode.name}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentStep.description}
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[#080d22] border border-cyber-border text-center text-xs text-slate-400">
          Select a source user node and click <strong>Start Traversal</strong> to observe step-by-step state changes.
        </div>
      )}

      {/* Data Structure Live State: Queue (BFS) or Stack (DFS) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {algorithm === 'BFS' ? 'FIFO Queue State (Level Order)' : 'LIFO Call Stack State'}
            </span>
          </div>
          <span>{queueOrStack.length} items</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#050814] border border-cyber-border/70 min-h-[50px] flex items-center gap-2 overflow-x-auto">
          {queueOrStack.length === 0 ? (
            <span className="text-xs text-slate-500 italic px-2">Data structure empty</span>
          ) : (
            queueOrStack.map((nodeId, idx) => {
              const u = userMap.get(nodeId);
              const isHeadOrTop = algorithm === 'BFS' ? idx === 0 : idx === queueOrStack.length - 1;
              return (
                <div
                  key={`${nodeId}-${idx}`}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 transition-all ${
                    isHeadOrTop
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-glow-cyan'
                      : 'bg-[#0d1633] text-slate-300 border-cyber-border'
                  }`}
                >
                  <span className="text-xs">{u?.avatar || '👤'}</span>
                  <span>{u?.name || nodeId}</span>
                  {isHeadOrTop && (
                    <span className="text-[9px] font-mono px-1 rounded bg-cyan-400/30 text-cyan-100 uppercase ml-1">
                      {algorithm === 'BFS' ? 'Front' : 'Top'}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Traversal Visited Order Sequence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visited Nodes Order ({visited.length})</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#050814] border border-cyber-border/70 max-h-24 overflow-y-auto flex flex-wrap gap-1.5">
          {visited.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No nodes marked visited yet</span>
          ) : (
            visited.map((nodeId, idx) => {
              const u = userMap.get(nodeId);
              const dist = distances[nodeId];
              return (
                <span
                  key={nodeId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono"
                >
                  <span className="text-[10px] text-emerald-500">#{idx + 1}</span>
                  <span>{u?.name || nodeId}</span>
                  {dist !== undefined && (
                    <span className="text-[9px] px-1 rounded bg-emerald-900/60 text-emerald-200">
                      d={dist}
                    </span>
                  )}
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
