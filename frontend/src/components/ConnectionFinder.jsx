import React, { useState } from 'react';
import { GitFork, ArrowRight, Zap, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../api';

export default function ConnectionFinder({
  users = [],
  onPathCalculated = () => {},
  onSelectUser = () => {},
}) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFindPath = async () => {
    if (!sourceId || !targetId) {
      setError('Please select both a source and target user.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await api.findShortestPath(sourceId, targetId);
      setResult(data);
      onPathCalculated(data.path || []);
    } catch (err) {
      setError(err.message || 'Failed to calculate shortest path');
      setResult(null);
      onPathCalculated([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError('');
    onPathCalculated([]);
  };

  return (
    <div className="bg-[#070c1e] border border-cyber-border rounded-2xl p-4 shadow-xl space-y-4 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Shortest Connection Path (Unweighted BFS)
          </h3>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300">
          DAA O(V + E)
        </span>
      </div>

      {/* Source and Target User Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Source User (Start Node)
          </label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-[#0b1328] border border-cyber-border text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="">Select source user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.avatar || '👤'} {u.name} ({u.handle})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
            Target User (Destination Node)
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-[#0b1328] border border-cyber-border text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="">Select target user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.avatar || '👤'} {u.name} ({u.handle})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleFindPath}
          disabled={loading || !sourceId || !targetId}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-950/60 transition-all border border-amber-400/40 disabled:opacity-40"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{loading ? 'Executing BFS...' : 'Find Shortest Path'}</span>
        </button>

        {result && (
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-[#0b1328] border border-cyber-border text-slate-400 hover:text-white"
          >
            Clear Path
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-3 pt-2">
          {result.path_found ? (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-[#0e1733] border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Optimal Path Located</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-amber-400 font-bold">
                    {result.edges_count} connection hop{result.edges_count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-slate-400">
                    ({result.path.length} users)
                  </span>
                </div>
              </div>

              {/* Path Sequence Nodes */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {result.path_details?.map((u, idx) => (
                  <React.Fragment key={u.id}>
                    <button
                      onClick={() => onSelectUser(u)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0b1328] border border-amber-400/50 hover:bg-amber-950/50 shrink-0 text-left transition-colors"
                    >
                      <span>{u.avatar || '👤'}</span>
                      <span className="text-xs font-medium text-amber-100">{u.name}</span>
                    </button>
                    {idx < result.path_details.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <p className="text-[11px] text-slate-300 font-sans">
                {result.message} Highlighted in vibrant gold on the 3D graph canvas.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-300 font-semibold mb-0.5">No Path Discovered</strong>
                <p className="text-slate-300 leading-relaxed">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
