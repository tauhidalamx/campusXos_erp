const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting CampusX ERP Dev Servers...');

// 1. Spawn node server.js
const server = spawn('node', ['server.js'], {
  stdio: 'inherit'
});

// 2. Spawn next dev server via local npx on port 3000
const nextDev = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit'
});

// 3. Resolve Virtualenv Python path cross-platform
let pythonPath = path.join(__dirname, '.venv', 'bin', 'python');
if (process.platform === 'win32') {
  pythonPath = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
} else if (!fs.existsSync(pythonPath)) {
  pythonPath = path.join(__dirname, '.venv', 'bin', 'python3');
}

console.log(`Resolved Kivy Python runtime path: ${pythonPath}`);

// 4. Spawn Kivy Desktop Client App
const kivyClient = process.env.NO_KIVY ? null : spawn(pythonPath, ['campusx_desktop_mobile/main.py'], {
  stdio: 'inherit'
});

let isCleaningUp = false;
function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log('\nShutting down dev servers and Kivy client...');
  server.kill('SIGINT');
  nextDev.kill('SIGINT');
  if (kivyClient) {
    try {
      kivyClient.kill('SIGINT');
    } catch (e) {}
  }
  // Wait a moment before exiting to let children clean up
  setTimeout(() => {
    process.exit(0);
  }, 500);
}

// Handle child exits
server.on('exit', (code) => {
  if (!isCleaningUp) {
    console.log(`Backend server exited with code ${code}`);
    cleanup();
  }
});

nextDev.on('exit', (code) => {
  if (!isCleaningUp) {
    console.log(`Next.js dev server exited with code ${code}`);
    cleanup();
  }
});

if (kivyClient) {
  kivyClient.on('exit', (code) => {
    if (!isCleaningUp) {
      console.log(`Kivy desktop client exited with code ${code}`);
      cleanup();
    }
  });
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGHUP', cleanup);

