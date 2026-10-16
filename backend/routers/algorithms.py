from fastapi import APIRouter, HTTPException, status
from schemas import (
    BFSRequest, BFSResponse,
    DFSRequest, DFSResponse,
    ShortestPathRequest, ShortestPathResponse,
    MutualFriendsRequest, MutualFriendsResponse,
    BenchmarkRequest, BenchmarkResponse
)
from services.graph_service import GraphService
from algorithms import (
    run_bfs, run_dfs, find_shortest_path,
    calculate_mutual_friends, run_empirical_benchmark
)

router = APIRouter(prefix="/api/algorithms", tags=["Algorithms"])

@router.post("/bfs", response_model=BFSResponse)
def execute_bfs(req: BFSRequest):
    G = GraphService.get_graph()
    if req.source_id not in G:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Source user '{req.source_id}' not found.")
    result = run_bfs(G, req.source_id)
    return result

@router.post("/dfs", response_model=DFSResponse)
def execute_dfs(req: DFSRequest):
    G = GraphService.get_graph()
    if req.source_id not in G:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Source user '{req.source_id}' not found.")
    result = run_dfs(G, req.source_id)
    return result

@router.post("/shortest-path", response_model=ShortestPathResponse)
def execute_shortest_path(req: ShortestPathRequest):
    G = GraphService.get_graph()
    if req.source_id not in G:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Source user '{req.source_id}' not found.")
    if req.target_id not in G:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Target user '{req.target_id}' not found.")

    res = find_shortest_path(G, req.source_id, req.target_id)
    path_details = [GraphService.get_user_by_id(uid) for uid in res["path"]]
    return {
        **res,
        "path_details": path_details
    }

@router.post("/mutual-friends", response_model=MutualFriendsResponse)
def execute_mutual_friends(req: MutualFriendsRequest):
    G = GraphService.get_graph()
    if req.user1_id not in G:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{req.user1_id}' not found.")
    if req.user2_id not in G:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{req.user2_id}' not found.")

    mutual_ids = calculate_mutual_friends(G, req.user1_id, req.user2_id)
    mutual_users = [GraphService.get_user_by_id(uid) for uid in mutual_ids]

    return {
        "user1_id": req.user1_id,
        "user2_id": req.user2_id,
        "mutual_friends": mutual_users,
        "count": len(mutual_users)
    }

@router.post("/benchmark", response_model=BenchmarkResponse)
def execute_benchmark(req: BenchmarkRequest):
    bench_data = run_empirical_benchmark(req.node_counts, req.algorithm)
    return {
        "algorithm": req.algorithm.upper(),
        "results": bench_data["results"],
        "comparison": bench_data["comparison"],
        "note": "Measured times are median CPU timings over 7 runs. Actual runtime depends on hardware, implementation, graph density, and OS scheduler noise."
    }
