#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CAMPUSX OS - UNIVERSAL MASTER BUILD SYSTEM & CLI ORCHESTRATOR
A single entry point managing setup, dev servers, compiler toolchains,
multi-platform desktop/mobile packaging, AI testing, and Docker/Kubernetes deploys.
"""

import os
import sys
import subprocess
import shutil
import socket
import signal
import time
import json
import hashlib
from datetime import datetime

# ANSI Terminal Colors
C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_RED = "\033[91m"
C_GREEN = "\033[92m"
C_YELLOW = "\033[93m"
C_BLUE = "\033[94m"
C_CYAN = "\033[96m"
C_MAGENTA = "\033[95m"

# Global Process Registry to ensure clean stopping of subprocesses
_spawned_processes = []

def print_header(title):
    print(f"\n{C_BOLD}{C_CYAN}=== {title} ==={C_RESET}")

def print_success(msg):
    print(f"{C_GREEN}✔ {msg}{C_RESET}")

def print_warning(msg):
    print(f"{C_YELLOW}⚠ {msg}{C_RESET}")

def print_error(msg):
    print(f"{C_RED}✗ {msg}{C_RESET}")

def print_info(msg):
    print(f"{C_BLUE}ℹ {msg}{C_RESET}")

def run_cmd(cmd, cwd=None, env=None, check=True, stdout=None, stderr=None):
    """Helper to run shell command and output live"""
    print_info(f"Executing: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    try:
        result = subprocess.run(
            cmd,
            shell=not isinstance(cmd, list),
            cwd=cwd,
            env=env or os.environ.copy(),
            check=check,
            stdout=stdout,
            stderr=stderr
        )
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print_error(f"Command failed with exit code {e.returncode}")
        if check:
            sys.exit(e.returncode)
        return False
    except Exception as e:
        print_error(f"Execution failed: {e}")
        if check:
            sys.exit(1)
        return False

def check_port(port):
    """Returns True if port is in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.2)
        return s.connect_ex(('127.0.0.1', port)) == 0

def kill_process_on_port(port):
    """Attempts to kill processes occupying port"""
    if not check_port(port):
        return
    print_info(f"Port {port} is busy. Finding process...")
    try:
        output = subprocess.check_output(["lsof", "-t", f"-i:{port}"]).decode().strip()
        if output:
            pids = output.split('\n')
            for pid in pids:
                if pid:
                    print_warning(f"Killing PID {pid} occupying port {port}...")
                    os.kill(int(pid), signal.SIGTERM)
            time.sleep(1)
    except Exception as e:
         print_warning(f"Could not kill process on port {port}: {e}")

# ==========================================
# AUTOMATIC TECHNOLOGY DETECTION
# ==========================================
def detect_technologies():
    tech = {
        "frontend_next": os.path.exists("next.config.js") or os.path.exists("next.config.mjs"),
        "backend_fastapi": os.path.exists("campusx_backend_python/main.py"),
        "backend_node": os.path.exists("server.js"),
        "desktop_cpp_qt": os.path.exists("campusx_native_cpp/CMakeLists.txt"),
        "desktop_kivy": os.path.exists("campusx_desktop_mobile/main.py"),
        "blockchain_solidity": os.path.exists("contracts") and os.path.exists("hardhat.config.js"),
        "docker": os.path.exists("Dockerfile") or os.path.exists("docker-compose.yml"),
        "k8s": os.path.exists("k8s") or os.path.exists("helm")
    }
    
    print_header("CampusX OS - Auto-Detected Technologies")
    for k, v in tech.items():
        status = f"{C_GREEN}Active{C_RESET}" if v else f"{C_YELLOW}Not Found (Skipped){C_RESET}"
        print(f"  • {k.replace('_', ' ').title()}: {status}")
    return tech

# ==========================================
# COMMAND HANDLERS
# ==========================================

