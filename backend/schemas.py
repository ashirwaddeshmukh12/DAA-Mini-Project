from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    handle: str = Field(..., min_length=1, max_length=50)
    role: Optional[str] = "Member"
    avatar: Optional[str] = "👤"
    bio: Optional[str] = ""
    community: Optional[str] = "General"

class UserCreate(UserBase):
    id: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    z: Optional[float] = None

class UserResponse(UserBase):
    id: str
    x: float
    y: float
    z: float
    degree: int = 0
    created_at: Optional[str] = None

class UserDetail(UserResponse):
    friends: List[UserResponse] = []
    suggestions: List[Dict[str, Any]] = []

class FriendshipCreate(BaseModel):
    user1_id: str
    user2_id: str

class FriendshipResponse(BaseModel):
    id: int
    user1_id: str
    user2_id: str
    created_at: Optional[str] = None

class FriendshipDelete(BaseModel):
    user1_id: str
    user2_id: str

class BFSStep(BaseModel):
    step: int
    current_node: str
    visited: List[str]
    queue: List[str]
    action: str
    edge_traversed: Optional[List[str]] = None
    level: int
    description: str

class BFSRequest(BaseModel):
    source_id: str

class BFSResponse(BaseModel):
    source_id: str
    traversal_order: List[str]
    distances: Dict[str, int]
    steps: List[BFSStep]
    total_nodes_visited: int
    edges_examined: int = 0
    time_complexity: str = "O(V + E)"
    space_complexity: str = "O(V)"
    v_count: int
    e_count: int

class DFSStep(BaseModel):
    step: int
    current_node: str
    visited: List[str]
    stack: List[str]
    action: str
    edge_traversed: Optional[List[str]] = None
    depth: int
    description: str

class DFSRequest(BaseModel):
    source_id: str

class DFSResponse(BaseModel):
    source_id: str
    traversal_order: List[str]
    steps: List[DFSStep]
    total_nodes_visited: int
    edges_examined: int = 0
    time_complexity: str = "O(V + E)"
    space_complexity: str = "O(V)"
    v_count: int
    e_count: int

class ShortestPathRequest(BaseModel):
    source_id: str
    target_id: str

class ShortestPathResponse(BaseModel):
    source_id: str
    target_id: str
    path_found: bool
    path: List[str] = []
    path_string: str = ""
    path_details: List[UserResponse] = []
    edges_count: int = 0
    traversal_sequence: List[str] = []
    time_complexity: str = "O(V + E)"
    message: str

class MutualFriendsRequest(BaseModel):
    user1_id: str
    user2_id: str

class MutualFriendsResponse(BaseModel):
    user1_id: str
    user2_id: str
    mutual_friends: List[UserResponse]
    count: int

class CommunityStats(BaseModel):
    name: str
    user_count: int
    users: List[str]
    color: str

class AnalyticsResponse(BaseModel):
    total_users: int
    total_friendships: int
    average_degree: float
    density: float
    is_connected: bool
    connected_components_count: int
    connected_components: List[List[str]]
    most_connected_user: Optional[UserResponse] = None
    communities: List[CommunityStats]
    degree_distribution: Dict[int, int]
    adjacency_list: Dict[str, List[str]] = {}
    edge_list: List[Dict[str, str]] = []

class BenchmarkRequest(BaseModel):
    node_counts: List[int] = [20, 50, 100, 200, 500]
    algorithm: str = "bfs"

class BenchmarkItem(BaseModel):
    nodes: int
    edges: int
    v_plus_e: int
    execution_time_ms: float
    ops_per_ms: float
    algorithm: str = "BFS"

class BenchmarkComparisonItem(BaseModel):
    nodes: int
    edges: int
    v_plus_e: int
    bfs_time_ms: float
    dfs_time_ms: float

class BenchmarkResponse(BaseModel):
    algorithm: str
    results: List[BenchmarkItem]
    comparison: List[BenchmarkComparisonItem] = []
    note: str
