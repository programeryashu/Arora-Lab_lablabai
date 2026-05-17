import os
import json
import time

BASE_PROJECTS_DIR = "generated_projects"

def safe_write_file(filepath: str, content: str, retries: int = 3, delay: float = 0.5) -> bool:
    """Safely writes a file to disk with retries to handle lock contention, permission issues, or temporary IO errors."""
    for attempt in range(retries):
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"[FILE_WRITER_SUCCESS] Wrote file: {filepath}")
            return True
        except PermissionError as pe:
            print(f"[FILE_WRITER_ERROR] Permission denied when writing to {filepath} (Attempt {attempt + 1}/{retries}): {pe}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise Exception(f"Permission denied: {pe}. Please check write permissions for {filepath}.")
        except FileNotFoundError as fnfe:
            print(f"[FILE_WRITER_ERROR] Directory path not found: {fnfe} (Attempt {attempt + 1}/{retries})")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise fnfe
        except Exception as e:
            print(f"[FILE_WRITER_ERROR] Error writing {filepath} (Attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise e
    return False


def init_project_dir(project_id: str) -> str:
    """Creates a directory for the new project and returns its path."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    os.makedirs(project_path, exist_ok=True)
    return project_path

def write_frontend_code(project_id: str, frontend_output: dict):
    """Writes the frontend components to the project directory."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id, "frontend", "src")
    
    components = frontend_output.get("components", [])
    if not components and "frontend_code" in frontend_output:
        # Fallback for old/simple formats
        components = [{"name": "App.jsx", "code": frontend_output["frontend_code"]}]
        
    for comp in components:
        filename = comp.get("name")
        code = comp.get("code")
        if filename and code:
            filepath = os.path.join(project_path, filename)
            safe_write_file(filepath, code)

def write_backend_code(project_id: str, backend_output: dict):
    """Writes the backend code to the project directory."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id, "backend")
    
    components = backend_output.get("components", [])
    if not components:
        code = backend_output.get("backend_code")
        if code:
            components = [{"name": "main.py", "code": code}]
            
    for comp in components:
        filename = comp.get("name")
        code = comp.get("code")
        if filename and code:
            filepath = os.path.join(project_path, filename)
            safe_write_file(filepath, code)

def write_docs(project_id: str, docs_output: dict):
    """Writes the README.md to the project root."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    filepath = os.path.join(project_path, "README.md")
    
    readme_content = docs_output.get("docs") or docs_output.get("readme")
    if not readme_content:
        # Construct README.md from components/fields
        readme_content = f"# {docs_output.get('project_name', 'Arora Project')}\n\n"
        readme_content += f"{docs_output.get('description', '')}\n\n"
        readme_content += "## Setup Instructions\n\n"
        readme_content += f"{docs_output.get('setup_instructions', '')}\n\n"
        readme_content += "## Features\n\n"
        for feature in docs_output.get('features', []):
            readme_content += f"- {feature}\n"
        readme_content += "\n## Usage\n\n"
        readme_content += f"{docs_output.get('usage', '')}\n\n"
        readme_content += "## Tech Stack\n\n"
        for tech in docs_output.get('tech_stack', []):
            readme_content += f"- {tech}\n"
            
    safe_write_file(filepath, readme_content)

def write_planner_output(project_id: str, planner_output: dict):
    """Writes the planner output JSON for reference."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    filepath = os.path.join(project_path, "planner_output.json")
    
    safe_write_file(filepath, json.dumps(planner_output, indent=2))