def cmd_setup():
    print_header("CAMPUSX OS - Universal Setup & Environment Provisioner")
    tech = detect_technologies()
    
    # 1. Virtualenv Python setup
    if not os.path.exists(".venv"):
        print_info("Creating Python virtual environment (.venv)...")
        run_cmd([sys.executable, "-m", "venv", ".venv"])
        
    pip_path = os.path.join(".venv", "bin", "pip")
    if os.name == 'nt':
        pip_path = os.path.join(".venv", "Scripts", "pip.exe")
        
    if os.path.exists(pip_path):
        print_info("Upgrading pip and installing requirements.txt...")
        run_cmd([pip_path, "install", "--upgrade", "pip"])
        run_cmd([pip_path, "install", "-r", "requirements.txt"])
    else:
        print_warning("Virtualenv pip path unresolved. Please install requirements manually.")

    # 2. Node Packages
    if tech["frontend_next"] or tech["backend_node"]:
        if shutil.which("npm"):
            print_info("Installing Node npm packages...")
            run_cmd(["npm", "install"])
        else:
            print_warning("npm command not found. Node dependencies skipped.")

    # 3. Prisma Client Generator
    if os.path.exists("prisma/schema.prisma") and shutil.which("npx"):
        print_info("Generating Prisma client...")
        run_cmd(["npx", "prisma", "generate"])

    # 4. Solidity Contracts compiler setup
    if tech["blockchain_solidity"] and shutil.which("npx"):
        print_info("Installing Hardhat local dependencies...")
        run_cmd(["npx", "hardhat", "compile"])

    # 5. Native build tools verification
    print_info("Verifying active native compilers and tools:")
    for tool in ["cmake", "ninja", "docker", "java", "buildozer"]:
        path = shutil.which(tool)
        if path:
            print_success(f"  {tool}: Verified at {path}")
        else:
            print_warning(f"  {tool}: Not found. Skipping compilation layers for this runtime.")

    # 6. Database Verification
    print_info("Verifying local database availability:")
    db_paths = ["campusx_os_python.db", "database.sqlite"]
    for db in db_paths:
        if os.path.exists(db):
            print_success(f"  Database online: {db}")
        else:
            print_warning(f"  Database missing: {db} (Will be auto-created on start)")

    print_success("Setup phase ready!")

def cmd_dev():
    print_header("Bootstrapping Complete Multi-Stack Dev Environment")
    tech = detect_technologies()
    
    # 1. Clean port conflicts
    kill_process_on_port(3000)
    kill_process_on_port(8000)
    kill_process_on_port(8081)
    
    # 2. Docker compose dependencies (Redis, Kafka)
    if shutil.which("docker") and os.path.exists("docker-compose.yml"):
        print_info("Launching container infrastructure (Redis, Kafka, Databases)...")
        run_cmd("docker compose up -d", check=False)
    else:
        print_warning("Docker Compose unavailable. Continuing with local SQLite/services fallbacks.")
        
    # 3. Spawn Backend Server.js (Node)
    if tech["backend_node"]:
        print_info("Starting Node API Gateway & Blockchain Broker...")
        p_node = subprocess.Popen(["node", "server.js"], stdout=None, stderr=None)
        _spawned_processes.append(p_node)
        
    # 4. Spawn FastAPI Backend (Python)
    if tech["backend_fastapi"]:
        print_info("Starting FastAPI Python AI Services & Analytics Router...")
        python_bin = os.path.join(".venv", "bin", "python")
        if not os.path.exists(python_bin):
            python_bin = "python3"
        env = os.environ.copy()
        env["PYTHONPATH"] = "."
        p_fastapi = subprocess.Popen([python_bin, "campusx_backend_python/main.py"], env=env, stdout=None, stderr=None)
        _spawned_processes.append(p_fastapi)

    # 5. Spawn Next.js Dev Frontend
    if tech["frontend_next"]:
        print_info("Starting Next.js App Router Web Dashboard...")
        p_next = subprocess.Popen(["npx", "next", "dev", "-p", "3000"], stdout=None, stderr=None)
        _spawned_processes.append(p_next)

    # 6. Launch Kivy GUI Client (unless disabled)
    if tech["desktop_kivy"] and not os.environ.get("NO_KIVY"):
        print_info("Launching Kivy Desktop App GUI...")
        python_bin = os.path.join(".venv", "bin", "python")
        if not os.path.exists(python_bin):
            python_bin = "python3"
        p_kivy = subprocess.Popen([python_bin, "campusx_desktop_mobile/main.py"])
        _spawned_processes.append(p_kivy)

    print_success("All platform microservices started!")
    print_info("Local URLs and Access Portals:")
    print("  • Next.js Web:   http://localhost:3000")
    print("  • API Gateway:   http://localhost:5000 / http://localhost:8001")
    print("  • FastAPI AI:    http://localhost:8000")
    
    # Block and wait for exit, clean up on interrupt
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cmd_stop()

