import os
import json

BASE_PROJECTS_DIR = "generated_projects"

def init_project_dir(project_id: str) -> str:
    """Creates a directory for the new project and returns its path."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    os.makedirs(project_path, exist_ok=True)
    return project_path

def write_frontend_code(project_id: str, frontend_output: dict):
    """Writes the frontend components to the project directory."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id, "frontend", "src")
    os.makedirs(project_path, exist_ok=True)
    
    components = frontend_output.get("components", [])
    for comp in components:
        filename = comp.get("name")
        code = comp.get("code")
        if filename and code:
            filepath = os.path.join(project_path, filename)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(code)

def write_backend_code(project_id: str, backend_output: dict):
    """Writes the backend code to the project directory."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id, "backend")
    os.makedirs(project_path, exist_ok=True)
    
    code = backend_output.get("backend_code")
    if code:
        # Assuming single file output for now based on prompt. 
        # Can be enhanced to handle multiple files.
        filepath = os.path.join(project_path, "main.py")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(code)

def write_docs(project_id: str, docs_output: dict):
    """Writes the README.md to the project root."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    os.makedirs(project_path, exist_ok=True)
    
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
        
    filepath = os.path.join(project_path, "README.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(readme_content)

def write_planner_output(project_id: str, planner_output: dict):
    """Writes the planner output JSON for reference."""
    project_path = os.path.join(BASE_PROJECTS_DIR, project_id)
    os.makedirs(project_path, exist_ok=True)
    
    filepath = os.path.join(project_path, "planner_output.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(planner_output, f, indent=2)
