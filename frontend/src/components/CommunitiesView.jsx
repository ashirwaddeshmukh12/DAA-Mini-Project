import React from 'react';
import { Network, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CommunitiesView({
  communities = [],
  allUsers = [],
  onSelectUser = () => {},
}) {
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  return (
    <div className="space-y-4 select-none p-1">
      <div className="flex items-center justify-between pb-2 border-b border-cyber-border/60">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Network Communities & Subgraph Partitions
          </h3>
        </div>
        <span className="text-[11px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40">
          {communities.length} Detected Clusters
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">
        In social network intelligence, communities represent densely connected clusters of individuals sharing mutual domains, affiliations, or technical domains.
      </p>

      {/* Grid of Community Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {communities.map((comm) => (
          <div
            key={comm.name}
            className="p-4 rounded-2xl bg-[#090f24] border border-cyber-border space-y-3 shadow-lg hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shadow-md"
                  style={{ backgroundColor: comm.color }}
                />
                <h4 className="text-sm font-bold text-white">{comm.name}</h4>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#070c1d] border border-cyber-border text-slate-300">
                {comm.user_count} members
              </span>
            </div>

            {/* Members List */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {comm.users.map((uid) => {
                const u = userMap.get(uid);
                if (!u) return null;
                return (
                  <button
                    key={uid}
                    onClick={() => onSelectUser(u)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-[#060a18] hover:bg-cyan-950/30 text-left transition-colors border border-cyber-border/40 group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{u.avatar || '👤'}</span>
                      <div className="truncate">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {u.handle} • {u.role}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
