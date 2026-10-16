import React, { useState } from 'react';
import {
  Cpu,
  Clock,
  HardDrive,
  Activity,
  Play,
  Info,
  CheckCircle2,
  Table,
  Zap,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function ComplexityAnalysis() {
  const [selectedAlgo, setSelectedAlgo] = useState('bfs');
  const [selectedSizes, setSelectedSizes] = useState([25, 50, 100, 250, 500]);
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRunBenchmark = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.runBenchmark(selectedSizes, selectedAlgo);
      setBenchmarkResults(data);
    } catch (err) {
      setError(err.message || 'Benchmark execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none p-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              DAA Theoretical & Empirical Complexity Analysis
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Design and Analysis of Algorithms • Asymptotic Bounds & Hardware Benchmarking
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
          DAA Syllabus Benchmark
        </span>
      </div>

      {/* Fundamentals: Explaining V and E */}
      <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>Understanding Asymptotic Variables $V$ and $E$</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-3 bg-[#060a18] rounded-xl border border-cyber-border/50">
            <strong className="text-white block mb-1">Vertex Count ($|V|$) — Vertices / Nodes</strong>
            <p className="text-slate-300">
              Represents the total number of individual entities (users/profiles) stored in the network.
              Each vertex is stored in an adjacency list head and visited at most once during traversal.
            </p>
          </div>
          <div className="p-3 bg-[#060a18] rounded-xl border border-cyber-border/50">
            <strong className="text-white block mb-1">Edge Count ($|E|$) — Edges / Friendships</strong>
            <p className="text-slate-300">
              Represents the total bidirectional friendship relations between pairs of vertices.
              In an undirected graph, every edge $(u, v)$ is traversed in both directions, contributing $2|E|$ edge inspections across all vertices.
            </p>
          </div>
        </div>
      </div>

      {/* Theoretical Asymptotic Complexity Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adjacency List Storage */}
        <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase">
              1. Adjacency-List Graph Storage
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-500/40">
              Space: $\Theta(V + E)$
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The graph uses an array/hash of $|V|$ vertex lists. Total list nodes across all vertices is $\sum_{v} \deg(v) = 2|E|$.
            Optimal for sparse real-world social networks where $|E| \ll |V|^2$.
          </p>
        </div>

        {/* BFS Traversal */}
        <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase">
              2. Breadth-First Search (BFS)
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-500/40">
              Time: $O(V + E)$
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every reachable vertex is enqueued and dequeued exactly once ($\Theta(V)$). For each dequeued vertex, its adjacency list is scanned, checking each incident edge ($\Theta(E)$). Space is $O(V)$ for queue and visited set.
          </p>
        </div>

        {/* DFS Traversal */}
        <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase">
              3. Depth-First Search (DFS)
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-500/40">
              Time: $O(V + E)$
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each vertex is visited once through recursive calls or explicit stack ($\Theta(V)$). Each edge is examined once from each endpoint ($\Theta(E)$). Space is $O(V)$ for recursive call stack height in the worst-case line graph.
          </p>
        </div>

        {/* BFS Shortest Path */}
        <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase">
              4. Unweighted Shortest Path
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/40">
              Time: $O(V + E)$
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Since edge weights are uniform ($w(e) = 1$), standard BFS guarantees shortest path discovery upon first reaching the destination, avoiding the $O((V+E)\log V)$ priority queue overhead of Dijkstra's algorithm.
          </p>
        </div>
      </div>

      {/* Interactive Empirical Benchmark Test Facility */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Empirical Graph Scalability Benchmark Facility
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAlgo('bfs')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                selectedAlgo === 'bfs'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Benchmark BFS
            </button>
            <button
              onClick={() => setSelectedAlgo('dfs')}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                selectedAlgo === 'dfs'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Benchmark DFS
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Test theoretical linear growth against actual runtime. The facility generates synthetic graphs of sizes $|V| \in [25, 50, 100, 250, 500]$, executes timed traversals using high-precision hardware timers, and records execution times.
        </p>

        {/* Run Button */}
        <button
          onClick={handleRunBenchmark}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 px-5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-950/60 transition-all border border-cyan-400/40 disabled:opacity-40"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{loading ? 'Measuring Hardware Timers...' : `Run ${selectedAlgo.toUpperCase()} Empirical Benchmark`}</span>
        </button>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Results Table */}
        {benchmarkResults && (
          <div className="space-y-3 pt-2">
            <div className="overflow-x-auto rounded-xl border border-cyber-border">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#050814] text-slate-400 font-mono uppercase text-[10px] border-b border-cyber-border">
                  <tr>
                    <th className="py-2.5 px-3">Nodes (|V|)</th>
                    <th className="py-2.5 px-3">Edges (|E|)</th>
                    <th className="py-2.5 px-3 text-cyan-300">Theoretical (|V| + |E|)</th>
                    <th className="py-2.5 px-3 text-amber-300">Empirical Runtime (ms)</th>
                    <th className="py-2.5 px-3 text-emerald-300">Operations / ms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-border/40 font-mono">
                  {benchmarkResults.results.map((row) => (
                    <tr key={row.nodes} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3 text-white font-semibold">{row.nodes}</td>
                      <td className="py-2.5 px-3 text-slate-300">{row.edges}</td>
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">{row.v_plus_e}</td>
                      <td className="py-2.5 px-3 text-amber-300 font-bold">
                        {row.execution_time_ms} ms
                      </td>
                      <td className="py-2.5 px-3 text-emerald-300">
                        {row.ops_per_ms} ops/ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Academic Scientific Caution Notice */}
            <div className="p-3 rounded-xl bg-[#060a18] border border-amber-500/30 text-[11px] text-slate-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Academic Rigor Notice: Empirical Measurement vs. Mathematical Proof
                </strong>
                <p className="leading-relaxed">
                  These measured execution times are <strong>empirical measurements</strong> on the current CPU architecture and OS scheduler, not mathematical proofs.
                  Empirical runtimes include OS thread preemption, cache hits/misses, and garbage collection jitter.
                  The formal mathematical proof of $O(V + E)$ stems from the graph invariant that each vertex is queued once and each edge is inspected twice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
