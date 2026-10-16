"""
SocialSphere 2D DAA Teaching Lab Seed Data.
Defines a clean, easy-to-explain 11-student social network:
- 8 students in the primary connected component with the requested connections:
    Aditi — Rohan, Aditi — Priya
    Rohan — Sneha, Rohan — Karan
    Priya — Karan, Priya — Meera
    Sneha — Karan, Sneha — Arjun
    Karan — Meera, Meera — Arjun
    Arjun — Neha
- 3 students in a clearly separated disconnected component (Vikram — Ananya — Kabir)
  to demonstrate unreachable nodes and multiple connected components.
"""

SAMPLE_USERS = [
    # Main Connected Component (8 students)
    {
        "id": "u01",
        "name": "Aditi",
        "handle": "@aditi",
        "role": "Computer Science",
        "avatar": "👩‍💻",
        "bio": "First-year CS student. Interested in graph theory and algorithms.",
        "community": "Main Network",
        "x": 90.0,
        "y": 260.0,
        "z": 0.0
    },
    {
        "id": "u02",
        "name": "Rohan",
        "handle": "@rohan",
        "role": "Data Science",
        "avatar": "👨‍💻",
        "bio": "Working on machine learning pipelines and data structures.",
        "community": "Main Network",
        "x": 210.0,
        "y": 150.0,
        "z": 0.0
    },
    {
        "id": "u03",
        "name": "Priya",
        "handle": "@priya",
        "role": "AI & ML",
        "avatar": "👩‍🔬",
        "bio": "Passionate about search heuristics and graph neural networks.",
        "community": "Main Network",
        "x": 210.0,
        "y": 370.0,
        "z": 0.0
    },
    {
        "id": "u04",
        "name": "Sneha",
        "handle": "@sneha",
        "role": "Web Dev",
        "avatar": "👩‍🎨",
        "bio": "Front-end enthusiast building clean interactive visualizations.",
        "community": "Main Network",
        "x": 470.0,
        "y": 150.0,
        "z": 0.0
    },
    {
        "id": "u05",
        "name": "Karan",
        "handle": "@karan",
        "role": "Algorithms (Hub)",
        "avatar": "🧑‍💻",
        "bio": "Competitive programmer and network hub with the highest degree.",
        "community": "Main Network",
        "x": 340.0,
        "y": 260.0,
        "z": 0.0
    },
    {
        "id": "u06",
        "name": "Meera",
        "handle": "@meera",
        "role": "Cybersecurity",
        "avatar": "👩‍💼",
        "bio": "Exploring network flow, cryptography, and secure communications.",
        "community": "Main Network",
        "x": 470.0,
        "y": 370.0,
        "z": 0.0
    },
    {
        "id": "u07",
        "name": "Arjun",
        "handle": "@arjun",
        "role": "Cloud Computing",
        "avatar": "👨‍🚀",
        "bio": "Designing distributed backends and microservice connectivity.",
        "community": "Main Network",
        "x": 590.0,
        "y": 260.0,
        "z": 0.0
    },
    {
        "id": "u08",
        "name": "Neha",
        "handle": "@neha",
        "role": "Software Systems",
        "avatar": "👩‍🎓",
        "bio": "Systems programmer focusing on memory layout and graph caches.",
        "community": "Main Network",
        "x": 710.0,
        "y": 260.0,
        "z": 0.0
    },

    # Disconnected Group (3 students - demonstrating unreachable components)
    {
        "id": "u09",
        "name": "Vikram",
        "handle": "@vikram",
        "role": "Robotics Lab",
        "avatar": "🤖",
        "bio": "Autonomous systems research. Member of the isolated lab cluster.",
        "community": "Disconnected Group",
        "x": 840.0,
        "y": 140.0,
        "z": 0.0
    },
    {
        "id": "u10",
        "name": "Ananya",
        "handle": "@ananya",
        "role": "Quantum Research",
        "avatar": "🔬",
        "bio": "Quantum algorithms specialist in the isolated outpost network.",
        "community": "Disconnected Group",
        "x": 840.0,
        "y": 260.0,
        "z": 0.0
    },
    {
        "id": "u11",
        "name": "Kabir",
        "handle": "@kabir",
        "role": "Bio-Informatics",
        "avatar": "🧬",
        "bio": "Computational biology researcher studying genomic graph patterns.",
        "community": "Disconnected Group",
        "x": 840.0,
        "y": 380.0,
        "z": 0.0
    }
]

# Undirected friendships (user1, user2)
SAMPLE_FRIENDSHIPS = [
    # Main Connected Component (11 edges as requested)
    ("u01", "u02"),  # Aditi — Rohan
    ("u01", "u03"),  # Aditi — Priya
    ("u02", "u04"),  # Rohan — Sneha
    ("u02", "u05"),  # Rohan — Karan
    ("u03", "u05"),  # Priya — Karan
    ("u03", "u06"),  # Priya — Meera
    ("u04", "u05"),  # Sneha — Karan
    ("u04", "u07"),  # Sneha — Arjun
    ("u05", "u06"),  # Karan — Meera
    ("u06", "u07"),  # Meera — Arjun
    ("u07", "u08"),  # Arjun — Neha

    # Disconnected Group (2 edges)
    ("u09", "u10"),  # Vikram — Ananya
    ("u10", "u11"),  # Ananya — Kabir
]

def seed_database(conn):
    cursor = conn.cursor()

    for u in SAMPLE_USERS:
        cursor.execute("""
            INSERT OR REPLACE INTO users (id, name, handle, role, avatar, bio, community, x, y, z)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u["id"], u["name"], u["handle"], u["role"], u["avatar"], u["bio"], u["community"], u["x"], u["y"], u["z"]))

    for u1, u2 in SAMPLE_FRIENDSHIPS:
        user1 = min(u1, u2)
        user2 = max(u1, u2)
        cursor.execute("""
            INSERT OR IGNORE INTO friendships (user1_id, user2_id)
            VALUES (?, ?)
        """, (user1, user2))

    conn.commit()
