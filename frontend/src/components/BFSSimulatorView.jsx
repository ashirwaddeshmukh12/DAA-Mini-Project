import React, { useState, useEffect, useRef } from 'react';
import GraphCanvas2D from './GraphCanvas2D';
import { api } from '../api';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function BFSSimulatorView({ users = [], friendships = [] }) {
  const [startUserId, setStartUserId] = useState(users[0]?.id || '');
  const [traversalData, setTraversalData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0); // 1.0 = 1000ms, 2.0 = 500ms
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  // Sync default starting user
  useEffect(() => {
    if (!startUserId && users.length > 0) {
      setStartUserId(users[0].id);
    }
  }, [users, startUserId]);

  // Reset when starting user changes
  const handleStartUserChange = (newId) => {
    setStartUserId(newId);
    handleReset();
  };

  // Run BFS on backend
  const handleStart = async () => {
    if (!startUserId) return;
    try {
      setLoading(true);
      const res = await api.runBFS(startUserId);
      setTraversalData(res);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (err) {
      alert(err.message || 'Failed to run BFS');
    } finally {
      setLoading(false);
    }
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying && traversalData?.steps) {
      const delay = 1100 / speed;
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < traversalData.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, traversalData, speed]);

  const handleNextStep = () => {
    if (traversalData?.steps && currentStepIndex < traversalData.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIndex(0);
    setTraversalData(null);
  };

  // Current step details
  const currentStep = traversalData?.steps ? traversalData.steps[currentStepIndex] : null;
  const isComplete =
    traversalData?.steps && currentStepIndex >= traversalData.steps.length - 1;

  const userMap = new Map(users.map((u) => [u.id, u]));

  // Active highlights
  const activeTraversalNode = currentStep ? currentStep.current_node : null;
  const visitedTraversalNodes = currentStep ? currentStep.visited || [] : [];
  const queueNodes = currentStep ? currentStep.queue || [] : [];
  const activeEdge = currentStep ? currentStep.edge_traversed : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Top Simulator Control Bar */}
      <div className="h-14 px-5 bg-white border-b border-slate-200 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>BFS Simulator</span>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Start Person Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <label className="text-slate-500 font-medium">Starting Person:</label>
            <select
              value={startUserId}
              onChange={(e) => handleStartUserChange(e.target.value)}
              disabled={isPlaying}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.community})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action & Playback Controls */}
        <div className="flex items-center gap-2">
          {!traversalData ? (
            <button
              onClick={handleStart}
              disabled={loading || !startUserId}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{loading ? 'Running...' : 'Start BFS'}</span>
            </button>
          ) : (
            <>
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isComplete && !isPlaying}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isComplete ? 'Finished' : 'Play'}</span>
                  </>
                )}
              </button>

              {/* Prev Step */}
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex <= 0 || isPlaying}
                title="Previous step"
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-40"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Next Step */}
              <button
                onClick={handleNextStep}
                disabled={isComplete || isPlaying}
                title="Next step"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-40"
              >
                <span>Next Step</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                title="Reset simulation"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Speed Toggle */}
              <button
                onClick={() => setSpeed((prev) => (prev === 1.0 ? 2.0 : 1.0))}
                className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              >
                {speed}x
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Workspace: 2D Graph Canvas (Top) + Interactive Teaching Panel (Bottom) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <GraphCanvas2D
            users={users}
            friendships={friendships}
            activeTraversalNode={activeTraversalNode}
            visitedTraversalNodes={visitedTraversalNodes}
            queueOrStackNodes={queueNodes}
            activeEdge={activeEdge}
          />
        </div>

        {/* Bottom Teaching Panel for BFS */}
        <div className="h-64 bg-white border-t border-slate-200 flex flex-col z-20 shrink-0 shadow-lg">
          {/* Header bar with step counter */}
          <div className="h-9 px-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-700">
              <span className="font-bold text-indigo-700">Breadth-First Search (BFS)</span>
              <span className="text-slate-300">•</span>
              <span>Explores level by level using a Queue (FIFO)</span>
            </div>

            {traversalData && (
              <div className="font-mono text-slate-600 text-[11px]">
                Step <strong className="text-slate-900">{currentStepIndex + 1}</strong> of{' '}
                <strong className="text-slate-900">{traversalData.steps.length}</strong>
              </div>
            )}
          </div>

          {/* Panel Content Grid */}
          <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
            {/* Column 1: Step Explanation Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  Current Step Explanation
                </div>
                {currentStep ? (
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {currentStep.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Select a starting person above and click <strong>Start BFS</strong> to begin step-by-step exploration.
                  </p>
                )}
              </div>

              {/* DAA Core Rules */}
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-0.5">
                <div>• BFS checks nearby people first.</div>
                <div>• Queue stores people waiting to be visited.</div>
                <div>• A person is added to the queue only when discovered.</div>
                <div>• BFS explores the graph level by level.</div>
              </div>
            </div>

            {/* Column 2: Visible FIFO Queue */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider font-mono">
                    FIFO Queue (Waiting to be visited)
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">First-In, First-Out</span>
                </div>

                {queueNodes.length > 0 ? (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-2">
                    <span className="text-[10px] font-mono text-indigo-700 font-bold shrink-0">FRONT ➔</span>
                    {queueNodes.map((uid, idx) => {
                      const u = userMap.get(uid);
                      const isNext = idx === 0;
                      return (
                        <div
                          key={uid}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold shrink-0 shadow-2xs flex items-center gap-1 ${
                            isNext
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-800 border-slate-200'
                          }`}
                        >
                          <span>{u?.name || uid}</span>
                        </div>
                      );
                    })}
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">➔ BACK</span>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400 italic">
                    {traversalData ? 'Queue is currently empty.' : 'Queue waiting for start.'}
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 font-sans">
                💡 <span className="font-semibold text-slate-700">Concept:</span> Nodes at level 1 are dequeued and examined before any nodes at level 2.
              </div>
            </div>

            {/* Column 3: Visited People & Traversal Order */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                    Traversal Order (Visited)
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {visitedTraversalNodes.length} / {users.length} Visited
                  </span>
                </div>

                {visitedTraversalNodes.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1 max-h-24 overflow-y-auto">
                    {visitedTraversalNodes.map((uid, idx) => {
                      const u = userMap.get(uid);
                      return (
                        <React.Fragment key={uid}>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                            {u?.name || uid}
                          </span>
                          {idx < visitedTraversalNodes.length - 1 && (
                            <span className="text-slate-300 text-xs">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400 italic">
                    No nodes visited yet.
                  </div>
                )}
              </div>

              {/* Completion Banner */}
              {isComplete && (
                <div className="p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    BFS Complete! Traversed {visitedTraversalNodes.length} reachable students.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
