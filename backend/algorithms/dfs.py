from typing import Dict, Any, List
import networkx as nx

def run_dfs(G: nx.Graph, source_id: str) -> Dict[str, Any]:
    if source_id not in G:
        raise ValueError(f"User '{source_id}' does not exist in graph.")

    visited = set()
    traversal_order = []
    steps = []
    call_stack = []
    step_num = 0
    edges_examined = 0

    def dfs_visit(u: str, parent: str = None, depth: int = 0):
        nonlocal step_num, edges_examined
        visited.add(u)
        traversal_order.append(u)
        call_stack.append(u)
        u_name = G.nodes[u].get("name", u)

        step_num += 1
        steps.append({
            "step": step_num,
            "current_node": u,
            "visited": list(visited),
            "stack": list(call_stack),
            "action": "VISIT",
            "edge_traversed": [parent, u] if parent else None,
            "depth": depth,
            "description": f"Visited '{u_name}' at depth {depth}. Pushed onto call stack."
        })

        # Deterministic alphabetical neighbor ordering for reproducible viva demonstration
        neighbors = sorted(list(G.neighbors(u)), key=lambda n: (G.nodes[n].get("name", n), n))
        for v in neighbors:
            edges_examined += 1
            v_name = G.nodes[v].get("name", v)
            if v not in visited:
                step_num += 1
                steps.append({
                    "step": step_num,
                    "current_node": u,
                    "visited": list(visited),
                    "stack": list(call_stack),
                    "action": "ADVANCE",
                    "edge_traversed": [u, v],
                    "depth": depth,
                    "description": f"Exploring unvisited branch from '{u_name}' to '{v_name}'."
                })
                dfs_visit(v, u, depth + 1)
                
                # Backtracking event
                step_num += 1
                steps.append({
                    "step": step_num,
                    "current_node": u,
                    "visited": list(visited),
                    "stack": list(call_stack),
                    "action": "BACKTRACK",
                    "edge_traversed": [v, u],
                    "depth": depth,
                    "description": f"Backtracked from '{v_name}' back to '{u_name}'. Continuing remaining adjacent edges."
                })

        call_stack.pop()
        step_num += 1
        steps.append({
            "step": step_num,
            "current_node": u,
            "visited": list(visited),
            "stack": list(call_stack),
            "action": "FINISHED",
            "edge_traversed": None,
            "depth": depth,
            "description": f"All friends of '{u_name}' explored. Popped from call stack."
        })

    dfs_visit(source_id, parent=None, depth=0)

    return {
        "source_id": source_id,
        "traversal_order": traversal_order,
        "steps": steps,
        "total_nodes_visited": len(traversal_order),
        "edges_examined": edges_examined,
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)",
        "v_count": G.number_of_nodes(),
        "e_count": G.number_of_edges()
    }
