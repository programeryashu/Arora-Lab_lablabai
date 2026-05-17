import asyncio
import json
import traceback
from .state import create_project, update_agent, add_progress, set_result, finish_project
from .agents import (
    call_llm_json, PROMPT_RESEARCH, PROMPT_PLANNER, 
    PROMPT_FRONTEND, PROMPT_BACKEND, PROMPT_DOCS
)
from .storage import (
    init_project_dir, write_planner_output,
    write_frontend_code, write_backend_code, write_docs
)

async def run_workflow(project_id: str, user_idea: str):
    try:
        create_project(project_id)
        add_progress(project_id, f"[*] Starting workflow for idea: {user_idea}")
        
        # Initialize directory
        project_path = init_project_dir(project_id)
        add_progress(project_id, f"[FILE_WRITER] Initialized workspace folder: {project_path}")
        
        # 1. Research Agent
        update_agent(project_id, "research")
        add_progress(project_id, "[AGENT] Research Agent is analyzing technical challenges and stack...")
        research_output = await call_llm_json(PROMPT_RESEARCH, user_idea)
        set_result(project_id, "research", research_output)
        add_progress(project_id, f"[AGENT_OUTPUT] Research summary: {research_output.get('research_summary')}")
        add_progress(project_id, "[SUCCESS] Research Agent completed.")
        
        # 2. Planner Agent
        update_agent(project_id, "planner")
        add_progress(project_id, "[AGENT] Planner is breaking down the architecture and features...")
        planner_input = json.dumps({"idea": user_idea, "research": research_output})
        planner_output = await call_llm_json(PROMPT_PLANNER, planner_input)
        set_result(project_id, "planner", planner_output)
        add_progress(project_id, f"[AGENT_OUTPUT] Planner architectural blueprint generated.")
        
        # Write planner output reference
        try:
            write_planner_output(project_id, planner_output)
            add_progress(project_id, "[FILE_WRITER] Planner output JSON saved to disk.")
        except Exception as file_err:
            add_progress(project_id, f"[FILE_WRITER_ERROR] Failed to save planner JSON: {file_err}")
            
        add_progress(project_id, "[SUCCESS] Planner Agent completed.")
        
        # 3. Frontend Agent
        update_agent(project_id, "frontend")
        add_progress(project_id, "[AGENT] Frontend engineer is generating modern UI code...")
        frontend_output = await call_llm_json(PROMPT_FRONTEND, json.dumps(planner_output))
        set_result(project_id, "frontend", frontend_output)
        add_progress(project_id, f"[AGENT_OUTPUT] Frontend engineer response received. Character count: {len(str(frontend_output))}")
        
        # Write Frontend Code to disk
        try:
            comps = frontend_output.get("components", []) if isinstance(frontend_output, dict) else []
            names = [c.get("name") for c in comps if c.get("name")]
            add_progress(project_id, f"[FILE_WRITER] Writing {len(names)} frontend files to disk: {', '.join(names)}")
            write_frontend_code(project_id, frontend_output)
            for name in names:
                add_progress(project_id, f"[FILE_WRITER_SUCCESS] Frontend component '{name}' written to workspace.")
        except Exception as file_err:
            add_progress(project_id, f"[FILE_WRITER_ERROR] Frontend file write failed: {file_err}")
            
        add_progress(project_id, "[SUCCESS] Frontend Agent completed.")
        
        # 4. Backend Agent
        update_agent(project_id, "backend")
        add_progress(project_id, "[AGENT] Backend engineer is designing APIs and DB schema...")
        backend_output = await call_llm_json(PROMPT_BACKEND, json.dumps(planner_output))
        set_result(project_id, "backend", backend_output)
        add_progress(project_id, f"[AGENT_OUTPUT] Backend engineer response received. Character count: {len(str(backend_output))}")
        
        # Write Backend Code to disk
        try:
            comps = backend_output.get("components", []) if isinstance(backend_output, dict) else []
            names = [c.get("name") for c in comps if c.get("name")]
            add_progress(project_id, f"[FILE_WRITER] Writing {len(names)} backend files to disk: {', '.join(names)}")
            write_backend_code(project_id, backend_output)
            for name in names:
                add_progress(project_id, f"[FILE_WRITER_SUCCESS] Backend component '{name}' written to workspace.")
        except Exception as file_err:
            add_progress(project_id, f"[FILE_WRITER_ERROR] Backend file write failed: {file_err}")
            
        add_progress(project_id, "[SUCCESS] Backend Agent completed.")
        
        # 5. Docs Agent
        update_agent(project_id, "docs")
        add_progress(project_id, "[AGENT] Documentation expert is creating the README...")
        docs_input = json.dumps({
            "planner": planner_output,
            "frontend": frontend_output,
            "backend": backend_output
        })
        docs_output = await call_llm_json(PROMPT_DOCS, docs_input)
        set_result(project_id, "docs", docs_output)
        add_progress(project_id, f"[AGENT_OUTPUT] README Markdown compiled. Character count: {len(str(docs_output))}")
        
        # Write Documentation Code to disk
        try:
            add_progress(project_id, "[FILE_WRITER] Writing README.md to workspace...")
            write_docs(project_id, docs_output)
            add_progress(project_id, "[FILE_WRITER_SUCCESS] README.md successfully written to workspace.")
        except Exception as file_err:
            add_progress(project_id, f"[FILE_WRITER_ERROR] Documentation file write failed: {file_err}")
            
        add_progress(project_id, "[SUCCESS] Docs Agent completed.")
        
        # Complete & Sync Editor Workspace
        finish_project(project_id)
        add_progress(project_id, "[EDITOR_UPDATE] Workspace update broadcast successfully to client.")
        add_progress(project_id, "[REFRESH_WORKSPACE] Editor workspace successfully refreshed and synchronized.")
        add_progress(project_id, "[DONE] Pipeline Complete!")

        
    except Exception as e:
        update_agent(project_id, "error")
        err_msg = f"[ERROR] Pipeline failed: {str(e)}\n{traceback.format_exc()}"
        add_progress(project_id, err_msg)



