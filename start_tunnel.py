import subprocess
import sys
import os
import time
import re
import threading

def print_banner(title, color_code="36"):
    """Prints a beautiful colored terminal banner."""
    print(f"\033[1;{color_code}m" + "="*60 + "\033[0m")
    print(f"\033[1;{color_code}m{title.center(60)}\033[0m")
    print(f"\033[1;{color_code}m" + "="*60 + "\033[0m")

def stream_logs(process, prefix, color_code):
    """Streams logs from a subprocess to the console with a colored prefix."""
    for line in iter(process.stdout.readline, ''):
        if line:
            print(f"\033[1;{color_code}m[{prefix}]\033[0m {line.strip()}")

def main():
    print_banner("ARORA LABS — EXPOSING BACKEND ONLINE", "35")
    
    # 1. Determine the Python executable to use
    venv_python = os.path.join(".venv", "Scripts", "python.exe") if sys.platform == "win32" else os.path.join(".venv", "bin", "python")
    python_cmd = venv_python if os.path.exists(venv_python) else "python"
    
    print(f"[*] Using Python executable: {python_cmd}")
    
    # 2. Start the FastAPI backend
    print("[*] Starting FastAPI Backend on port 8000...")
    backend_proc = subprocess.Popen(
        [python_cmd, "main.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        shell=(sys.platform == "win32")
    )
    
    # 3. Start localtunnel
    print("[*] Launching localtunnel secure tunnel...")
    # Using 'npx -y localtunnel' to bypass any interactive npm installation prompts
    tunnel_proc = subprocess.Popen(
        ["npx", "-y", "localtunnel", "--port", "8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        shell=(sys.platform == "win32")
    )
    
    # 4. Wait for localtunnel to assign a public URL
    public_url = None
    websocket_url = None
    timeout = 15  # seconds
    start_time = time.time()
    
    print("[*] Acquiring public tunnel URL (this may take a few seconds)...")
    while time.time() - start_time < timeout:
        line = tunnel_proc.stdout.readline()
        if line:
            print(f"\033[90m[tunnel-setup]\033[0m {line.strip()}")
            match = re.search(r"your url is:\s*(https?://[^\s]+)", line, re.IGNORECASE)
            if match:
                public_url = match.group(1)
                websocket_url = public_url.replace("http://", "ws://").replace("https://", "wss://")
                break
        time.sleep(0.1)
        
    if not public_url:
        print_banner("!!! FAILED TO START SECURE TUNNEL !!!", "31")
        print("[!] Localtunnel did not return a public URL within 15 seconds.")
        print("[!] Please check if you have Node.js / npx installed and network access.")
        backend_proc.terminate()
        tunnel_proc.terminate()
        sys.exit(1)
        
    # 5. Display the beautiful online endpoints banner
    print_banner("=== ARORA LABS BACKEND IS ONLINE! ===", "32")
    print(f" \033[1;32m[+] REST API URL: \033[0;36m{public_url}\033[0m")
    print(f" \033[1;32m[+] WebSocket:    \033[0;36m{websocket_url}\033[0m")
    print("\033[1;33m[*] Instructions: Paste the REST API URL above into your frontend's .env file as VITE_API_BASE_URL,\033[0m")
    print("\033[1;33m    and the WebSocket URL as VITE_WS_BASE_URL to connect them securely!\033[0m")
    print_banner("STREAMING SERVER LOGS", "34")
    
    # 6. Stream logs from both subprocesses in separate threads
    backend_thread = threading.Thread(target=stream_logs, args=(backend_proc, "FASTAPI", "34"), daemon=True)
    tunnel_thread = threading.Thread(target=stream_logs, args=(tunnel_proc, "TUNNEL", "35"), daemon=True)
    
    backend_thread.start()
    tunnel_thread.start()
    
    try:
        # Keep the main thread alive while subprocesses are running
        while backend_proc.poll() is None and tunnel_proc.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\033[1;33m\n[!] KeyboardInterrupt received. Shutting down servers and closing tunnel...\033[0m")
    finally:
        backend_proc.terminate()
        tunnel_proc.terminate()
        print("\033[1;32m[+] Servers shut down successfully.\033[0m")

if __name__ == "__main__":
    main()
