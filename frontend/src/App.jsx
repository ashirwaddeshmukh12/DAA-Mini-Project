import React, { useState, useEffect, useMemo } from 'react';
import { api } from './api';
import TopNavbar from './components/TopNavbar';
import HomeGraphView from './components/HomeGraphView';
import BFSSimulatorView from './components/BFSSimulatorView';
import DFSSimulatorView from './components/DFSSimulatorView';
import ShortestPathView from './components/ShortestPathView';
import LearnAlgorithmsView from './components/LearnAlgorithmsView';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [friendships, setFriendships] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Active Main Section Tab: 'home' | 'bfs' | 'dfs' | 'shortest-path' | 'learn'
  const [activeTab, setActiveTab] = useState('home');

  // Load Initial Graph Data
  const fetchGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, friendshipsData] = await Promise.all([
        api.getUsers(),
        api.getFriendships(),
      ]);
      setUsers(usersData);
      setFriendships(friendshipsData);
    } catch (err) {
      console.error('Error fetching graph data:', err);
      setError(
        'Unable to connect to SocialSphere FastAPI backend. Ensure backend is running at http://127.0.0.1:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  // Sync selected user when users array updates
  useEffect(() => {
    if (selectedUser) {
      const updated = users.find((u) => u.id === selectedUser.id);
      if (updated) {
        setSelectedUser(updated);
      }
    }
  }, [users]);

  // Compute direct friends of selected user
  const directFriendIds = useMemo(() => {
    const set = new Set();
    if (selectedUser) {
      friendships.forEach((f) => {
        if (f.user1_id === selectedUser.id) set.add(f.user2_id);
        if (f.user2_id === selectedUser.id) set.add(f.user1_id);
      });
    }
    return set;
  }, [selectedUser, friendships]);

  // CRUD Operations
  const handleAddUser = async (userData) => {
    const newUser = await api.createUser(userData);
    await fetchGraphData();
    setSelectedUser(newUser);
    return newUser;
  };

  const handleDeleteUser = async (userId) => {
    await api.deleteUser(userId);
    if (selectedUser?.id === userId) setSelectedUser(null);
    await fetchGraphData();
  };

  const handleAddFriendship = async (u1, u2) => {
    const res = await api.createFriendship(u1, u2);
    await fetchGraphData();
    return res;
  };

  const handleDeleteFriendship = async (u1, u2) => {
    await api.deleteFriendship(u1, u2);
    await fetchGraphData();
  };

  const handleResetDemo = async () => {
    if (
      !window.confirm(
        'Reset network to the standard 11-student teaching graph (Aditi, Rohan, Sneha, etc.)?'
      )
    ) {
      return;
    }
    try {
      setIsResetting(true);
      await api.resetSampleData();
      await fetchGraphData();
      setSelectedUser(null);
    } catch (err) {
      alert(err.message || 'Failed to reset sample graph.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
      {/* Top Navbar with 5 Clean Tabs */}
      <TopNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedUser(null);
        }}
        totalUsers={users.length}
        totalFriendships={friendships.length}
        onResetDemo={handleResetDemo}
        isResetting={isResetting}
        isConnected={!error}
      />

      {/* Backend Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-5 py-2.5 text-xs text-red-800 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchGraphData}
            className="px-2.5 py-1 rounded bg-red-600 text-white font-medium flex items-center gap-1 hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry Connection
          </button>
        </div>
      )}

      {/* Main Content Area: 5 Dedicated Sections */}
      <main className="flex-1 flex overflow-hidden relative">
        {loading && users.length === 0 ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-medium">Loading SocialSphere network...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeGraphView
                users={users}
                friendships={friendships}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
                onAddFriendship={handleAddFriendship}
                onDeleteFriendship={handleDeleteFriendship}
                directFriendIds={directFriendIds}
              />
            )}

            {activeTab === 'bfs' && (
              <BFSSimulatorView
                users={users}
                friendships={friendships}
              />
            )}

            {activeTab === 'dfs' && (
              <DFSSimulatorView
                users={users}
                friendships={friendships}
              />
            )}

            {activeTab === 'shortest-path' && (
              <ShortestPathView
                users={users}
                friendships={friendships}
              />
            )}

            {activeTab === 'learn' && (
              <LearnAlgorithmsView
                totalUsers={users.length}
                totalFriendships={friendships.length}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
