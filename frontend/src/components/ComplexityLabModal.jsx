import React, { useState } from 'react';
import {
  X,
  Cpu,
  Play,
  Clock,
  HardDrive,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Zap
} from 'lucide-react';
import { api } from '../api';

export default function ComplexityLabModal({
  isOpen = false,
  onClose = () => {},
}) {
  const [selectedAlgo, setSelectedAlgo] = useState('bfs');
  const [selectedSizes, setSelectedSizes] = useState([20, 50, 100, 200, 500]);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRunBenchmark = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.runBenchmark(selectedSizes, selectedAlgo);
      setBenchmarkData(data);
    } catch (err) {
      setError(err.message || 'Benchmark execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                DAA Algorithm Complexity Lab & Empirical Benchmark
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Theoretical Asymptotic Analysis vs. Real Hardware Benchmark Measurements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Asymptotic Foundations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase font-mono">
                  BFS (Breadth-First Search)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  Time: O(V + E) • Space: O(V)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Every reachable student vertex is enqueued/dequeued once (&Theta;(V)). For each dequeued vertex, each incident friendship edge is examined (&Theta;(E)). Space is O(V) for the queue.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 uppercase font-mono">
                  DFS (Depth-First Search)
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Time: O(V + E) • Space: O(V)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Explores one branch deeply before backtracking. Visited set prevents cycles. In simple sparse graphs, total work is proportional to $(V + E)$.
              </p>
            </div>
          </div>

          {/* Interactive Benchmark Section */}
          <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>Run Empirical Scalability Experiment</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Measures median CPU runtime across 7 test iterations on reproducible graphs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedAlgo('bfs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                    selectedAlgo === 'bfs'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Benchmark BFS
                </button>
                <button
                  onClick={() => setSelectedAlgo('dfs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                    selectedAlgo === 'dfs'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Benchmark DFS
                </button>
                <button
                  onClick={handleRunBenchmark}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{loading ? 'Testing...' : 'Run Experiment'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-800 text-xs">
                {error}
              </div>
            )}

            {/* Benchmark Results Table & Visual Comparison */}
            {benchmarkData && (
              <div className="space-y-4 pt-2">
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Nodes (|V|)</th>
                        <th className="py-2.5 px-3">Edges (|E|)</th>
                        <th className="py-2.5 px-3 text-indigo-700">Theoretical (|V| + |E|)</th>
                        <th className="py-2.5 px-3 text-emerald-700">BFS Median Runtime (ms)</th>
                        <th className="py-2.5 px-3 text-purple-700">DFS Median Runtime (ms)</th>
                        <th className="py-2.5 px-3">Operations / ms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {benchmarkData.comparison?.map((row, idx) => (
                        <tr key={row.nodes} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-bold text-slate-900">{row.nodes}</td>
                          <td className="py-2 px-3 text-slate-700">{row.edges}</td>
                          <td className="py-2 px-3 font-bold text-indigo-700">{row.v_plus_e}</td>
                          <td className="py-2 px-3 text-emerald-800 font-semibold">{row.bfs_time_ms} ms</td>
                          <td className="py-2 px-3 text-purple-800 font-semibold">{row.dfs_time_ms} ms</td>
                          <td className="py-2 px-3 text-slate-600">
                            {benchmarkData.results[idx]?.ops_per_ms || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Teacher Scientific Rigor Callout */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-amber-900 font-semibold block">
                      Scientific Rigor: Empirical Measurement vs. Mathematical Proof
                    </strong>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      These figures are <strong>empirically measured runtimes</strong> on your CPU using high-precision hardware timers (averaged via median of 7 runs to eliminate OS noise). They confirm that execution scales linearly with <strong>V + E</strong>, though actual milliseconds are influenced by memory caches and thread scheduling.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DAA Asymptotic Complexity Educational Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Teaching Explanation of Big-O Classes</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-700">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-indigo-700 font-mono block mb-1">O(1) — Constant Work</strong>
                Checking whether two people are friends via a hash lookup or accessing an array index.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-indigo-700 font-mono block mb-1">O(V) — Linear in Vertices</strong>
                Initializing visited flags or printing the list of all students in the college network.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-indigo-700 font-mono block mb-1">O(V + E) — Adjacency-List Traversal</strong>
                BFS and DFS on social networks: each student is queued once (&Theta;(V)) and each friendship is examined twice (&Theta;(E)).
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-indigo-700 font-mono block mb-1">O(V²) — Dense Graph Worst-Case</strong>
                In a complete graph where every student is friends with everyone else, E = V(V - 1)/2 = O(V&sup2;). Thus O(V + E) becomes O(V&sup2;).
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
}
