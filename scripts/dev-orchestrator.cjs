const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

const children = [];

function startProcess(name, command, args, cwd, extraEnv = {}) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...extraEnv },
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal !== 'SIGTERM' && signal !== 'SIGINT') {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  children.push(child);
  return child;
}

const backendPort = process.env.BACKEND_PORT || '5000';

startProcess('backend', process.execPath, ['src/server.js'], backendDir, {
  PORT: backendPort,
});

startProcess(
  'frontend',
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'dev'],
  frontendDir,
  {
    VITE_BACKEND_PROXY_TARGET: `http://127.0.0.1:${backendPort}`,
  }
);

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
