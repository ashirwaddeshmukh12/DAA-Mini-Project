import React, { useState } from 'react';
import GraphCanvas2D from './GraphCanvas2D';
import {
  UserPlus,
  Link2,
  Unlink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  RotateCcw,
  Users,
  ArrowRight
} from 'lucide-react';

export default function HomeGraphView({
  users = [],
  friendships = [],
  selectedUser = null,
  onSelectUser = () => {},
  onAddUser = () => {},
  onDeleteUser = () => {},
  onAddFriendship = () => {},
  onDeleteFriendship = () => {},
  directFriendIds = new Set(),
}) {
  const [newPersonName, setNewPersonName] = useState('');
  const [connectUser1, setConnectUser1] = useState('');
  const [connectUser2, setConnectUser2] = useState('');
  const [removeFriendshipKey, setRemoveFriendshipKey] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isolateMode, setIsolateMode] = useState(true);

  // Clear feedback after 4 seconds
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreatePerson = async (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    const name = newPersonName.trim();
    try {
      await onAddUser({
        name,
        handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
        role: 'Computer Science',
        community: 'Main Network',
        avatar: '🧑‍🎓',
      });
      setNewPersonName('');
      showFeedback('success', `Student "${name}" added successfully.`);
    } catch (err) {
      showFeedback('error', err.message || 'Failed to add student.');
    }
  };

  const handleCreateFriendship = async (e) => {
    e.preventDefault();
    if (!connectUser1 || !connectUser2) {
      showFeedback('error', 'Please choose two different people to connect.');
      return;
    }
    if (connectUser1 === connectUser2) {
      showFeedback('error', 'Cannot connect a person to themselves.');
      return;
    }

    try {
      await onAddFriendship(connectUser1, connectUser2);
      const u1 = users.find((u) => u.id === connectUser1);
      const u2 = users.find((u) => u.id === connectUser2);
      setConnectUser1('');
      setConnectUser2('');
      showFeedback(
        'success',
        `Friendship created successfully between ${u1?.name || 'Student 1'} and ${u2?.name || 'Student 2'}.`
      );
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already exists')) {
        showFeedback('error', 'These people are already connected.');
      } else {
        showFeedback('error', err.message || 'Failed to connect students.');
      }
    }
  };

  const handleRemoveFriendship = async (e) => {
    e.preventDefault();
    if (!removeFriendshipKey) return;
    const [u1, u2] = removeFriendshipKey.split('_');
    try {
      await onDeleteFriendship(u1, u2);
      setRemoveFriendshipKey('');
      showFeedback('success', 'Friendship removed successfully.');
    } catch (err) {
      showFeedback('error', err.message || 'Failed to remove friendship.');
    }
  };

  // Get direct friends of selected user
  const directFriendsList = users.filter((u) => directFriendIds.has(u.id));

  return (
    <div className="flex-1 flex overflow-hidden relative bg-slate-50">
      {/* Central 2D Graph Canvas */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Floating Feedback Alert */}
        {feedback && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <GraphCanvas2D
          users={users}
          friendships={friendships}
          selectedUser={selectedUser}
          directFriendIds={directFriendIds}
          onSelectUser={onSelectUser}
          onResetSelection={() => onSelectUser(null)}
          isolateSelected={isolateMode}
          onDeleteFriendship={onDeleteFriendship}
        />
      </div>

      {/* Right Sidebar: Student Details & Simple Network Controls */}
      <aside className="w-80 lg:w-92 bg-white border-l border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 z-20 shadow-xs">
        <div className="p-4 space-y-4">
          {/* 1. Selected Person Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            {selectedUser ? (
              <div className="space-y-3.5">
                {/* Header with Show All Connections button */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Selected Vertex
                  </div>
                  <button
                    onClick={() => onSelectUser(null)}
                    title="Restore full graph view with all students"
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3 text-indigo-600" />
                    <span>Show All Connections</span>
                  </button>
                </div>

                {/* Person Profile Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                      {selectedUser.avatar || '🧑‍🎓'}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{selectedUser.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">{selectedUser.handle}</p>
                      <p className="text-xs text-indigo-700 font-medium">{selectedUser.role || 'Computer Science'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                    deg {directFriendsList.length}
                  </span>
                </div>

                {/* Bio / Description */}
                {selectedUser.bio && (
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed font-sans">
                    {selectedUser.bio}
                  </p>
                )}

                {/* Direct Friends List — Clickable to jump to friend */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Direct Connections ({directFriendsList.length}):
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">Click to inspect</span>
                  </div>

                  {directFriendsList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {directFriendsList.map((friend) => (
                        <button
                          key={friend.id}
                          onClick={() => onSelectUser(friend)}
                          title={`View connections for ${friend.name}`}
                          className="px-2.5 py-1.5 rounded-lg text-xs bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 hover:border-emerald-500 font-semibold transition-all flex items-center gap-1.5 shadow-2xs group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{friend.name}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-700 transition-colors" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No connections for this student yet.</p>
                  )}
                </div>

                {/* Isolation Mode Toggle Helper */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Hide unrelated people:</span>
                  <button
                    onClick={() => setIsolateMode((prev) => !prev)}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      isolateMode
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isolateMode ? 'ON (Only Friends Shown)' : 'OFF (All Visible)'}
                  </button>
                </div>

                {/* Remove Student Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove ${selectedUser.name} from the social network?`)) {
                      onDeleteUser(selectedUser.id);
                    }
                  }}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove {selectedUser.name}</span>
                </button>
              </div>
            ) : (
              <div className="py-2 text-center space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Click Any Vertex on Graph</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Click any student to clearly isolate their direct friendships and hide all unrelated connections.
                  </p>
                </div>

                {/* Quick Selection Chips from Sidebar */}
                <div className="pt-2 text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                    Quick Select Student:
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => onSelectUser(u)}
                        className="px-2 py-1 rounded bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 text-[11px] font-medium transition-colors"
                      >
                        {u.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Connect Two People (Friendship Edge) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Link2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Connect Two Friends</span>
            </div>
            <form onSubmit={handleCreateFriendship} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={connectUser1}
                  onChange={(e) => setConnectUser1(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Student 1...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <select
                  value={connectUser2}
                  onChange={(e) => setConnectUser2(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Student 2...</option>
                  {users
                    .filter((u) => u.id !== connectUser1)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!connectUser1 || !connectUser2}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors disabled:opacity-40"
              >
                + Create Friendship Edge
              </button>
            </form>
          </div>

          {/* 3. Add New Person */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add a Student (Vertex)</span>
            </div>
            <form onSubmit={handleCreatePerson} className="flex gap-2">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Student name (e.g. Rahul)..."
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!newPersonName.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-40 shrink-0"
              >
                Add
              </button>
            </form>
          </div>

          {/* 4. Remove a Connection */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Unlink className="w-3.5 h-3.5 text-rose-600" />
              <span>Remove Friendship Edge</span>
            </div>
            <form onSubmit={handleRemoveFriendship} className="space-y-2">
              <select
                value={removeFriendshipKey}
                onChange={(e) => setRemoveFriendshipKey(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="">Select friendship to remove...</option>
                {friendships.map((f) => {
                  const u1 = users.find((u) => u.id === f.user1_id);
                  const u2 = users.find((u) => u.id === f.user2_id);
                  if (!u1 || !u2) return null;
                  return (
                    <option key={f.id} value={`${f.user1_id}_${f.user2_id}`}>
                      {u1.name} ↔ {u2.name}
                    </option>
                  );
                })}
              </select>

              <button
                type="submit"
                disabled={!removeFriendshipKey}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-40"
              >
                Remove Connection
              </button>
            </form>
          </div>
        </div>

        {/* Small Educational Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
          💡 <span className="font-semibold text-slate-700">Classroom Viva Tip:</span> Clicking a vertex isolates their direct degree neighborhood $N(v)$. Clicking any neighbor explores their own neighborhood.
        </div>
      </aside>
    </div>
  );
}
