import React, { useState } from 'react';
import { X, Link2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function AddFriendshipModal({
  isOpen = false,
  allUsers = [],
  defaultUser1Id = '',
  defaultUser2Id = '',
  onClose = () => {},
  onFriendshipAdded = () => {},
}) {
  const [user1Id, setUser1Id] = useState(defaultUser1Id);
  const [user2Id, setUser2Id] = useState(defaultUser2Id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user1Id || !user2Id) {
      setError('Please select both users.');
      return;
    }
    if (user1Id === user2Id) {
      setError('Cannot connect a user to themselves (no self-loops in undirected simple graph).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const newEdge = await api.createFriendship(user1Id, user2Id);
      onFriendshipAdded(newEdge);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to establish friendship connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#0a1024] border border-cyber-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-cyber-border/70 flex items-center justify-between bg-[#070b1a]">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Create Friendship Connection (Edge)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Select First User Node
            </label>
            <select
              value={user1Id}
              onChange={(e) => setUser1Id(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-purple-400"
            >
              <option value="">Choose user 1...</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.avatar || '👤'} {u.name} ({u.handle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Select Second User Node
            </label>
            <select
              value={user2Id}
              onChange={(e) => setUser2Id(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-purple-400"
            >
              <option value="">Choose user 2...</option>
              {allUsers
                .filter((u) => u.id !== user1Id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.avatar || '👤'} {u.name} ({u.handle})
                  </option>
                ))}
            </select>
          </div>

          <div className="p-3 bg-[#060a18] rounded-xl border border-cyber-border/40 text-[11px] text-slate-400">
            Friendships in SocialSphere 3D are bidirectional undirected edges $(u_1, u_2) \equiv (u_2, u_1)$.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !user1Id || !user2Id}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/60 transition-all border border-purple-400/40 disabled:opacity-40"
            >
              {loading ? 'Creating Edge...' : 'Establish Friendship Edge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
