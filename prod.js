const { spawn } = require('child_process');

console.log('Starting CampusX ERP Production Servers...');

// Spawn node server.js
const server = spawn('node', ['server.js'], {
  stdio: 'inherit'
});

// Spawn next start on port 3000
const nextStart = spawn('npx', ['next', 'start', '-p', '3000'], {
  stdio: 'inherit'
});

let isCleaningUp = false;
function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log('\nShutting down production servers...');
  server.kill('SIGINT');
  nextStart.kill('SIGINT');
  setTimeout(() => {
    process.exit(0);
  }, 500);
}

server.on('exit', (code) => {
  if (!isCleaningUp) {
    console.log(`Backend server exited with code ${code}`);
    cleanup();
  }
});

nextStart.on('exit', (code) => {
  if (!isCleaningUp) {
    console.log(`Next.js production server exited with code ${code}`);
    cleanup();
  }
});

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGHUP', cleanup);
