import React, { useState } from 'react';
import {
  UserPlus,
  Link2,
  Unlink,
  Play,
  RotateCcw,
  Sparkles,
  GitFork,
  Layers,
  Binary,
  Cpu,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function SidebarControls({
  mode = 'explore',
  users = [],
  friendships = [],
  selectedUser = null,
  activeAlgorithm = 'bfs',
  onSelectAlgorithm = () => {},
  sourceUserId = '',
  onChangeSourceUserId = () => {},
  targetUserId = '',
  onChangeTargetUserId = () => {},
  onStartAlgorithm = () => {},
  onAddUser = () => {},
  onAddFriendship = () => {},
  onDeleteFriendship = () => {},
  onSelectUser = () => {},
  connectMode = false,
  onToggleConnectMode = () => {},
}) {
  // Local form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Computer Science');
  const [newUserAvatar, setNewUserAvatar] = useState('🧑‍🎓');

  const [connectUser1, setConnectUser1] = useState('');
  const [connectUser2, setConnectUser2] = useState('');
  const [connectError, setConnectError] = useState('');

  const [removeFriendshipId, setRemoveFriendshipId] = useState('');

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const cleanHandle = `@${newUserName.trim().toLowerCase().replace(/\s+/g, '')}`;
    onAddUser({
      name: newUserName.trim(),
      handle: cleanHandle,
      role: newUserRole,
      avatar: newUserAvatar,
      community: 'Main Network',
    });
    setNewUserName('');
  };

  const handleCreateFriendship = (e) => {
    e.preventDefault();
    setConnectError('');
    if (!connectUser1 || !connectUser2) {
      setConnectError('Please select both students.');
      return;
    }
    if (connectUser1 === connectUser2) {
      setConnectError('Cannot connect a person to themselves.');
      return;
    }
    onAddFriendship(connectUser1, connectUser2)
      .then(() => {
        setConnectUser1('');
        setConnectUser2('');
      })
      .catch((err) => {
        setConnectError(err.message || 'Friendship creation failed.');
      });
  };

  const handleRemoveFriendship = (e) => {
    e.preventDefault();
    if (!removeFriendshipId) return;
    const [u1, u2] = removeFriendshipId.split('_');
    onDeleteFriendship(u1, u2);
    setRemoveFriendshipId('');
  };

  return (
    <aside className="w-80 lg:w-88 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 z-20 shadow-xs">
      {/* EXPLORE NETWORK CONTROLS */}
      {mode === 'explore' && (
        <div className="p-4 space-y-5">
          {/* Section: Connect People */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Connect People (Edge)</span>
              </div>
              <button
                type="button"
                onClick={onToggleConnectMode}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                  connectMode
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-indigo-600'
                }`}
              >
                {connectMode ? 'Click Canvas Active' : 'Click on Canvas'}
              </button>
            </div>

            {connectError && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{connectError}</span>
              </div>
            )}

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
                + Add Friendship Edge
              </button>
            </form>
          </div>

          {/* Section: Remove Connection */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Unlink className="w-3.5 h-3.5 text-rose-600" />
              <span>Remove Friendship</span>
            </div>

            <form onSubmit={handleRemoveFriendship} className="space-y-2">
              <select
                value={removeFriendshipId}
                onChange={(e) => setRemoveFriendshipId(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="">Choose connection to remove...</option>
                {friendships.map((f) => {
                  const u1 = users.find((u) => u.id === f.user1_id);
                  const u2 = users.find((u) => u.id === f.user2_id);
                  if (!u1 || !u2) return null;
                  return (
                    <option key={f.id} value={`${f.user1_id}_${f.user2_id}`}>
                      {u1.name} — {u2.name}
                    </option>
                  );
                })}
              </select>

              <button
                type="submit"
                disabled={!removeFriendshipId}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-40"
              >
                Remove Selected Connection
              </button>
            </form>
          </div>

          {/* Section: Add Student (Node) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Person (Node)</span>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Student name..."
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={newUserAvatar}
                  onChange={(e) => setNewUserAvatar(e.target.value)}
                  className="text-base px-1.5 py-1 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="👩‍💻">👩‍💻</option>
                  <option value="👨‍💻">👨‍💻</option>
                  <option value="👩‍🔬">👩‍🔬</option>
                  <option value="🧑‍💻">🧑‍💻</option>
                  <option value="👩‍🎓">👩‍🎓</option>
                  <option value="👨‍🚀">👨‍🚀</option>
                  <option value="🤖">🤖</option>
                </select>
              </div>

              <input
                type="text"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                placeholder="Branch / Major (e.g. Computer Science)"
                className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={!newUserName.trim()}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors disabled:opacity-40"
              >
                + Add Person to Graph
              </button>
            </form>
          </div>

          {/* Guided Sample Exercises for DAA Students */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>DAA Viva / Sample Exercises</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
              <li
                onClick={() => {
                  const karan = users.find((u) => u.name === 'Karan');
                  if (karan) onSelectUser(karan);
                }}
                className="cursor-pointer hover:text-indigo-700 hover:underline flex items-start gap-1"
              >
                <ArrowRight className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Find Hub Student:</strong> Click Karan (highest degree = 4).</span>
              </li>
              <li className="flex items-start gap-1">
                <ArrowRight className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Test Reachability:</strong> Check if Aditi can reach Vikram (unreachable!).</span>
              </li>
              <li className="flex items-start gap-1">
                <ArrowRight className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Handshaking Lemma:</strong> Sum of degrees = 2E = 26.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* LEARN ALGORITHMS CONTROLS */}
      {mode === 'algorithms' && (
        <div className="p-4 space-y-5">
          {/* Algorithm Category Tabs */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Select Algorithm Lesson
            </div>
            <div className="grid grid-cols-1 gap-1">
              {[
                { id: 'bfs', label: 'BFS (Breadth-First Search)', icon: Layers, tag: 'Queue' },
                { id: 'dfs', label: 'DFS (Depth-First Search)', icon: Binary, tag: 'Stack' },
                { id: 'shortest-path', label: 'Shortest Path (Unweighted)', icon: GitFork, tag: 'Min Hops' },
                { id: 'mutual', label: 'Mutual Friends & Suggestions', icon: Sparkles, tag: 'Common' },
                { id: 'complexity', label: 'DAA Complexity & Benchmark', icon: Cpu, tag: 'O(V+E)' },
              ].map((algo) => {
                const Icon = algo.icon;
                const isActive = activeAlgorithm === algo.id;
                return (
                  <button
                    key={algo.id}
                    onClick={() => onSelectAlgorithm(algo.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                      <span>{algo.label}</span>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {algo.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source & Destination Selectors */}
          {activeAlgorithm !== 'complexity' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Parameters
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Starting Student (Source Node):
                </label>
                <select
                  value={sourceUserId}
                  onChange={(e) => onChangeSourceUserId(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.avatar || '👤'} {u.name} ({u.handle}) - deg {u.degree || 0}
                    </option>
                  ))}
                </select>
              </div>

              {activeAlgorithm === 'shortest-path' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Destination Student (Target Node):
                  </label>
                  <select
                    value={targetUserId}
                    onChange={(e) => onChangeTargetUserId(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.avatar || '👤'} {u.name} ({u.handle})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={onStartAlgorithm}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {activeAlgorithm === 'shortest-path' ? 'Find Shortest Path' : 'Load Traversal Steps'}
                </span>
              </button>
            </div>
          )}

          {/* DAA Concept Card */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>DAA Educational Concept</span>
            </div>

            {activeAlgorithm === 'bfs' && (
              <p className="text-slate-700 text-[11px] leading-relaxed">
                <strong>BFS visits nearby nodes first.</strong> It uses a <strong>Queue (FIFO)</strong> and explores the graph level by level. Time Complexity is <strong>O(V + E)</strong> on an adjacency list, and Space is <strong>O(V)</strong> for the queue.
              </p>
            )}

            {activeAlgorithm === 'dfs' && (
              <p className="text-slate-700 text-[11px] leading-relaxed">
                <strong>DFS follows one path as far as possible before backtracking.</strong> It uses a <strong>Stack (LIFO) or recursion</strong>. Time Complexity is <strong>O(V + E)</strong>, and Space is <strong>O(V)</strong> for recursion height.
              </p>
            )}

            {activeAlgorithm === 'shortest-path' && (
              <p className="text-slate-700 text-[11px] leading-relaxed">
                In an unweighted social network, <strong>shortest path means minimum number of friendship edges</strong>, not physical distance. BFS guarantees the optimal hop count in <strong>O(V + E)</strong>.
              </p>
            )}

            {activeAlgorithm === 'mutual' && (
              <p className="text-slate-700 text-[11px] leading-relaxed">
                <strong>Mutual friends</strong> are computed by comparing the neighbor sets N(u) and N(v). Candidates with the highest mutual friend count are ranked top for recommendation.
              </p>
            )}

            {activeAlgorithm === 'complexity' && (
              <p className="text-slate-700 text-[11px] leading-relaxed">
                Both BFS and DFS examine every reachable vertex once and every incident edge twice (for undirected graphs). Thus, runtime is proportional to <strong>V + E</strong>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer DAA Syllabus Tag */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
        <span className="text-[10px] text-slate-500 font-mono">
          DAA College Microproject • Graph Theory Lab
        </span>
      </div>
    </aside>
  );
}
