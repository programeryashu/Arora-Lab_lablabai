import os
import json
import asyncio
import re
from openai import AsyncOpenAI
from dotenv import load_dotenv

def robust_parse_agent_output(text: str, default_filename: str = "App.jsx") -> dict:
    """Robustly extracts JSON or markdown code blocks from conversational LLM output."""
    if not text:
        return {"components": []}
    
    text = text.strip()
    
    # 1. Try to find the largest JSON block in the response
    first_brace = text.find('{')
    last_brace = text.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        json_candidate = text[first_brace:last_brace+1]
        try:
            parsed = json.loads(json_candidate)
            if isinstance(parsed, dict):
                # Standard components schema
                if "components" in parsed and isinstance(parsed["components"], list):
                    return parsed
                # Flat schema like {"App.jsx": "code"}
                elif all(isinstance(k, str) and isinstance(v, str) for k, v in parsed.items()):
                    return {
                        "components": [{"name": k, "code": v} for k, v in parsed.items()]
                    }
                # Other key-values
                else:
                    components = []
                    for k, v in parsed.items():
                        if isinstance(v, str):
                            components.append({"name": k, "code": v})
                        elif isinstance(v, dict) and "code" in v:
                            components.append({"name": k, "code": v["code"]})
                    if components:
                        return {"components": components}
        except Exception as e:
            print(f"[RobustParser] JSON block candidate parsing failed: {e}")
            
    # 2. Extract structured file names & code from markdown code blocks
    # Pattern: ```[lang]\n[code]\n```
    code_blocks = re.findall(r"```([a-zA-Z0-9_\-\+]*)\s*\n([\s\S]*?)\n```", text)
    split_text = re.split(r"```[a-zA-Z0-9_\-\+]*\s*\n[\s\S]*?\n```", text)
    
    components = []
    for idx, (lang, code) in enumerate(code_blocks):
        lang = lang.lower()
        code = code.strip()
        
        preceding_text = split_text[idx] if idx < len(split_text) else ""
        lines = [line.strip() for line in preceding_text.split("\n") if line.strip()]
        filename = None
        
        # Search the last 3 non-empty lines before the code block for a filename
        for line in reversed(lines[-3:] if len(lines) >= 3 else lines):
            match = re.search(r"([\w\-\./]+\.(?:jsx|js|tsx|ts|py|css|html|sql|md|json))", line, re.IGNORECASE)
            if match:
                filename = os.path.basename(match.group(1))
                break
                
        if not filename:
            # Generate a logical fallback filename based on the language
            if idx == 0:
                filename = default_filename
            else:
                ext = "js"
                if "py" in lang or "python" in lang:
                    ext = "py"
                elif "html" in lang:
                    ext = "html"
                elif "css" in lang:
                    ext = "css"
                elif "json" in lang:
                    ext = "json"
                elif "sql" in lang:
                    ext = "sql"
                elif "md" in lang or "markdown" in lang:
                    ext = "md"
                elif "ts" in lang or "typescript" in lang:
                    ext = "ts"
                elif "tsx" in lang:
                    ext = "tsx"
                elif "jsx" in lang:
                    ext = "jsx"
                filename = f"file_{idx + 1}.{ext}"
                
        components.append({"name": filename, "code": code})
        
    if components:
        return {"components": components}
        
    # 3. Final Fallback: wrap the entire text response in a default filename
    return {
        "components": [
            {
                "name": default_filename,
                "code": text
            }
        ]
    }


load_dotenv()

# Set this to False to use real LLM calls (e.g. OpenRouter, NVIDIA)
SIMULATION_MODE = os.getenv("SIMULATION_MODE", "True").lower() in ("true", "1", "yes")

# API Keys and URLs are loaded dynamically per agent inside call_llm_json

PROMPT_RESEARCH = """
You are a senior technical research agent.
Analyze the user's project idea, identify technical challenges, find best practices, and recommend a tech stack.

Return output ONLY as JSON in this format:
{
  "research_summary": "...",
  "key_findings": ["...", "..."],
  "technical_challenges": ["...", "..."],
  "recommended_stack": "..."
}
"""

PROMPT_PLANNER = """
You are a senior software architect.
Your job is to define the architecture and break the project into technical components.

Return output ONLY as JSON in this format:
{
  "architecture": "...",
  "features": ["...", "..."],
  "frontend_requirements": "...",
  "backend_requirements": "...",
  "database_design": "..."
}
"""

