#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, openSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function pidExists(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path) {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw);
}

async function waitForReady(url, timeoutMs) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status >= 200 && response.status < 500) {
        return true;
      }
    } catch {
      // Keep waiting.
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }
  return false;
}

async function stopFromRuntime(runtimeFile) {
  if (!existsSync(runtimeFile)) {
    return { stopped: false, reason: 'runtime file not found', runtimeFile };
  }

  const runtime = await readJson(runtimeFile);
  if (pidExists(runtime.pid)) {
    try {
      process.kill(runtime.pid, 'SIGTERM');
    } catch {
      // Ignore.
    }
  }

  await rm(runtimeFile, { force: true });
  return {
    stopped: true,
    runtimeFile,
    pid: runtime.pid,
    port: runtime.port,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = resolve(args['repo-root'] ?? process.cwd());
  const branch = args.branch ?? 'unknown-branch';
  const host = args.host ?? '127.0.0.1';
  const timeoutMs = Number(args['timeout-ms'] ?? 90000);
  const runtimeFile = resolve(
    args['runtime-file'] ?? `${repoRoot}/.tmp/preview-runtime-${args.port ?? 'unknown'}.json`
  );

  if (args.stop) {
    const result = await stopFromRuntime(runtimeFile);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const port = Number(args.port);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Invalid --port, expected a positive integer.');
  }

  const baseUrl = `http://localhost:${port}`;
  const healthUrl = `${baseUrl}/preview?component=button`;

  await mkdir(resolve(repoRoot, '.tmp'), { recursive: true });
  const logFile = resolve(repoRoot, `.tmp/preview-server-${port}.log`);

  if (existsSync(runtimeFile)) {
    try {
      const runtime = await readJson(runtimeFile);
      if (runtime.port === port && pidExists(runtime.pid)) {
        const ready = await waitForReady(healthUrl, 3000);
        if (ready) {
          process.stdout.write(
            `${JSON.stringify({ ...runtime, reused: true, runtimeFile, logFile }, null, 2)}\n`
          );
          return;
        }
      }
    } catch {
      // Ignore malformed runtime and restart.
    }
  }

  const fd = openSync(logFile, 'a');
  const child = spawn(
    'npm',
    ['run', 'start', '--', '--host', host, '--port', String(port)],
    {
      cwd: repoRoot,
      detached: true,
      stdio: ['ignore', fd, fd],
    }
  );
  child.unref();

  const ready = await waitForReady(healthUrl, timeoutMs);
  if (!ready) {
    try {
      process.kill(child.pid, 'SIGTERM');
    } catch {
      // Ignore kill failure.
    }
    throw new Error(
      `Preview server failed readiness check: ${healthUrl}. See log ${logFile}`
    );
  }

  const runtime = {
    branch,
    port,
    pid: child.pid,
    baseUrl,
    localPreviewTemplate: `${baseUrl}/preview?component={component}`,
    healthUrl,
    runtimeFile,
    logFile,
    startedAt: new Date().toISOString(),
  };
  await writeFile(runtimeFile, `${JSON.stringify(runtime, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(runtime, null, 2)}\n`);
}

main().catch((error) => {
  console.error(`start_preview_server failed: ${error.message}`);
  process.exit(1);
});
