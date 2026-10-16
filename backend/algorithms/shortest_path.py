from collections import deque
from typing import Dict, Any, List
import networkx as nx

def find_shortest_path(G: nx.Graph, source_id: str, target_id: str) -> Dict[str, Any]:
    if source_id not in G:
        raise ValueError(f"Source student '{source_id}' does not exist in graph.")
    if target_id not in G:
        raise ValueError(f"Target student '{target_id}' does not exist in graph.")

    source_name = G.nodes[source_id].get("name", source_id)
    target_name = G.nodes[target_id].get("name", target_id)

    if source_id == target_id:
        return {
            "source_id": source_id,
            "target_id": target_id,
            "path_found": True,
            "path": [source_id],
            "path_string": source_name,
            "edges_count": 0,
            "traversal_sequence": [source_id],
            "time_complexity": "O(V + E)",
            "message": f"Source and destination are the same student ('{source_name}'). Shortest path is 0 edges (0 hops)."
        }

    # Unweighted shortest path using BFS
    visited = {source_id}
    queue = deque([source_id])
    parent = {source_id: None}
    traversal_sequence = []

    found = False
    while queue:
        current = queue.popleft()
        traversal_sequence.append(current)

        if current == target_id:
            found = True
            break

        # Deterministic neighbor order
        neighbors = sorted(list(G.neighbors(current)), key=lambda n: (G.nodes[n].get("name", n), n))
        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)
                if neighbor == target_id:
                    traversal_sequence.append(neighbor)
                    found = True
                    break
        if found:
            break

    if not found:
        return {
            "source_id": source_id,
            "target_id": target_id,
            "path_found": False,
            "path": [],
            "path_string": "No path exists (unreachable)",
            "edges_count": 0,
            "traversal_sequence": traversal_sequence,
            "time_complexity": "O(V + E)",
            "message": f"No connection path exists between '{source_name}' and '{target_name}'. These students belong to isolated disconnected components."
        }

    # Reconstruct path by backtracking parent pointers
    path = []
    curr = target_id
    while curr is not None:
        path.append(curr)
        curr = parent[curr]
    path.reverse()

    path_names = [G.nodes[nid].get("name", nid) for nid in path]
    path_string = " → ".join(path_names)

    return {
        "source_id": source_id,
        "target_id": target_id,
        "path_found": True,
        "path": path,
        "path_string": path_string,
        "edges_count": len(path) - 1,
        "traversal_sequence": traversal_sequence,
        "time_complexity": "O(V + E)",
        "message": f"Shortest path found: {path_string} ({len(path) - 1} friendship hop{'s' if len(path) - 1 != 1 else ''}, {len(path)} students). Note: In an unweighted graph, shortest path represents the minimum number of friendship edges, not physical distance."
    }
