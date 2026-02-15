from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Set

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []


def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    node_ids: Set[str] = {node.get("id") for node in nodes if node.get("id") is not None}
    adjacency: Dict[str, Set[str]] = {node_id: set() for node_id in node_ids}
    indegree: Dict[str, int] = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if source is None or target is None:
            continue

        # ensure nodes referenced by edges are tracked
        if source not in indegree:
            indegree[source] = 0
            adjacency[source] = set()
            node_ids.add(source)
        if target not in indegree:
            indegree[target] = 0
            adjacency[target] = set()
            node_ids.add(target)

        if target not in adjacency[source]:
            adjacency[source].add(target)
            indegree[target] += 1

    queue = [node_id for node_id, degree in indegree.items() if degree == 0]
    visited = 0

    while queue:
        current = queue.pop(0)
        visited += 1
        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    dag = is_dag(payload.nodes, payload.edges)
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': dag}
