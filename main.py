from fastapi import FastAPI, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import psutil
import asyncio
import time
import json
import platform
import socket
from datetime import datetime

from core.orchestrator import run_workflow
from core.state import get_project, connect_websocket, disconnect_websocket

app = FastAPI(title="Arora Labs Backend API")

# Store active bridge connections
bridge_connections = set()

async def broadcast_telemetry():
    """Broadcast system metrics to all connected bridge clients."""
    while True:
        if bridge_connections:
            try:
                # Device Info
                device_info = {
                    "hostname": socket.gethostname(),
                    "os": f"{platform.system()} {platform.release()}",
                    "processor": platform.processor()
                }

                # CPU usage per core + overall
                cpu_percent = psutil.cpu_percent(interval=None)
                cpu_count = psutil.cpu_count()
                
                # RAM usage
                memory = psutil.virtual_memory()
                ram_used = round(memory.used / (1024**3), 2)
                ram_total = round(memory.total / (1024**3), 2)
                ram_percent = memory.percent
                
                # Temperature (fallback if not available on Windows/specific hardware)
                temp = 0
                try:
                    if hasattr(psutil, "sensors_temperatures"):
                        temps = psutil.sensors_temperatures()
                        if temps:
                            for name, entries in temps.items():
                                temp = entries[0].current
                                break
                except:
                    pass
                
                if temp == 0:
                    # Mock temperature fluctuation if sensors not accessible
                    temp = 42 + (time.time() % 10) 

                telemetry = {
                    "type": "telemetry",
                    "timestamp": datetime.now().isoformat(),
                    "data": {
                        "cpu": {
                            "load": cpu_percent,
                            "cores": cpu_count
                        },
                        "ram": {
                            "used": ram_used,
                            "total": ram_total,
                            "percent": ram_percent
                        },
                        "device": device_info,
                        "temp": round(temp, 1),
                        "status": "online"
                    }
                }
                
                # Broadcast to all
                dead_connections = set()
                for ws in bridge_connections:
                    try:
                        await ws.send_json(telemetry)
                    except:
                        dead_connections.add(ws)
                
                for dead in dead_connections:
                    bridge_connections.remove(dead)
                    
            except Exception as e:
                print(f"Telemetry error: {e}")
                
        await asyncio.sleep(2)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(broadcast_telemetry())
# Setup CORS for the frontend to consume
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectRequest(BaseModel):
    idea: str

class WorkerRequest(BaseModel):
    name: str
    prompt: str
    apiKey: str
@app.post("/start-project")
async def start_project(request: ProjectRequest, background_tasks: BackgroundTasks):
    project_id = str(uuid.uuid4())
    
    # Run the orchestrator pipeline in the background
    background_tasks.add_task(run_workflow, project_id, request.idea)
    
    return {
        "project_id": project_id,
        "status": "started",
        "message": "Project pipeline initiated in background."
    }

@app.post("/run-worker")
async def run_worker(request: WorkerRequest):
    # This is a mock implementation of running a specific worker
    # In a real system, you'd use the apiKey to call an LLM with the prompt
    print(f"Running worker: {request.name}")
    print(f"Prompt: {request.prompt}")
    print(f"API Key: {request.apiKey[:5]}...")
    
    return {
        "status": "success",
        "message": f"Worker {request.name} invoked successfully using provided API key.",
        "worker_id": str(uuid.uuid4())
    }
@app.get("/status/{project_id}")
async def get_status(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return {
        "current_agent": project["current_agent"],
        "progress": project["progress"]
    }

@app.get("/result/{project_id}")
async def get_result(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    res = project["results"]
    return {
        "status": project["status"],
        "frontend": res.get("frontend"),
        "backend": res.get("backend"),
        "docs": res.get("docs")
    }

@app.websocket("/ws/logs/{project_id}")
async def websocket_logs(websocket: WebSocket, project_id: str):
    await connect_websocket(project_id, websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        disconnect_websocket(project_id, websocket)

@app.websocket("/ws/bridge")
async def websocket_bridge(websocket: WebSocket, token: str = None):
    # Simple token-based security check
    # In production, this would verify against a DB
    expected_token = "arora-secure-bridge-2024"
    
    await websocket.accept()
    
    if token != expected_token:
        await websocket.send_json({"type": "error", "message": "Unauthorized bridge access"})
        await websocket.close(code=1008)
        return

    bridge_connections.add(websocket)
    print(f"Bridge connected: {websocket.client}")
    
    try:
        while True:
            # Listen for any commands from frontend
            data = await websocket.receive_text()
            # Process potential commands here
    except WebSocketDisconnect:
        bridge_connections.remove(websocket)
        print(f"Bridge disconnected: {websocket.client}")

if __name__ == "__main__":
    import uvicorn
    print("Starting Arora Labs API on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
