from typing import List
from fastapi import APIRouter, HTTPException, status
from database import get_connection
from schemas import FriendshipCreate, FriendshipResponse, FriendshipDelete
from services.graph_service import GraphService

router = APIRouter(prefix="/api/friendships", tags=["Friendships"])

@router.get("", response_model=List[FriendshipResponse])
def get_friendships():
    return GraphService.get_all_friendships()

@router.post("", response_model=FriendshipResponse, status_code=status.HTTP_201_CREATED)
def create_friendship(friendship: FriendshipCreate):
    if friendship.user1_id == friendship.user2_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Self-friendships are strictly invalid. A user cannot form an edge with themselves."
        )

    conn = get_connection()
    cursor = conn.cursor()

    # Check existence of both users
    cursor.execute("SELECT id FROM users WHERE id IN (?, ?)", (friendship.user1_id, friendship.user2_id))
    existing_users = {row["id"] for row in cursor.fetchall()}

    if friendship.user1_id not in existing_users:
        conn.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{friendship.user1_id}' does not exist.")
    if friendship.user2_id not in existing_users:
        conn.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{friendship.user2_id}' does not exist.")

    # Canonical undirected ordering
    u1 = min(friendship.user1_id, friendship.user2_id)
    u2 = max(friendship.user1_id, friendship.user2_id)

    # Check for existing friendship
    cursor.execute("SELECT id FROM friendships WHERE user1_id = ? AND user2_id = ?", (u1, u2))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A friendship edge already exists between these users."
        )

    cursor.execute("INSERT INTO friendships (user1_id, user2_id) VALUES (?, ?)", (u1, u2))
    conn.commit()
    new_id = cursor.lastrowid

    cursor.execute("SELECT * FROM friendships WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()

    return dict(row)

@router.delete("", status_code=status.HTTP_200_OK)
def delete_friendship(friendship: FriendshipDelete):
    u1 = min(friendship.user1_id, friendship.user2_id)
    u2 = max(friendship.user1_id, friendship.user2_id)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM friendships WHERE user1_id = ? AND user2_id = ?", (u1, u2))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friendship edge does not exist.")

    cursor.execute("DELETE FROM friendships WHERE user1_id = ? AND user2_id = ?", (u1, u2))
    conn.commit()
    conn.close()

    return {"message": "Friendship successfully removed."}
