from collections import deque
from typing import Dict, Any, List
import networkx as nx

def run_bfs(G: nx.Graph, source_id: str) -> Dict[str, Any]:
    if source_id not in G:
        raise ValueError(f"User '{source_id}' does not exist in graph.")

    visited = set()
    queue = deque([source_id])
    visited.add(source_id)

    traversal_order = []
    distances = {source_id: 0}
    steps = []
    step_num = 1
    edges_examined = 0

    root_name = G.nodes[source_id].get("name", source_id)

    # Initial step: Push source onto queue
    steps.append({
        "step": step_num,
        "current_node": source_id,
        "visited": list(visited),
        "queue": list(queue),
        "action": "START",
        "edge_traversed": None,
        "level": 0,
        "description": f"Initialized BFS Queue with starting student '{root_name}' at Level 0 (0 hops)."
    })

    while queue:
        current = queue.popleft()
        traversal_order.append(current)
        current_name = G.nodes[current].get("name", current)
        current_dist = distances[current]

        step_num += 1
        steps.append({
            "step": step_num,
            "current_node": current,
            "visited": list(visited),
            "queue": list(queue),
            "action": "DEQUEUE",
            "edge_traversed": None,
            "level": current_dist,
            "description": f"Dequeued '{current_name}' (Level {current_dist}) from the front of the FIFO queue."
        })

        # Inspect all adjacent neighbors in deterministic alphabetical order
        neighbors = sorted(list(G.neighbors(current)), key=lambda n: (G.nodes[n].get("name", n), n))
        for neighbor in neighbors:
            edges_examined += 1
            neighbor_name = G.nodes[neighbor].get("name", neighbor)
            if neighbor not in visited:
                visited.add(neighbor)
                distances[neighbor] = current_dist + 1
                queue.append(neighbor)

                step_num += 1
                steps.append({
                    "step": step_num,
                    "current_node": neighbor,
                    "visited": list(visited),
                    "queue": list(queue),
                    "action": "ENQUEUE",
                    "edge_traversed": [current, neighbor],
                    "level": current_dist + 1,
                    "description": f"Discovered unvisited friend '{neighbor_name}' via friendship ({current_name} — {neighbor_name}). Enqueued at Level {current_dist + 1}."
                })

    return {
        "source_id": source_id,
        "traversal_order": traversal_order,
        "distances": distances,
        "steps": steps,
        "total_nodes_visited": len(traversal_order),
        "edges_examined": edges_examined,
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)",
        "v_count": G.number_of_nodes(),
        "e_count": G.number_of_edges()
    }
