from typing import Dict, Any, List
from fastapi import WebSocket
import asyncio

# In-memory dictionary to store state for active projects.
STATE: Dict[str, Dict[str, Any]] = {}
CONNECTIONS: Dict[str, List[WebSocket]] = {}

def create_project(project_id: str):
    STATE[project_id] = {
        "status": "running",
        "current_agent": "Bob AI",
        "progress": [f"Project {project_id} initialized."],
        "results": {
            "planner": None,
            "frontend": None,
            "backend": None,
            "docs": None
        }
    }
    CONNECTIONS[project_id] = []

def update_agent(project_id: str, agent_name: str):
    if project_id in STATE:
        STATE[project_id]["current_agent"] = agent_name
        add_progress(project_id, f"Transitioning to {agent_name}...")

def add_progress(project_id: str, message: str):
    if project_id in STATE:
        STATE[project_id]["progress"].append(message)
        print(f"[{project_id}] {message}")
        
        # Broadcast to active websocket connections
        if project_id in CONNECTIONS:
            for ws in CONNECTIONS[project_id]:
                asyncio.create_task(ws.send_json({"log": message, "current_agent": STATE[project_id]["current_agent"]}))

def set_result(project_id: str, key: str, data: Any):
    if project_id in STATE:
        STATE[project_id]["results"][key] = data
        
def finish_project(project_id: str):
    if project_id in STATE:
        STATE[project_id]["status"] = "completed"
        STATE[project_id]["current_agent"] = "done"

def get_project(project_id: str) -> Dict[str, Any]:
    return STATE.get(project_id)

async def connect_websocket(project_id: str, websocket: WebSocket):
    await websocket.accept()
    if project_id not in CONNECTIONS:
        CONNECTIONS[project_id] = []
    CONNECTIONS[project_id].append(websocket)
    
    # Send all existing logs immediately upon connection
    if project_id in STATE:
        for log in STATE[project_id]["progress"]:
            await websocket.send_json({"log": log, "current_agent": STATE[project_id]["current_agent"]})

def disconnect_websocket(project_id: str, websocket: WebSocket):
    if project_id in CONNECTIONS and websocket in CONNECTIONS[project_id]:
        CONNECTIONS[project_id].remove(websocket)

