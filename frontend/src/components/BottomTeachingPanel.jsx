import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  Layers,
  Binary,
  Table,
  CheckCircle2,
  Clock,
  HardDrive,
  GitFork,
  ArrowRight,
  Info,
  ListOrdered
} from 'lucide-react';

export default function BottomTeachingPanel({
  mode = 'explore',
  algorithmType = 'BFS',
  traversalData = null,
  currentStepIndex = 0,
  isPlaying = false,
  isPaused = false,
  playbackSpeed = 1.0,
  onStart = () => {},
  onPause = () => {},
  onResume = () => {},
  onStepForward = () => {},
  onStepBack = () => {},
  onReset = () => {},
  onChangeSpeed = () => {},
  shortestPathResult = null,
  analytics = null,
  allUsers = [],
}) {
  const [activeBottomTab, setActiveBottomTab] = useState('trace'); // 'trace' | 'adj-list' | 'complexity'

  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const totalSteps = traversalData?.steps?.length || 0;
  const currentStep = traversalData?.steps ? traversalData.steps[currentStepIndex] : null;

  const isFinished = totalSteps > 0 && currentStepIndex >= totalSteps - 1;

  const queueOrStack =
    algorithmType === 'BFS' ? currentStep?.queue || [] : currentStep?.stack || [];
  const visited = currentStep?.visited || [];
  const distances = traversalData?.distances || {};

  return (
    <footer className="h-64 bg-white border-t border-slate-200 flex flex-col z-20 shrink-0 shadow-lg">
      {/* Top Header / Tab Bar */}
      <div className="h-11 px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveBottomTab('trace')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeBottomTab === 'trace'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {algorithmType === 'BFS' ? <Layers className="w-3.5 h-3.5" /> : <Binary className="w-3.5 h-3.5" />}
            <span>Algorithm Trace & {algorithmType === 'BFS' ? 'Queue (FIFO)' : 'Call Stack (LIFO)'}</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('adj-list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeBottomTab === 'adj-list'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-blue-600" />
            <span>Adjacency List & Edge List</span>
          </button>

          <button
            onClick={() => setActiveBottomTab('complexity')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeBottomTab === 'complexity'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>DAA Asymptotic Complexity</span>
          </button>
        </div>

        {/* Algorithm Step Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back button */}
          <button
            onClick={onStepBack}
            disabled={currentStepIndex <= 0 || isPlaying}
            title="Step Back"
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Start / Pause / Resume */}
          {!isPlaying && !isPaused && (
            <button
              onClick={onStart}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={onPause}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && !isFinished && (
            <button
              onClick={onResume}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Resume</span>
            </button>
          )}

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={isPlaying || isFinished || totalSteps === 0}
            title="Advance One Step"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-3 h-3 text-indigo-600" />
            <span>Next Step</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Reset Traversal"
            className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-slate-300">|</span>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs font-mono text-slate-600">
            <span className="text-[10px] text-slate-400 uppercase">Speed:</span>
            {[0.5, 1.0, 2.0, 4.0].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  playbackSpeed === s
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <span className="text-slate-300">|</span>

          {/* Step Counter */}
          <span className="text-xs font-mono font-semibold text-slate-700">
            Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {/* TAB 1: ALGORITHM TRACE & DATA STRUCTURE INSPECTOR */}
        {activeBottomTab === 'trace' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Column A: Live Queue (BFS) or Stack (DFS) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  <div className="flex items-center gap-1.5">
                    {algorithmType === 'BFS' ? (
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <Binary className="w-3.5 h-3.5 text-purple-600" />
                    )}
                    <span>
                      {algorithmType === 'BFS' ? 'Live Queue (FIFO)' : 'Live Call Stack (LIFO)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900 font-semibold">
                    {queueOrStack.length} items
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white border border-slate-200 rounded-lg min-h-[46px]">
                  {queueOrStack.length === 0 ? (
                    <span className="text-xs text-slate-400 italic px-2">Data structure empty</span>
                  ) : (
                    queueOrStack.map((nodeId, idx) => {
                      const u = userMap.get(nodeId);
                      const isHead = algorithmType === 'BFS' ? idx === 0 : idx === queueOrStack.length - 1;
                      return (
                        <div
                          key={`${nodeId}-${idx}`}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 border transition-all ${
                            isHead
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>{u?.avatar || '👤'}</span>
                          <span>{u?.name || nodeId}</span>
                          {isHead && (
                            <span className="text-[9px] font-mono px-1 rounded bg-indigo-800 text-indigo-200 uppercase">
                              {algorithmType === 'BFS' ? 'Front' : 'Top'}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-sans pt-2">
                {algorithmType === 'BFS'
                  ? 'Queue maintains FIFO (First-In First-Out) discipline to explore nodes in non-decreasing order of distance.'
                  : 'Call stack follows LIFO (Last-In First-Out) order to follow paths deeply before backtracking.'}
              </div>
            </div>

            {/* Column B: Traversal Visited Order Sequence */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Visited Order ({visited.length})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-20 p-1.5 bg-white border border-slate-200 rounded-lg">
                  {visited.length === 0 ? (
                    <span className="text-xs text-slate-400 italic px-2">No students visited yet</span>
                  ) : (
                    visited.map((nodeId, idx) => {
                      const u = userMap.get(nodeId);
                      const dist = distances[nodeId];
                      return (
                        <span
                          key={nodeId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900"
                        >
                          <span className="text-[10px] font-bold text-emerald-600">#{idx + 1}</span>
                          <span>{u?.name || nodeId}</span>
                          {dist !== undefined && (
                            <span className="text-[9px] font-mono px-1 rounded bg-emerald-200 text-emerald-800">
                              d={dist}
                            </span>
                          )}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 flex items-center justify-between">
                <span>Visited Set avoids infinite loops in cyclic graphs.</span>
                <span className="font-mono text-slate-700">Space: O(V)</span>
              </div>
            </div>

            {/* Column C: Traversal Metrics & Complexity */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  DAA Metrics & Complexity
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Nodes Visited</span>
                    <span className="text-base font-bold font-mono text-indigo-700">
                      {traversalData?.total_nodes_visited || visited.length}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Edges Examined</span>
                    <span className="text-base font-bold font-mono text-purple-700">
                      {traversalData?.edges_examined || 0}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Time Complexity</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      O(V + E)
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-mono">Auxiliary Space</span>
                    <span className="text-xs font-bold font-mono text-blue-700">
                      O(V)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-1">
                Undirected graph inspections: Each edge visited at most twice (Handshaking).
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADJACENCY LIST & EDGE LIST VIEWER */}
        {activeBottomTab === 'adj-list' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full text-xs">
            {/* Adjacency List */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide">
                  Adjacency List Representation (Memory: Θ(V + E))
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                  {Object.keys(analytics?.adjacency_list || {}).length} Vertices
                </span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                {Object.entries(analytics?.adjacency_list || {}).map(([vName, nbrs]) => (
                  <div
                    key={vName}
                    className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between"
                  >
                    <span className="font-bold text-indigo-700">{vName}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-800 font-sans">
                      [{nbrs.join(', ') || 'No neighbors'}]
                    </span>
                    <span className="text-[10px] text-slate-400">deg {nbrs.length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge List */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide">
                  Edge List (Total: {analytics?.edge_list?.length || 0} Undirected Friendships)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  |E| = {analytics?.total_friendships || 0}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {(analytics?.edge_list || []).map((edge, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-center gap-1.5 text-slate-800"
                  >
                    <span className="font-semibold text-slate-900">{edge.u1}</span>
                    <span className="text-indigo-500 font-bold">—</span>
                    <span className="font-semibold text-slate-900">{edge.u2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAA ASYMPTOTIC COMPLEXITY COMPARISON */}
        {activeBottomTab === 'complexity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full text-xs">
            {/* Complexity Matrix Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-x-auto">
              <div className="font-bold text-slate-800 uppercase tracking-wide mb-2">
                Core Algorithm Complexity Reference
              </div>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                    <th className="py-1.5 px-2">Algorithm</th>
                    <th className="py-1.5 px-2">Data Structure</th>
                    <th className="py-1.5 px-2 text-indigo-700">Time Complexity</th>
                    <th className="py-1.5 px-2 text-purple-700">Auxiliary Space</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="py-1.5 px-2 font-bold text-slate-800">BFS</td>
                    <td className="py-1.5 px-2 text-slate-600">Queue (FIFO)</td>
                    <td className="py-1.5 px-2 font-bold text-indigo-700">O(V + E)</td>
                    <td className="py-1.5 px-2 text-purple-700">O(V)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-bold text-slate-800">DFS</td>
                    <td className="py-1.5 px-2 text-slate-600">Stack / Recursion</td>
                    <td className="py-1.5 px-2 font-bold text-indigo-700">O(V + E)</td>
                    <td className="py-1.5 px-2 text-purple-700">O(V)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-bold text-slate-800">Shortest Path</td>
                    <td className="py-1.5 px-2 text-slate-600">BFS + Parent Map</td>
                    <td className="py-1.5 px-2 font-bold text-indigo-700">O(V + E)</td>
                    <td className="py-1.5 px-2 text-purple-700">O(V)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-bold text-slate-800">Mutual Friends</td>
                    <td className="py-1.5 px-2 text-slate-600">Set Intersection</td>
                    <td className="py-1.5 px-2 font-bold text-indigo-700">O(min(d(u), d(v)))</td>
                    <td className="py-1.5 px-2 text-purple-700">O(min(d(u), d(v)))</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Teaching Explanation of Asymptotic Bounds */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-y-auto space-y-2 text-[11px] leading-relaxed text-slate-700">
              <div className="font-bold text-slate-800 uppercase tracking-wide">
                DAA Teacher Notes & Viva Insights
              </div>
              <ul className="space-y-1">
                <li>
                  <strong>O(1)</strong>: Constant work (e.g. checking user existence in a hash set).
                </li>
                <li>
                  <strong>O(V)</strong>: Work grows with number of students (e.g. initializing visited array).
                </li>
                <li>
                  <strong>O(V + E)</strong>: Standard adjacency-list bound. Each vertex is queued/visited once, and each edge is examined once from each end (2E inspections).
                </li>
                <li>
                  <strong>Dense Graph Caution</strong>: In a complete/dense graph, E = O(V²). Thus O(V + E) simplifies to O(V²). But on sparse social graphs, O(V + E) is near-linear.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
