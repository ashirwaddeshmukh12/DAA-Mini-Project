import React from 'react';
import {
  Compass,
  Layers,
  Binary,
  Route,
  BookOpen,
  RotateCcw,
  Users
} from 'lucide-react';

export default function TopNavbar({
  activeTab = 'home',
  onSelectTab = () => {},
  totalUsers = 0,
  totalFriendships = 0,
  onResetDemo = () => {},
  isResetting = false,
  isConnected = true,
}) {
  const navTabs = [
    { id: 'home', label: 'Home / Graph', icon: Compass },
    { id: 'bfs', label: 'BFS Simulator', icon: Layers },
    { id: 'dfs', label: 'DFS Simulator', icon: Binary },
    { id: 'shortest-path', label: 'Shortest Path', icon: Route },
    { id: 'learn', label: 'Learn Algorithms', icon: BookOpen },
  ];

  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between z-30 shrink-0 shadow-xs">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          <span>🌐</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-900 text-base tracking-tight">SocialSphere</h1>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
              DAA Teaching Lab
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Social Network Graph Visualizer & Algorithm Simulator
          </p>
        </div>
      </div>

      {/* 5 Dedicated Navigation Tabs */}
      <nav className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Compact Stats & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Small Graph Stats Pill */}
        <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            <strong className="text-slate-900">{totalUsers}</strong> People
          </span>
          <span className="text-slate-300">•</span>
          <span>
            <strong className="text-slate-900">{totalFriendships}</strong> Connections
          </span>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={onResetDemo}
          disabled={isResetting}
          title="Restore the standard 11-student teaching graph"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isResetting ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* Backend Connected Indicator */}
        <div
          title={isConnected ? 'Connected to FastAPI Backend' : 'Backend Disconnected'}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden xl:inline">Connected</span>
        </div>
      </div>
    </header>
  );
}

