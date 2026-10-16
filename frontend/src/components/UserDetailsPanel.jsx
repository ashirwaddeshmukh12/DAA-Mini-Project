import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  UserCheck,
  Sparkles,
  GitCompare,
  Trash2,
  ExternalLink,
  Shield,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { api } from '../api';

export default function UserDetailsPanel({
  user = null,
  allUsers = [],
  onClose = () => {},
  onSelectUser = () => {},
  onDeleteUser = () => {},
  onConnectUsers = () => {},
  onFindPathTo = () => {},
}) {
  const [userDetails, setUserDetails] = useState(null);
  const [compareUserId, setCompareUserId] = useState('');
  const [mutualFriendsData, setMutualFriendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch full details (friends + smart suggestions) when selected user changes
  useEffect(() => {
    if (!user) {
      setUserDetails(null);
      setCompareUserId('');
      setMutualFriendsData(null);
      return;
    }

    setLoading(true);
    api.getUser(user.id)
      .then((data) => {
        setUserDetails(data);
      })
      .catch((err) => {
        console.error("Failed to load user details:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Compute mutual friends whenever compareUserId changes
  useEffect(() => {
    if (user && compareUserId && compareUserId !== user.id) {
      api.getMutualFriends(user.id, compareUserId)
        .then((data) => {
          setMutualFriendsData(data);
        })
        .catch((err) => {
          console.error("Failed to compute mutual friends:", err);
        });
    } else {
      setMutualFriendsData(null);
    }
  }, [user, compareUserId]);

  if (!user) {
    return (
      <aside className="w-80 lg:w-96 border-l border-cyber-border/70 bg-cyber-surface/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center z-10 shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-[#080d22] border border-cyber-border flex items-center justify-center text-3xl mb-4 shadow-inner">
          <Compass className="w-8 h-8 text-slate-500 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <h3 className="font-semibold text-slate-200 mb-1">No Node Selected</h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Click any 3D sphere node in the graph, search from the top navigation, or explore algorithms to view connection intelligence.
        </p>
      </aside>
    );
  }

  const friends = userDetails?.friends || [];
  const suggestions = userDetails?.suggestions || [];

  return (
    <aside className="w-80 lg:w-96 border-l border-cyber-border/70 bg-cyber-surface/90 backdrop-blur-md flex flex-col justify-between z-10 shrink-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Top Header Card */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-b from-[#0e1733] to-[#090e22] border border-cyber-border shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-glow-cyan">
              {user.avatar || '👤'}
            </div>
            <div className="flex-1 pr-6">
              <h2 className="text-lg font-bold text-white tracking-wide">{user.name}</h2>
              <p className="text-xs text-cyber-cyan font-mono">{user.handle}</p>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
                  {user.community || 'General'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-slate-300 leading-relaxed mb-3 bg-[#060a18] p-2.5 rounded-xl border border-cyber-border/40">
              {user.bio}
            </p>
          )}

          {/* Graph Metric Badges */}
          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-cyber-border/60">
            <div className="bg-[#070b1a] p-2 rounded-xl border border-cyber-border/40">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Degree (Friends)</div>
              <div className="text-base font-bold text-cyber-cyan font-mono">
                {user.degree !== undefined ? user.degree : friends.length}
              </div>
            </div>
            <div className="bg-[#070b1a] p-2 rounded-xl border border-cyber-border/40">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Role</div>
              <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                {user.role || 'Member'}
              </div>
            </div>
          </div>
        </div>

        {/* Mutual Friends Comparative Explorer */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
            <GitCompare className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Compare Mutual Friends</span>
          </div>
          <div className="space-y-2 bg-[#070c1d] p-3 rounded-xl border border-cyber-border">
            <select
              value={compareUserId}
              onChange={(e) => setCompareUserId(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#0b1328] border border-cyber-border text-slate-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="">Compare with another network user...</option>
              {allUsers
                .filter((u) => u.id !== user.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.handle})
                  </option>
                ))}
            </select>

            {mutualFriendsData && (
              <div className="pt-2 border-t border-cyber-border/50">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Common Friends:</span>
                  <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30">
                    {mutualFriendsData.count} mutual
                  </span>
                </div>
                {mutualFriendsData.mutual_friends.length > 0 ? (
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {mutualFriendsData.mutual_friends.map((mf) => (
                      <button
                        key={mf.id}
                        onClick={() => onSelectUser(mf)}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg bg-[#0d1733] hover:bg-cyan-950/50 text-left transition-colors"
                      >
                        <span className="text-xs text-slate-200 flex items-center gap-1.5">
                          <span>{mf.avatar || '👤'}</span>
                          <span>{mf.name}</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No common friends between these two users.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Direct Friends List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Direct Friends ({friends.length})</span>
            </div>
          </div>
          {friends.length === 0 ? (
            <div className="p-3 bg-[#070c1d] rounded-xl border border-cyber-border text-center text-xs text-slate-400">
              No direct connections established yet.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#080d20] border border-cyber-border/60 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all group"
                >
                  <button
                    onClick={() => onSelectUser(friend)}
                    className="flex items-center gap-2 text-left flex-1 truncate"
                  >
                    <span className="text-base">{friend.avatar || '👤'}</span>
                    <div className="truncate">
                      <div className="text-xs font-medium text-slate-200 group-hover:text-cyber-cyan truncate">
                        {friend.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {friend.handle}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => onFindPathTo(user.id, friend.id)}
                    title="Find connection path in 3D"
                    className="p-1 rounded text-slate-500 hover:text-amber-400 hover:bg-amber-950/40 ml-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smart Friend Recommendations (Mutual Friends Heuristic) */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Recommended Friends</span>
            </div>
            <div className="space-y-1.5">
              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#090f24] border border-purple-500/20 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{sug.avatar || '👤'}</span>
                    <div className="truncate">
                      <div className="text-xs font-medium text-slate-200 truncate">{sug.name}</div>
                      <div className="text-[10px] text-purple-300 font-mono">
                        {sug.mutual_count} mutual friend{sug.mutual_count > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onConnectUsers(user.id, sug.id)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 transition-colors shrink-0"
                  >
                    + Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete User Option (Cascade Deletion) */}
      <div className="p-4 border-t border-cyber-border/70 bg-[#070b1a]">
        <button
          onClick={() => {
            if (window.confirm(`Delete user "${user.name}"? This will permanently remove this node and all connected friendships from SQLite.`)) {
              onDeleteUser(user.id);
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 hover:text-white transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Node & Cascaded Edges</span>
        </button>
      </div>
    </aside>
  );
}
