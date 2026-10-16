import pytest
import networkx as nx
from algorithms.bfs import run_bfs
from algorithms.dfs import run_dfs
from algorithms.shortest_path import find_shortest_path
from algorithms.friends import calculate_mutual_friends, generate_friend_suggestions
from algorithms.analytics import calculate_network_analytics

@pytest.fixture
def sample_graph():
    """
    Predictable test graph:
    0 -- 1 -- 2 -- 3
    |    |
    4 -- 5
    
    Disconnected component:
    6 -- 7
    """
    G = nx.Graph()
    for i in range(8):
        G.add_node(f"u{i}", name=f"User_{i}")
    
    # Component 1
    G.add_edge("u0", "u1")
    G.add_edge("u1", "u2")
    G.add_edge("u2", "u3")
    G.add_edge("u0", "u4")
    G.add_edge("u1", "u5")
    G.add_edge("u4", "u5")
    
    # Component 2 (Isolated)
    G.add_edge("u6", "u7")
    return G

def test_bfs_traversal(sample_graph):
    res = run_bfs(sample_graph, "u0")
    assert res["source_id"] == "u0"
    assert res["traversal_order"][0] == "u0"
    # Neighbors of u0 are u1 and u4, so they must come next in order
    assert set(res["traversal_order"][1:3]) == {"u1", "u4"}
    assert res["distances"]["u0"] == 0
    assert res["distances"]["u1"] == 1
    assert res["distances"]["u4"] == 1
    assert res["distances"]["u2"] == 2
    assert res["distances"]["u5"] == 2
    assert res["distances"]["u3"] == 3
    # Component 2 nodes should not be visited from u0
    assert "u6" not in res["traversal_order"]
    assert "u7" not in res["traversal_order"]
    assert res["total_nodes_visited"] == 6

def test_dfs_traversal(sample_graph):
    res = run_dfs(sample_graph, "u0")
    assert res["source_id"] == "u0"
    assert res["traversal_order"][0] == "u0"
    # Verify all 6 nodes in component 1 are visited
    assert set(res["traversal_order"]) == {"u0", "u1", "u2", "u3", "u4", "u5"}
    assert "u6" not in res["traversal_order"]
    # Check that steps include VISIT, ADVANCE, BACKTRACK, FINISHED
    actions = {step["action"] for step in res["steps"]}
    assert "VISIT" in actions
    assert "BACKTRACK" in actions
    assert "FINISHED" in actions

def test_shortest_path_connected(sample_graph):
    # Shortest path from u0 to u3: u0 -> u1 -> u2 -> u3 (3 hops)
    res = find_shortest_path(sample_graph, "u0", "u3")
    assert res["path_found"] is True
    assert res["path"] == ["u0", "u1", "u2", "u3"]
    assert res["edges_count"] == 3

def test_shortest_path_no_path_disconnected(sample_graph):
    # Shortest path between disconnected components: u0 and u7
    res = find_shortest_path(sample_graph, "u0", "u7")
    assert res["path_found"] is False
    assert res["path"] == []
    assert res["edges_count"] == 0
    assert "isolated disconnected" in res["message"]

def test_mutual_friends(sample_graph):
    # u0 neighbors: {u1, u4}
    # u5 neighbors: {u1, u4}
    # Common friends between u0 and u5 should be {u1, u4}
    mutual = calculate_mutual_friends(sample_graph, "u0", "u5")
    assert set(mutual) == {"u1", "u4"}

    # u0 and u3: u0 has {u1, u4}, u3 has {u2}. Intersection is empty
    mutual_empty = calculate_mutual_friends(sample_graph, "u0", "u3")
    assert mutual_empty == []

def test_friend_suggestions_never_suggests_existing_friends_or_self(sample_graph):
    suggestions = generate_friend_suggestions(sample_graph, "u0")
    suggested_ids = [s["id"] for s in suggestions]
    
    # Must NOT include u0 itself
    assert "u0" not in suggested_ids
    # Must NOT include existing direct friends (u1, u4)
    assert "u1" not in suggested_ids
    assert "u4" not in suggested_ids
    # u5 has 2 mutual friends with u0, so u5 should be the top suggestion!
    assert "u5" in suggested_ids
    assert suggestions[0]["id"] == "u5"
    assert suggestions[0]["mutual_count"] == 2

def test_network_analytics(sample_graph):
    analytics = calculate_network_analytics(sample_graph)
    assert analytics["total_users"] == 8
    assert analytics["total_friendships"] == 7
    assert analytics["is_connected"] is False
    assert analytics["connected_components_count"] == 2
    assert len(analytics["connected_components"][0]) == 6
    assert len(analytics["connected_components"][1]) == 2
