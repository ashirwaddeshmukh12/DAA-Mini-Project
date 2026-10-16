import React, { useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, Activity, Sparkles, RefreshCw, X, Shield, Users } from 'lucide-react';

export default function TopNav({
  users = [],
  analytics = null,
  onSelectUser = () => {},
  onResetCamera = () => {},
  onResetSampleData = () => {},
  isResetting = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const filteredUsers = searchQuery.trim() === ''
    ? []
    : users.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.handle.toLowerCase().includes(q) ||
          (u.role && u.role.toLowerCase().includes(q)) ||
          (u.community && u.community.toLowerCase().includes(q))
        );
      }).slice(0, 8);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-5 border-b border-cyber-border/70 bg-cyber-surface/90 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
      {/* Brand Logo & Academic Tag */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 p-0.5 flex items-center justify-center shadow-glow-cyan">
          <div className="w-full h-full bg-[#070b1a] rounded-[10px] flex items-center justify-center">
            <span className="text-xl">🌐</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-wide text-white flex items-center gap-1.5">
              <span>SocialSphere</span>
              <span className="text-cyber-cyan text-sm px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                3D
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            DAA Network Intelligence Engine • Graph Theory
          </p>
        </div>
      </div>

      {/* Center Search Autocomplete */}
      <div className="relative w-80 lg:w-96" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search users, handles, skills..."
            className="w-full pl-9 pr-8 py-1.5 bg-[#070c1d] border border-cyber-border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && filteredUsers.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0b1328] border border-cyber-border rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-[#070b19] border-b border-cyber-border/50">
              Matching Network Nodes ({filteredUsers.length})
            </div>
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-cyan-950/40 border-b border-cyber-border/30 last:border-b-0 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{user.avatar || '👤'}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-cyber-cyan transition-colors">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {user.handle} • {user.role || user.community}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#101b38] text-cyan-300 border border-cyan-800/40">
                    deg {user.degree || 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Quick Controls & Network Health */}
      <div className="flex items-center gap-3">
        {analytics && (
          <div className="hidden md:flex items-center gap-3 text-xs font-mono bg-[#070c1d] border border-cyber-border px-3.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan"></span>
              <span>|V| = {analytics.total_users}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span>|E| = {analytics.total_friendships}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="text-purple-400">
              {analytics.connected_components_count} comp
            </div>
          </div>
        )}

        <button
          onClick={onResetCamera}
          title="Reset Camera View to Default"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0b1328] border border-cyber-border text-slate-300 hover:text-white hover:border-cyber-cyan hover:bg-cyan-950/20 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Reset View</span>
        </button>

        <button
          onClick={onResetSampleData}
          disabled={isResetting}
          title="Reset to original 30-node academic sample graph"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0b1328] border border-cyber-border text-slate-300 hover:text-amber-300 hover:border-amber-400/50 hover:bg-amber-950/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reset Graph</span>
        </button>
      </div>
    </header>
  );
}
