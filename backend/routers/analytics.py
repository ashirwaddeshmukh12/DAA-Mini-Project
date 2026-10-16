from fastapi import APIRouter
from schemas import AnalyticsResponse
from services.graph_service import GraphService
from algorithms import calculate_network_analytics
from database import get_connection
from seed_data import seed_database

router = APIRouter(tags=["Analytics"])

@router.get("/api/analytics", response_model=AnalyticsResponse)
def get_analytics():
    G = GraphService.get_graph()
    return calculate_network_analytics(G)

@router.post("/api/reset-sample-data")
def reset_sample_data():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM friendships;")
    cursor.execute("DELETE FROM users;")
    conn.commit()

    seed_database(conn)
    conn.close()

    return {"message": "Sample network reset successfully with 11 students and teaching graph connections."}
