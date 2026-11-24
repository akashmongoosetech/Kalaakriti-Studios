const { spawn, spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

function canResolve(specifier, searchPaths) {
  try {
    require.resolve(specifier, { paths: searchPaths });
    return true;
  } catch {
    return false;
  }
}

function ensureDependenciesInstalled() {
  const hasBackendDeps = canResolve('express', [backendDir, rootDir]);
  const hasFrontendDeps = canResolve('vite/package.json', [frontendDir, rootDir]);

  if (hasBackendDeps && hasFrontendDeps) {
    return;
  }

  console.log('[dev] Installing workspace dependencies for frontend and backend...');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCmd, ['install', '--no-audit', '--no-fund'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    console.error('[dev] Failed to install workspace dependencies.');
    process.exit(result.status || 1);
  }
}

ensureDependenciesInstalled();

const vitePkgPath = require.resolve('vite/package.json', {
  paths: [frontendDir, rootDir],
});
const vitePkg = require(vitePkgPath);
const viteBinRel = typeof vitePkg.bin === 'string' ? vitePkg.bin : vitePkg.bin.vite;
const viteBin = path.resolve(path.dirname(vitePkgPath), viteBinRel);

const children = [];
let shuttingDown = false;

function startProcess(name, command, args, cwd, extraEnv = {}) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...extraEnv },
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown && code !== 0 && signal !== 'SIGTERM' && signal !== 'SIGINT') {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  children.push(child);
  return child;
}

const backendPort = process.env.BACKEND_PORT || '5000';
const frontendPort = process.env.FRONTEND_PORT || '3000';

startProcess('backend', process.execPath, ['src/server.js'], backendDir, {
  PORT: backendPort,
});

startProcess(
  'frontend',
  process.execPath,
  [viteBin, '--port', frontendPort, '--host', '0.0.0.0'],
  frontendDir,
  {
    VITE_BACKEND_PROXY_TARGET: `http://127.0.0.1:${backendPort}`,
  }
);

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
