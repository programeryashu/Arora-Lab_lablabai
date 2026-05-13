from fastapi import FastAPI, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

from core.orchestrator import run_workflow
from core.state import get_project, connect_websocket, disconnect_websocket

app = FastAPI(title="Arora Labs Backend API")

# Setup CORS for the frontend to consume
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectRequest(BaseModel):
    idea: str

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

if __name__ == "__main__":
    import uvicorn
    print("Starting Arora Labs API on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
