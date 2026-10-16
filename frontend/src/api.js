const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function fetchJSON(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = 'API Request failed';
    try {
      const err = await response.json();
      errorDetail = err.detail || JSON.stringify(err);
    } catch {
      errorDetail = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  getUsers: () => fetchJSON('/api/users'),
  getUser: (id) => fetchJSON(`/api/users/${id}`),
  createUser: (userData) => fetchJSON('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  deleteUser: (id) => fetchJSON(`/api/users/${id}`, {
    method: 'DELETE',
  }),

  getFriendships: () => fetchJSON('/api/friendships'),
  createFriendship: (user1_id, user2_id) => fetchJSON('/api/friendships', {
    method: 'POST',
    body: JSON.stringify({ user1_id, user2_id }),
  }),
  deleteFriendship: (user1_id, user2_id) => fetchJSON('/api/friendships', {
    method: 'DELETE',
    body: JSON.stringify({ user1_id, user2_id }),
  }),

  runBFS: (source_id) => fetchJSON('/api/algorithms/bfs', {
    method: 'POST',
    body: JSON.stringify({ source_id }),
  }),

  runDFS: (source_id) => fetchJSON('/api/algorithms/dfs', {
    method: 'POST',
    body: JSON.stringify({ source_id }),
  }),

  findShortestPath: (source_id, target_id) => fetchJSON('/api/algorithms/shortest-path', {
    method: 'POST',
    body: JSON.stringify({ source_id, target_id }),
  }),

  getMutualFriends: (user1_id, user2_id) => fetchJSON('/api/algorithms/mutual-friends', {
    method: 'POST',
    body: JSON.stringify({ user1_id, user2_id }),
  }),

  getAnalytics: () => fetchJSON('/api/analytics'),

  runBenchmark: (node_counts, algorithm) => fetchJSON('/api/algorithms/benchmark', {
    method: 'POST',
    body: JSON.stringify({ node_counts, algorithm }),
  }),

  resetSampleData: () => fetchJSON('/api/reset-sample-data', {
    method: 'POST',
  }),
};
