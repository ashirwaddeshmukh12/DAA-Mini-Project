import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Sparkles,
  GitCompare,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { api } from '../api';

export default function StudentDetailsPanel({
  user = null,
  allUsers = [],
  onClose = () => {},
  onSelectUser = () => {},
  onDeleteUser = () => {},
  onConnectUsers = () => {},
  currentStep = null,
  algorithmName = '',
}) {
  const [userDetails, setUserDetails] = useState(null);
  const [compareUserId, setCompareUserId] = useState('');
  const [mutualFriendsData, setMutualFriendsData] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserDetails(null);
      setCompareUserId('');
      setMutualFriendsData(null);
      return;
    }

    api.getUser(user.id)
      .then((data) => setUserDetails(data))
      .catch((err) => console.error('Failed to load user details:', err));
  }, [user]);

  // Compute mutual friends when compareUserId changes
  useEffect(() => {
    if (user && compareUserId && compareUserId !== user.id) {
      api.getMutualFriends(user.id, compareUserId)
        .then((data) => setMutualFriendsData(data))
        .catch((err) => console.error('Failed to compute mutual friends:', err));
    } else {
      setMutualFriendsData(null);
    }
  }, [user, compareUserId]);

  const friends = userDetails?.friends || [];
  const suggestions = userDetails?.suggestions || [];

  return (
    <aside className="w-80 lg:w-92 bg-white border-l border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 z-20 shadow-xs">
      <div className="p-4 space-y-4">
        {/* Top Algorithm Step Narrative Banner (if algorithm active) */}
        {currentStep && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white font-mono">
                {algorithmName} • Step #{currentStep.step}
              </span>
              <span className="text-[10px] font-mono font-semibold text-indigo-900 uppercase">
                Action: {currentStep.action}
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
              {currentStep.description}
            </p>
          </div>
        )}

        {/* Selected Student Profile */}
        {user ? (
          <div className="space-y-4">
            {/* Header Card */}
            <div className="relative p-4 rounded-xl bg-slate-50 border border-slate-200">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                  {user.avatar || '👤'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
                  <p className="text-xs text-indigo-600 font-mono font-medium">{user.handle}</p>
                  <p className="text-[11px] text-slate-500">{user.role || 'Student'}</p>
                </div>
              </div>

              {user.bio && (
                <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mb-2.5 leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Graph Degree Badge */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Node Degree (Friends):</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                  d(v) = {user.degree !== undefined ? user.degree : friends.length}
                </span>
              </div>
            </div>

            {/* Direct Friends List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Direct Friends ({friends.length})</span>
                </div>
              </div>

              {friends.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-lg text-center">
                  No friendships connected yet.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {friends.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onSelectUser(f)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span>{f.avatar || '👤'}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                            {f.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{f.handle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        deg {f.degree || 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compare Mutual Friends */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Compare Mutual Friends</span>
              </div>

              <select
                value={compareUserId}
                onChange={(e) => setCompareUserId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="">Select student to compare...</option>
                {allUsers
                  .filter((u) => u.id !== user.id)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.handle})
                    </option>
                  ))}
              </select>

              {mutualFriendsData && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Common Friends:</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                      {mutualFriendsData.count} mutual
                    </span>
                  </div>
                  {mutualFriendsData.mutual_friends.length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {mutualFriendsData.mutual_friends.map((mf) => (
                        <span
                          key={mf.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-xs font-medium text-indigo-800"
                        >
                          <span>{mf.avatar || '👤'}</span>
                          <span>{mf.name}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No common friends between these students.</p>
                  )}
                </div>
              )}
            </div>

            {/* Friend Suggestions (Common Neighbors Heuristic) */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Friend Suggestions</span>
                </div>
                <div className="space-y-1.5">
                  {suggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-purple-50/60 border border-purple-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{sug.avatar || '👤'}</span>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-800 truncate">{sug.name}</div>
                          <div className="text-[10px] text-purple-700 font-mono">
                            {sug.mutual_count} common friend{sug.mutual_count > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onConnectUsers(user.id, sug.id)}
                        className="text-[11px] font-semibold px-2 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white transition-colors shrink-0"
                      >
                        + Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Compass className="w-8 h-8 mx-auto text-slate-300 animate-spin" style={{ animationDuration: '25s' }} />
            <h4 className="font-semibold text-slate-600 text-xs">No Person Selected</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Click any student circle on the graph to inspect friendships, mutual friends, and recommendations.
            </p>
          </div>
        )}
      </div>

      {/* Delete Student Button (Cascade Integrity) */}
      {user && (
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => {
              if (
                window.confirm(
                  `Delete ${user.name}? This will remove the node and its friendships from SQLite.`
                )
              ) {
                onDeleteUser(user.id);
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Student & Incident Edges</span>
          </button>
        </div>
      )}
    </aside>
  );
}
