import asyncio
import json
from .state import create_project, update_agent, add_progress, set_result, finish_project
from .agents import (
    call_llm_json, PROMPT_PLANNER, 
    PROMPT_FRONTEND, PROMPT_BACKEND, PROMPT_DOCS
)

async def run_workflow(project_id: str, user_idea: str):
    try:
        create_project(project_id)
        add_progress(project_id, f"🚀 Starting workflow for idea: {user_idea}")
        
        # 1. Planner Agent
        update_agent(project_id, "planner")
        add_progress(project_id, "Planner is breaking down the architecture and features...")
        planner_input = json.dumps({"idea": user_idea})
        planner_output = await call_llm_json(PROMPT_PLANNER, planner_input)
        set_result(project_id, "planner", planner_output)
        add_progress(project_id, "✅ Planner completed successfully.")
        
        # 2. Frontend Agent
        update_agent(project_id, "frontend")
        add_progress(project_id, "Frontend engineer is generating UI code...")
        frontend_output = await call_llm_json(PROMPT_FRONTEND, json.dumps(planner_output))
        set_result(project_id, "frontend", frontend_output)
        add_progress(project_id, "✅ Frontend code generated.")
        
        # 3. Backend Agent
        update_agent(project_id, "backend")
        add_progress(project_id, "Backend engineer is designing APIs and DB schema...")
        backend_output = await call_llm_json(PROMPT_BACKEND, json.dumps(planner_output))
        set_result(project_id, "backend", backend_output)
        add_progress(project_id, "✅ Backend code generated.")
        
        # 4. Docs Agent
        update_agent(project_id, "docs")
        add_progress(project_id, "Documentation expert is creating the README...")
        docs_input = json.dumps({
            "planner": planner_output,
            "frontend": frontend_output,
            "backend": backend_output
        })
        docs_output = await call_llm_json(PROMPT_DOCS, docs_input)
        set_result(project_id, "docs", docs_output)
        add_progress(project_id, "✅ Documentation generated.")
        
        # Complete
        finish_project(project_id)
        add_progress(project_id, "🎉 Pipeline Complete!")
        
    except Exception as e:
        update_agent(project_id, "error")
        add_progress(project_id, f"❌ Pipeline failed: {str(e)}")


