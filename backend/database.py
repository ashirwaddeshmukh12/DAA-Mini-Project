import sqlite3
import os
from pathlib import Path

DB_PATH = os.environ.get(
    "SQLITE_DB_PATH",
    str(Path(__file__).parent / "socialsphere.db")
)

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        handle TEXT NOT NULL UNIQUE,
        role TEXT,
        avatar TEXT,
        bio TEXT,
        community TEXT,
        x REAL,
        y REAL,
        z REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS friendships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user1_id TEXT NOT NULL,
        user2_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user1_id, user2_id),
        CHECK (user1_id < user2_id)
    );
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_friendships_u1 ON friendships(user1_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_friendships_u2 ON friendships(user2_id);")
    conn.commit()

    # Check if empty, if so populate seed data
    cursor.execute("SELECT COUNT(*) as count FROM users")
    row = cursor.fetchone()
    if row["count"] == 0:
        from seed_data import seed_database
        seed_database(conn)

    conn.close()