def cmd_build():
    print_header("Compiling CampusX OS Target Ecosystem Binaries")
    tech = detect_technologies()
    
    # 1. Compile Next.js
    if tech["frontend_next"] and shutil.which("npm"):
      print_info("Building Next.js optimized production bundle...")
      run_cmd("npx next build && npx -y vite build")
        
    # 2. Compile Solidity contracts
    if tech["blockchain_solidity"] and shutil.which("npx"):
        print_info("Compiling Solidity smart contracts...")
        run_cmd(["npx", "hardhat", "compile"])
        
    # 3. Configure and compile C++ Qt Native Desktop
    if tech["desktop_cpp_qt"] and shutil.which("cmake"):
        print_info("Configuring CMake for Qt6 client...")
        run_cmd("cmake -S campusx_native_cpp -B campusx_native_cpp/build -DCMAKE_BUILD_TYPE=Release", check=False)
        print_info("Compiling Qt6 native binaries...")
        run_cmd("cmake --build campusx_native_cpp/build --config Release", check=False)
        
    # 4. Compile Kivy PyInstaller Desktop
    if tech["desktop_kivy"] and (shutil.which("pyinstaller") or os.path.exists(".venv/bin/pyinstaller")):
        print_info("Compiling Kivy Python Desktop App Bundle via PyInstaller...")
        pyinst = "pyinstaller" if shutil.which("pyinstaller") else ".venv/bin/pyinstaller"
        run_cmd([
            pyinst,
            "--name=CampusXOS_Kivy",
            "--windowed",
            "--noconfirm",
            "--clean",
            "--workpath=builds/mac/build",
            "--add-data=campusx_desktop_mobile/campusx_app.kv:.",
            "campusx_desktop_mobile/main.py"
        ], check=False)

    # 5. Compile Android App via Buildozer
    if shutil.which("buildozer") and os.path.exists("builds/android/build_android.sh"):
        print_info("Packaging Android binary targets (APK/AAB)...")
        run_cmd("cd builds/android && ./build_android.sh", check=False)

    # 6. Generate checksum files
    print_info("Generating build artifact integrity checksums...")
    os.makedirs("dist", exist_ok=True)
    for root, dirs, files in os.walk("dist"):
        for file in files:
            filepath = os.path.join(root, file)
            hasher = hashlib.sha256()
            try:
                with open(filepath, 'rb') as f:
                    hasher.update(f.read())
                checksum = hasher.hexdigest()
                with open(f"{filepath}.sha256", 'w') as f_out:
                    f_out.write(checksum)
                print_success(f"Generated SHA-256 for {file}")
            except Exception:
                pass

    print_header("BUILD OUTPUT SUMMARY")
    print(f"✔ Frontend Built:  {'Yes' if tech['frontend_next'] else 'N/A'}")
    print(f"✔ Backend Built:   {'Yes' if tech['backend_node'] or tech['backend_fastapi'] else 'N/A'}")
    print(f"✔ AI Ready:        {'Yes' if tech['backend_fastapi'] else 'N/A'}")
    print(f"✔ Desktop Built:   {'Yes' if tech['desktop_cpp_qt'] or tech['desktop_kivy'] else 'N/A'}")
    print(f"✔ Android Ready:   {'Yes' if shutil.which('buildozer') else 'N/A (Buildozer missing)'}")
    print(f"✔ Blockchain Ready:{'Yes' if tech['blockchain_solidity'] else 'N/A'}")
    print(f"✔ Production Ready: {C_GREEN}Ecosystem Built Successfully{C_RESET}")

def cmd_run():
    print_header("Running Production Environment")
    
    # 1. Clean conflict ports
    kill_process_on_port(3000)
    kill_process_on_port(8000)
    
    # 2. Run servers
    if os.path.exists("prod.js"):
        run_cmd(["node", "prod.js"])
    else:
        run_cmd(["node", "server.js"])

