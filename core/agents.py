import os
import json
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

# Set this to False to use real LLM calls (e.g. OpenRouter, NVIDIA)
SIMULATION_MODE = os.getenv("SIMULATION_MODE", "True").lower() in ("true", "1", "yes")

# API Keys and URLs are loaded dynamically per agent inside call_llm_json

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
  "api_endpoints": ["GET /...", "POST /..."],
  "database_schema": "...",
  "backend_code": "..."
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
        
        if system_prompt == PROMPT_PLANNER:
            return {
                "features": ["User Auth", "Data Dashboard", "Settings"],
                "architecture": "Client-Server React + FastAPI",
                "frontend_requirements": "React 18, TailwindCSS, Vite",
                "backend_requirements": "FastAPI, Uvicorn, Python 3.10+",
                "database_design": "Users Table, Projects Table"
            }
        elif system_prompt == PROMPT_FRONTEND:
            return {
                "frontend_code": "export default function App() { return <div className='p-4 text-xl'>Hello from Arora Labs UI</div>; }"
            }
        elif system_prompt == PROMPT_BACKEND:
            return {
                "api_endpoints": ["GET /api/status", "POST /api/data"],
                "backend_code": "@app.get('/api/status')\ndef status(): return {'ok': True}",
                "database_schema": "CREATE TABLE users (id INT PRIMARY KEY, name TEXT);"
            }
        elif system_prompt == PROMPT_DOCS:
            return {
                "docs": "# Arora Project\n\nRun the backend with `uvicorn main:app` and frontend with `npm run dev`."
            }
        return {"error": "Unknown prompt in simulation mode."}
    
    # Real LLM Call logic below
    # Select the model and credentials based on the prompt
    model_id = "meta/llama-3.3-70b-instruct"
    api_key = None
    base_url = None

    if system_prompt == PROMPT_PLANNER:
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
            # Clean up markdown code blocks if present
            text_cleaned = text.strip()
            if text_cleaned.startswith("```json"):
                text_cleaned = text_cleaned[7:]
            elif text_cleaned.startswith("```"):
                text_cleaned = text_cleaned[3:]
            if text_cleaned.endswith("```"):
                text_cleaned = text_cleaned[:-3]
                
            return json.loads(text_cleaned.strip())
        except Exception as e:
            last_error = e
            print(f"LLM Error on attempt {attempt + 1}: {e}")
            
    return {"error": str(last_error), "raw_response": text if 'text' in locals() else None}
