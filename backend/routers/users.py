import uuid
from typing import List
from fastapi import APIRouter, HTTPException, status
from database import get_connection
from schemas import UserCreate, UserResponse, UserDetail
from services.graph_service import GraphService
from algorithms.friends import generate_friend_suggestions

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("", response_model=List[UserResponse])
def get_users():
    return GraphService.get_all_users_with_degrees()

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    conn = get_connection()
    cursor = conn.cursor()

    # Check handle uniqueness
    cursor.execute("SELECT id FROM users WHERE handle = ?", (user.handle,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Handle '{user.handle}' is already in use."
        )

    user_id = user.id or f"u_{uuid.uuid4().hex[:6]}"

    # Check ID uniqueness if supplied
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User ID '{user_id}' already exists."
        )

    # 3D position
    if user.x is None or user.y is None or user.z is None:
        x, y, z = GraphService.calculate_position_for_new_user(user_id, user.community or "General")
    else:
        x, y, z = user.x, user.y, user.z

    cursor.execute("""
        INSERT INTO users (id, name, handle, role, avatar, bio, community, x, y, z)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (user_id, user.name, user.handle, user.role, user.avatar, user.bio, user.community, x, y, z))
    conn.commit()
    conn.close()

    created = GraphService.get_user_by_id(user_id)
    return created

@router.get("/{user_id}", response_model=UserDetail)
def get_user(user_id: str):
    user = GraphService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")

    friends = GraphService.get_direct_friends(user_id)
    G = GraphService.get_graph()
    suggestions = generate_friend_suggestions(G, user_id)

    return {
        **user,
        "friends": friends,
        "suggestions": suggestions
    }

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")

    # SQLite CASCADE foreign keys delete related friendships automatically
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

    return {"message": f"User '{user_id}' and all associated friendships successfully removed."}

@router.get("/{user_id}/friends", response_model=List[UserResponse])
def get_user_friends(user_id: str):
    user = GraphService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")
    return GraphService.get_direct_friends(user_id)
