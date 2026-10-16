from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import users, friendships, algorithms, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed initial data if needed
    init_db()
    yield

app = FastAPI(
    title="SocialSphere 3D API",
    description="Graph intelligence and network traversal engine for DAA academic microproject",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(friendships.router)
app.include_router(algorithms.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "project": "SocialSphere 3D",
        "status": "online",
        "docs_url": "/docs",
        "endpoints": [
            "/api/users",
            "/api/friendships",
            "/api/algorithms/bfs",
            "/api/algorithms/dfs",
            "/api/algorithms/shortest-path",
            "/api/algorithms/mutual-friends",
            "/api/analytics",
            "/api/algorithms/benchmark"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
