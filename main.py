from fastapi import FastAPI, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
import uuid
import psutil
import asyncio
import time
import json
import platform
import socket
import os
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

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: list[ChatMessage]
    stream: bool = False

@app.post("/chat/completions")
async def chat_completions(request: ChatRequest):
    api_key = os.getenv("VITE_AI_API_KEY") or os.getenv("VITE_PLANNER_API_KEY")
    base_url = os.getenv("VITE_AI_BASE_URL") or os.getenv("VITE_PLANNER_BASE_URL") or "https://integrate.api.nvidia.com/v1"
    
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not found in environment.")
        
    client = AsyncOpenAI(api_key=api_key, base_url=base_url)
    
    try:
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        response = await client.chat.completions.create(
            model=request.model,
            messages=messages_dict,
            stream=request.stream
        )
        
        if request.stream:
            async def stream_generator():
                try:
                    async for chunk in response:
                        if hasattr(chunk, "model_dump_json"):
                            json_str = chunk.model_dump_json()
                        elif hasattr(chunk, "json"):
                            json_str = chunk.json()
                        else:
                            json_str = json.dumps(chunk)
                        yield f"data: {json_str}\n\n"
                    yield "data: [DONE]\n\n"
                except Exception as stream_err:
                    print(f"Error during stream generation: {stream_err}")
                    yield f"data: {json.dumps({'error': str(stream_err)})}\n\n"
                    
            return StreamingResponse(stream_generator(), media_type="text/event-stream")
        else:
            if hasattr(response, "model_dump"):
                return response.model_dump()
            elif hasattr(response, "json"):
                return json.loads(response.json())
            return response
            
    except Exception as e:
        print(f"Error in chat completions endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class BobChatRequest(BaseModel):
    messages: list[ChatMessage]
    stream: bool = False

@app.post("/ibm-bob/chat")
async def ibm_bob_chat(request: BobChatRequest):
    import httpx
    api_key = os.getenv("IBM_BOB_API_KEY")
    url = os.getenv("IBM_BOB_URL") or "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2024-05-01"
    project_id = os.getenv("IBM_PROJECT_ID")

    if not api_key:
        raise HTTPException(status_code=500, detail="IBM_BOB_API_KEY not configured in environment.")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json" if not request.stream else "text/event-stream"
    }
    
    is_watsonx = "cloud.ibm.com" in url or project_id is not None

    if is_watsonx:
        try:
            # 1. Exchange API Key for IAM Access Token
            async with httpx.AsyncClient() as client:
                token_resp = await client.post(
                    "https://iam.cloud.ibm.com/identity/token",
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                    data={
                        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                        "apikey": api_key
                    },
                    timeout=10.0
                )
                token_resp.raise_for_status()
                access_token = token_resp.json().get("access_token")
                
            headers["Authorization"] = f"Bearer {access_token}"
            
            # 2. Watsonx payload format
            payload = {
                "model_id": "ibm/granite-3-8b-instruct",
                "project_id": project_id,
                "messages": [{"role": msg.role, "content": msg.content} for msg in request.messages]
            }
        except Exception as auth_err:
            print(f"IBM Watsonx Auth Error: {auth_err}")
            raise HTTPException(status_code=500, detail=f"Watsonx Authentication failed: {str(auth_err)}")
    else:
        # Generic OpenAI-compatible mode
        headers["Authorization"] = f"Bearer {api_key}"
        payload = {
            "model": "ibm-bob",
            "messages": [{"role": msg.role, "content": msg.content} for msg in request.messages],
            "stream": request.stream
        }

    # Execute request
    if request.stream:
        async def stream_generator():
            try:
                async with httpx.AsyncClient() as client:
                    async with client.stream("POST", url, headers=headers, json=payload, timeout=30.0) as response:
                        response.raise_for_status()
                        async for chunk in response.aiter_lines():
                            if chunk.strip():
                                yield f"{chunk}\n\n"
            except Exception as stream_err:
                print(f"IBM Bob Stream Error: {stream_err}")
                yield f"data: {json.dumps({'error': str(stream_err)})}\n\n"
                
        return StreamingResponse(stream_generator(), media_type="text/event-stream")
    else:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, headers=headers, json=payload, timeout=30.0)
                resp.raise_for_status()
                return resp.json()
        except Exception as req_err:
            print(f"IBM Bob API Request Error: {req_err}")
            raise HTTPException(status_code=500, detail=f"IBM Bob request failed: {str(req_err)}")


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
    
    # 1. Rebuild or load dynamically from filesystem if project is not in memory
    from core.storage import BASE_PROJECTS_DIR
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    
    if not os.path.exists(project_path):
        if not project:
            raise HTTPException(status_code=404, detail="Project workspace folder not found")
            
    # 2. Scan and read actual project files from disk to ensure 100% sync
    frontend_components = []
    frontend_path = os.path.join(project_path, "frontend", "src")
    if os.path.exists(frontend_path):
        for f in os.listdir(frontend_path):
            fpath = os.path.join(frontend_path, f)
            if os.path.isfile(fpath):
                try:
                    with open(fpath, "r", encoding="utf-8") as file_handle:
                        frontend_components.append({"name": f, "code": file_handle.read()})
                except Exception as e:
                    print(f"Error reading frontend file {f}: {e}")
                    
    backend_components = []
    backend_path = os.path.join(project_path, "backend")
    if os.path.exists(backend_path):
        for f in os.listdir(backend_path):
            fpath = os.path.join(backend_path, f)
            if os.path.isfile(fpath):
                try:
                    with open(fpath, "r", encoding="utf-8") as file_handle:
                        backend_components.append({"name": f, "code": file_handle.read()})
                except Exception as e:
                    print(f"Error reading backend file {f}: {e}")
                    
    readme_content = ""
    readme_path = os.path.join(project_path, "README.md")
    if os.path.exists(readme_path):
        try:
            with open(readme_path, "r", encoding="utf-8") as file_handle:
                readme_content = file_handle.read()
        except Exception as e:
            print(f"Error reading README.md: {e}")
            
    # If project is not in memory, initialize it
    if not project:
        from core.state import create_project
        create_project(project_id)
        project = get_project(project_id)
        project["status"] = "completed"
        project["current_agent"] = "completed"
        
    # Synchronize and save inside project state
    project["results"]["frontend"] = {"components": frontend_components}
    project["results"]["backend"] = {"components": backend_components}
    project["results"]["docs"] = {"docs": readme_content}
    
    return {
        "status": project["status"],
        "frontend": project["results"]["frontend"],
        "backend": project["results"]["backend"],
        "docs": project["results"]["docs"]
    }