PROMPT_FRONTEND = """
You are a senior frontend engineer.
Generate modern UI code using React and Tailwind CSS.
Focus on clean and responsive design based on the provided planner output.

Return output ONLY as JSON in this format:
{
  "components": [
    {
      "name": "App.jsx",
      "code": "..."
    }
  ]
}
"""

PROMPT_BACKEND = """
You are a backend engineer.
Design APIs, define DB schema, and write logic based on the planner output.

Return output ONLY as JSON in this format:
{
  "components": [
    {
      "name": "main.py",
      "code": "..."
    }
  ],
  "api_endpoints": ["GET /...", "POST /..."],
  "database_schema": "..."
}
"""

PROMPT_DOCS = """
You are a technical documentation expert.
Create a clean README, explain setup, and describe features.

Return output ONLY as JSON in this format:
{
  "docs": "..."
}
"""

async def call_llm_json(system_prompt: str, user_input: str, retries: int = 3) -> dict:
    """Calls the LLM and attempts to parse the result as JSON with retries."""
    
    if (SIMULATION_MODE):
        await asyncio.sleep(2) # Premium visual simulation processing time
        
        if system_prompt == PROMPT_RESEARCH:
            return {
                "research_summary": "Initial technical study for the requested application. Standard requirements call for a responsive single-page web environment, high-throughput REST API endpoints, and a structured database schema.",
                "key_findings": [
                    "React is ideal for dynamic client-side rendering.",
                    "FastAPI's async nature provides robust support for concurrent requests."
                ],
                "technical_challenges": [
                    "Websocket connection stability.",
                    "Local directory write permission constraints on Windows."
                ],
                "recommended_stack": "React (Vite) + FastAPI + SQLite"
            }
        elif system_prompt == PROMPT_PLANNER:
            return {
                "features": ["User Auth", "Data Dashboard", "Settings"],
                "architecture": "Client-Server React + FastAPI",
                "frontend_requirements": "React 18, TailwindCSS, Vite",
                "backend_requirements": "FastAPI, Uvicorn, Python 3.10+",
                "database_design": "Users Table, Projects Table"
            }
        elif system_prompt == PROMPT_FRONTEND:
            return {
                "components": [
                    {
                        "name": "App.jsx",
                        "code": "export default function App() {\n  return (\n    <div className=\"min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8\">\n      <div className=\"max-w-md w-full bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700\">\n        <h1 className=\"text-2xl font-bold mb-4 text-emerald-400\">Arora OS Workspace</h1>\n        <p className=\"text-slate-300 text-sm mb-6\">Your intelligent agent-to-editor pipeline is fully active.</p>\n        <div className=\"bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-500 border border-emerald-900/50\">\n          [SUCCESS] Code Writer Sync Active\n        </div>\n      </div>\n    </div>\n  );\n}"
                    }
                ]
            }
        elif system_prompt == PROMPT_BACKEND:
            return {
                "components": [
                    {
                        "name": "main.py",
                        "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/api/status\")\ndef read_status():\n    return {\"status\": \"online\", \"pipeline\": \"active\"}\n\n@app.get(\"/api/data\")\ndef read_data():\n    return {\"data\": []}\n"
                    }
                ],
                "api_endpoints": ["GET /api/status", "POST /api/data"],
                "database_schema": "CREATE TABLE users (id INT PRIMARY KEY, name TEXT);"
            }
        elif system_prompt == PROMPT_DOCS:
            return {
                "docs": "# Arora OS Project\n\nAutomated workspace generation successful.\n\n## Running the Project\n\n1. Start backend server:\n   ```bash\n   uvicorn main:app --reload\n   ```\n2. Start frontend dev environment:\n   ```bash\n   npm run dev\n   ```\n"
            }
        return {"error": "Unknown prompt in simulation mode."}
    
    # Real LLM Call logic below
    # Select the model and credentials based on the prompt
    model_id = "meta/llama-3.3-70b-instruct"
    api_key = None
    base_url = None

    if system_prompt == PROMPT_RESEARCH:
        model_id = "meta/llama-3.3-70b-instruct"
        api_key = os.getenv("PLANNER_API_KEY") or os.getenv("VITE_PLANNER_API_KEY")
        base_url = os.getenv("PLANNER_BASE_URL") or os.getenv("VITE_PLANNER_BASE_URL")
    elif system_prompt == PROMPT_PLANNER:
        model_id = "meta/llama-3.3-70b-instruct"
        api_key = os.getenv("PLANNER_API_KEY") or os.getenv("VITE_PLANNER_API_KEY")
        base_url = os.getenv("PLANNER_BASE_URL") or os.getenv("VITE_PLANNER_BASE_URL")
    elif system_prompt == PROMPT_FRONTEND:
        model_id = "meta/llama-3.3-70b-instruct"
        api_key = os.getenv("FRONTEND_API_KEY") or os.getenv("VITE_FRONTEND_API_KEY")
        base_url = os.getenv("FRONTEND_BASE_URL") or os.getenv("VITE_FRONTEND_BASE_URL")
    elif system_prompt == PROMPT_BACKEND:
        model_id = "meta/llama-3.3-70b-instruct"
        api_key = os.getenv("BACKEND_API_KEY") or os.getenv("VITE_BACKEND_API_KEY")
        base_url = os.getenv("BACKEND_BASE_URL") or os.getenv("VITE_BACKEND_BASE_URL")
    elif system_prompt == PROMPT_DOCS:
        model_id = "meta/llama-3.1-8b-instruct"
        api_key = os.getenv("DOCS_API_KEY") or os.getenv("VITE_DOCS_API_KEY")
        base_url = os.getenv("DOCS_BASE_URL") or os.getenv("VITE_DOCS_BASE_URL")

    if not api_key:
        return {"error": f"API_KEY not set for {model_id}. Mock response returned.", "raw_input": user_input[:50]}

    client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        
    last_error = None
    for attempt in range(retries):
        try:
            # Attempt with json_object formatting
            try:
                response = await client.chat.completions.create(
                    model=model_id,
                    response_format={ "type": "json_object" },
                    messages=[
                        {"role": "system", "content": system_prompt + "\n\nEnsure your ENTIRE response is valid JSON and nothing else."},
                        {"role": "user", "content": f"USER INPUT:\n{user_input}"}
                    ]
                )
            except Exception as format_err:
                print(f"Fallback: model does not support response_format type json_object: {format_err}")
                response = await client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": system_prompt + "\n\nEnsure your ENTIRE response is valid JSON and nothing else."},
                        {"role": "user", "content": f"USER INPUT:\n{user_input}"}
                    ]
                )
                
            text = response.choices[0].message.content
            try:
                text_cleaned = text.strip()
                if text_cleaned.startswith("```json"):
                    text_cleaned = text_cleaned[7:]
                elif text_cleaned.startswith("```"):
                    text_cleaned = text_cleaned[3:]
                if text_cleaned.endswith("```"):
                    text_cleaned = text_cleaned[:-3]
                parsed = json.loads(text_cleaned.strip())
                if isinstance(parsed, dict):
                    if "components" in parsed:
                        return parsed
                    elif all(isinstance(k, str) and isinstance(v, str) for k, v in parsed.items()):
                        return {"components": [{"name": k, "code": v} for k, v in parsed.items()]}
                return parsed
            except Exception as json_err:
                print(f"[call_llm_json] Direct parsing failed: {json_err}. Falling back to robust_parse_agent_output.")
                default_fn = "App.jsx"
                if system_prompt == PROMPT_BACKEND:
                    default_fn = "main.py"
                elif system_prompt == PROMPT_DOCS:
                    default_fn = "README.md"
                elif system_prompt == PROMPT_PLANNER:
                    default_fn = "planner_output.json"
                elif system_prompt == PROMPT_RESEARCH:
                    default_fn = "research_output.json"
                return robust_parse_agent_output(text, default_fn)
        except Exception as e:
            last_error = e
            print(f"LLM Error on attempt {attempt + 1}: {e}")
            
    # Final robust fallback on retry failures
    default_fn = "App.jsx"
    if system_prompt == PROMPT_BACKEND:
        default_fn = "main.py"
    elif system_prompt == PROMPT_DOCS:
        default_fn = "README.md"
    
    return robust_parse_agent_output(text if 'text' in locals() else "", default_fn)