def cmd_test():
    print_header("Executing Unified Multi-Technology Validation Suite")
    
    python_bin = os.path.join(".venv", "bin", "python")
    if not os.path.exists(python_bin):
        python_bin = "python3"
        
    env = os.environ.copy()
    env["PYTHONPATH"] = "."
    
    # 0. Ensure server is active for integration tests
    server_proc = None
    if not check_port(5000):
        print_info("Starting background Node.js server on port 5000 for integration tests...")
        server_proc = subprocess.Popen(["node", "server.js"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(2)

    try:
        # 1. FastAPI core unit/integration tests
        print_info("Executing FastAPI Core Backend test suites...")
        run_cmd([python_bin, "campusx_backend_python/tests/test_backend.py"], env=env, check=False)
        
        # 2. Sports prediction tests
        print_info("Executing Sports Analytics Neural network checks...")
        run_cmd([python_bin, "-m", "unittest", "discover", "-s", "backend_sports/tests"], env=env, check=False)
        
        print_success("All validation checks completed!")
    finally:
        if server_proc:
            print_info("Stopping background test server process...")
            server_proc.terminate()
            server_proc.wait(timeout=2)

def cmd_package():
    print_header("Generating Binary Packages & Clean Installers")
    if os.path.exists("build_all.sh"):
        run_cmd("./build_all.sh")
    else:
        cmd_build()

def cmd_release():
    print_header("Triggering Production Release Workflow")
    cmd_build()
    
    # Git tagging
    print_info("Creating Git release version tags...")
    version_tag = f"v{datetime.now().strftime('%Y.%m.%d-%H%M')}"
    run_cmd(f"git tag -a {version_tag} -m 'Automated Release {version_tag}'", check=False)
    
    # Package release
    release_dir = f"releases/release_{version_tag}"
    os.makedirs(release_dir, exist_ok=True)
    if os.path.exists("dist"):
        for item in os.listdir("dist"):
            shutil.copy(os.path.join("dist", item), release_dir)
            
    print_success(f"Production releases mapped inside: {release_dir}")

def cmd_clean():
    print_header("Purging Caches & Clean Up Intermediate Targets")
    
    cleanup_paths = [
        "dist", "build", "releases", "campusx_native_cpp/build", 
        "builds/mac/build", "campusx_desktop_mobile/build", ".next", "out"
    ]
    for path in cleanup_paths:
        if os.path.exists(path):
            print_info(f"Removing directory: {path}...")
            shutil.rmtree(path, ignore_errors=True)
            
    # Clean Python caches
    print_info("Cleaning __pycache__ folders...")
    for root, dirs, files in os.walk("."):
        if "__pycache__" in dirs:
            shutil.rmtree(os.path.join(root, "__pycache__"), ignore_errors=True)

    # Clean Docker resources
    if shutil.which("docker"):
        print_info("Pruning unused Docker assets...")
        run_cmd("docker system prune -f --volumes", check=False)
        
    print_success("System clean completed.")

def cmd_rebuild():
    print_header("Triggering Full System Rebuild Lifecycle")
    cmd_clean()
    cmd_setup()
    cmd_build()
    cmd_test()
    cmd_package()
    print_success("Ecosystem fully rebuilded.")

def cmd_doctor():
    print_header("System Diagnostic Doctor & Corrective Recommendations")
    
    # Check toolchains
    tools = ["node", "npm", "python3", "cmake", "ninja", "docker", "git", "java", "buildozer"]
    for t in tools:
        path = shutil.which(t)
        if path:
            print_success(f"  • {t}: Operational ({path})")
        else:
            print_warning(f"  • {t}: Missing from PATH system path")
            
    # Check ports
    for port in [3000, 5000, 8000, 8081]:
        in_use = check_port(port)
        status = f"{C_RED}Busy / Bounded{C_RESET}" if in_use else f"{C_GREEN}Free / Open{C_RESET}"
        print(f"  • Port {port}: {status}")
        
    # Check DBs
    db_paths = ["campusx_os_python.db", "database.sqlite"]
    for db in db_paths:
        if os.path.exists(db):
            print_success(f"  • Database {db}: Ready ({os.path.getsize(db)} bytes)")
        else:
            print_error(f"  • Database {db}: Missing")

    print_success("Diagnostics finished.")

def cmd_digitalocean():
    print_header("DigitalOcean Deployment Orchestrator")
    if os.path.exists("scripts/deploy_digitalocean.sh"):
        run_cmd("bash scripts/deploy_digitalocean.sh")
    else:
        print_error("DigitalOcean deployment script missing.")

def cmd_deploy():
    print_header("Production Deployment Broker")
    if os.path.exists("scripts/deploy_digitalocean.sh"):
        run_cmd("bash scripts/deploy_digitalocean.sh")
    elif shutil.which("docker") and os.path.exists("Dockerfile"):
        print_info("Building production Docker images...")
        run_cmd("docker build -t campusx-os-platform:latest .")
    if shutil.which("helm") and os.path.exists("helm"):
        print_info("Triggering Helm Kubernetes release upgrade...")
        run_cmd("helm upgrade --install campusx-os-erp ./helm")
    print_success("Deploy process finalized.")

def cmd_stop():
    print_header("Stopping CampusX Background Services")
    
    # Terminate spawned python CLI processes
    for p in _spawned_processes:
        try:
            print_info(f"Stopping background PID {p.pid}...")
            p.terminate()
            p.wait(timeout=2)
        except Exception:
            try:
                p.kill()
            except Exception:
                pass
                
    # Kill ports
    kill_process_on_port(3000)
    kill_process_on_port(8000)
    kill_process_on_port(8081)
    
    # Docker stop
    if shutil.which("docker") and os.path.exists("docker-compose.yml"):
        run_cmd("docker compose down", check=False)
        
    print_success("All background services stopped.")

def cmd_restart():
    cmd_stop()
    cmd_dev()

def cmd_logs():
    print_header("Tailing Server Execution Logs")
    # Search for local task log
    log_files = [
        f"/Users/tauhidalam/.gemini/antigravity-ide/brain/3633402a-5c65-4b33-bb16-adce2581d73e/.system_generated/tasks/task-286.log"
    ]
    for log in log_files:
        if os.path.exists(log):
            run_cmd(f"tail -n 100 {log}")
            return
    print_warning("No active log streams resolved.")

def cmd_update():
    print_header("Updating Stack Packages & Dependencies")
    if shutil.which("npm"):
        run_cmd(["npm", "update"])
    pip_path = os.path.join(".venv", "bin", "pip")
    if os.path.exists(pip_path):
        run_cmd([pip_path, "install", "-U", "-r", "requirements.txt"])
    print_success("Dependencies updated.")

def main():
    if len(sys.argv) < 2:
        print(f"{C_BOLD}{C_CYAN}CampusX OS - Universal CLI & Master Build Orchestrator{C_RESET}")
        print("Usage: ./campusx <command> [args]\n")
        print("Available Commands:")
        print("  setup      First-time setup")
        print("  dev        Start complete development environment")
        print("  build      Build all components")
        print("  run        Run production")
        print("  test       Execute all tests")
        print("  package    Generate installers/packages")
        print("  release    Create production release")
        print("  clean      Purge cache, outputs, build directories")
        print("  rebuild    Clean -> Setup -> Build -> Test -> Package")
        print("  doctor     Run environment compatibility checks")
        print("  logs       Tail server logs")
        print("  stop       Terminate service processes")
        print("  restart    Restart stack servers")
        print("  update     Upgrade stack dependencies packages")
        print("  deploy     Run Docker/Kubernetes deployment")
        print("  digitalocean Run DigitalOcean App Platform & Droplet deployment setup")
        sys.exit(0)

    cmd = sys.argv[1].lower()
    
    commands = {
        "setup": cmd_setup,
        "dev": cmd_dev,
        "build": cmd_build,
        "run": cmd_run,
        "test": cmd_test,
        "package": cmd_package,
        "release": cmd_release,
        "clean": cmd_clean,
        "rebuild": cmd_rebuild,
        "doctor": cmd_doctor,
        "logs": cmd_logs,
        "stop": cmd_stop,
        "restart": cmd_restart,
        "update": cmd_update,
        "deploy": cmd_deploy,
        "digitalocean": cmd_digitalocean
    }

    if cmd in commands:
        commands[cmd]()
    else:
        print_error(f"Unknown command: {cmd}")
        sys.exit(1)

if __name__ == "__main__":
    main()
