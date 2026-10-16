import React, { useState, useEffect } from 'react';
import GraphCanvas2D from './GraphCanvas2D';
import { api } from '../api';
import { Route, ArrowRight, AlertCircle, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export default function ShortestPathView({ users = [], friendships = [] }) {
  const [sourceId, setSourceId] = useState(users[0]?.id || '');
  const [targetId, setTargetId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default target to Neha or last student in users
  useEffect(() => {
    if (users.length > 0) {
      if (!sourceId) setSourceId(users[0].id);
      if (!targetId && users.length > 1) {
        const neha = users.find((u) => u.name === 'Neha');
        setTargetId(neha ? neha.id : users[users.length - 1].id);
      }
    }
  }, [users, sourceId, targetId]);

  const handleFindPath = async (src = sourceId, tgt = targetId) => {
    if (!src || !tgt) {
      setError('Please choose both starting person and destination person.');
      return;
    }
    if (src === tgt) {
      setError('Start and destination cannot be the same person (0 connections).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.findShortestPath(src, tgt);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error finding shortest path');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first mount if both are set
  useEffect(() => {
    if (sourceId && targetId && !result) {
      handleFindPath(sourceId, targetId);
    }
  }, [sourceId, targetId]);

  const shortestPath = result?.path || [];

  // Quick preset helper
  const handlePreset = (srcName, tgtName) => {
    const s = users.find((u) => u.name === srcName);
    const t = users.find((u) => u.name === tgtName);
    if (s && t) {
      setSourceId(s.id);
      setTargetId(t.id);
      handleFindPath(s.id, t.id);
    }
  };

  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Top Shortest Path Control Bar */}
      <div className="h-14 px-5 bg-white border-b border-slate-200 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Route className="w-4 h-4 text-amber-600" />
            <span>Shortest Path</span>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* Select Source */}
          <div className="flex items-center gap-1.5 text-xs">
            <label className="text-slate-500 font-medium">From:</label>
            <select
              value={sourceId}
              onChange={(e) => {
                setSourceId(e.target.value);
                setResult(null);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 font-mono text-xs">➔</span>

          {/* Select Target */}
          <div className="flex items-center gap-1.5 text-xs">
            <label className="text-slate-500 font-medium">To:</label>
            <select
              value={targetId}
              onChange={(e) => {
                setTargetId(e.target.value);
                setResult(null);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleFindPath(sourceId, targetId)}
            disabled={loading || !sourceId || !targetId || sourceId === targetId}
            className="flex items-center gap-1 px-3.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors disabled:opacity-40"
          >
            <span>{loading ? 'Finding...' : 'Find Path'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => handlePreset('Aditi', 'Neha')}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-slate-200 text-slate-700 font-medium transition-colors"
          >
            Aditi ➔ Neha
          </button>
          <button
            onClick={() => handlePreset('Aditi', 'Vikram')}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 border border-slate-200 text-slate-700 font-medium transition-colors"
          >
            Aditi ➔ Vikram (Disconnected)
          </button>
        </div>
      </div>

      {/* Main Area: Graph Canvas + Results Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Graph Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <GraphCanvas2D
            users={users}
            friendships={friendships}
            shortestPath={shortestPath}
          />
        </div>

        {/* Right Results Panel */}
        <aside className="w-80 lg:w-92 bg-white border-l border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 z-20 shadow-xs p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Route className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Shortest Path Analysis</h3>
                <p className="text-[11px] text-slate-500">Unweighted Breadth-First Search (BFS)</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                {result.connected ? (
                  <>
                    {/* Path Sequence Card */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
                        Route Found
                      </div>
                      <div className="text-sm font-bold text-slate-900 tracking-tight flex flex-wrap items-center gap-1.5">
                        {result.path.map((uid, idx) => {
                          const u = userMap.get(uid);
                          return (
                            <React.Fragment key={uid}>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-950 font-bold shadow-2xs">
                                {u?.name || uid}
                              </span>
                              {idx < result.path.length - 1 && (
                                <span className="text-amber-500 font-bold">→</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs">
                        <span className="text-amber-900 font-semibold">
                          Shortest path: {result.edges_count} {result.edges_count === 1 ? 'connection' : 'connections'}.
                        </span>
                        <span className="font-mono text-[11px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md">
                          {result.edges_count} hops
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Connection Links */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                        Connection Breakdown
                      </div>
                      <div className="space-y-1 text-xs text-slate-700">
                        {result.path.slice(0, -1).map((uid, i) => {
                          const u1 = userMap.get(uid);
                          const u2 = userMap.get(result.path[i + 1]);
                          return (
                            <div
                              key={i}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                            >
                              <span className="font-medium text-slate-900">
                                {u1?.name} ↔ {u2?.name}
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                Link {i + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>No Path Exists</span>
                    </div>
                    <p className="text-xs text-red-900 leading-relaxed font-medium">
                      No friendship connection exists between <strong>{userMap.get(sourceId)?.name}</strong> and{' '}
                      <strong>{userMap.get(targetId)?.name}</strong>.
                    </p>
                    <p className="text-[11px] text-red-700 leading-normal">
                      Reason: These students belong to isolated disconnected components. There is no sequence of friendships linking them.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DAA Teaching Explanation Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>DAA Concept Note</span>
            </div>
            <p className="leading-relaxed">
              <strong>Shortest path means the minimum number of friendship links, not physical distance.</strong>
            </p>
            <p className="leading-relaxed text-[11px] text-slate-500">
              In an unweighted graph, BFS guarantees the shortest path because it discovers vertices strictly by hop level (1-hop friends, then 2-hop friends, etc.).
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
