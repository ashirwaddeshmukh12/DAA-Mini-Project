import time
import statistics
from typing import List, Dict, Any
import networkx as nx
from algorithms.bfs import run_bfs
from algorithms.dfs import run_dfs

def run_empirical_benchmark(node_counts: List[int], algorithm: str = "bfs") -> Dict[str, Any]:
    """
    Empirically measures execution time on synthetic reproducible graphs of varying size.
    Repeats experiments 7 times and computes the MEDIAN runtime to minimize measurement noise.
    Returns both target algorithm results and a head-to-head comparison between BFS and DFS.
    """
    results = []
    comparison = []

    for idx, n in enumerate(node_counts):
        # Create an Erdős–Rényi random graph with average degree ~ 4
        # Seed ensures reproducibility across runs
        p = min(1.0, 4.0 / max(1, n))
        G = nx.fast_gnp_random_graph(n, p, seed=42 + idx)

        for node in G.nodes():
            G.nodes[node]["name"] = f"Student_{node}"

        V = G.number_of_nodes()
        E = G.number_of_edges()
        v_plus_e = V + E

        source_node = 0 if 0 in G else (list(G.nodes())[0] if G.nodes() else None)
        if source_node is None:
            continue

        # Warm-up runs
        run_bfs(G, source_node)
        run_dfs(G, source_node)

        # 7 repetitions for median calculation
        bfs_times = []
        dfs_times = []
        repetitions = 7

        for _ in range(repetitions):
            # BFS timing
            t0 = time.perf_counter_ns()
            run_bfs(G, source_node)
            t1 = time.perf_counter_ns()
            bfs_times.append((t1 - t0) / 1_000_000.0)

            # DFS timing
            t2 = time.perf_counter_ns()
            run_dfs(G, source_node)
            t3 = time.perf_counter_ns()
            dfs_times.append((t3 - t2) / 1_000_000.0)

        median_bfs_ms = round(statistics.median(bfs_times), 4)
        median_dfs_ms = round(statistics.median(dfs_times), 4)

        chosen_time = median_dfs_ms if algorithm.lower() == "dfs" else median_bfs_ms
        ops_per_ms = round(v_plus_e / max(0.0001, chosen_time), 1)

        results.append({
            "nodes": V,
            "edges": E,
            "v_plus_e": v_plus_e,
            "execution_time_ms": chosen_time,
            "ops_per_ms": ops_per_ms,
            "algorithm": algorithm.upper()
        })

        comparison.append({
            "nodes": V,
            "edges": E,
            "v_plus_e": v_plus_e,
            "bfs_time_ms": median_bfs_ms,
            "dfs_time_ms": median_dfs_ms
        })

    return {
        "results": results,
        "comparison": comparison
    }
