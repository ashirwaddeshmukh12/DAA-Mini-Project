import React from 'react';
import {
  LayoutDashboard,
  Compass,
  GitFork,
  Layers,
  Binary,
  Cpu,
  UserPlus,
  Link2,
  Network
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tag: 'Metrics' },
  { id: 'explore', label: 'Explore Network', icon: Compass, tag: '3D View' },
  { id: 'find-connection', label: 'Find Connection', icon: GitFork, tag: 'Shortest Path' },
  { id: 'bfs', label: 'BFS Traversal', icon: Layers, tag: 'O(V+E)' },
  { id: 'dfs', label: 'DFS Traversal', icon: Binary, tag: 'O(V+E)' },
  { id: 'communities', label: 'Communities', icon: Network, tag: 'Clusters' },
  { id: 'complexity', label: 'Complexity Analysis', icon: Cpu, tag: 'DAA' },
];

export default function LeftSidebar({
  activeTab = 'explore',
  onSelectTab = () => {},
  onOpenAddUser = () => {},
  onOpenAddFriendship = () => {},
}) {
  return (
    <aside className="w-64 border-r border-cyber-border/70 bg-cyber-surface/90 backdrop-blur-md flex flex-col justify-between p-3.5 z-10 shrink-0">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
            Graph Intelligence
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Graph Mutation Actions */}
        <div className="pt-2 border-t border-cyber-border/50">
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
            Graph Mutation
          </div>
          <div className="space-y-2">
            <button
              onClick={onOpenAddUser}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-950/50 transition-all border border-cyan-400/30 active:scale-98"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Network User</span>
            </button>

            <button
              onClick={onOpenAddFriendship}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#0b1328] border border-cyber-border text-slate-200 hover:border-cyber-purple hover:text-purple-300 hover:bg-purple-950/20 transition-all active:scale-98"
            >
              <Link2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Connect Friendship Edge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer DAA Academic Note */}
      <div className="p-3 bg-[#070b1a] border border-cyber-border/50 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="text-xs font-semibold text-slate-200">DAA Microproject</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Graph traversal & analysis algorithms implemented with real adjacency matrices & lists.
        </p>
      </div>
    </aside>
  );
}