class SaveFileRequest(BaseModel):
    project_id: str
    filename: str
    content: str

@app.post("/save-file")
async def save_file(request: SaveFileRequest):
    project_id = request.project_id
    filename = request.filename
    content = request.content
    
    project = get_project(project_id)
    if not project:
        # If project is not found in memory (e.g. server reloaded), create a stub
        from core.state import create_project
        create_project(project_id)
        project = get_project(project_id)
    
    # 1. Determine folder path and key dynamically
    if filename.endswith(".jsx") or filename.endswith(".js") or filename.endswith(".css") or filename.endswith(".html") or filename == "index.html":
        sub_folder = os.path.join("frontend", "src")
        res_key = "frontend"
    elif filename.endswith(".py") or filename.endswith(".sql"):
        sub_folder = "backend"
        res_key = "backend"
    elif filename == "README.md" or filename == "package.json":
        sub_folder = ""
        res_key = "docs"
    else:
        # Fallback to general workspace
        sub_folder = ""
        res_key = "docs"
        
    # 2. Write to local filesystem
    from core.storage import safe_write_file, BASE_PROJECTS_DIR
    filepath = os.path.join(BASE_PROJECTS_DIR, project_id, sub_folder, filename)
    
    try:
        safe_write_file(filepath, content)
        print(f"[API_SAVE] Successfully wrote file to disk: {filepath}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write file to disk: {str(e)}")
        
    # 3. Synchronize in-memory result state
    results = project["results"]
    if results.get(res_key) is None:
        results[res_key] = {}
        
    if res_key == "frontend":
        components = results["frontend"].setdefault("components", [])
        updated = False
        for comp in components:
            if comp.get("name") == filename:
                comp["code"] = content
                updated = True
                break
        if not updated:
            components.append({"name": filename, "code": content})
            
    elif res_key == "backend":
        components = results["backend"].setdefault("components", [])
        updated = False
        for comp in components:
            if comp.get("name") == filename:
                comp["code"] = content
                updated = True
                break
        if not updated:
            components.append({"name": filename, "code": content})
            
    elif res_key == "docs":
        results["docs"]["docs"] = content
        
    return {
        "status": "success",
        "message": f"File '{filename}' successfully saved and synchronized in workspace."
    }


@app.websocket("/ws/bridge")
async def websocket_bridge(websocket: WebSocket):
    # Simple token-based security check
    token = websocket.query_params.get("token")
    expected_token = "arora-secure-bridge-2024"
    
    await websocket.accept()
    
    if token != expected_token:
        print(f"Bridge unauthorized: {token}")
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

@app.websocket("/ws/logs/{project_id}")
async def websocket_logs(websocket: WebSocket, project_id: str):
    """WebSocket endpoint for streaming project-specific logs."""
    await connect_websocket(project_id, websocket)
    try:
        while True:
            # Keep connection open until client disconnects
            await websocket.receive_text()
    except WebSocketDisconnect:
        disconnect_websocket(project_id, websocket)

if __name__ == "__main__":
    import uvicorn
    print("Starting Arora Labs API on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
