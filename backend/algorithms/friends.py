from typing import List, Dict, Any, Set
import networkx as nx

def calculate_mutual_friends(G: nx.Graph, user1_id: str, user2_id: str) -> List[str]:
    if user1_id not in G or user2_id not in G:
        return []
    neighbors_1: Set[str] = set(G.neighbors(user1_id))
    neighbors_2: Set[str] = set(G.neighbors(user2_id))
    return sorted(list(neighbors_1.intersection(neighbors_2)))

def generate_friend_suggestions(G: nx.Graph, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Ranks non-friends based on the number of mutual friends (common neighbors heuristic).
    Strict constraint: NEVER suggests existing friends, and NEVER suggests user themselves.
    """
    if user_id not in G:
        return []

    direct_friends = set(G.neighbors(user_id))
    excluded = direct_friends.union({user_id})

    suggestions = []
    for other_id in G.nodes():
        if other_id in excluded:
            continue
        other_friends = set(G.neighbors(other_id))
        mutual = direct_friends.intersection(other_friends)
        if mutual:
            other_node = G.nodes[other_id]
            suggestions.append({
                "id": other_id,
                "name": other_node.get("name", other_id),
                "handle": other_node.get("handle", ""),
                "avatar": other_node.get("avatar", "👤"),
                "role": other_node.get("role", "Member"),
                "community": other_node.get("community", "General"),
                "mutual_count": len(mutual),
                "mutual_friends": list(mutual)
            })

    # Sort descending by mutual friends count, then name
    suggestions.sort(key=lambda s: (-s["mutual_count"], s["name"]))
    return suggestions[:limit]
