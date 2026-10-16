import random
import networkx as nx
from database import get_connection

class GraphService:
    @staticmethod
    def get_graph():
        """Constructs and returns a NetworkX Graph from current SQLite state."""
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users")
        user_rows = cursor.fetchall()

        cursor.execute("SELECT * FROM friendships")
        friendship_rows = cursor.fetchall()
        conn.close()

        G = nx.Graph()
        for u in user_rows:
            G.add_node(
                u["id"],
                name=u["name"],
                handle=u["handle"],
                role=u["role"],
                avatar=u["avatar"],
                bio=u["bio"],
                community=u["community"],
                x=u["x"],
                y=u["y"],
                z=u["z"]
            )

        for f in friendship_rows:
            G.add_edge(f["user1_id"], f["user2_id"])

        return G

    @staticmethod
    def get_all_users_with_degrees():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.*, 
                   (SELECT COUNT(*) FROM friendships f WHERE f.user1_id = u.id OR f.user2_id = u.id) as degree
            FROM users u
            ORDER BY u.name ASC
        """)
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def get_user_by_id(user_id: str):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.*, 
                   (SELECT COUNT(*) FROM friendships f WHERE f.user1_id = u.id OR f.user2_id = u.id) as degree
            FROM users u
            WHERE u.id = ?
        """, (user_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def get_direct_friends(user_id: str):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.*, 
                   (SELECT COUNT(*) FROM friendships f WHERE f.user1_id = u.id OR f.user2_id = u.id) as degree
            FROM users u
            WHERE u.id IN (
                SELECT user2_id FROM friendships WHERE user1_id = ?
                UNION
                SELECT user1_id FROM friendships WHERE user2_id = ?
            )
            ORDER BY u.name ASC
        """, (user_id, user_id))
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def get_all_friendships():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM friendships ORDER BY id ASC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def calculate_position_for_new_user(user_id: str, community: str):
        """Calculates a sensible 2D coordinate for a newly added node."""
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT x, y FROM users")
        rows = cursor.fetchall()
        conn.close()

        existing_coords = [(r["x"], r["y"]) for r in rows if r["x"] is not None and r["y"] is not None]

        # Find a location in the main area (x: 150-650, y: 120-400) not too close to any existing node
        for _ in range(40):
            cand_x = round(random.uniform(150.0, 650.0), 1)
            cand_y = round(random.uniform(120.0, 400.0), 1)
            too_close = any(((cand_x - ex)**2 + (cand_y - ey)**2)**0.5 < 75.0 for ex, ey in existing_coords)
            if not too_close:
                return (cand_x, cand_y, 0.0)

        # Fallback
        return (round(random.uniform(200.0, 600.0), 1), round(random.uniform(150.0, 350.0), 1), 0.0)

