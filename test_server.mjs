import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 31000 + (process.pid % 1000);
const child = spawn(process.execPath, ['server.js'], {
  cwd: new URL('.', import.meta.url),
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

async function waitForReady() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/readyz`);
      if (response.status === 200) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('server did not become ready');
}

try {
  await waitForReady();
  assert.equal((await fetch(`http://127.0.0.1:${port}/healthz`)).status, 200);
  assert.equal((await fetch(`http://127.0.0.1:${port}/readyz`)).status, 200);
  child.kill('SIGTERM');
  await new Promise(resolve => child.once('exit', resolve));
  assert.equal(child.exitCode, 0);
  console.log('probe contract: PASS');
} finally {
  if (!child.killed) child.kill('SIGKILL');
}
