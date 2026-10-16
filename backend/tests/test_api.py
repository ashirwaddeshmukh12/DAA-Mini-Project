import os
import tempfile
import pytest
from fastapi.testclient import TestClient

# Create a temporary sqlite database file for test isolation
temp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
temp_db.close()
os.environ["SQLITE_DB_PATH"] = temp_db.name

import database
database.DB_PATH = temp_db.name

from database import init_db
from main import app

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()
    yield
    if os.path.exists(temp_db.name):
        try:
            os.remove(temp_db.name)
        except OSError:
            pass

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["project"] == "SocialSphere 3D"

def test_get_users():
    response = client.get("/api/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 11

def test_prevent_self_friendship():
    response = client.post("/api/friendships", json={
        "user1_id": "u01",
        "user2_id": "u01"
    })
    assert response.status_code == 400
    assert "Self-friendships are strictly invalid" in response.json()["detail"]

def test_prevent_duplicate_friendship():
    # u01 (Aditi) and u02 (Rohan) are friends in the seed data
    response = client.post("/api/friendships", json={
        "user1_id": "u01",
        "user2_id": "u02"
    })
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

    # Also check inverted order
    response2 = client.post("/api/friendships", json={
        "user1_id": "u02",
        "user2_id": "u01"
    })
    assert response2.status_code == 400
    assert "already exists" in response2.json()["detail"]

def test_create_and_delete_user_cascade():
    # Create user
    new_user = {
        "id": "u_test_99",
        "name": "Test Node",
        "handle": "@testnode99",
        "role": "QA Tester",
        "avatar": "🧪",
        "bio": "Automated verification agent",
        "community": "Main Network"
    }
    create_res = client.post("/api/users", json=new_user)
    assert create_res.status_code == 201

    # Connect to u01
    friendship_res = client.post("/api/friendships", json={
        "user1_id": "u01",
        "user2_id": "u_test_99"
    })
    assert friendship_res.status_code == 201

    # Verify friendship is visible in friends list
    friends_res = client.get("/api/users/u_test_99/friends")
    assert any(f["id"] == "u01" for f in friends_res.json())

    # Delete user
    del_res = client.delete("/api/users/u_test_99")
    assert del_res.status_code == 200

    # Verify user is gone
    get_res = client.get("/api/users/u_test_99")
    assert get_res.status_code == 404

    # Verify friendship is cascaded/removed from u01's list
    u01_friends = client.get("/api/users/u01/friends").json()
    assert not any(f["id"] == "u_test_99" for f in u01_friends)

def test_algorithm_endpoints():
    # BFS from Aditi (u01)
    bfs_res = client.post("/api/algorithms/bfs", json={"source_id": "u01"})
    assert bfs_res.status_code == 200
    data = bfs_res.json()
    assert data["source_id"] == "u01"
    assert len(data["traversal_order"]) == 8  # Main component has 8 reachable nodes
    assert "O(V + E)" in data["time_complexity"]
    assert "u09" not in data["traversal_order"]  # Disconnected Vikram should not be reached

    # DFS from Aditi (u01)
    dfs_res = client.post("/api/algorithms/dfs", json={"source_id": "u01"})
    assert dfs_res.status_code == 200
    dfs_data = dfs_res.json()
    assert dfs_data["source_id"] == "u01"
    assert len(dfs_data["traversal_order"]) == 8

    # Shortest Path (Connected: Aditi to Neha)
    sp_res = client.post("/api/algorithms/shortest-path", json={"source_id": "u01", "target_id": "u08"})
    assert sp_res.status_code == 200
    sp_data = sp_res.json()
    assert sp_data["path_found"] is True
    assert sp_data["edges_count"] > 0
    assert sp_data["path"][0] == "u01"
    assert sp_data["path"][-1] == "u08"
    assert "Neha" in sp_data["path_string"]

    # Shortest Path (Disconnected: Aditi to Vikram)
    sp_disc = client.post("/api/algorithms/shortest-path", json={"source_id": "u01", "target_id": "u09"})
    assert sp_disc.status_code == 200
    sp_disc_data = sp_disc.json()
    assert sp_disc_data["path_found"] is False
    assert sp_disc_data["edges_count"] == 0

    # Mutual Friends (Rohan u02 and Priya u03 both connect to Aditi and Karan)
    mf_res = client.post("/api/algorithms/mutual-friends", json={"user1_id": "u02", "user2_id": "u03"})
    assert mf_res.status_code == 200
    mf_data = mf_res.json()
    assert isinstance(mf_data["mutual_friends"], list)
    mutual_names = {u["name"] for u in mf_data["mutual_friends"]}
    assert "Aditi" in mutual_names
    assert "Karan" in mutual_names

    # Benchmark
    bm_res = client.post("/api/algorithms/benchmark", json={"node_counts": [10, 20], "algorithm": "bfs"})
    assert bm_res.status_code == 200
    bm_data = bm_res.json()
    assert len(bm_data["results"]) == 2
    assert len(bm_data["comparison"]) == 2
