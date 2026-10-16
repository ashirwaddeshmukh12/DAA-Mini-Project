import React, { useState } from 'react';
import { X, UserPlus, AlertTriangle } from 'lucide-react';
import { api } from '../api';

const COMMUNITIES = [
  "AI Research",
  "Web & Distributed",
  "Cybersecurity",
  "Creative Tech",
  "Satellite Outpost"
];

const AVATAR_OPTIONS = ['👤', '🧠', '🤖', '💻', '🛡️', '🎨', '🚀', '⚡', '🔬', '🎮', '🌙', '💎', '🦇', '🦾'];

export default function AddUserModal({
  isOpen = false,
  onClose = () => {},
  onUserAdded = () => {},
}) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [community, setCommunity] = useState('AI Research');
  const [avatar, setAvatar] = useState('👤');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) {
      setError('Name and handle are required.');
      return;
    }

    const cleanHandle = handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    setError('');
    setLoading(true);

    try {
      const newUser = await api.createUser({
        name: name.trim(),
        handle: cleanHandle,
        role: role.trim() || 'Software Engineer',
        bio: bio.trim(),
        community,
        avatar,
      });
      onUserAdded(newUser);
      onClose();
      // Reset form
      setName('');
      setHandle('');
      setRole('');
      setBio('');
    } catch (err) {
      setError(err.message || 'Failed to create user node');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#0a1024] border border-cyber-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-cyber-border/70 flex items-center justify-between bg-[#070b1a]">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Add New Network Node (User)
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

          {/* Avatar Selector */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">
              Select Avatar Symbol
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`text-lg p-1.5 rounded-lg border transition-all ${
                    avatar === av
                      ? 'bg-cyan-500/20 border-cyan-400 scale-110 shadow-glow-cyan'
                      : 'bg-[#060a18] border-cyber-border hover:bg-slate-800'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linus Torvalds"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Handle *
              </label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@torvalds"
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Community
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {COMMUNITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Role / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Distributed Consensus Architect"
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
              Bio / Research Focus
            </label>
            <textarea
              rows="2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. High-throughput distributed graph partitioning."
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#060a18] border border-cyber-border text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
            />
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
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-950/60 transition-all border border-cyan-400/40 disabled:opacity-40"
            >
              {loading ? 'Adding Node...' : 'Add Node to 3D Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
