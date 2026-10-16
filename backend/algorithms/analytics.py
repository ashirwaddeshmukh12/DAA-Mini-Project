from typing import Dict, Any, List
import networkx as nx

COMMUNITY_COLORS = [
    "#3b82f6", # Blue (Main Network)
    "#a855f7", # Purple (Disconnected / Specialized)
    "#10b981", # Emerald
    "#f59e0b", # Amber
    "#ec4899", # Pink
    "#06b6d4", # Cyan
]

def calculate_network_analytics(G: nx.Graph) -> Dict[str, Any]:
    v_count = G.number_of_nodes()
    e_count = G.number_of_edges()

    if v_count == 0:
        return {
            "total_users": 0,
            "total_friendships": 0,
            "average_degree": 0.0,
            "density": 0.0,
            "is_connected": True,
            "connected_components_count": 0,
            "connected_components": [],
            "most_connected_user": None,
            "communities": [],
            "degree_distribution": {},
            "adjacency_list": {},
            "edge_list": []
        }

    # Degree metrics: sum(deg) = 2E
    degrees = dict(G.degree())
    avg_degree = round((2.0 * e_count) / v_count, 2)
    density = round(nx.density(G), 4)

    # Connected components
    components = [list(c) for c in nx.connected_components(G)]
    components.sort(key=len, reverse=True)
    is_connected = len(components) <= 1

    # Most connected user (highest degree)
    max_node_id = max(degrees, key=degrees.get) if degrees else None
    most_connected_user = None
    if max_node_id:
        node_data = G.nodes[max_node_id]
        most_connected_user = {
            "id": max_node_id,
            "name": node_data.get("name", max_node_id),
            "handle": node_data.get("handle", ""),
            "role": node_data.get("role", ""),
            "avatar": node_data.get("avatar", "👤"),
            "bio": node_data.get("bio", ""),
            "community": node_data.get("community", "General"),
            "x": node_data.get("x", 0.0),
            "y": node_data.get("y", 0.0),
            "z": node_data.get("z", 0.0),
            "degree": degrees[max_node_id]
        }

    # Communities: group by existing community attribute
    community_map: Dict[str, List[str]] = {}
    for node, data in G.nodes(data=True):
        comm_name = data.get("community", "General")
        if comm_name not in community_map:
            community_map[comm_name] = []
        community_map[comm_name].append(node)

    communities_list = []
    for idx, (c_name, members) in enumerate(community_map.items()):
        communities_list.append({
            "name": c_name,
            "user_count": len(members),
            "users": members,
            "color": COMMUNITY_COLORS[idx % len(COMMUNITY_COLORS)]
        })

    # Degree distribution
    dist: Dict[int, int] = {}
    for deg in degrees.values():
        dist[deg] = dist.get(deg, 0) + 1

    # Human-readable Adjacency List for DAA teaching: Node Name -> [Friend Names]
    adj_list: Dict[str, List[str]] = {}
    for node in sorted(G.nodes()):
        node_name = G.nodes[node].get("name", node)
        neighbors = sorted([G.nodes[nbr].get("name", nbr) for nbr in G.neighbors(node)])
        adj_list[node_name] = neighbors

    # Human-readable Edge List: [(Name1, Name2)]
    edge_list: List[Dict[str, str]] = []
    seen_edges = set()
    for u, v in G.edges():
        u_name = G.nodes[u].get("name", u)
        v_name = G.nodes[v].get("name", v)
        edge_key = tuple(sorted([u_name, v_name]))
        if edge_key not in seen_edges:
            seen_edges.add(edge_key)
            edge_list.append({"u1": edge_key[0], "u2": edge_key[1]})
    edge_list.sort(key=lambda e: (e["u1"], e["u2"]))

    return {
        "total_users": v_count,
        "total_friendships": e_count,
        "average_degree": avg_degree,
        "density": density,
        "is_connected": is_connected,
        "connected_components_count": len(components),
        "connected_components": components,
        "most_connected_user": most_connected_user,
        "communities": communities_list,
        "degree_distribution": dist,
        "adjacency_list": adj_list,
        "edge_list": edge_list
    }
