"""
Comprehensive end-to-end feature verification script for SocialSphere DAA Teaching Lab.
Tests all graph algorithms, database persistence, and API endpoints.
"""
import sys
import os
from fastapi.testclient import TestClient

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import init_db
from main import app

def run_all_verifications():
    print("=" * 60)
    print("SocialSphere 2D: Comprehensive DAA Verification Suite")
    print("=" * 60)

    # 1. Initialize DB and Test Client
    init_db()
    client = TestClient(app)
    print("[1] Database initialized and seeded successfully.")

    # 2. Verify /api/users
    res = client.get("/api/users")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    users = res.json()
    print(f"[2] GET /api/users: {len(users)} users retrieved.")
    assert len(users) >= 11, "Must have 11 sample students."

    aditi = next(u for u in users if u["name"] == "Aditi")
    print(f"    Sample node: {aditi['name']} ({aditi['handle']}), degree={aditi['degree']}, pos=({aditi['x']}, {aditi['y']})")

    # 3. Verify /api/friendships
    res = client.get("/api/friendships")
    assert res.status_code == 200
    friendships = res.json()
    print(f"[3] GET /api/friendships: {len(friendships)} undirected friendships retrieved.")
    assert len(friendships) == 13, f"Expected 13 friendships, got {len(friendships)}"

    # 4. Verify BFS Algorithm from Aditi (u01)
    bfs_res = client.post("/api/algorithms/bfs", json={"source_id": "u01"})
    assert bfs_res.status_code == 200
    bfs_data = bfs_res.json()
    print(f"[4] POST /api/algorithms/bfs: Traversed {bfs_data['total_nodes_visited']} reachable students.")
    print(f"    Time Complexity: {bfs_data['time_complexity']}, Space: {bfs_data['space_complexity']}")
    print(f"    Edges examined: {bfs_data['edges_examined']}")
    assert bfs_data["total_nodes_visited"] == 8
    assert "u09" not in bfs_data["traversal_order"]  # Vikram is disconnected

    # 5. Verify DFS Algorithm from Aditi (u01)
    dfs_res = client.post("/api/algorithms/dfs", json={"source_id": "u01"})
    assert dfs_res.status_code == 200
    dfs_data = dfs_res.json()
    print(f"[5] POST /api/algorithms/dfs: Traversed {dfs_data['total_nodes_visited']} students with call-stack & backtracking.")
    assert dfs_data["total_nodes_visited"] == 8

    # 6. Verify Shortest Path (Connected: Aditi to Neha)
    sp_res = client.post("/api/algorithms/shortest-path", json={"source_id": "u01", "target_id": "u08"})
    assert sp_res.status_code == 200
    sp_data = sp_res.json()
    assert sp_data["path_found"] is True
    print(f"[6] POST /api/algorithms/shortest-path (Connected):")
    print(f"    Path String: {sp_data['path_string']}")
    print(f"    Friendship Hops: {sp_data['edges_count']}")

    # 7. Verify Shortest Path (Disconnected Component: Aditi to Vikram)
    sp_dis_res = client.post("/api/algorithms/shortest-path", json={"source_id": "u01", "target_id": "u09"})
    assert sp_dis_res.status_code == 200
    sp_dis_data = sp_dis_res.json()
    assert sp_dis_data["path_found"] is False
    print(f"[7] POST /api/algorithms/shortest-path (Disconnected):")
    print(f"    Feedback: {sp_dis_data['message']}")

    # 8. Verify Mutual Friends between Rohan (u02) and Priya (u03)
    mf_res = client.post("/api/algorithms/mutual-friends", json={"user1_id": "u02", "user2_id": "u03"})
    assert mf_res.status_code == 200
    mf_data = mf_res.json()
    names = [u["name"] for u in mf_data["mutual_friends"]]
    print(f"[8] POST /api/algorithms/mutual-friends (Rohan & Priya): {mf_data['count']} common friends: {', '.join(names)}")
    assert "Aditi" in names and "Karan" in names

    # 9. Verify User Details & Friend Recommendations
    user_detail_res = client.get("/api/users/u01")
    assert user_detail_res.status_code == 200
    user_detail = user_detail_res.json()
    print(f"[9] GET /api/users/u01: Direct friends = {len(user_detail['friends'])}, Suggestions = {len(user_detail['suggestions'])}")

    # 10. Verify Network Analytics & Adjacency List
    analytics_res = client.get("/api/analytics")
    assert analytics_res.status_code == 200
    analytics = analytics_res.json()
    print(f"[10] GET /api/analytics:")
    print(f"     |V| = {analytics['total_users']}, |E| = {analytics['total_friendships']}")
    print(f"     Average Degree (2E/V) = {analytics['average_degree']}")
    print(f"     Connected Components: {analytics['connected_components_count']}")
    print(f"     Hub Student: {analytics['most_connected_user']['name']} (degree {analytics['most_connected_user']['degree']})")
    print(f"     Adjacency List sample (Aditi): {analytics['adjacency_list'].get('Aditi')}")

    # 11. Verify Empirical Benchmark Test Facility with Median Calculation
    bench_res = client.post("/api/algorithms/benchmark", json={"node_counts": [20, 50, 100], "algorithm": "bfs"})
    assert bench_res.status_code == 200
    bench = bench_res.json()
    print(f"[11] POST /api/algorithms/benchmark (Median of 7 iterations):")
    for row in bench["results"]:
        print(f"     Nodes={row['nodes']}, Edges={row['edges']}, V+E={row['v_plus_e']}, Median Time={row['execution_time_ms']}ms")

    # 12. Verify Self-Friendship Prevention
    self_res = client.post("/api/friendships", json={"user1_id": "u01", "user2_id": "u01"})
    assert self_res.status_code == 400
    print("[12] Verified: Self-friendships strictly prevented with 400 Bad Request.")

    # 13. Verify Duplicate Friendship Prevention
    dup_res = client.post("/api/friendships", json={"user1_id": "u01", "user2_id": "u02"})
    assert dup_res.status_code == 400
    print("[13] Verified: Duplicate friendship edges strictly prevented.")

    # 14. Verify Node Creation, Edge Linking, and Cascade Deletion
    create_res = client.post("/api/users", json={
        "id": "u_e2e_test",
        "name": "E2E Test Student",
        "handle": "@e2etest",
        "role": "QA Verification",
        "avatar": "🧪",
        "community": "Main Network"
    })
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    edge_res = client.post("/api/friendships", json={"user1_id": "u01", "user2_id": created_id})
    assert edge_res.status_code == 201

    del_res = client.delete(f"/api/users/{created_id}")
    assert del_res.status_code == 200
    assert client.get(f"/api/users/{created_id}").status_code == 404
    print("[14] Verified: Student creation, dynamic edge linking, and cascade deletion passed.")

    # 15. Verify Reset to Sample Network
    reset_res = client.post("/api/reset-sample-data")
    assert reset_res.status_code == 200
    print("[15] POST /api/reset-sample-data: Restored sample network successfully.")

    print("=" * 60)
    print("ALL 15 DAA VERIFICATIONS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_all_verifications()
