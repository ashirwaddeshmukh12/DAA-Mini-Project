import React from 'react';
import {
  Users,
  Network,
  GitCommit,
  Layers,
  Award,
  BarChart3,
  TrendingUp,
  Cpu,
  Info
} from 'lucide-react';

export default function AnalyticsDashboard({
  analytics = null,
  onSelectUser = () => {},
}) {
  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Computing real-time network topology analytics...
      </div>
    );
  }

  const {
    total_users,
    total_friendships,
    average_degree,
    density,
    connected_components_count,
    connected_components,
    most_connected_user,
    communities,
    degree_distribution,
  } = analytics;

  return (
    <div className="space-y-6 select-none p-1">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#090f24] border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Nodes (|V|)</span>
            <Users className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{total_users}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total Network Profiles</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090f24] border border-blue-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Edges (|E|)</span>
            <GitCommit className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{total_friendships}</div>
          <div className="text-[11px] text-slate-400 mt-1">Undirected Friendships</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090f24] border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Degree</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{average_degree}</div>
          <div className="text-[11px] text-slate-400 mt-1">2|E| / |V| Connections</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090f24] border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Components</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{connected_components_count}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {connected_components_count === 1 ? 'Fully Connected' : 'Disconnected Subgraphs'}
          </div>
        </div>
      </div>

      {/* DAA Crucial Distinction Note */}
      <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-slate-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-cyan-300 font-semibold">DAA Architectural Insight: Node Degree vs. Community Size</strong>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            In graph theory, a node's <strong>degree $d(v)$</strong> is purely the count of its direct incident edges (direct friends).
            Conversely, a <strong>community</strong> is a subgraph partition of nodes that share denser interconnectivity.
            A user in a 10-person community may have a degree of only 2, while a high-degree bridge user connects multiple communities.
          </p>
        </div>
      </div>

      {/* Most Connected User & Connected Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Connected User Card */}
        {most_connected_user && (
          <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Network Hub (Highest Degree Centrality)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#060a18] border border-amber-500/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{most_connected_user.avatar || '👤'}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{most_connected_user.name}</h4>
                  <p className="text-xs text-amber-400 font-mono">{most_connected_user.handle}</p>
                  <p className="text-[11px] text-slate-400">{most_connected_user.role}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold font-mono text-amber-400">
                  {most_connected_user.degree}
                </div>
                <div className="text-[10px] text-slate-400 font-mono uppercase">Direct Friends</div>
              </div>
            </div>

            <button
              onClick={() => onSelectUser(most_connected_user)}
              className="w-full py-1.5 rounded-xl text-xs font-medium bg-[#0e1738] hover:bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 transition-colors"
            >
              Focus on Hub Node in 3D
            </button>
          </div>
        )}

        {/* Connected Components Breakdown */}
        <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Connected Components ({connected_components_count})</span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {connected_components.map((comp, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#060a18] border border-cyber-border/60"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    Component #{idx + 1}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {idx === 0 ? 'Primary Connected Component' : 'Satellite / Disconnected Cluster'}
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
                  {comp.length} vertices
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Degree Distribution Histogram */}
      <div className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Degree Distribution $P(k)$</span>
        </div>

        <div className="flex items-end gap-2 h-28 pt-4 px-2">
          {Object.entries(degree_distribution)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([deg, count]) => {
              const maxCount = Math.max(...Object.values(degree_distribution));
              const heightPct = Math.max(15, (count / maxCount) * 100);
              return (
                <div key={deg} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-cyan-300 font-mono">{count}</span>
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t transition-all"
                    style={{ height: `${heightPct}%` }}
                    title={`Degree ${deg}: ${count} user(s)`}
                  />
                  <span className="text-[10px] text-slate-400 font-mono">d={deg}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
